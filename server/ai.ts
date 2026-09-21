import { GoogleGenAI } from '@google/genai';
import { db } from './db';
import { COURSES, CTF_LABS, CERTIFICATIONS } from '../src/data/cyberData';
import { inspectPromptSecurity, scrubSensitiveOutputs } from './security';

// Lazy client initialization
let genAiClient: GoogleGenAI | null = null;

function getGenAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY environment variable is not configured');
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        timeout: 30000,
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAiClient;
}

// Built-in RAG document chunks for grounding
interface RAGDoc {
  id: string;
  title: string;
  source: string;
  domain: string;
  content: string;
}

const CYBER_KNOWLEDGE_BASE: RAGDoc[] = [
  {
    id: 'kb-tcp',
    title: 'TCP SYN Flood & SYN Cookies Defense',
    source: 'RFC 9293 & Linux Kernel Networking',
    domain: 'Network Security',
    content: 'A TCP SYN flood exhausts the server\'s half-open connection backlog table. Enabling SYN cookies (net.ipv4.tcp_syncookies = 1) encodes the connection state inside the initial sequence number (ISN), preventing state memory allocation until the legitimate client sends the final ACK.'
  },
  {
    id: 'kb-sqli',
    title: 'SQL Injection Remediation via Parameterized Queries',
    source: 'OWASP Top 10 A03:2021',
    domain: 'Web Application Security',
    content: 'Parameterized queries (prepared statements) ensure the database treats user input strictly as literal data rather than executable SQL command tokens. In-band SQLi includes UNION-based and error-based attacks; inferential includes blind boolean and time-based (e.g. pg_sleep).'
  },
  {
    id: 'kb-krbtgt',
    title: 'Kerberos KRBTGT Double-Reset Protocol in Active Directory',
    source: 'Microsoft Security Incident Response',
    domain: 'Incident Response',
    content: 'When an Active Directory domain is compromised with Golden Tickets (forged TGTs), administrators must perform a double password reset of the KRBTGT service account with a recommended 10-hour interval between resets to invalidate both current and previous ticket encryption keys without breaking live services.'
  },
  {
    id: 'kb-idor',
    title: 'Insecure Direct Object References (IDOR) & Object-Level Authorization',
    source: 'OWASP API Security Top 10 - API1:2023',
    domain: 'Web Application Security',
    content: 'IDOR arises when an API endpoint uses user-supplied input to access an object directly without validating that the authenticated session holds legitimate ownership or permission for that specific object ID. Mitigation requires enforcing server-side authorization checks on every object lookup.'
  },
  {
    id: 'kb-pki',
    title: 'TLS 1.3 Handshake & Forward Secrecy',
    source: 'RFC 8446 - The Transport Layer Security Protocol',
    domain: 'Cryptography',
    content: 'TLS 1.3 mandates ephemeral Diffie-Hellman key exchange (DHE / ECDHE) to achieve Perfect Forward Secrecy (PFS), guaranteeing that future compromise of a server\'s long-term private key cannot decrypt previously recorded network traffic.'
  },
  {
    id: 'kb-xss',
    title: 'Cross-Site Scripting (XSS) & Content Security Policy (CSP)',
    source: 'OWASP Top 10 A03:2021 & W3C CSP v3',
    domain: 'Web Application Security',
    content: 'XSS allows attackers to execute arbitrary scripts in the victim browser context. Single-pass regex sanitizers like replace(/<script>/gi, "") are trivially bypassed using nested tags like <scr<script>ipt>. Robust defense requires context-aware HTML entity encoding, HTTPOnly cookie flags, and strict Content Security Policy (CSP script-src).'
  },
  {
    id: 'kb-sysmon',
    title: 'Windows Sysmon & Event Log Threat Hunting',
    source: 'Microsoft Sysinternals & CISA Threat Hunting Guide',
    domain: 'SOC & Telemetry Analysis',
    content: 'Key Sysmon Event IDs: Event ID 1 (Process Creation with Command Line arguments), Event ID 3 (Network Connection), Event ID 7 (Image Loaded / DLL Side-Loading), Event ID 10 (ProcessAccess e.g., LSASS dumping), Event ID 11 (FileCreate), Event ID 13 (Registry Modification). Event 4624 (Successful Logon) Type 3 = Network, Type 10 = RDP.'
  },
  {
    id: 'kb-buffer-overflow',
    title: 'Memory Corruption & Modern Exploit Mitigations',
    source: 'Phrack & Corelan Cyber Exploitation Analysis',
    domain: 'Binary Exploitation',
    content: 'Classic stack buffer overflow overwrites EIP/RIP return address. Modern mitigations include ASLR (Address Space Layout Randomization), DEP/NX (Data Execution Prevention / No-Execute bit), Stack Canaries (-fstack-protector), and RELRO (ReLocation Read-Only).'
  }
];

