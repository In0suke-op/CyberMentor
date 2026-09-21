import { Course, Lab, IncidentScenario, Certification, DiagnosticQuestion } from '../types';

export const COURSES: Course[] = [
  {
    id: 'netsec-101',
    title: 'Network Defense & Protocol Analysis',
    slug: 'network-defense-protocols',
    description: 'Master packet-level inspection, TCP/IP 3-way handshake analysis, ARP spoofing mitigation, and stateful firewall rule engineering.',
    category: 'Fundamentals',
    level: 'Beginner',
    estimatedMinutes: 180,
    totalXp: 450,
    prerequisiteCourseIds: [],
    modules: [
      {
        id: 'net-mod-1',
        courseId: 'netsec-101',
        title: 'Module 1: The TCP/IP Deep Dive',
        order: 1,
        lessons: [
          {
            id: 'net-les-1',
            moduleId: 'net-mod-1',
            courseId: 'netsec-101',
            title: 'TCP 3-Way Handshake & SYN Flood Mechanics',
            slug: 'tcp-handshake-syn-flood',
            type: 'video',
            durationMinutes: 18,
            xpReward: 50,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'net-les-2',
            moduleId: 'net-mod-1',
            courseId: 'netsec-101',
            title: 'Wireshark Packet Crafting & Deep Packet Inspection',
            slug: 'wireshark-dpi',
            type: 'interactive',
            durationMinutes: 25,
            xpReward: 70,
            order: 2,
            prerequisiteLessonIds: ['net-les-1'],
          }
        ]
      },
      {
        id: 'net-mod-2',
        courseId: 'netsec-101',
        title: 'Module 2: Layer 2/3 Adversary Tactics',
        order: 2,
        lessons: [
          {
            id: 'net-les-3',
            moduleId: 'net-mod-2',
            courseId: 'netsec-101',
            title: 'ARP Poisoning, MITM & Dynamic ARP Inspection',
            slug: 'arp-poisoning-mitigation',
            type: 'article',
            durationMinutes: 20,
            xpReward: 60,
            order: 1,
            prerequisiteLessonIds: ['net-les-2'],
          },
          {
            id: 'net-les-4',
            moduleId: 'net-mod-2',
            courseId: 'netsec-101',
            title: 'Stateful Firewalls & Suricata IDS Signature Rules',
            slug: 'firewalls-suricata-ids',
            type: 'interactive',
            durationMinutes: 30,
            xpReward: 90,
            order: 2,
            prerequisiteLessonIds: ['net-les-3'],
          }
        ]
      }
    ]
  },
  {
    id: 'websec-201',
    title: 'OWASP Top 10 & Web Application Exploitation',
    slug: 'owasp-top-10-web-sec',
    description: 'Deconstruct SQL Injection (Union, Blind, Time-based), Stored XSS, CSRF tokens, SSRF in cloud architectures, and IDOR vulnerabilities.',
    category: 'Offensive',
    level: 'Intermediate',
    estimatedMinutes: 240,
    totalXp: 600,
    prerequisiteCourseIds: ['netsec-101'],
    modules: [
      {
        id: 'web-mod-1',
        courseId: 'websec-201',
        title: 'Module 1: Injection & Broken Access Control',
        order: 1,
        lessons: [
          {
            id: 'web-les-1',
            moduleId: 'web-mod-1',
            courseId: 'websec-201',
            title: 'SQL Injection: From Authentication Bypass to RCE',
            slug: 'sqli-bypass-rce',
            type: 'interactive',
            durationMinutes: 28,
            xpReward: 80,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'web-les-2',
            moduleId: 'web-mod-1',
            courseId: 'websec-201',
            title: 'Insecure Direct Object Reference (IDOR) Audit Methodology',
            slug: 'idor-audit-testing',
            type: 'interactive',
            durationMinutes: 22,
            xpReward: 70,
            order: 2,
            prerequisiteLessonIds: ['web-les-1'],
          }
        ]
      },
      {
        id: 'web-mod-2',
        courseId: 'websec-201',
        title: 'Module 2: Client-Side & Cloud Vector Attacks',
        order: 2,
        lessons: [
          {
            id: 'web-les-3',
            moduleId: 'web-mod-2',
            courseId: 'websec-201',
            title: 'Stored vs Reflected XSS & Content Security Policy (CSP) Bypasses',
            slug: 'xss-csp-bypasses',
            type: 'video',
            durationMinutes: 24,
            xpReward: 75,
            order: 1,
            prerequisiteLessonIds: ['web-les-2'],
          },
          {
            id: 'web-les-4',
            moduleId: 'web-mod-2',
            courseId: 'websec-201',
            title: 'Server-Side Request Forgery (SSRF) in AWS Metadata Services',
            slug: 'ssrf-aws-metadata',
            type: 'article',
            durationMinutes: 30,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['web-les-3'],
          }
        ]
      }
    ]
  },
  {
    id: 'crypto-301',
    title: 'Applied Cryptography & Public Key Infrastructure',
    slug: 'applied-cryptography-pki',
    description: 'Implement secure cryptographic protocols. Unravel AES-GCM authenticated encryption, Elliptic Curves (ECC), RSA mathematical flaws, and TLS 1.3.',
    category: 'Fundamentals',
    level: 'Intermediate',
    estimatedMinutes: 210,
    totalXp: 520,
    prerequisiteCourseIds: [],
    modules: [
      {
        id: 'cry-mod-1',
        courseId: 'crypto-301',
        title: 'Module 1: Symmetric & Hash Primitives',
        order: 1,
        lessons: [
          {
            id: 'cry-les-1',
            moduleId: 'cry-mod-1',
            courseId: 'crypto-301',
            title: 'Block Ciphers: ECB vs CBC vs AES-GCM Authenticated Encryption',
            slug: 'block-ciphers-aes-gcm',
            type: 'video',
            durationMinutes: 22,
            xpReward: 65,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'cry-les-2',
            moduleId: 'cry-mod-1',
            courseId: 'crypto-301',
            title: 'Cryptographic Hashing, Salted PBKDF2 & Length Extension Attacks',
            slug: 'hashing-salting-attacks',
            type: 'interactive',
            durationMinutes: 26,
            xpReward: 75,
            order: 2,
            prerequisiteLessonIds: ['cry-les-1'],
          }
        ]
      },
      {
        id: 'cry-mod-2',
        courseId: 'crypto-301',
        title: 'Module 2: Asymmetric Keys & TLS 1.3 Handshake',
        order: 2,
        lessons: [
          {
            id: 'cry-les-3',
            moduleId: 'cry-mod-2',
            courseId: 'crypto-301',
            title: 'Diffie-Hellman Key Exchange & Elliptic Curve Cryptography',
            slug: 'diffie-hellman-ecc',
            type: 'article',
            durationMinutes: 25,
            xpReward: 80,
            order: 1,
            prerequisiteLessonIds: ['cry-les-2'],
          },
          {
            id: 'cry-les-4',
            moduleId: 'cry-mod-2',
            courseId: 'crypto-301',
            title: 'X.509 Digital Certificates, PKI Revocation & TLS 1.3 Session Keys',
            slug: 'pki-tls13-crl-ocsp',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 100,
            order: 2,
            prerequisiteLessonIds: ['cry-les-3'],
          }
        ]
      }
    ]
  },
  {
    id: 'soc-401',
    title: 'SOC Analyst & Enterprise Incident Response',
    slug: 'soc-analyst-incident-response',
    description: 'Operate inside a 24/7 Security Operations Center. Triage telemetry logs, map adversary behavior to MITRE ATT&CK, contain active breaches, and draft forensic reports.',
    category: 'Incident Response',
    level: 'Advanced',
    estimatedMinutes: 280,
    totalXp: 750,
    prerequisiteCourseIds: ['netsec-101', 'websec-201'],
    modules: [
      {
        id: 'soc-mod-1',
        courseId: 'soc-401',
        title: 'Module 1: SIEM & Log Investigation',
        order: 1,
        lessons: [
          {
            id: 'soc-les-1',
            moduleId: 'soc-mod-1',
            courseId: 'soc-401',
            title: 'Windows Event Logs: Event IDs 4624, 4625, 4688 & Sysmon Analysis',
            slug: 'windows-event-logs-sysmon',
            type: 'interactive',
            durationMinutes: 30,
            xpReward: 90,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'soc-les-2',
            moduleId: 'soc-mod-1',
            courseId: 'soc-401',
            title: 'MITRE ATT&CK Matrix: Mapping Tactics, Techniques & Procedures (TTPs)',
            slug: 'mitre-attck-mapping',
            type: 'video',
            durationMinutes: 25,
            xpReward: 80,
            order: 2,
            prerequisiteLessonIds: ['soc-les-1'],
          }
        ]
      },
      {
        id: 'soc-mod-2',
        courseId: 'soc-401',
        title: 'Module 2: Live Breach Containment & Forensics',
        order: 2,
        lessons: [
          {
            id: 'soc-les-3',
            moduleId: 'soc-mod-2',
            courseId: 'soc-401',
            title: 'Ransomware Containment: Network Segmentation & Volatile Memory Preservation',
            slug: 'ransomware-containment-forensics',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 110,
            order: 1,
            prerequisiteLessonIds: ['soc-les-2'],
          },
          {
            id: 'soc-les-4',
            moduleId: 'soc-mod-2',
            courseId: 'soc-401',
            title: 'Root Cause Analysis & Post-Incident Executive Debrief Writing',
            slug: 'post-incident-executive-debrief',
            type: 'article',
            durationMinutes: 28,
            xpReward: 85,
            order: 2,
            prerequisiteLessonIds: ['soc-les-3'],
          }
        ]
      }
    ]
  },
  {
    id: 'threathunt-501',
    title: 'Threat Hunter: Advanced APT Hunting, KQL & MITRE ATT&CK Methodology',
    slug: 'threat-hunter-apt-kql-mitre',
    description: 'Proactively search across enterprise endpoints, networks, and cloud telemetry. Formulate testable hypotheses, dissect APT adversary TTPs, develop complex KQL queries in Microsoft Sentinel, and convert hunt findings into permanent detection rules.',
    category: 'Incident Response',
    level: 'Advanced',
    estimatedMinutes: 360,
    totalXp: 950,
    prerequisiteCourseIds: ['soc-401'],
    modules: [
      {
        id: 'th-mod-1',
        courseId: 'threathunt-501',
        title: 'Module 1: Threat Hunting Foundations & Methodologies',
        order: 1,
        lessons: [
          {
            id: 'th-les-1',
            moduleId: 'th-mod-1',
            courseId: 'threathunt-501',
            title: 'Threat Hunting Fundamentals: Shifting from Reactive to Proactive',
            slug: 'threat-hunting-fundamentals',
            type: 'video',
            durationMinutes: 30,
            xpReward: 80,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'th-les-2',
            moduleId: 'th-mod-1',
            courseId: 'threathunt-501',
            title: 'Hypothesis-Driven Hunting vs Detection Engineering: Scoping the Mission',
            slug: 'hypothesis-driven-hunting-methodology',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['th-les-1'],
          }
        ]
      },
      {
        id: 'th-mod-2',
        courseId: 'threathunt-501',
        title: 'Module 2: MITRE ATT&CK Framework & TTP Dissection',
        order: 2,
        lessons: [
          {
            id: 'th-les-3',
            moduleId: 'th-mod-2',
            courseId: 'threathunt-501',
            title: 'MITRE ATT&CK Enterprise Matrix: Navigating Tactics & Techniques',
            slug: 'mitre-attck-matrix-navigation',
            type: 'video',
            durationMinutes: 35,
            xpReward: 90,
            order: 1,
            prerequisiteLessonIds: ['th-les-2'],
          },
          {
            id: 'th-les-4',
            moduleId: 'th-mod-2',
            courseId: 'threathunt-501',
            title: 'Adversary TTPs & APT Hunting: Living off the Land (LOLBAS) Detection',
            slug: 'adversary-ttps-apt-hunting',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 110,
            order: 2,
            prerequisiteLessonIds: ['th-les-3'],
          }
        ]
      },
      {
        id: 'th-mod-3',
        courseId: 'threathunt-501',
        title: 'Module 3: KQL & Microsoft Sentinel Hunting Engine',
        order: 3,
        lessons: [
          {
            id: 'th-les-5',
            moduleId: 'th-mod-3',
            courseId: 'threathunt-501',
            title: 'KQL Mastery for Threat Hunters: Time-Series & Anomaly Detection',
            slug: 'kql-threat-hunting-mastery',
            type: 'interactive',
            durationMinutes: 45,
            xpReward: 120,
            order: 1,
            prerequisiteLessonIds: ['th-les-4'],
          },
          {
            id: 'th-les-6',
            moduleId: 'th-mod-3',
            courseId: 'threathunt-501',
            title: 'Microsoft Sentinel Hunting Queries, Bookmarks & Jupyter Notebooks',
            slug: 'sentinel-hunting-queries-bookmarks',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 100,
            order: 2,
            prerequisiteLessonIds: ['th-les-5'],
          }
        ]
      },
      {
        id: 'th-mod-4',
        courseId: 'threathunt-501',
        title: 'Module 4: Windows, Multi-Cloud & Threat Intelligence Hunting',
        order: 4,
        lessons: [
          {
            id: 'th-les-7',
            moduleId: 'th-mod-4',
            courseId: 'threathunt-501',
            title: 'Windows Endpoint Hunting: Sysmon Process Lineage & Memory Injection',
            slug: 'windows-sysmon-endpoint-hunting',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 110,
            order: 1,
            prerequisiteLessonIds: ['th-les-6'],
          },
          {
            id: 'th-les-8',
            moduleId: 'th-mod-4',
            courseId: 'threathunt-501',
            title: 'Cloud & Identity Hunting: Entra ID Anomalies & CTI Indicator Pivoting',
            slug: 'cloud-threat-intelligence-hunting',
            type: 'article',
            durationMinutes: 30,
            xpReward: 90,
            order: 2,
            prerequisiteLessonIds: ['th-les-7'],
          }
        ]
      }
    ]
  },
  {
    id: 'cti-601',
    title: 'Threat Intelligence Analyst: CTI, STIX/TAXII & Adversary Profiling',
    slug: 'threat-intelligence-analyst-cti',
    description: 'Master the 15-stage Cyber Threat Intelligence curriculum. Leverage OSINT, evaluate IOCs vs IOAs, operationalize STIX 2.1 / TAXII 2.1 feeds, profile nation-state threat actors, and administer MISP & OpenCTI platforms.',
    category: 'Incident Response',
    level: 'Advanced',
    estimatedMinutes: 340,
    totalXp: 920,
    prerequisiteCourseIds: ['threathunt-501'],
    modules: [
      {
        id: 'cti-mod-1',
        courseId: 'cti-601',
        title: 'Module 1: CTI Fundamentals & Intelligence Lifecycle',
        order: 1,
        lessons: [
          {
            id: 'cti-les-1',
            moduleId: 'cti-mod-1',
            courseId: 'cti-601',
            title: 'Threat Intelligence Fundamentals & The Diamond Model',
            slug: 'threat-intel-fundamentals-diamond-model',
            type: 'video',
            durationMinutes: 30,
            xpReward: 80,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'cti-les-2',
            moduleId: 'cti-mod-1',
            courseId: 'cti-601',
            title: 'The 6-Phase Intelligence Lifecycle & Priority Requirements (PIRs)',
            slug: 'intelligence-lifecycle-pirs',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['cti-les-1'],
          }
        ]
      },
      {
        id: 'cti-mod-2',
        courseId: 'cti-601',
        title: 'Module 2: OSINT, IOCs vs IOAs & ATT&CK Mapping',
        order: 2,
        lessons: [
          {
            id: 'cti-les-3',
            moduleId: 'cti-mod-2',
            courseId: 'cti-601',
            title: 'OSINT Collection: Passive DNS, SSL Fingerprints & Dark Web Scrapes',
            slug: 'osint-pdns-ssl-fingerprinting',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 90,
            order: 1,
            prerequisiteLessonIds: ['cti-les-2'],
          },
          {
            id: 'cti-les-4',
            moduleId: 'cti-mod-2',
            courseId: 'cti-601',
            title: 'Indicators of Compromise (IOCs) vs Indicators of Attack (IOAs)',
            slug: 'iocs-vs-ioas-behavioral-detection',
            type: 'article',
            durationMinutes: 30,
            xpReward: 85,
            order: 2,
            prerequisiteLessonIds: ['cti-les-3'],
          }
        ]
      },
      {
        id: 'cti-mod-3',
        courseId: 'cti-601',
        title: 'Module 3: STIX 2.1, TAXII 2.1 & Threat Actor Profiling',
        order: 3,
        lessons: [
          {
            id: 'cti-les-5',
            moduleId: 'cti-mod-3',
            courseId: 'cti-601',
            title: 'STIX 2.1 JSON Schema & TAXII 2.1 Automated Threat Sharing',
            slug: 'stix-taxii-threat-sharing-standards',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 110,
            order: 1,
            prerequisiteLessonIds: ['cti-les-4'],
          },
          {
            id: 'cti-les-6',
            moduleId: 'cti-mod-3',
            courseId: 'cti-601',
            title: 'Threat Actor Profiling & Malware/Vulnerability Intelligence (EPSS/KEV)',
            slug: 'threat-actor-profiling-epss-kev',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 100,
            order: 2,
            prerequisiteLessonIds: ['cti-les-5'],
          }
        ]
      },
      {
        id: 'cti-mod-4',
        courseId: 'cti-601',
        title: 'Module 4: TIP Platforms (MISP & OpenCTI) & Dissemination',
        order: 4,
        lessons: [
          {
            id: 'cti-les-7',
            moduleId: 'cti-mod-4',
            courseId: 'cti-601',
            title: 'Deploying & Managing MISP and OpenCTI Knowledge Graphs',
            slug: 'misp-opencti-knowledge-graphs',
            type: 'interactive',
            durationMinutes: 45,
            xpReward: 120,
            order: 1,
            prerequisiteLessonIds: ['cti-les-6'],
          },
          {
            id: 'cti-les-8',
            moduleId: 'cti-mod-4',
            courseId: 'cti-601',
            title: 'Authoring Actionable Threat Intelligence Reports & Executive Advisories',
            slug: 'authoring-cti-reports-advisories',
            type: 'article',
            durationMinutes: 28,
            xpReward: 80,
            order: 2,
            prerequisiteLessonIds: ['cti-les-7'],
          }
        ]
      }
    ]
  },
  {
    id: 'malware-701',
    title: 'Malware Analyst: Static, Dynamic Analysis & Reverse Engineering',
    slug: 'malware-analyst-reverse-engineering',
    description: 'Dissect real-world malware samples in isolated sandboxes. Master PE file internals, entropy, process injection (RunPE), DLL sideloading, x86/x64 assembly, IDA Pro/Ghidra reversing, and ransomware decryption mechanics.',
    category: 'Incident Response',
    level: 'Advanced',
    estimatedMinutes: 420,
    totalXp: 1100,
    prerequisiteCourseIds: ['threathunt-501'],
    modules: [
      {
        id: 'mal-mod-1',
        courseId: 'malware-701',
        title: 'Module 1: Malware Taxonomy & Safe Lab Engineering',
        order: 1,
        lessons: [
          {
            id: 'mal-les-1',
            moduleId: 'mal-mod-1',
            courseId: 'malware-701',
            title: 'Malware Fundamentals, Types & Execution Lifecycles',
            slug: 'malware-fundamentals-types-lifecycles',
            type: 'video',
            durationMinutes: 30,
            xpReward: 80,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'mal-les-2',
            moduleId: 'mal-mod-1',
            courseId: 'malware-701',
            title: 'Building an Isolated Malware Lab: FlareVM, REMnux & INetSim',
            slug: 'building-isolated-malware-lab',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 100,
            order: 2,
            prerequisiteLessonIds: ['mal-les-1'],
          }
        ]
      },
      {
        id: 'mal-mod-2',
        courseId: 'malware-701',
        title: 'Module 2: Static Triage, PE Headers & Entropy Analysis',
        order: 2,
        lessons: [
          {
            id: 'mal-les-3',
            moduleId: 'mal-mod-2',
            courseId: 'malware-701',
            title: 'PE File Structure: Headers, Sections, IAT & Shannon Entropy',
            slug: 'pe-file-structure-entropy-analysis',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 1,
            prerequisiteLessonIds: ['mal-les-2'],
          },
          {
            id: 'mal-les-4',
            moduleId: 'mal-mod-2',
            courseId: 'malware-701',
            title: 'Deobfuscating Strings with FLOSS & Fuzzy Hashing (SSDEEP/imphash)',
            slug: 'deobfuscating-strings-fuzzy-hashing',
            type: 'interactive',
            durationMinutes: 30,
            xpReward: 85,
            order: 2,
            prerequisiteLessonIds: ['mal-les-3'],
          }
        ]
      },
      {
        id: 'mal-mod-3',
        courseId: 'malware-701',
        title: 'Module 3: Dynamic Analysis, Behavioral Tracing & Persistence',
        order: 3,
        lessons: [
          {
            id: 'mal-les-5',
            moduleId: 'mal-mod-3',
            courseId: 'malware-701',
            title: 'Dynamic Analysis with Procmon, Wireshark & RegShot Diffing',
            slug: 'dynamic-analysis-procmon-wireshark',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 110,
            order: 1,
            prerequisiteLessonIds: ['mal-les-4'],
          },
          {
            id: 'mal-les-6',
            moduleId: 'mal-mod-3',
            courseId: 'malware-701',
            title: 'Process Injection (Hollowing/APC) & Stealth Persistence Analysis',
            slug: 'process-injection-stealth-persistence',
            type: 'interactive',
            durationMinutes: 45,
            xpReward: 120,
            order: 2,
            prerequisiteLessonIds: ['mal-les-5'],
          }
        ]
      },
      {
        id: 'mal-mod-4',
        courseId: 'malware-701',
        title: 'Module 4: x86/x64 Disassembly, IDA Pro & Threat Reversing',
        order: 4,
        lessons: [
          {
            id: 'mal-les-7',
            moduleId: 'mal-mod-4',
            courseId: 'malware-701',
            title: 'x86/x64 Assembly, Registers, Calling Conventions & Stack Frames',
            slug: 'assembly-registers-calling-conventions',
            type: 'video',
            durationMinutes: 45,
            xpReward: 120,
            order: 1,
            prerequisiteLessonIds: ['mal-les-6'],
          },
          {
            id: 'mal-les-8',
            moduleId: 'mal-mod-4',
            courseId: 'malware-701',
            title: 'Reverse Engineering with IDA Pro & Dissecting Ransomware Cryptors',
            slug: 'ida-pro-reverse-engineering-ransomware',
            type: 'interactive',
            durationMinutes: 50,
            xpReward: 130,
            order: 2,
            prerequisiteLessonIds: ['mal-les-7'],
          }
        ]
      }
    ]
  },
  {
    id: 'seceng-801',
    title: 'Security Engineer: Enterprise Architecture & Defense Controls',
    slug: 'security-engineer-enterprise-defense',
    description: 'Design, configure, and maintain mission-critical defense infrastructure. Deploy NGFWs, inline IPS, ZTNA tunnels, IAM least-privilege policies, EDR/XDR agents, and automated hardening baselines.',
    category: 'Defensive',
    level: 'Intermediate',
    estimatedMinutes: 300,
    totalXp: 820,
    prerequisiteCourseIds: ['netsec-101'],
    modules: [
      {
        id: 'se-mod-1',
        courseId: 'seceng-801',
        title: 'Module 1: Defense-in-Depth & Network Perimeters',
        order: 1,
        lessons: [
          {
            id: 'se-les-1',
            moduleId: 'se-mod-1',
            courseId: 'seceng-801',
            title: 'Security Engineering Principles, CIA Triad & Zero Trust Architecture',
            slug: 'security-engineering-principles-zero-trust',
            type: 'video',
            durationMinutes: 25,
            xpReward: 70,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'se-les-2',
            moduleId: 'se-mod-1',
            courseId: 'seceng-801',
            title: 'Next-Gen Firewall (NGFW) & Inline IDS/IPS Rule Engineering',
            slug: 'ngfw-ids-ips-rule-engineering',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['se-les-1'],
          }
        ]
      },
      {
        id: 'se-mod-2',
        courseId: 'seceng-801',
        title: 'Module 2: IAM Governance, Authentication & Least Privilege',
        order: 2,
        lessons: [
          {
            id: 'se-les-3',
            moduleId: 'se-mod-2',
            courseId: 'seceng-801',
            title: 'Enterprise Authentication: Kerberos, SAML 2.0, OIDC & FIDO2 MFA',
            slug: 'enterprise-authentication-saml-fido2',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 90,
            order: 1,
            prerequisiteLessonIds: ['se-les-2'],
          },
          {
            id: 'se-les-4',
            moduleId: 'se-mod-2',
            courseId: 'seceng-801',
            title: 'Role-Based Access Control (RBAC) & Principle of Least Privilege (PoLP)',
            slug: 'rbac-least-privilege-enforcement',
            type: 'article',
            durationMinutes: 28,
            xpReward: 80,
            order: 2,
            prerequisiteLessonIds: ['se-les-3'],
          }
        ]
      },
      {
        id: 'se-mod-3',
        courseId: 'seceng-801',
        title: 'Module 3: Endpoint Security, EDR/XDR & Telemetry Pipelines',
        order: 3,
        lessons: [
          {
            id: 'se-les-5',
            moduleId: 'se-mod-3',
            courseId: 'seceng-801',
            title: 'EDR/XDR Sensor Deployment, Host Isolation & Kernel Hooks',
            slug: 'edr-xdr-sensor-deployment-isolation',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 1,
            prerequisiteLessonIds: ['se-les-4'],
          },
          {
            id: 'se-les-6',
            moduleId: 'se-mod-3',
            courseId: 'seceng-801',
            title: 'Telemetry Engineering: Log Normalization, CEF & Ingestion Optimization',
            slug: 'telemetry-engineering-log-normalization',
            type: 'article',
            durationMinutes: 30,
            xpReward: 85,
            order: 2,
            prerequisiteLessonIds: ['se-les-5'],
          }
        ]
      },
      {
        id: 'se-mod-4',
        courseId: 'seceng-801',
        title: 'Module 4: Security Architecture & CIS Baseline Hardening',
        order: 4,
        lessons: [
          {
            id: 'se-les-7',
            moduleId: 'se-mod-4',
            courseId: 'seceng-801',
            title: 'Threat Modeling (STRIDE) & Enterprise Security Architecture Design',
            slug: 'stride-threat-modeling-architecture',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 100,
            order: 1,
            prerequisiteLessonIds: ['se-les-6'],
          },
          {
            id: 'se-les-8',
            moduleId: 'se-mod-4',
            courseId: 'seceng-801',
            title: 'OS & Infrastructure Hardening: CIS Benchmarks & WDAC Application Control',
            slug: 'cis-benchmarks-wdac-application-control',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['se-les-7'],
          }
        ]
      }
    ]
  },
  {
    id: 'netsec-901',
    title: 'Network Security Engineer: Core Protocols, Segmentation & Encryption',
    slug: 'network-security-engineer-protocols-segmentation',
    description: 'Master enterprise networking defense from Layer 2 to Layer 7. Deep dive into OSI & TCP/IP models, DNSSEC & DNS tunneling mitigation, VLAN/PVLAN segmentation, IPsec VPN tunnels, reverse proxies, and flow analysis.',
    category: 'Defensive',
    level: 'Intermediate',
    estimatedMinutes: 320,
    totalXp: 860,
    prerequisiteCourseIds: ['netsec-101'],
    modules: [
      {
        id: 'neteng-mod-1',
        courseId: 'netsec-901',
        title: 'Module 1: OSI, TCP/IP & Transport Layer Protocols',
        order: 1,
        lessons: [
          {
            id: 'neteng-les-1',
            moduleId: 'neteng-mod-1',
            courseId: 'netsec-901',
            title: 'The 7-Layer OSI Model vs TCP/IP: Protocols, PDUs & Threat Surfaces',
            slug: 'osi-model-tcp-ip-pdus-threats',
            type: 'video',
            durationMinutes: 28,
            xpReward: 75,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'neteng-les-2',
            moduleId: 'neteng-mod-1',
            courseId: 'netsec-901',
            title: 'TCP vs UDP: Handshakes, SYN Cookies & Volumetric DDoS Amplification',
            slug: 'tcp-vs-udp-handshakes-ddos-mitigation',
            type: 'interactive',
            durationMinutes: 32,
            xpReward: 85,
            order: 2,
            prerequisiteLessonIds: ['neteng-les-1'],
          }
        ]
      },
      {
        id: 'neteng-mod-2',
        courseId: 'netsec-901',
        title: 'Module 2: Infrastructure Hardening & DNS Security',
        order: 2,
        lessons: [
          {
            id: 'neteng-les-3',
            moduleId: 'neteng-mod-2',
            courseId: 'netsec-901',
            title: 'DNS Architecture, DNSSEC Cryptographic Validation & Tunneling Defense',
            slug: 'dnssec-dns-tunneling-defense',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 1,
            prerequisiteLessonIds: ['neteng-les-2'],
          },
          {
            id: 'neteng-les-4',
            moduleId: 'neteng-mod-2',
            courseId: 'netsec-901',
            title: 'Routing & Switching Security: Port Security, DAI, DHCP Snooping & CoPP',
            slug: 'routing-switching-dai-dhcp-snooping',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['neteng-les-3'],
          }
        ]
      },
      {
        id: 'neteng-mod-3',
        courseId: 'netsec-901',
        title: 'Module 3: Segmentation, NAT & Secure IPsec Tunnels',
        order: 3,
        lessons: [
          {
            id: 'neteng-les-5',
            moduleId: 'neteng-mod-3',
            courseId: 'netsec-901',
            title: 'Micro-segmentation, Private VLANs (PVLANs) & Workload Isolation',
            slug: 'micro-segmentation-pvlans-isolation',
            type: 'article',
            durationMinutes: 30,
            xpReward: 85,
            order: 1,
            prerequisiteLessonIds: ['neteng-les-4'],
          },
          {
            id: 'neteng-les-6',
            moduleId: 'neteng-mod-3',
            courseId: 'netsec-901',
            title: 'IPsec Architecture: AH, ESP, IKEv2 Cryptographic Suites & Site-to-Site Tunnels',
            slug: 'ipsec-architecture-ikev2-tunnels',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 110,
            order: 2,
            prerequisiteLessonIds: ['neteng-les-5'],
          }
        ]
      },
      {
        id: 'neteng-mod-4',
        courseId: 'netsec-901',
        title: 'Module 4: Proxies, WAFs & Full Flow Monitoring',
        order: 4,
        lessons: [
          {
            id: 'neteng-les-7',
            moduleId: 'neteng-mod-4',
            courseId: 'netsec-901',
            title: 'Forward vs Reverse Proxies, WAF Rule Policies & SSL Offloading',
            slug: 'forward-reverse-proxies-waf-ssl',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 1,
            prerequisiteLessonIds: ['neteng-les-6'],
          },
          {
            id: 'neteng-les-8',
            moduleId: 'neteng-mod-4',
            courseId: 'netsec-901',
            title: 'Network Telemetry: Full Packet Capture (PCAP) vs NetFlow/IPFIX Analysis',
            slug: 'pcap-vs-netflow-ipfix-analysis',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['neteng-les-7'],
          }
        ]
      }
    ]
  },
  {
    id: 'cloudsec-1001',
    title: 'Cloud Security Engineer: AWS, Azure, GCP & Multi-Cloud Hardening',
    slug: 'cloud-security-engineer-multi-cloud-iam',
    description: 'Master public cloud security architecture. Apply the Shared Responsibility Model, author least-privilege IAM policies, detect SSRF and IMDSv1 risks, remediate open S3/Blob storage, configure VPC PrivateLink, and automate DevSecOps IaC scanning with Checkov.',
    category: 'Cloud & IAM',
    level: 'Intermediate',
    estimatedMinutes: 350,
    totalXp: 900,
    prerequisiteCourseIds: ['seceng-801'],
    modules: [
      {
        id: 'cld-mod-1',
        courseId: 'cloudsec-1001',
        title: 'Module 1: Cloud Providers (AWS, Azure, GCP) & Shared Responsibility',
        order: 1,
        lessons: [
          {
            id: 'cld-les-1',
            moduleId: 'cld-mod-1',
            courseId: 'cloudsec-1001',
            title: 'Cloud Security Fundamentals & The Shared Responsibility Model',
            slug: 'cloud-fundamentals-shared-responsibility',
            type: 'video',
            durationMinutes: 28,
            xpReward: 75,
            order: 1,
            prerequisiteLessonIds: [],
          },
          {
            id: 'cld-les-2',
            moduleId: 'cld-mod-1',
            courseId: 'cloudsec-1001',
            title: 'Multi-Cloud Security Architectures: AWS GuardDuty, Azure Entra & GCP SCC',
            slug: 'multi-cloud-guardduty-entra-scc',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 2,
            prerequisiteLessonIds: ['cld-les-1'],
          }
        ]
      },
      {
        id: 'cld-mod-2',
        courseId: 'cloudsec-1001',
        title: 'Module 2: Cloud IAM, Least Privilege & Non-Human Identities',
        order: 2,
        lessons: [
          {
            id: 'cld-les-3',
            moduleId: 'cld-mod-2',
            courseId: 'cloudsec-1001',
            title: 'Authoring Cloud IAM JSON Policies, STS AssumeRole & Cross-Account Trust',
            slug: 'cloud-iam-json-sts-assume-role',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 110,
            order: 1,
            prerequisiteLessonIds: ['cld-les-2'],
          },
          {
            id: 'cld-les-4',
            moduleId: 'cld-mod-2',
            courseId: 'cloudsec-1001',
            title: 'Enforcing Least Privilege: IAM Access Analyzer & CIEM Auditing',
            slug: 'enforcing-least-privilege-access-analyzer',
            type: 'article',
            durationMinutes: 30,
            xpReward: 85,
            order: 2,
            prerequisiteLessonIds: ['cld-les-3'],
          }
        ]
      },
      {
        id: 'cld-mod-3',
        courseId: 'cloudsec-1001',
        title: 'Module 3: Cloud Threats, Misconfigurations & VPC Data Security',
        order: 3,
        lessons: [
          {
            id: 'cld-les-5',
            moduleId: 'cld-mod-3',
            courseId: 'cloudsec-1001',
            title: 'Remediating Open S3 Buckets & Cloud Misconfigurations with Automation',
            slug: 'remediating-open-s3-buckets-misconfigurations',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 1,
            prerequisiteLessonIds: ['cld-les-4'],
          },
          {
            id: 'cld-les-6',
            moduleId: 'cld-mod-3',
            courseId: 'cloudsec-1001',
            title: 'Cloud Threat Defense: SSRF Credential Theft (IMDSv2) & Envelope Encryption',
            slug: 'cloud-ssrf-imdsv2-envelope-encryption',
            type: 'interactive',
            durationMinutes: 40,
            xpReward: 110,
            order: 2,
            prerequisiteLessonIds: ['cld-les-5'],
          }
        ]
      },
      {
        id: 'cld-mod-4',
        courseId: 'cloudsec-1001',
        title: 'Module 4: Telemetry, DevSecOps IaC Scanning & Landing Zones',
        order: 4,
        lessons: [
          {
            id: 'cld-les-7',
            moduleId: 'cld-mod-4',
            courseId: 'cloudsec-1001',
            title: 'Cloud Telemetry: AWS CloudTrail, VPC Flow Logs & Real-Time EventBridge Alerts',
            slug: 'cloudtrail-vpc-flow-eventbridge-alerts',
            type: 'interactive',
            durationMinutes: 35,
            xpReward: 95,
            order: 1,
            prerequisiteLessonIds: ['cld-les-6'],
          },
          {
            id: 'cld-les-8',
            moduleId: 'cld-mod-4',
            courseId: 'cloudsec-1001',
            title: 'DevSecOps & Cloud IaC Security: Scanning Terraform with Checkov & Trivy',
            slug: 'devsecops-iac-scanning-checkov-trivy',
            type: 'interactive',
            durationMinutes: 38,
            xpReward: 105,
            order: 2,
            prerequisiteLessonIds: ['cld-les-7'],
          }
        ]
      }
    ]
  }
];

