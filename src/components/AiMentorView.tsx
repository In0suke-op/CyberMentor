import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, User, Sparkles, BookOpen, AlertCircle, RefreshCw, Copy, Bookmark, Check, Shield, Code, Terminal, Brain, Lightbulb, HelpCircle, ChevronRight, Compass, GraduationCap, Layers, BookOpenCheck, Info, ChevronDown, ChevronUp, Target, MessageSquare, History, Plus } from 'lucide-react';
import { streamMentorMessage, createNote } from '../services/api';
import { User as UserType, Course, StudentDashboardSummary, Lesson, MentorChatSession } from '../types';
import { ChatHistorySidebar } from './ChatHistorySidebar';
import { fetchChatSessionsFromFirestore, saveChatSessionToFirestore, deleteChatSessionFromFirestore } from '../lib/firebase';

interface Message {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  citations?: { title: string; source: string; snippet: string }[];
  streaming?: boolean;
  savedToNotes?: boolean;
  hintStep?: number;
}

interface AiMentorViewProps {
  user: UserType | null;
  courses?: Course[];
  summary?: StudentDashboardSummary | null;
  activeLesson?: Lesson | null;
}

type MentorMode = 'socratic' | 'architecture' | 'code' | 'incident' | 'hint-guided';

export const AiMentorView: React.FC<AiMentorViewProps> = ({
  user,
  courses = [],
  summary = null,
  activeLesson = null
}) => {
  const [mentorMode, setMentorMode] = useState<MentorMode>('socratic');
  const [currentHintStep, setCurrentHintStep] = useState<number>(1);
  const [activeHintTopic, setActiveHintTopic] = useState<string>('Privilege Escalation via SUID Binary');
  const [showCurriculumDrawer, setShowCurriculumDrawer] = useState<boolean>(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState<boolean>(true);
  
  const initialWelcomeMsg: Message = {
    id: 'welcome',
    sender: 'mentor',
    text: `Greetings Cadet ${user?.username || 'Operator'}. I am **CyberMentor**, your AI Cybersecurity Principal & Guided Mentor.

I am synchronized with your **active course, module, and completed topic history**. Select a **Focus Mode** above or request **💡 Step-by-Step Hints**!`
  };

  const [sessions, setSessions] = useState<MentorChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('cybermentor_chat_sessions');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse local chat sessions:', e);
    }
    return [
      {
        id: 'session-default-1',
        title: 'Initial Security Onboarding & Guided Orientation',
        mode: 'socratic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [initialWelcomeMsg]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('session-default-1');

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [initialWelcomeMsg];

  const setMessages = (updater: React.SetStateAction<Message[]>) => {
    setSessions((prevSessions) => {
      return prevSessions.map((s) => {
        if (s.id === activeSessionId) {
          const newMsgs = typeof updater === 'function' ? updater(s.messages) : updater;
          
          // Generate an automated session title based on the first student question
          let updatedTitle = s.title;
          if (s.title === 'New Conversation' || s.title.startsWith('Initial Security')) {
            const firstUserMsg = newMsgs.find((m) => m.sender === 'user');
            if (firstUserMsg) {
              updatedTitle = firstUserMsg.text.slice(0, 45) + (firstUserMsg.text.length > 45 ? '...' : '');
            }
          }

          const updatedSession = {
            ...s,
            title: updatedTitle,
            mode: mentorMode,
            messages: newMsgs,
            updatedAt: new Date().toISOString()
          };

          // Async sync to Firestore if user logged in
          if (user?.id) {
            saveChatSessionToFirestore(user.id, updatedSession);
          }

          return updatedSession;
        }
        return s;
      });
    });
  };

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cybermentor_chat_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to store chat sessions locally:', e);
    }
  }, [sessions]);

  // Load user sessions from Firestore on mount
  useEffect(() => {
    if (!user?.id) return;
    async function loadFirestoreSessions() {
      try {
        const remoteSessions = await fetchChatSessionsFromFirestore(user.id);
        if (remoteSessions && remoteSessions.length > 0) {
          setSessions(remoteSessions);
          setActiveSessionId(remoteSessions[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch remote chat sessions:', err);
      }
    }
    loadFirestoreSessions();
  }, [user?.id]);

  const handleCreateNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: MentorChatSession = {
      id: newId,
      title: 'New Conversation',
      mode: mentorMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [initialWelcomeMsg]
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);

    if (user?.id) {
      saveChatSessionToFirestore(user.id, newSession);
    }
  };

  const handleDeleteSession = async (sessionIdToDelete: string) => {
    const updated = sessions.filter((s) => s.id !== sessionIdToDelete);
    if (updated.length === 0) {
      const freshSession: MentorChatSession = {
        id: `session-${Date.now()}`,
        title: 'New Conversation',
        mode: 'socratic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [initialWelcomeMsg]
      };
      setSessions([freshSession]);
      setActiveSessionId(freshSession.id);
    } else {
      setSessions(updated);
      if (activeSessionId === sessionIdToDelete) {
        setActiveSessionId(updated[0].id);
      }
    }

    if (user?.id) {
      await deleteChatSessionFromFirestore(sessionIdToDelete);
    }
  };
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Determine active course, module, active topic, and completed topics
  let currentCourse: Course | null = null;
  let currentModuleTitle: string | null = null;
  let activeTopicTitle: string | null = null;

  if (activeLesson) {
    activeTopicTitle = activeLesson.title;
    currentCourse = courses.find((c) => c.id === activeLesson.courseId) || null;
    if (currentCourse) {
      const mod = currentCourse.modules.find((m) => m.id === activeLesson.moduleId);
      if (mod) currentModuleTitle = mod.title;
    }
  } else if (summary?.continueLearning) {
    currentCourse = summary.continueLearning.course;
    activeTopicTitle = summary.continueLearning.nextLesson.title;
    if (currentCourse) {
      const mod = currentCourse.modules.find((m) =>
        m.lessons.some((l) => l.id === summary.continueLearning?.nextLesson.id)
      );
      if (mod) currentModuleTitle = mod.title;
    }
  } else if (courses.length > 0) {
    currentCourse = courses[0];
    if (currentCourse.modules.length > 0) {
      currentModuleTitle = currentCourse.modules[0].title;
      if (currentCourse.modules[0].lessons.length > 0) {
        activeTopicTitle = currentCourse.modules[0].lessons[0].title;
      }
    }
  }

  // Gather all completed topics / lessons
  const completedTopicsList: { title: string; courseTitle: string }[] = [];
  let totalLessonsCount = 0;
  courses.forEach((c) => {
    c.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        totalLessonsCount++;
        if (l.completed) {
          completedTopicsList.push({ title: l.title, courseTitle: c.title });
        }
      });
    });
  });

  // Construct comprehensive curriculum context for prompt engineering
  const buildCurriculumContext = (): string => {
    const contextSections: string[] = [];

    // 1. User Profile Basics
    if (user) {
      contextSections.push(
        `STUDENT PROFILE: ${user.fullName || user.username} (Level ${user.level}, ${user.xp} XP, Skill Tier: ${user.skillTier}, Daily Streak: ${user.dailyStreak} days)`
      );
    } else {
      contextSections.push(`STUDENT PROFILE: Guest Cadet`);
    }

    // 2. Enrolled Course & Active Module Context
    if (currentCourse) {
      contextSections.push(
        `CURRENT ENROLLED COURSE: "${currentCourse.title}" [Category: ${currentCourse.category}, Level: ${currentCourse.level}]`
      );
    }
    if (currentModuleTitle) {
      contextSections.push(`CURRENT STUDY MODULE: "${currentModuleTitle}"`);
    }
    if (activeTopicTitle) {
      contextSections.push(`ACTIVE/NEXT LESSON TOPIC: "${activeTopicTitle}"`);
    }

    // 3. Overall Completion Status & Completed Topics
    const completionPercentage = Math.round((completedTopicsList.length / (totalLessonsCount || 1)) * 100);
    contextSections.push(
      `CURRICULUM COMPLETION STATUS: ${completedTopicsList.length}/${totalLessonsCount} Lessons Completed (${completionPercentage}% Overall Progress)`
    );

    // Track-level breakdown
    if (courses.length > 0) {
      const trackBreakdown = courses.map((c) => {
        let done = 0;
        let total = 0;
        c.modules.forEach((m) => {
          m.lessons.forEach((l) => {
            total++;
            if (l.completed) done++;
          });
        });
        const pct = Math.round((done / (total || 1)) * 100);
        return `• ${c.title} [${c.category}]: ${done}/${total} completed (${pct}%)`;
      }).join('\n');
      contextSections.push(`COURSE TRACK COMPLETION BREAKDOWN:\n${trackBreakdown}`);
    }

    if (completedTopicsList.length > 0) {
      const formattedCompleted = completedTopicsList
        .slice(-12)
        .map((t) => `• ${t.title} (${t.courseTitle})`)
        .join('\n');
      contextSections.push(`RECENTLY COMPLETED TOPICS:\n${formattedCompleted}`);
    } else {
      contextSections.push(
        `COMPLETED TOPICS: Student is currently commencing initial curriculum modules.`
      );
    }

    // 4. Topic Masteries & Focus Areas
    if (summary?.strongTopics && summary.strongTopics.length > 0) {
      const strong = summary.strongTopics.map((t) => `${t.topicName} (${t.masteryScore}% mastery)`).join(', ');
      contextSections.push(`STRONG MASTERY DOMAINS: ${strong}`);
    }
    if (summary?.weakTopics && summary.weakTopics.length > 0) {
      const weak = summary.weakTopics.map((t) => `${t.topicName} (${t.masteryScore}% mastery)`).join(', ');
      contextSections.push(`TARGET REINFORCEMENT AREAS (WEAK TOPICS): ${weak}`);
    }

    return contextSections.join('\n\n');
  };

  const modePrompts: Record<MentorMode, string[]> = {
    socratic: [
      'Explain TCP SYN flood with SYN cookies defense',
      'Walk me through Kerberos Golden Ticket attack surface',
      'How do I detect & remediate Insecure Direct Object References (IDOR)?',
      'Explain TLS 1.3 Perfect Forward Secrecy (PFS)'
    ],
    architecture: [
      'Design zero-trust boundary for external API gateway',
      'Threat model OAuth 2.0 PKCE using STRIDE methodology',
      'NIST SP 800-53 Access Control (AC) vs Audit & Accountability (AU)',
      'How to isolate microservices with network policies'
    ],
    code: [
      'Show me prepared statements vs raw string formatting in SQL',
      'Why is single-pass regex replace(/<script>/gi, "") unsafe for XSS?',
      'How do Stack Canaries (-fstack-protector) prevent buffer overflows?',
      'Audit a JWT implementation for unverified alg: "none" header'
    ],
    incident: [
      'Investigate Windows Sysmon Event ID 1 & Event ID 4624 Type 10',
      'Walk me through containment steps for compromised KRBTGT account',
      'How to triage ransomware execution on a domain workstation',
      'SIEM query patterns for detecting LSASS memory dump attempt'
    ],
    'hint-guided': [
      'Privilege Escalation via Insecure SUID Binary',
      'Remediating SQL Injection in Auth Endpoint',
      'Sysmon Memory Dump Triaging (LSASS)',
      'OAuth 2.0 PKCE Misconfiguration Audit',
      'Bypassing Single-Pass Regex XSS Sanitizers',
      'Investigating Active Directory DCSync Attack'
    ]
  };

  const hintStepTitles = [
    { step: 1, title: 'Concept & Clue', icon: '🧩', desc: 'Protocol mechanics & vulnerability clues' },
    { step: 2, title: 'Investigation & Telemetry', icon: '🔍', desc: 'Logs, Event IDs & CLI inspection syntax' },
    { step: 3, title: 'Code & Defense Pattern', icon: '💻', desc: 'Remediation snippets & safe APIs' },
    { step: 4, title: 'Solution & Verification', icon: '🛡️', desc: 'Verification tests & security audit checklist' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = async (msgId: string, text: string) => {
    try {
      const firstLine = text.split('\n')[0].replace(/[*#]/g, '').trim().slice(0, 40) || 'Mentor Insight';
      await createNote({
        title: `AI Mentor: ${firstLine}`,
        content: text,
        tags: ['AI Mentor', mentorMode]
      });
      setSavedNoteId(msgId);
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, savedToNotes: true } : m)));
      setTimeout(() => setSavedNoteId(null), 2500);
    } catch (e) {
      console.error('Failed to save note:', e);
    }
  };

  const handleRequestHintStep = (stepNumber: number, customTopic?: string) => {
    const topic = customTopic || activeTopicTitle || currentModuleTitle || activeHintTopic || inputText || 'Current Security Challenge';
    setActiveHintTopic(topic);
    setCurrentHintStep(stepNumber);
    if (mentorMode !== 'hint-guided') {
      setMentorMode('hint-guided');
    }

    let promptText = '';
    if (stepNumber === 1) {
      promptText = `[STEP-BY-STEP HINT - STEP 1/4]: Provide Hint Step 1 (Conceptual Clue & Vulnerability Surface) for active topic: "${topic}". Do not spoil the full solution yet. Relate this clue to my active course/module background.`;
    } else if (stepNumber === 2) {
      promptText = `[STEP-BY-STEP HINT - STEP 2/4]: Provide Hint Step 2 (Investigation Technique & Telemetry/Logs) for active topic: "${topic}".`;
    } else if (stepNumber === 3) {
      promptText = `[STEP-BY-STEP HINT - STEP 3/4]: Provide Hint Step 3 (Tactical Code Pattern & Defense Blueprint) for active topic: "${topic}".`;
    } else {
      promptText = `[STEP-BY-STEP HINT - STEP 4/4]: Provide Hint Step 4 (Full Solution & Verification Audit Checklist) for active topic: "${topic}".`;
    }

    handleSendMessage(promptText, 'hint-guided', stepNumber);
  };

  const handleSendMessage = (textToSend?: string, overrideMode?: MentorMode, stepNum?: number) => {
    const text = (textToSend || inputText).trim();
    if (!text || isGenerating) return;

    const modeToUse = overrideMode || mentorMode;
    const userMsgId = `user-${Date.now()}`;
    const mentorMsgId = `mentor-${Date.now()}`;

    // Prepare previous conversation history for multi-turn dialogue memory
    const history = messages
      .filter((m) => !m.streaming && m.text.trim().length > 0)
      .slice(-8)
      .map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.text
      }));

    // Append user message
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInputText('');
    setIsGenerating(true);

    // Placeholder mentor streaming message
    setMessages((prev) => [
      ...prev,
      { id: mentorMsgId, sender: 'mentor', text: '', streaming: true, citations: [], hintStep: stepNum || (modeToUse === 'hint-guided' ? currentHintStep : undefined) }
    ]);

    // Build rich student curriculum context (course, module, active topic, completed topics)
    const studentContext = buildCurriculumContext();

    streamMentorMessage(
      text,
      studentContext,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === mentorMsgId ? { ...m, text: m.text + chunk } : m))
        );
      },
      (citations) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === mentorMsgId ? { ...m, citations } : m))
        );
      },
      () => {
        setMessages((prev) =>
          prev.map((m) => (m.id === mentorMsgId ? { ...m, streaming: false } : m))
        );
        setIsGenerating(false);
      },
      (err) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === mentorMsgId
              ? { ...m, text: m.text + `\n\n*[-] Notice: ${err}*`, streaming: false }
              : m
          )
        );
        setIsGenerating(false);
      },
      history,
      modeToUse
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden">
      {/* Mentor Mode Selector Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/15 bg-slate-950/40 backdrop-blur-md px-6 py-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">CyberMentor Socratic & Hint Engine</span>
              <span className="rounded bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 font-mono text-[10px] text-cyan-200">
                Curriculum Grounded
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-300">
              NIST SP 800-61 • OWASP Top 10 • Step-by-Step Guided Hints
            </p>
          </div>
        </div>

        {/* Focus Mode Tabs & History Sidebar Toggle */}
        <div className="flex flex-wrap items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          <button
            onClick={() => setIsHistorySidebarOpen(!isHistorySidebarOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isHistorySidebarOpen
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Chat History Sidebar"
          >
            <History className="h-3.5 w-3.5 text-cyan-400" />
            <span>History</span>
          </button>

          <button
            onClick={() => setMentorMode('socratic')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mentorMode === 'socratic'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>Socratic Mentor</span>
          </button>

          <button
            onClick={() => setMentorMode('hint-guided')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mentorMode === 'hint-guided'
                ? 'bg-amber-400 text-slate-950 shadow-md font-semibold'
                : 'text-amber-300 hover:text-white hover:bg-amber-500/20'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-950 fill-amber-950 font-bold" />
            <span>Step-by-Step Hints</span>
          </button>

          <button
            onClick={() => setMentorMode('architecture')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mentorMode === 'architecture'
                ? 'bg-indigo-500 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Architecture</span>
          </button>
          <button
            onClick={() => setMentorMode('code')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mentorMode === 'code'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Code Audit</span>
          </button>
          <button
            onClick={() => setMentorMode('incident')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mentorMode === 'incident'
                ? 'bg-purple-500 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Incident Commander</span>
          </button>

          <button
            onClick={handleCreateNewSession}
            title="Start New Conversation"
            className="ml-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* CURRICULUM CONTEXT GROUNDING BAR */}
      <div className="border-b border-cyan-500/20 bg-slate-950/60 px-6 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
              <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
              <span>Active Curriculum Context:</span>
            </span>

            {/* Course Chip */}
            {currentCourse ? (
              <span className="flex items-center gap-1 rounded-md bg-cyan-500/15 border border-cyan-400/30 px-2.5 py-1 text-slate-200 font-medium text-[11px]">
                <BookOpen className="h-3 w-3 text-cyan-400" />
                <span>{currentCourse.title}</span>
              </span>
            ) : (
              <span className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-slate-400 font-mono text-[11px]">
                All Tracks
              </span>
            )}

            {/* Module Chip */}
            {currentModuleTitle && (
              <span className="flex items-center gap-1 rounded-md bg-indigo-500/15 border border-indigo-400/30 px-2.5 py-1 text-indigo-200 font-medium text-[11px]">
                <Layers className="h-3 w-3 text-indigo-400" />
                <span>{currentModuleTitle}</span>
              </span>
            )}

            {/* Active Topic Chip */}
            {activeTopicTitle && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-1 text-emerald-200 font-medium text-[11px]">
                <Target className="h-3 w-3 text-emerald-400" />
                <span>Topic: {activeTopicTitle}</span>
              </span>
            )}

            {/* Completed Topics Count */}
            <span className="flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-slate-300 text-[11px] font-mono">
              <BookOpenCheck className="h-3 w-3 text-amber-400" />
              <span>{completedTopicsList.length}/{totalLessonsCount} Completed</span>
            </span>
          </div>

          {/* Toggle Grounding Info & Quick Hint Request */}
          <div className="flex items-center gap-2">
            <button
              disabled={isGenerating}
              onClick={() => handleRequestHintStep(1, activeTopicTitle || currentModuleTitle || undefined)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1 text-[11px] shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all transform active:scale-95 disabled:opacity-50"
              title={`Request Step 1 Incremental Hint for ${activeTopicTitle || 'Current Topic'}`}
            >
              <Lightbulb className="h-3.5 w-3.5 fill-slate-950" />
              <span>Get Topic Hint: {activeTopicTitle ? `"${activeTopicTitle}"` : 'Active Topic'}</span>
            </button>

            <button
              onClick={() => setShowCurriculumDrawer(!showCurriculumDrawer)}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              <Info className="h-3.5 w-3.5" />
              <span>{showCurriculumDrawer ? 'Hide Details' : 'Grounding Profile'}</span>
              {showCurriculumDrawer ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Expanded Curriculum Grounding Drawer */}
        {showCurriculumDrawer && (
          <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/90 p-4 text-xs text-slate-200 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h5 className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-cyan-400" />
                <span>CyberMentor Curriculum Awareness Profile</span>
              </h5>
              <span className="text-[10px] font-mono text-slate-400">
                Injected into System Prompt Context
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 font-semibold uppercase font-mono block mb-1">Enrolled Track & Module:</span>
                <p className="text-slate-200">
                  {currentCourse ? `${currentCourse.title} (${currentCourse.category})` : 'General Security Curriculum'}
                </p>
                {currentModuleTitle && <p className="text-slate-400 mt-0.5">{currentModuleTitle}</p>}
                {activeTopicTitle && (
                  <p className="text-cyan-300 font-medium mt-1">Active Target: {activeTopicTitle}</p>
                )}
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase font-mono block mb-1">Topic Mastery Focus:</span>
                {summary?.weakTopics && summary.weakTopics.length > 0 ? (
                  <p className="text-amber-300">
                    Weak Topics: {summary.weakTopics.map((t) => t.topicName).join(', ')}
                  </p>
                ) : (
                  <p className="text-slate-300">All core topics performing with standard confidence.</p>
                )}
                {summary?.strongTopics && summary.strongTopics.length > 0 && (
                  <p className="text-emerald-300 mt-1">
                    Strong Domains: {summary.strongTopics.map((t) => t.topicName).join(', ')}
                  </p>
                )}
              </div>
            </div>

            {completedTopicsList.length > 0 && (
              <div>
                <span className="text-slate-400 font-semibold uppercase font-mono block mb-1">
                  Completed Topics Included in Context ({completedTopicsList.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {completedTopicsList.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10.5px] text-slate-300"
                    >
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>{t.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Container with History Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        <ChatHistorySidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(sid) => setActiveSessionId(sid)}
          onNewSession={handleCreateNewSession}
          onDeleteSession={handleDeleteSession}
          isOpen={isHistorySidebarOpen}
          onClose={() => setIsHistorySidebarOpen(false)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* STEP-BY-STEP HINT SYSTEM CONTROL BAR (Visible when in hint-guided mode) */}
      {mentorMode === 'hint-guided' && (
        <div className="border-b border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-950/60 to-amber-950/40 backdrop-blur-md px-6 py-3.5 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <Lightbulb className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
                  <span>Structured Step-by-Step Learning Pathway</span>
                  <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[10px] text-amber-300 font-mono font-bold">
                    Step {currentHintStep} of 4
                  </span>
                </h4>
                <p className="text-[11px] text-amber-100/80">
                  Target Topic: <span className="font-semibold text-amber-300">"{activeHintTopic || activeTopicTitle || 'Curriculum Topic'}"</span>
                  {activeTopicTitle && activeHintTopic !== activeTopicTitle && (
                    <button
                      onClick={() => handleRequestHintStep(1, activeTopicTitle)}
                      className="ml-2 underline hover:text-white text-cyan-300 font-mono text-[10.5px]"
                    >
                      (Switch to Active Topic: "{activeTopicTitle}")
                    </button>
                  )}
                </p>
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {hintStepTitles.map((st) => (
                <button
                  key={st.step}
                  disabled={isGenerating}
                  onClick={() => handleRequestHintStep(st.step, activeHintTopic || activeTopicTitle || undefined)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap shadow-sm ${
                    currentHintStep === st.step
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/15 hover:text-white hover:border-amber-400/30'
                  }`}
                  title={st.desc}
                >
                  <span>{st.icon}</span>
                  <span>Step {st.step}: {st.title}</span>
                </button>
              ))}

              <button
                disabled={isGenerating}
                onClick={() => handleRequestHintStep(Math.min(4, currentHintStep + 1), activeHintTopic || activeTopicTitle || undefined)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-sm active:scale-95"
              >
                <span>Next Hint</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT HISTORY VIEWPORT HEADER BADGE */}
      <div className="bg-slate-950/40 border-b border-white/5 px-6 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <MessageSquare className="h-3 w-3" />
          <span>CYBERMENTOR INTERACTIVE DIALOGUE LOGS</span>
        </span>
        <span>Mode: {mentorMode.toUpperCase()} | Model: Gemini 3.6 Flash</span>
      </div>

      {/* Messages Stream Viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'mentor' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-xs shadow-sm mt-1">
                CM
              </div>
            )}

            <div
              className={`max-w-3xl rounded-2xl p-4.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium shadow-md'
                  : 'border border-white/20 bg-slate-900/70 backdrop-blur-md text-slate-100 shadow-lg'
              }`}
            >
              {/* Hint Step Badge if present */}
              {msg.sender === 'mentor' && msg.hintStep && (
                <div className="inline-flex items-center gap-1.5 mb-2.5 px-2.5 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-[10.5px] font-mono text-amber-300">
                  <Lightbulb className="h-3 w-3 text-amber-400" />
                  <span>STEP-BY-STEP HINT {msg.hintStep}/4</span>
                </div>
              )}

              {/* Message Body rendered with ReactMarkdown for mentor, pre-wrap for user */}
              {msg.sender === 'mentor' ? (
                <div className="prose prose-invert max-w-none text-xs text-slate-100 space-y-2">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              )}

              {msg.streaming && (
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-cyan-400">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Synthesizing step-by-step guidance...</span>
                </div>
              )}

              {/* RAG Grounding Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 border-t border-white/15 pt-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 mb-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>GROUNDED RAG KNOWLEDGE VAULT:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {msg.citations.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="rounded-xl bg-slate-950/50 p-2.5 border border-white/10 text-[11px] backdrop-blur-sm"
                      >
                        <div className="font-semibold text-cyan-200">{c.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono mb-1">{c.source}</div>
                        <div className="text-slate-300 italic text-[10.5px]">"{c.snippet}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentor Message Actions (Copy, Save to Notes, Request Next Step Hint) */}
              {msg.sender === 'mentor' && !msg.streaming && msg.text.trim().length > 0 && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-[10.5px]">
                  {/* Quick Action to request next hint step based on this message */}
                  <button
                    disabled={isGenerating}
                    onClick={() => {
                      const nextStep = Math.min(4, (msg.hintStep || currentHintStep) + 1);
                      handleRequestHintStep(nextStep, activeHintTopic);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-200 hover:bg-amber-500/30 transition-all font-medium"
                  >
                    <Lightbulb className="h-3 w-3 text-amber-400" />
                    <span>Request Hint Step {Math.min(4, (msg.hintStep || currentHintStep) + 1)}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleSaveToNotes(msg.id, msg.text)}
                      disabled={msg.savedToNotes}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
                    >
                      {savedNoteId === msg.id || msg.savedToNotes ? (
                        <>
                          <Check className="h-3 w-3 text-cyan-400" />
                          <span className="text-cyan-400">Saved to Notes</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-3 w-3" />
                          <span>Save to Notes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold shadow-sm mt-1">
                {user?.username.slice(0, 2).toUpperCase() || 'YOU'}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions per Mode */}
      <div className="border-t border-white/15 bg-slate-950/40 backdrop-blur-md px-6 py-2.5 flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-semibold">
          {mentorMode === 'hint-guided' ? '💡 Step-by-Step Hint Challenges:' : `${mentorMode} Prompts:`}
        </span>
        {modePrompts[mentorMode].map((prompt, idx) => (
          <button
            key={idx}
            disabled={isGenerating}
            onClick={() => {
              if (mentorMode === 'hint-guided') {
                handleRequestHintStep(1, prompt);
              } else {
                handleSendMessage(prompt);
              }
            }}
            className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1 text-[11px] text-slate-200 hover:border-cyan-400/50 hover:bg-white/20 hover:text-white transition-colors truncate max-w-xs shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (mentorMode === 'hint-guided') {
            handleRequestHintStep(1, inputText);
          } else {
            handleSendMessage();
          }
        }}
        className="flex items-center gap-3 border-t border-white/15 bg-slate-950/60 backdrop-blur-md p-4"
      >
        <input
          type="text"
          value={inputText}
          disabled={isGenerating}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            mentorMode === 'hint-guided'
              ? 'Enter a security challenge or topic to generate Step 1 Hint...'
              : `Ask a cybersecurity question in ${mentorMode.toUpperCase()} mode...`
          }
          className="flex-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:outline-none shadow-sm"
        />
        <button
          type="submit"
          disabled={isGenerating || !inputText.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
        </div>
      </div>
    </div>
  );
};