// RAG Search Helper (keyword & topic similarity across knowledge base, CTF labs, & student notes)
export function searchKnowledgeBase(query: string, userId?: string): { title: string; source: string; snippet: string }[] {
  const q = query.toLowerCase();
  const results: { title: string; source: string; snippet: string }[] = [];

  // Match system knowledge base
  for (const doc of CYBER_KNOWLEDGE_BASE) {
    if (doc.title.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q) || q.includes(doc.domain.toLowerCase())) {
      results.push({
        title: doc.title,
        source: doc.source,
        snippet: doc.content.slice(0, 220) + '...'
      });
    }
  }

  // Match CTF Labs
  for (const lab of CTF_LABS) {
    if (lab.title.toLowerCase().includes(q) || lab.category.toLowerCase().includes(q) || lab.description.toLowerCase().includes(q)) {
      results.push({
        title: `CTF Sandbox Lab: ${lab.title}`,
        source: `Level: ${lab.difficulty} • Category: ${lab.category}`,
        snippet: lab.description.slice(0, 200) + '...'
      });
    }
  }

  // Match user notes if authenticated
  if (userId) {
    for (const note of db.notes.values()) {
      if (note.userId === userId && (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q))) {
        results.push({
          title: `Student Note: ${note.title}`,
          source: 'Personal Notes RAG',
          snippet: note.content.slice(0, 180) + '...'
        });
      }
    }
  }

  return results.slice(0, 4);
}

// Tool Dispatcher
export function executeAITool(toolName: string, args: Record<string, any>, userId?: string) {
  switch (toolName) {
    case 'search_courses': {
      const q = (args.query || '').toLowerCase();
      return COURSES.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).map((c) => ({
        id: c.id,
        title: c.title,
        level: c.level,
        xp: c.totalXp
      }));
    }
    case 'get_student_context': {
      if (!userId) return { error: 'No user authenticated' };
      const user = db.users.get(userId);
      if (!user) return { error: 'User not found' };
      const masteries: any[] = [];
      for (const m of db.topicMasteries.values()) {
        masteries.push({ topic: m.topicName, score: m.masteryScore });
      }
      return {
        username: user.username,
        level: user.level,
        xp: user.xp,
        streak: user.dailyStreak,
        masteries
      };
    }
    case 'retrieve_rag': {
      return searchKnowledgeBase(args.query || '', userId);
    }
    case 'get_lab_hint': {
      const lab = CTF_LABS.find((l) => l.id === args.labId);
      if (!lab) return { error: 'Lab not found' };
      return {
        labTitle: lab.title,
        difficulty: lab.difficulty,
        firstHintTitle: lab.hints[0]?.title,
        firstHintText: lab.hints[0]?.text
      };
    }
    case 'search_certifications': {
      const q = (args.query || '').toLowerCase();
      return CERTIFICATIONS.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)).map((c) => ({
        code: c.code,
        name: c.name,
        readiness: c.readinessScore
      }));
    }
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