export const CTF_LABS: Lab[] = [
  {
    id: 'lab-sqli-01',
    title: 'SQL Injection: Authentication Bypass & Flag Dump',
    slug: 'lab-sqli-bypass',
    category: 'Web Exploitation',
    difficulty: 'Easy',
    description: 'An internal human resources portal uses unparameterized string concatenation in its login queries. Exploit the vulnerability to authenticate as admin and extract the security flag.',
    scenario: 'You have been engaged by Apex Financial to assess their internal portal running at 10.10.42.15:8080. Source code analysis revealed: SELECT * FROM users WHERE username = \'$user\' AND password = \'$pass\'.',
    targetSystem: 'Apex HR Portal (v2.4-vulnerable)',
    terminalPrompt: 'hacker@cybermentor:~/labs/sqli-01$',
    initialCommands: [
      'curl -s http://10.10.42.15:8080/health',
      'echo "Target is active. Use the terminal below to test payloads against the auth endpoint."'
    ],
    objectives: [
      'Discover injection point in HTTP POST payload',
      'Bypass authentication check without knowing password',
      'Retrieve the secret flag stored in the admin record'
    ],
    hints: [
      { id: 'h1', title: 'SQL Query Syntax', xpCost: 15, unlocked: false, text: 'Consider how standard quotes close strings: admin\' -- or admin\' OR \'1\'=\'1' },
      { id: 'h2', title: 'Union Payload', xpCost: 30, unlocked: false, text: 'Use a UNION SELECT 1, "admin", "FLAG{...}" to force authentication if password check is bypassed.' }
    ],
    totalXpReward: 120
  },
  {
    id: 'lab-idor-02',
    title: 'IDOR: Horizontal Privilege Escalation in REST API',
    slug: 'lab-idor-api-exfil',
    category: 'Web Exploitation',
    difficulty: 'Medium',
    description: 'A healthcare claims platform exposes patient records via predictable numeric identifiers without validating the JWT owner against the requested record ID.',
    scenario: 'Target is MediVault API running at https://api.medivault.local/v1/patients/{id}/records. You hold standard user credentials for user ID 1042. Patient 1001 is a high-profile target carrying the CTF flag in their diagnosis notes.',
    targetSystem: 'MediVault HIPAA API (REST Endpoint)',
    terminalPrompt: 'analyst@cybermentor:~/labs/idor-02$',
    initialCommands: [
      'curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." https://api.medivault.local/v1/patients/1042/records',
      'echo "Authorized for user 1042. Attempt to query neighboring records."'
    ],
    objectives: [
      'Analyze the authorization header vs path parameters',
      'Enumerate patient record ID 1001',
      'Extract the confidential medical record containing the CTF flag'
    ],
    hints: [
      { id: 'h1', title: 'Path Parameter Tampering', xpCost: 20, unlocked: false, text: 'Notice how the server inspects the bearer token for validity, but fails to check if token.sub == request.params.id.' },
      { id: 'h2', title: 'Header inspection', xpCost: 35, unlocked: false, text: 'Execute: curl -s -H "Authorization: Bearer <TOKEN>" https://api.medivault.local/v1/patients/1001/records' }
    ],
    totalXpReward: 150
  },
  {
    id: 'lab-xss-03',
    title: 'Stored XSS & Cookie Theft Filter Bypass',
    slug: 'lab-stored-xss-bypass',
    category: 'Web Exploitation',
    difficulty: 'Medium',
    description: 'An enterprise ticket system strips <script> tags using a naive single-pass regex. Craft an evasion payload to execute JavaScript and steal the simulated admin session cookie.',
    scenario: 'Ticket comments are rendered directly in the internal agent dashboard. The naive filter executes: content.replace(/<script>/gi, ""). Craft a nested tag payload or event handler.',
    targetSystem: 'SupportDesk Ticketing v4.1',
    terminalPrompt: 'researcher@cybermentor:~/labs/xss-03$',
    initialCommands: [
      'cat /var/log/ticket_filter.py',
      'echo "Regex filter: re.sub(r\'<script>\', \'\', input, flags=re.I)"'
    ],
    objectives: [
      'Identify the flaws in single-pass substring removal',
      'Inject <scr<script>ipt> or <img src=x onerror=...> payload',
      'Retrieve FLAG stored in the simulated admin bot cookie'
    ],
    hints: [
      { id: 'h1', title: 'Recursion Vulnerability', xpCost: 20, unlocked: false, text: 'If <script> is deleted from <scr<script>ipt>, what remains?' },
      { id: 'h2', title: 'Event Handlers', xpCost: 40, unlocked: false, text: 'Alternatively, try non-script tags: <svg onload="alert(document.cookie)"/>' }
    ],
    totalXpReward: 160
  },
  {
    id: 'lab-privesc-04',
    title: 'Linux SUID Binary Abuse & Root Escalation',
    slug: 'lab-linux-suid-privesc',
    category: 'Privilege Escalation',
    difficulty: 'Hard',
    description: 'A legacy Linux server has a custom backup utility flagged with SUID root permissions that invokes an unquoted tar command with wildcard expansion vulnerabilities.',
    scenario: 'You have low-privilege SSH access as user "webuser". Enumerate all SUID binaries on the filesystem and exploit GTFOBins techniques to drop an interactive root shell.',
    targetSystem: 'Ubuntu 22.04 LTS (Kernel 5.15)',
    terminalPrompt: 'webuser@target-host:~$',
    initialCommands: [
      'find / -perm -4000 2>/dev/null',
      'ls -la /usr/local/bin/backup_agent'
    ],
    objectives: [
      'Enumerate SUID binaries via find -perm -4000',
      'Analyze binary execution path and arguments',
      'Exploit wildcard injection or PATH hijacking to extract /root/flag.txt'
    ],
    hints: [
      { id: 'h1', title: 'GTFOBins Tar Check', xpCost: 25, unlocked: false, text: 'Check GTFOBins for tar checkpoint execution: --checkpoint=1 --checkpoint-action=exec=sh' },
      { id: 'h2', title: 'Wildcard Injection', xpCost: 45, unlocked: false, text: 'Create files named "--checkpoint=1" and "--checkpoint-action=exec=sh shell.sh" in the backup directory.' }
    ],
    totalXpReward: 200
  }
];