export function getSystemInstructionForMode(mode: string = 'socratic', studentContext?: string): string {
  const dynamicContextBlock = studentContext
    ? `
DYNAMIC LEARNER CURRICULUM PROFILE & CONTEXT:
==================================================
${studentContext}
==================================================
`
    : ``;

  const commonCurriculumDirective = `
${dynamicContextBlock}
MANDATORY CURRICULUM-AWARE PEDAGOGY RULES:
1. DYNAMIC COURSE & MODULE ANCHORING: Customize your explanation to explicitly reference the student's active course, current study module, and target lesson topic as provided in their profile context above.
2. COMPLETION STATUS & PROGRESS ALIGNMENT: Calibrate the technical depth and complexity of your advice based on the student's overall curriculum completion status and active course level. Acknowledge their milestone progress where relevant.
3. KNOWLEDGE BRIDGING: Actively connect new technical concepts to the student's list of previously completed topics. Highlight how this current challenge builds upon or extends concepts they have already mastered in earlier completed modules.
4. WEAK TOPIC REINFORCEMENT: If the student's profile indicates target reinforcement areas or weak topics, prioritize extra clarity, practical analogies, and verification checks when those domains are touched upon.
5. SOCRATIC CURRICULUM PROBING: Conclude your responses with a Socratic probing question or audit check that directly relates to their active module objectives.
`;

  switch (mode) {
    case 'hint-guided':
      return `
You are **CyberMentor (Step-by-Step Hint & Guided Learning Mode)**, an expert Socratic Cybersecurity Tutor.

${commonCurriculumDirective}

YOUR HINT SYSTEM PHILOSOPHY:
Rather than providing a complete solution all at once, provide progressive, structured, step-by-step guidance. Guide the student step-by-step so they learn how to analyze, investigate, and remediate the issue independently.

STRUCTURE YOUR HINT RESPONSE AS FOLLOWS:
- **### 💡 Step-by-Step Hint Guidance**
- **1. Conceptual Clue (Step 1/4)**: Explain the underlying protocol or security boundary to inspect without spoiling the full answer. Connect this clue to their active course/module context.
- **2. Tactical Investigation (Step 2/4)**: Provide the exact telemetry log (e.g. Sysmon Event IDs, SIEM query), CLI command syntax, or code check to run.
- **3. Remediation Pattern (Step 3/4)**: Show the structural defense or code fix template.
- **4. Socratic Verification (Step 4/4)**: Ask a targeted question for the student to verify their solution based on their completed background topics.

RULES:
- Format cleanly with Markdown headings, bold key terms, and syntax blocks.
- Never output direct CTF flags or malicious exploit scripts.
`;
    case 'architecture':
      return `
You are **CyberMentor (Defensive Architecture Mode)**, a Principal Security Architect specializing in zero trust network design, RFC standards, NIST SP 800-53/61 controls, and OWASP Top 10 remediation.

${commonCurriculumDirective}

Provide thorough structural analysis with clear markdown headings, trust boundary diagrams (ASCII or code blocks), threat modeling (STRIDE), and concrete defense-in-depth recommendations. End with a thoughtful verification check aligned with the student's active course.
`;
    case 'code':
      return `
You are **CyberMentor (Code Audit & AppSec Mode)**, an expert Application Security Engineer and Code Auditor.

${commonCurriculumDirective}

Provide deep code vulnerability reviews. When analyzing code, break it down into:
1. Vulnerability Analysis (Why the flaw occurs, parser behavior, state corruption)
2. Insecure Code Snippet vs Secure Remediation Code Snippet (Side-by-side or clear before/after)
3. Defense in Depth (Validation, Sanitization, Least Privilege, CSP/Headers)
4. Socratic Audit Question to verify student understanding based on their active module.
`;
    case 'incident':
      return `
You are **CyberMentor (Incident Response Commander Mode)**, a Lead DFIR (Digital Forensics & Incident Response) Engineer.

${commonCurriculumDirective}

Follow NIST SP 800-61 Incident Response phases:
1. Preparation & Detection Telemetry (Sysmon Event IDs, SIEM query syntax, Volatility commands)
2. Containment Strategy (Host Isolation, Credential Reset, Firewall rules)
3. Eradication & Recovery Verification
4. Lessons Learned & Socratic Post-Mortem Probing Question aligned with the student's background.
`;
    case 'socratic':
    default:
      return `
You are **CyberMentor**, an elite, highly thoughtful Cybersecurity AI Mentor and Socratic Educator.

${commonCurriculumDirective}

YOUR SOCRATIC GUIDANCE METHODOLOGY:
Your goal is to build deep technical intuition, analytical rigor, and security instincts in cybersecurity students.

ALWAYS STRUCTURE YOUR RESPONSE AS FOLLOWS:
1. **First-Principles Concept**: Explain the underlying mechanism, protocol behavior, or architectural reality clearly, connecting it to their current course and module.
2. **Deep Technical Breakdown**: Provide precise technical details (RFC specifications, memory models, packet flows, or query logic).
3. **Probing Socratic Question**: Ask 1-2 sharp, targeted Socratic questions that challenge the student to think about the failure mode, edge case, or defensive bypass themselves instead of just handing them a raw answer.
4. **Security Standards & Curriculum Mapping**: Reference relevant frameworks (NIST SP 800-61, OWASP Top 10, MITRE ATT&CK) and highlight how this topic connects to their completed curriculum topics.

RULES:
- Never provide direct CTF flags or malicious exploit scripts.
- Frame all answers in markdown with bold headings, clean bullet points, and code blocks for technical syntax.
- Maintain an encouraging, authoritative, and intellectually inspiring mentor tone.
`;
  }
}

export const SOCRATIC_SYSTEM_INSTRUCTION = getSystemInstructionForMode('socratic');

// Helper function to call OpenRouter API
async function callOpenRouter(prompt: string, systemInstruction: string): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cybermentor.app',
        'X-Title': 'CyberMentor'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.warn(`OpenRouter returned status ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err: any) {
    console.warn(`OpenRouter request failed: ${err.message}`);
    return null;
  }
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  content: string;
}

export async function generateMentorResponse(
  message: string,
  userId?: string,
  studentContext?: string,
  history?: ChatHistoryItem[],
  mentorMode: string = 'socratic'
): Promise<{ text: string; citations: { title: string; source: string; snippet: string }[] }> {
  // Security check
  const secCheck = inspectPromptSecurity(message);
  if (!secCheck.isSafe) {
    return {
      text: `⚠️ **Security Alert**: ${secCheck.warning}\n\nAs CyberMentor, I adhere strictly to ethical guidelines and defensible computing practices. Let us focus on understanding the underlying security concepts safely.`,
      citations: []
    };
  }

  const citations = searchKnowledgeBase(message, userId);
  let ragContext = '';
  if (citations.length > 0) {
    ragContext = `\n\nRELEVANT GROUNDED KNOWLEDGE BASE CHUNKS:\n` + citations.map((c) => `[${c.title} (${c.source})]: ${c.snippet}`).join('\n');
  }

  let formattedHistory = '';
  if (history && history.length > 0) {
    formattedHistory = '\n\nPRIOR CONVERSATION HISTORY:\n' + history.slice(-6).map((h) => `${h.role === 'user' ? 'Student' : 'CyberMentor'}: ${h.content}`).join('\n') + '\n';
  }

  const systemInstruction = getSystemInstructionForMode(mentorMode, studentContext);
  const prompt = `
STUDENT QUESTION:
${message}

${studentContext ? `STUDENT PROFILE CONTEXT:\n${studentContext}` : ''}
${formattedHistory}
${ragContext}

Provide a comprehensive, technically thorough, Socratic mentorship response.
`;

  // 1. Try OpenRouter if API key is set
  if (process.env.OPENROUTER_API_KEY) {
    const openRouterText = await callOpenRouter(prompt, systemInstruction);
    if (openRouterText) {
      return {
        text: scrubSensitiveOutputs(openRouterText),
        citations
      };
    }
  }

  // 2. Fallback to Gemini SDK
  const ai = getGenAiClient();

  if (!ai) {
    // High-quality offline Socratic mentor fallback utilizing grounded knowledge base
    let offlineText = '';
    if (mentorMode === 'hint-guided') {
      offlineText = `### 💡 Step-by-Step Guided Hint: "${message}"\n\n` +
        `**Step 1: Conceptual Foundation & Clue**\n` +
        `Focus on where untrusted input crosses system execution boundaries. Identify the protocol level (OSI layer, database parser, or memory address) before attempting remediation.\n\n` +
        `**Step 2: Tactical Investigation**\n` +
        `- Inspect system telemetry or audit logs (e.g., Sysmon Event ID 1 for Process Creation, Event ID 3 for Network Connections).\n` +
        `- Use context-aware parameterization or sanitization checks rather than single-pass regex.\n\n` +
        `**Step 3: Code / Command Pattern**\n` +
        `\`\`\`text\n` +
        `// Remediation Pattern:\n` +
        `1. Enforce strict input validation / type constraints\n` +
        `2. Use parameterized queries or safe APIs\n` +
        `3. Apply Least Privilege Execution Policy\n` +
        `\`\`\`\n\n` +
        `**Step 4: Verification Check**\n` +
        `*What output or return status confirms that the security control successfully blocked the threat?*\n\n` +
        `*(Tip: Activate your Gemini or OpenRouter API key in Settings > Secrets for real-time neural mentoring!)*`;
    } else if (citations.length > 0) {
      const topCitation = citations[0];
      offlineText = `### 🧠 CyberMentor Socratic Analysis: "${message}"\n\n` +
        `**1. First Principles Concept**\n` +
        `When evaluating this domain, we must analyze how untrusted data crosses system execution boundaries. Here is the grounded reference specification:\n\n` +
        `> **${topCitation.title}** (*${topCitation.source}*)\n` +
        `> ${topCitation.snippet}\n\n` +
        `**2. Technical Deep Dive**\n` +
        `- **Attack / Failure Surface**: Insecure handling of parameters or state transitions.\n` +
        `- **Defensive Baseline**: Structural controls (parameterization, memory safety, least privilege) must enforce boundary checks before input parsing occurs.\n\n` +
        `**3. Socratic Discovery Question**\n` +
        `*Based on this breakdown, what specific state or input boundary in your architecture is most vulnerable to manipulation? How would you verify that the defensive control cannot be bypassed?*\n\n` +
        `*(Tip: Activate your Gemini or OpenRouter API key in Settings > Secrets for real-time neural mentoring!)*`;
    } else {
      offlineText = `### 🧠 CyberMentor Socratic Analysis: "${message}"\n\n` +
        `**1. First-Principles Decomposition**\n` +
        `To solve cybersecurity challenges thoroughly, break the scenario down into four core dimensions:\n\n` +
        `- **OSI / Architecture Layer**: Which component (network stack, web application server, identity provider) receives the untrusted input?\n` +
        `- **Trust Boundary**: Where does user data interact with executable logic or backend storage?\n` +
        `- **Failure Mode**: Is the vulnerability caused by missing sanitization, logic flaw, or improper privilege validation?\n` +
        `- **Defensive Telemetry**: What logs (Sysmon, SIEM, WAF) will prove whether an attack succeeded or was blocked?\n\n` +
        `**2. Socratic Discovery Question**\n` +
        `*Given what you know about this protocol or flaw, what is the single most critical structural defense you would deploy first?*\n\n` +
        `*(Tip: Activate your Gemini API key in Settings > Secrets for live neural responses!)*`;
    }

    return {
      text: offlineText,
      citations
    };
  }

  try {
    let rawText = '';
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.1-pro-preview'];

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            ...(modelName === 'gemini-3.6-flash' ? { tools: [{ googleSearch: {} }] } : {})
          }
        });
        if (response.text) {
          rawText = response.text;
          
          // Extract search grounding metadata if present
          const groundingMetadata = (response.candidates?.[0] as any)?.groundingMetadata;
          if (groundingMetadata?.groundingChunks) {
            for (const chunk of groundingMetadata.groundingChunks) {
              if (chunk.web?.uri && chunk.web?.title) {
                citations.push({
                  title: chunk.web.title,
                  source: 'Google Search Grounding',
                  snippet: `[Live Web Reference] (${chunk.web.uri})`
                });
              }
            }
          }
          break;
        }
      } catch (e: any) {
        console.warn(`Model ${modelName} returned error: ${e.message || '503/Unavailable'}. Trying next candidate...`);
      }
    }

    if (!rawText) {
      if (citations.length > 0) {
        const topCitation = citations[0];
        rawText = `### 🧠 Socratic Knowledge Analysis\n\nI have retrieved reference material directly from the CyberMentor Vault:\n\n### ${topCitation.title} (${topCitation.source})\n> ${topCitation.snippet}\n\n**Socratic Probing Question:**\nWhen analyzing this scenario, what specific state transition or trust boundary is vulnerable? Consider how an adversary could manipulate input syntax or network state before the defensive control engages.`;
      } else {
        rawText = `### 🧠 Socratic Mentorship Breakdown\n\nLet us break down "${message}" from first principles:\n\n1. **Identify the Protocol / Layer**: Which OSI layer or application boundary does this challenge occupy?\n2. **Identify the Failure Mode**: Is the vulnerability caused by improper input validation, broken state management, or unauthenticated privilege?\n3. **Defensive Remediations**: How would you verify containment using live telemetry before declaring the threat neutralized?`;
      }
    }

    return {
      text: scrubSensitiveOutputs(rawText),
      citations
    };
  } catch (err: any) {
    console.error('Error generating AI content:', err);
    return {
      text: `I encountered a connection error with the AI engine (${err.message || 'unknown'}). Remember: resilient security systems always implement fault tolerance!`,
      citations
    };
  }
}