export const INCIDENT_SCENARIOS: IncidentScenario[] = [
  {
    id: 'scen-lockbit-01',
    title: 'Incident Alpha: LockBit Enterprise Ransomware Outbreak',
    severity: 'Critical',
    mitreTactics: ['Initial Access (T1190)', 'Execution (T1059)', 'Lateral Movement (T1021)', 'Impact (T1486)'],
    summary: 'At 02:14 UTC, high-priority EDR alerts trigger across the finance cluster. File systems are rapidly renaming with the extension .lockbit3 and a ransom note README.txt appears on all mapped shares.',
    totalXpReward: 250,
    stages: [
      {
        id: 'stage-1',
        stageNumber: 1,
        title: 'Triage & First Responders Assessment',
        telemetryLogs: [
          '[02:14:02] EDR-AGENT-04: Suspicious process spawned: powershell.exe -enc JAB3AGMA... by svchost.exe',
          '[02:14:18] SIEM: 1,420 files renamed to .lockbit3 in \\\\FIN-FS01\\Accounting within 60 seconds',
          '[02:15:00] NETFLOW: Inbound SMB (Port 445) spike from Workstation-104 to all internal VLAN nodes'
        ],
        description: 'You are the Lead Incident Handler on duty. The ransomware is actively propagating through domain network shares. What is your immediate containment action?',
        question: 'Select your initial containment strategy:',
        choices: [
          {
            id: 'c1',
            label: 'Option A: Power off all servers immediately via emergency datacenter breaker',
            actionDescription: 'Pull datacenter power breakers to kill all machines instantly.',
            isOptimal: false,
            scoreDelta: -40,
            feedback: 'Critical error! Cutting power abruptly corrupts volatile RAM memory containing decryption keys, process injection memory maps, and in-flight C2 connection sockets.'
          },
          {
            id: 'c2',
            label: 'Option B: Network isolate Workstation-104 and FIN-FS01 via EDR & VLAN quarantine',
            actionDescription: 'Issue EDR software network isolation and sever VLAN routing while preserving power for volatile RAM dumping.',
            isOptimal: true,
            scoreDelta: 50,
            feedback: 'Optimal response! Isolating the network perimeter halts lateral SMB traversal while preserving live system RAM for memory forensics and key extraction.'
          },
          {
            id: 'c3',
            label: 'Option C: Send an email broadcast to all 2,000 employees advising them to reboot',
            actionDescription: 'Send company-wide email asking people to reboot their computers.',
            isOptimal: false,
            scoreDelta: -30,
            feedback: 'Ineffective! Rebooting allows the malware persistence mechanism (scheduled tasks/registry run keys) to re-execute and finalize file encryption upon boot.'
          }
        ]
      },
      {
        id: 'stage-2',
        stageNumber: 2,
        title: 'Evidence Preservation & Forensics',
        telemetryLogs: [
          '[02:30:10] IR-TOOL: Memory dump captured on Workstation-104 (16GB raw RAM image written to write-blocker drive)',
          '[02:32:45] VOLATILITY: Found injected DLL in lsass.exe process space; cleartext Mimikatz artifacts detected in memory',
          '[02:35:00] ACTIVE DIRECTORY: Alert: Domain Admin account "svc-backup" logged in from anomalous IP 192.168.10.104'
        ],
        description: 'Memory analysis proves the adversary leveraged Mimikatz to scrape the Domain Admin backup service account credentials from memory. What is your credential containment step?',
        question: 'How do you remediate the compromised Domain Administrator credential?',
        choices: [
          {
            id: 'c4',
            label: 'Reset the svc-backup password once and leave Krbtgt untouched',
            actionDescription: 'Reset only the compromised service account password.',
            isOptimal: false,
            scoreDelta: 10,
            feedback: 'Insufficient! If the adversary extracted Kerberos ticket-granting tickets (Golden Ticket), resetting svc-backup alone does not invalidate forged TGTs.'
          },
          {
            id: 'c5',
            label: 'Perform a double reset of the KRBTGT account password and rotate svc-backup credentials',
            actionDescription: 'Execute standard 2-step Active Directory KRBTGT password rotation with 10-hour propagation spacing and revoke current Kerberos tickets.',
            isOptimal: true,
            scoreDelta: 50,
            feedback: 'Master-level incident handling! Resetting KRBTGT twice invalidates any Golden/Silver Kerberos tickets forged by the attacker across the entire domain forest.'
          },
          {
            id: 'c6',
            label: 'Delete Active Directory and rebuild the domain forest from scratch right now',
            actionDescription: 'Format the Domain Controllers immediately without root-cause analysis.',
            isOptimal: false,
            scoreDelta: -20,
            feedback: 'Premature and catastrophic to business operations. Investigation is not yet complete.'
          }
        ]
      },
      {
        id: 'stage-3',
        stageNumber: 3,
        title: 'Root Cause & Restoration Debrief',
        telemetryLogs: [
          '[03:10:00] FIREWALL LOGS: Discovered external SSL-VPN connection using single-factor password for employee "jdoe"',
          '[03:12:15] CVE-CHECK: Fortinet VPN gateway was unpatched against CVE-2023-27997 RCE flaw',
          '[03:20:00] IMMUTABLE BACKUPS: Veeam air-gapped immutable S3 storage reports 100% clean snapshots from 00:00 UTC'
        ],
        description: 'You have identified the initial vector (unpatched VPN portal lacking MFA) and validated that cold air-gapped backups are intact. What is the approved recovery procedure?',
        question: 'Execute the restoration and hardening sequence:',
        choices: [
          {
            id: 'c7',
            label: 'Restore backups immediately to existing infected machines without patching the VPN',
            actionDescription: 'Restore files while leaving the external perimeter vulnerable.',
            isOptimal: false,
            scoreDelta: -50,
            feedback: 'Disaster! The attacker retains VPN access and will re-infect the restored systems within minutes.'
          },
          {
            id: 'c8',
            label: 'Patch VPN firmware, enforce hardware FIDO2 MFA on all remote portals, wipe infected endpoints, and restore from verified immutable snapshots',
            actionDescription: 'Harden the entry point, enforce MFA, re-image compromised machines, and restore from verified clean air-gapped backups.',
            isOptimal: true,
            scoreDelta: 50,
            feedback: 'Textbook NIST SP 800-61 recovery! Perimeter secured, authentication hardened with MFA, clean images deployed, and zero ransom paid.'
          }
        ]
      }
    ]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-secplus',
    code: 'Security+',
    name: 'CompTIA Security+ (SY0-701)',
    issuer: 'CompTIA',
    examCode: 'SY0-701',
    durationMinutes: 90,
    passingScore: '750 / 900 (approx 83%)',
    questionsCount: 'Max 90 questions (MC & PBQs)',
    cost: '$392 USD',
    description: 'The foundational baseline credential for cybersecurity professionals. Validates baseline skills necessary to perform core security functions and pursue an IT security career.',
    domains: [
      { name: 'General Security Concepts', weightPercent: 12, topics: ['Security controls', 'Basic crypto concepts', 'Authentication & Authorization'] },
      { name: 'Threats, Vulnerabilities, & Mitigations', weightPercent: 22, topics: ['Threat actors & vectors', 'Vulnerabilities', 'Security assessments'] },
      { name: 'Security Architecture', weightPercent: 18, topics: ['Security models', 'Network architecture', 'Cloud security concepts'] },
      { name: 'Security Operations', weightPercent: 28, topics: ['Incident response', 'Monitoring & logging', 'Hardening techniques'] },
      { name: 'Security Program Management', weightPercent: 20, topics: ['Risk management', 'Compliance & governance', 'Privacy controls'] }
    ],
    resources: [
      { title: 'Official CompTIA Exam Blueprint', type: 'blueprint', url: 'https://www.comptia.org/certifications/security' },
      { title: 'CyberMentor Security+ Syllabus Map', type: 'roadmap', url: '#courses' }
    ],
    readinessScore: 68
  },
  {
    id: 'cert-ceh',
    code: 'CEH v12',
    name: 'Certified Ethical Hacker v12',
    issuer: 'EC-Council',
    examCode: '312-50',
    durationMinutes: 240,
    passingScore: '60% - 85% (Dynamic Cut Score)',
    questionsCount: '125 Multiple Choice',
    cost: '$1,199 USD',
    description: 'A respected offensive security credential teaching ethical hacking methodologies, reconnaissance, system scanning, malware analysis, and network packet sniffing.',
    domains: [
      { name: 'Information Security & Ethical Hacking Overview', weightPercent: 6, topics: ['Cyber kill chain', 'Hacker classes', 'Legal frameworks'] },
      { name: 'Reconnaissance Techniques', weightPercent: 21, topics: ['Footprinting', 'Network scanning', 'Enumeration'] },
      { name: 'System Hacking Phases & Attack Techniques', weightPercent: 17, topics: ['Vulnerability analysis', 'Sniffing', 'Social engineering'] },
      { name: 'Network and Perimeter Hacking', weightPercent: 14, topics: ['Denial-of-Service', 'Session hijacking', 'Evading IDS/Firewalls'] },
      { name: 'Web Application Hacking', weightPercent: 16, topics: ['SQLi', 'XSS', 'CSRF', 'API hacking'] }
    ],
    resources: [
      { title: 'Official EC-Council CEH Page', type: 'official_site', url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/' }
    ],
    readinessScore: 54
  },
  {
    id: 'cert-cysa',
    code: 'CySA+',
    name: 'CompTIA Cybersecurity Analyst (CS0-003)',
    issuer: 'CompTIA',
    examCode: 'CS0-003',
    durationMinutes: 165,
    passingScore: '750 / 900',
    questionsCount: 'Max 85 questions (MC & PBQs)',
    cost: '$392 USD',
    description: 'An intermediate analytics-based certification applying behavioral analytics to networks and devices to prevent, detect, and combat cybersecurity threats.',
    domains: [
      { name: 'Security Operations', weightPercent: 33, topics: ['System communication analysis', 'Malicious activity identification', 'Threat hunting'] },
      { name: 'Vulnerability Management', weightPercent: 30, topics: ['Vulnerability scanning', 'Vulnerability prioritization', 'Remediation strategies'] },
      { name: 'Incident Response and Management', weightPercent: 20, topics: ['Attack impact evaluation', 'Incident containment', 'Digital forensics'] },
      { name: 'Reporting and Communication', weightPercent: 17, topics: ['Compliance reporting', 'Root cause communication', 'Control metrics'] }
    ],
    resources: [
      { title: 'CompTIA CySA+ Certification Path', type: 'official_site', url: 'https://www.comptia.org/certifications/cybersecurity-analyst' }
    ],
    readinessScore: 42
  },
  {
    id: 'cert-oscp',
    code: 'OSCP',
    name: 'Offensive Security Certified Professional',
    issuer: 'OffSec',
    examCode: 'PEN-200 Exam',
    durationMinutes: 1440,
    passingScore: '70 / 100 points within 24 hours',
    questionsCount: 'Hands-on 24-Hour Active Directory & Standalone Machines Lab',
    cost: '$1,649 USD (Course + Exam)',
    description: 'The golden standard practical penetration testing certification. Candidates must compromise an active directory network and multiple standalone machines, followed by a professional 24-hour penetration test report.',
    domains: [
      { name: 'Active Directory Attacks', weightPercent: 40, topics: ['Kerberoasting', 'AS-REP roasting', 'Pass-the-Hash', 'BloodHound lateral movement'] },
      { name: 'Standalone Target Exploitation', weightPercent: 40, topics: ['Buffer overflows', 'Web service exploitation', 'Local privilege escalation'] },
      { name: 'Professional Documentation', weightPercent: 20, topics: ['Step-by-step reproduction steps', 'Executive summary', 'Remediation advice'] }
    ],
    resources: [
      { title: 'OffSec PEN-200 Official Guide', type: 'official_site', url: 'https://www.offsec.com/courses/pen-200/' }
    ],
    readinessScore: 35
  },
  {
    id: 'cert-cissp',
    code: 'CISSP',
    name: 'Certified Information Systems Security Professional',
    issuer: '(ISC)²',
    examCode: 'CISSP CAT Exam',
    durationMinutes: 240,
    passingScore: '700 / 1000',
    questionsCount: '100 - 150 Adaptive Questions',
    cost: '$749 USD',
    description: 'The premier senior management and architecture certification. Validates an information security leader\'s deep knowledge across 8 comprehensive cybersecurity domains.',
    domains: [
      { name: 'Security and Risk Management', weightPercent: 15, topics: ['Governance', 'Risk analysis', 'Business continuity', 'Ethics'] },
      { name: 'Asset Security', weightPercent: 10, topics: ['Data classification', 'Privacy protection', 'Data retention'] },
      { name: 'Security Architecture and Engineering', weightPercent: 13, topics: ['Security models', 'Vulnerabilities in systems', 'Cryptography'] },
      { name: 'Communication and Network Security', weightPercent: 13, topics: ['Network architecture', 'Secure communications channels', 'Network attacks'] },
      { name: 'Identity and Access Management (IAM)', weightPercent: 13, topics: ['Physical/logical access', 'Authentication', 'SSO & Federation'] }
    ],
    resources: [
      { title: '(ISC)² Official CISSP Overview', type: 'official_site', url: 'https://www.isc2.org/certifications/cissp' }
    ],
    readinessScore: 28
  }
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-1',
    domain: 'Network Security',
    text: 'During an SYN Flood attack, which state does the targeted server\'s TCP connection queue remain in while waiting for the client\'s response?',
    options: ['ESTABLISHED', 'SYN_RECEIVED', 'TIME_WAIT', 'CLOSE_WAIT']
  },
  {
    id: 'diag-2',
    domain: 'Web Application Security',
    text: 'Which defensive programming technique is the primary defense against SQL Injection vulnerabilities?',
    options: [
      'Client-side HTML form regex validation',
      'Parameterized queries (Prepared Statements)',
      'Escaping single quote characters with backslashes',
      'Deploying a Layer 4 firewall rule'
    ]
  },
  {
    id: 'diag-3',
    domain: 'Cryptography',
    text: 'Why is AES in Galois/Counter Mode (AES-GCM) strongly preferred over AES in Electronic Codebook (AES-ECB) or Cipher Block Chaining (AES-CBC)?',
    options: [
      'AES-GCM operates with zero initialization vector',
      'AES-GCM provides both confidentiality and built-in cryptographic integrity verification (AEAD)',
      'AES-GCM is an asymmetric cipher resistant to quantum attacks',
      'AES-GCM does not require a secret key'
    ]
  },
  {
    id: 'diag-4',
    domain: 'Incident Response & Forensics',
    text: 'In Windows Event Logging, which Event ID definitively records successful user authentication and logon?',
    options: ['Event ID 4624', 'Event ID 4625', 'Event ID 1102', 'Event ID 4688']
  },
  {
    id: 'diag-5',
    domain: 'System & OS Security',
    text: 'What is the security hazard of setting the SUID bit on a binary owned by root that executes external commands without absolute paths?',
    options: [
      'It exhausts the system inodes',
      'Local low-privilege users can manipulate the PATH environment variable to achieve root privilege escalation',
      'It renders the filesystem read-only',
      'It disables kernel ASLR protection'
    ]
  }
];