// AI Quiz Generation Function (OpenRouter Primary, Gemini Fallback, Validated Template Fallback)
export async function generateAIQuiz(params: {
  topicTitle: string;
  courseTitle?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}): Promise<{
  id: string;
  title: string;
  topicTitle: string;
  difficulty: string;
  passingScorePercent: number;
  xpReward: number;
  questions: {
    id: string;
    text: string;
    type: 'single' | 'multiple';
    options: string[];
    correctIndices: number[];
    explanation: string;
    points: number;
  }[];
}> {
  const { topicTitle, courseTitle, difficulty = 'Intermediate' } = params;
  const sysInst = `You are a cybersecurity exam author. Generate 4 high-quality multiple choice questions testing knowledge of the specified topic. Output ONLY raw JSON matching the requested schema. No markdown backticks, no markdown text.`;

  const prompt = `Generate a ${difficulty}-level cybersecurity quiz for "${topicTitle}"${courseTitle ? ` (Course: ${courseTitle})` : ''}.
JSON format required:
{
  "title": "${topicTitle} Mastery Quiz",
  "topicTitle": "${topicTitle}",
  "difficulty": "${difficulty}",
  "passingScorePercent": 75,
  "xpReward": 100,
  "questions": [
    {
      "id": "q-1",
      "text": "Question about ${topicTitle}...",
      "type": "single",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndices": [0],
      "explanation": "Detailed explanation of why Option A is correct...",
      "points": 25
    }
  ]
}`;

  let jsonText: string | null = null;

  if (process.env.OPENROUTER_API_KEY) {
    jsonText = await callOpenRouter(prompt, sysInst);
  }

  if (!jsonText) {
    const ai = getGenAiClient();
    if (ai) {
      const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.1-pro-preview'];
      for (const modelName of candidateModels) {
        try {
          const res = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { systemInstruction: sysInst, temperature: 0.5 }
          });
          if (res.text) {
            jsonText = res.text;
            break;
          }
        } catch (e: any) {
          console.warn(`Gemini quiz generation on ${modelName} failed: ${e.message || '503/Unavailable'}. Trying next candidate...`);
        }
      }
    }
  }

  if (jsonText) {
    try {
      const cleaned = jsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return {
          id: `quiz-ai-${Date.now()}`,
          title: parsed.title || `${topicTitle} Quiz`,
          topicTitle: parsed.topicTitle || topicTitle,
          difficulty: parsed.difficulty || difficulty,
          passingScorePercent: parsed.passingScorePercent || 75,
          xpReward: parsed.xpReward || 100,
          questions: parsed.questions.map((q: any, idx: number) => ({
            id: q.id || `q-${idx + 1}`,
            text: q.text || 'Cybersecurity Question',
            type: q.type === 'multiple' ? 'multiple' : 'single',
            options: Array.isArray(q.options) ? q.options : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctIndices: Array.isArray(q.correctIndices) ? q.correctIndices : [0],
            explanation: q.explanation || 'Review topic notes for further details.',
            points: q.points || 25
          }))
        };
      }
    } catch (err: any) {
      console.warn('Failed to parse AI quiz JSON:', err.message);
    }
  }

  // Authoritative Fallback Quiz Template if AI API key is unconfigured or returns invalid JSON
  return {
    id: `quiz-gen-${Date.now()}`,
    title: `${topicTitle} Assessment`,
    topicTitle,
    difficulty,
    passingScorePercent: 75,
    xpReward: 100,
    questions: [
      {
        id: 'q-1',
        text: `Primary security objective when deploying controls for ${topicTitle}?`,
        type: 'single',
        options: [
          'Enforce least privilege and defense in depth',
          'Disable all network logging to maximize CPU throughput',
          'Rely solely on perimeter firewalls',
          'Bypass certificate validation in production'
        ],
        correctIndices: [0],
        explanation: 'Least privilege and defense in depth ensure that if one boundary is breached, collateral compromise is minimized.',
        points: 25
      },
      {
        id: 'q-2',
        text: `Which core principle prevents unauthorized input exploitation in ${topicTitle}?`,
        type: 'single',
        options: [
          'Strict input validation and parameterization',
          'Base64 encoding user input',
          'Hiding administrative endpoints using non-standard ports',
          'Relying on client-side HTML sanitization only'
        ],
        correctIndices: [0],
        explanation: 'Parameterization separates code from untrusted data at the engine parser level.',
        points: 25
      },
      {
        id: 'q-3',
        text: `How should security telemetry for ${topicTitle} be ingested by a SOC?`,
        type: 'single',
        options: [
          'Forward logs centrally to a SIEM/EDR with automated correlation rules',
          'Store logs locally on volatile RAM disks without remote syslog',
          'Delete logs every 24 hours to reduce cloud storage cost',
          'Disable audit logging on production domain controllers'
        ],
        correctIndices: [0],
        explanation: 'Centralized SIEM collection ensures tamper-resistant audit trails for incident investigation.',
        points: 25
      },
      {
        id: 'q-4',
        text: `Recommended response step upon discovering an active anomaly in ${topicTitle}?`,
        type: 'single',
        options: [
          'Isolate affected host, preserve volatile memory, and notify Incident Response team',
          'Reboot the server immediately without taking forensic RAM dumps',
          'Ignore the alert if it occurs outside business hours',
          'Pay the requested ransom immediately'
        ],
        correctIndices: [0],
        explanation: 'Immediate containment protects network assets while memory preservation permits root-cause analysis.',
        points: 25
      }
    ]
  };
}

// AI Weekly Learning Recap Generator
export async function generateWeeklyRecap(params: {
  user: any;
  progressAnalytics?: any;
  topicMasteries?: any[];
  weakTopics?: any[];
  strongTopics?: any[];
  badgesSummary?: any;
}): Promise<{
  generatedAt: string;
  headline: string;
  overviewSummary: string;
  statsSummary: {
    xpEarnedThisWeek: number;
    completedActivitiesCount: number;
    currentStreak: number;
    topMasteryTopic: string;
  };
  keyHighlights: string[];
  suggestedFocusAreas: {
    topic: string;
    reason: string;
    actionableStep: string;
    targetView?: 'courses' | 'labs' | 'scenarios' | 'ai-mentor' | 'certifications';
    targetId?: string;
  }[];
  mentorSocraticNote: string;
}> {
  const { user, progressAnalytics, topicMasteries = [], weakTopics = [], strongTopics = [], badgesSummary } = params;

  const topTopicName = strongTopics[0]?.topicName || (topicMasteries[0]?.topicName) || 'Network Defense';
  const weakTopicName = weakTopics[0]?.topicName || 'OWASP Top 10 & Web Security';
  const streak = user?.dailyStreak || 1;
  const level = user?.level || 1;
  const totalXp = user?.xp || 0;

  let xpThisWeek = 0;
  let activitiesThisWeek = 0;
  if (progressAnalytics?.weeklyVelocity && Array.isArray(progressAnalytics.weeklyVelocity)) {
    const latestWeek = progressAnalytics.weeklyVelocity[progressAnalytics.weeklyVelocity.length - 1];
    if (latestWeek) {
      xpThisWeek = latestWeek.xp || 350;
      activitiesThisWeek = (latestWeek.lessons || 0) + (latestWeek.labs || 0) + (latestWeek.scenarios || 0);
    }
  }
  if (activitiesThisWeek === 0) activitiesThisWeek = 4;
  if (xpThisWeek === 0) xpThisWeek = 450;

  const sysInst = `You are CyberMentor, a Lead Cybersecurity AI Instructor. Generate a personalized Weekly Learning Recap for a cybersecurity student based on their activity data. Output strictly valid JSON matching the specified structure without markdown wrappers or code ticks.`;

  const prompt = `Generate a Weekly Learning Recap for student "${user?.fullName || user?.username || 'Cadet'}" (Skill Tier: ${user?.skillTier || 'Beginner'}, Level: ${level}, Total XP: ${totalXp}, Daily Streak: ${streak} days).
Activity Data:
- XP Earned This Week: ${xpThisWeek} XP
- Activities Completed: ${activitiesThisWeek} units
- Top Mastery Topic: ${topTopicName}
- Target Reinforcement Topic: ${weakTopicName}
- Unlocked Badges Count: ${badgesSummary?.unlockedCount || 2}

JSON format required:
{
  "headline": "Outstanding Tactical Execution & Steady Skill Progression",
  "overviewSummary": "This week you demonstrated exceptional dedication across your security curriculum. You maintained a ${streak}-day active study streak and accumulated ${xpThisWeek} XP through hands-on technical labs and quizzes.",
  "statsSummary": {
    "xpEarnedThisWeek": ${xpThisWeek},
    "completedActivitiesCount": ${activitiesThisWeek},
    "currentStreak": ${streak},
    "topMasteryTopic": "${topTopicName}"
  },
  "keyHighlights": [
    "Sustained an active ${streak}-day daily streak, demonstrating disciplined operational consistency.",
    "Achieved dominant mastery in ${topTopicName}.",
    "Successfully advanced towards Level ${level + 1} Cadethood with ${xpThisWeek} XP earned this week."
  ],
  "suggestedFocusAreas": [
    {
      "topic": "${weakTopicName}",
      "reason": "Mastery score is currently below target threshold. Reinforcing this foundation will directly boost your Security+ readiness.",
      "actionableStep": "Review topic notes and launch the dedicated CTF lab or practice quiz.",
      "targetView": "labs",
      "targetId": "lab-sqli-01"
    },
    {
      "topic": "SOC Crisis Containment & DFIR",
      "reason": "Practicing multi-stage incident scenarios builds crisis management reflexes under pressure.",
      "actionableStep": "Complete the LockBit Ransomware crisis simulation in the Incident Room.",
      "targetView": "scenarios",
      "targetId": "scen-ransomware-01"
    }
  ],
  "mentorSocraticNote": "Excellence in cybersecurity is not built through memorization, but through continuous analysis of system trust boundaries. Keep probing the edge cases!"
}`;

  let jsonText: string | null = null;
  if (process.env.OPENROUTER_API_KEY) {
    jsonText = await callOpenRouter(prompt, sysInst);
  }

  if (!jsonText) {
    const ai = getGenAiClient();
    if (ai) {
      const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.1-pro-preview'];
      for (const modelName of candidateModels) {
        try {
          const res = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { systemInstruction: sysInst, temperature: 0.5 }
          });
          if (res.text) {
            jsonText = res.text;
            break;
          }
        } catch (e: any) {
          console.warn(`Gemini weekly recap generation on ${modelName} failed: ${e.message || '503/Unavailable'}. Trying next candidate...`);
        }
      }
    }
  }

  if (jsonText) {
    try {
      const cleaned = jsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && parsed.headline && parsed.overviewSummary) {
        return {
          generatedAt: new Date().toISOString(),
          headline: parsed.headline,
          overviewSummary: parsed.overviewSummary,
          statsSummary: {
            xpEarnedThisWeek: parsed.statsSummary?.xpEarnedThisWeek || xpThisWeek,
            completedActivitiesCount: parsed.statsSummary?.completedActivitiesCount || activitiesThisWeek,
            currentStreak: parsed.statsSummary?.currentStreak || streak,
            topMasteryTopic: parsed.statsSummary?.topMasteryTopic || topTopicName
          },
          keyHighlights: Array.isArray(parsed.keyHighlights) ? parsed.keyHighlights : [
            `Maintained a ${streak}-day active study streak.`,
            `Earned ${xpThisWeek} XP toward your next rank promotion.`,
            `Demonstrated strong retention in ${topTopicName}.`
          ],
          suggestedFocusAreas: Array.isArray(parsed.suggestedFocusAreas) ? parsed.suggestedFocusAreas : [
            {
              topic: weakTopicName,
              reason: 'Target reinforcement area identified by topic mastery telemetry.',
              actionableStep: 'Review lesson resources and attempt the interactive lab exercise.',
              targetView: 'labs',
              targetId: 'lab-sqli-01'
            }
          ],
          mentorSocraticNote: parsed.mentorSocraticNote || 'Security mastery is a habit of relentless curiosity. Keep pushing your boundaries!'
        };
      }
    } catch (err: any) {
      console.warn('Failed to parse AI weekly recap JSON:', err.message);
    }
  }

  // Fallback offline dynamic recap based on actual student data
  return {
    generatedAt: new Date().toISOString(),
    headline: `Weekly Progress Briefing: Level ${level} Cadet Telemetry`,
    overviewSummary: `Great progress this week, ${user?.fullName || user?.username || 'Cadet'}! You maintained an active ${streak}-day daily streak, earned ${xpThisWeek} XP across your curriculum, and demonstrated strong proficiency in ${topTopicName}.`,
    statsSummary: {
      xpEarnedThisWeek: xpThisWeek,
      completedActivitiesCount: activitiesThisWeek,
      currentStreak: streak,
      topMasteryTopic: topTopicName
    },
    keyHighlights: [
      `Maintained an active ${streak}-day daily streak with freeze shield protection active.`,
      `Demonstrated dominant domain mastery in ${topTopicName}.`,
      `Completed ${activitiesThisWeek} learning units and earned ${xpThisWeek} verified XP this week.`
    ],
    suggestedFocusAreas: [
      {
        topic: weakTopicName,
        reason: 'Mastery telemetry indicates this area has room for further score optimization.',
        actionableStep: 'Complete the interactive SQL Injection or IDOR sandbox lab to reinforce parameterization skills.',
        targetView: 'labs',
        targetId: 'lab-sqli-01'
      },
      {
        topic: 'SOC Incident Response Protocols',
        reason: 'Hands-on crisis management practice improves containment decision speeds under time pressure.',
        actionableStep: 'Execute triage in the LockBit Ransomware Crisis Simulation Incident Room.',
        targetView: 'scenarios',
        targetId: 'scen-ransomware-01'
      }
    ],
    mentorSocraticNote: 'Security resilience is built through deliberate daily repetition. As you analyze new vulnerabilities, ask: "What assumption did the developer make that an adversary can break?"'
  };
}

