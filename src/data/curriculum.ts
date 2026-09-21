import {
  CuratedVideo,
  SOC_ANALYST_VIDEOS,
  PENTESTING_VIDEOS,
  THREAT_HUNTER_VIDEOS,
  THREAT_INTEL_VIDEOS,
  MALWARE_ANALYST_VIDEOS,
  SECURITY_ENGINEER_VIDEOS,
  NETWORK_SECURITY_VIDEOS,
  CLOUD_SECURITY_VIDEOS
} from './curatedVideoData';

export interface ExternalLab {
  title: string;
  platform: 'TryHackMe' | 'HackTheBox' | 'PortSwigger' | 'Blue Team Labs' | 'PicoCTF' | 'OverTheWire' | 'RangeForce' | 'CMD Challenge' | 'CyberDefenders' | 'VulnHub' | 'CryptoHack' | 'OWASP' | 'Other';
  url: string;
  type: 'CTF' | 'Lab' | 'Challenge' | 'Practice Platform' | 'Wargame';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  free: boolean;
  description?: string;
}

export interface CurriculumTopic {
  topicNumber: number;
  topicName: string;
  sectionNumber?: number;
  sectionTitle?: string;
  videoTitle: string;
  youtubeUrl: string;       // Original link provided
  directVideoUrl: string;   // Direct watch link
  embedUrl: string;         // Iframe-playable embed link
  videoId: string;
  channel: string;
  durationApprox?: string;
  description: string;
  keyTakeaways: string[];
  externalLabs: ExternalLab[];
}

export interface CurriculumRoleTrack {
  roleId: string;
  roleTitle: string;
  badge: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  estimatedHours: string;
  iconName: string;
  color: string;
  topics: CurriculumTopic[];
}

export const getRelevantExternalLabs = (roleId: string, topicName: string, videoTitle: string): ExternalLab[] => {
  const t = (topicName + ' ' + videoTitle).toLowerCase();

  // Nmap / Scanning / Recon
  if (t.includes('nmap') || t.includes('scan') || t.includes('recon') || t.includes('subdomain') || t.includes('enumeration')) {
    return [
      {
        title: 'TryHackMe: Further Nmap Scanning',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/furthernmap',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Interactive Nmap scanning flags, OS detection, NSE scripts, and port enumeration.'
      },
      {
        title: 'HackTheBox: Starting Point Reconnaissance',
        platform: 'HackTheBox',
        url: 'https://www.hackthebox.com/',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Hands-on target discovery and initial port scanning challenges.'
      }
    ];
  }

  // Web Application / OWASP / Burp Suite / SQLi / XSS / IDOR / SSRF
  if (t.includes('web') || t.includes('owasp') || t.includes('burp') || t.includes('sql') || t.includes('xss') || t.includes('idor') || t.includes('ssrf') || t.includes('csrf') || t.includes('injection')) {
    return [
      {
        title: 'PortSwigger Web Security Academy Labs',
        platform: 'PortSwigger',
        url: 'https://portswigger.net/web-security/all-labs',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'Interactive labs covering SQLi, XSS, CSRF, SSRF, IDOR, and authentication bypasses.'
      },
      {
        title: 'OWASP Juice Shop Practice Instance',
        platform: 'OWASP',
        url: 'https://juice-shop.herokuapp.com/',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'Deliberately insecure modern web application for practicing web pentesting.'
      },
      {
        title: 'TryHackMe: Web Fundamentals Path',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/module/web-fundamentals',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'HTTP request interception, cookie tampering, and web vulnerability exploitation.'
      }
    ];
  }

  // Active Directory / Windows / Kerberos / BloodHound / PrivEsc
  if (t.includes('active directory') || t.includes('kerberos') || t.includes('bloodhound') || t.includes('privilege escalation') || t.includes('privesc') || t.includes('windows')) {
    return [
      {
        title: 'TryHackMe: Active Directory Basics',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/active-directory-basics',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Domain enumeration, Kerberoasting, AS-REP Roasting, and BloodHound attack pathing.'
      },
      {
        title: 'HackTheBox: Windows Active Directory Labs',
        platform: 'HackTheBox',
        url: 'https://www.hackthebox.com/',
        type: 'Lab',
        difficulty: 'Advanced',
        free: true,
        description: 'Enterprise AD domain compromise, domain controller takeover, and golden tickets.'
      }
    ];
  }

  // SOC / SIEM / Splunk / Event Logs / Alert Triage
  if (t.includes('soc') || t.includes('siem') || t.includes('splunk') || t.includes('log') || t.includes('event') || t.includes('triage') || t.includes('elastic')) {
    return [
      {
        title: 'CyberDefenders: Splunk Log Investigation',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Intermediate',
        free: true,
        description: 'Query Splunk logs to trace attacker entry, credential theft, and data exfiltration.'
      },
      {
        title: 'TryHackMe: SOC Level 1 Learning Path',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/path/outline/soclevel1',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Interactive SOC rooms covering Splunk, Elastic, Snort, Wireshark, and Phishing triage.'
      },
      {
        title: 'Blue Team Labs Online Practice',
        platform: 'Blue Team Labs',
        url: 'https://blueteamlabs.online/',
        type: 'Practice Platform',
        difficulty: 'Beginner',
        free: true,
        description: 'Gamified blue team operational challenges covering SOC triage and SIEM queries.'
      }
    ];
  }

  // Incident Response / Memory / Ransomware / Containment
  if (t.includes('incident') || t.includes('response') || t.includes('memory') || t.includes('ransomware') || t.includes('containment') || t.includes('volatility')) {
    return [
      {
        title: 'CyberDefenders: Incident Response Scenarios',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Advanced',
        free: true,
        description: 'Investigate live enterprise breaches, RAM dumps, and lateral movement artifacts.'
      },
      {
        title: 'Blue Team Labs Online: Ransomware Containment',
        platform: 'Blue Team Labs',
        url: 'https://blueteamlabs.online/',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Hands-on ransomware containment, volatile memory triage, and root cause analysis.'
      }
    ];
  }

  // Forensics / Disk / Registry / MFT / Autopsy
  if (t.includes('forensics') || t.includes('disk') || t.includes('registry') || t.includes('mft') || t.includes('autopsy') || t.includes('evidence')) {
    return [
      {
        title: 'CyberDefenders: Disk & Memory Forensics Labs',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Intermediate',
        free: true,
        description: 'Analyze E01 raw disk images, Windows Registry hives, and Autopsy cases.'
      },
      {
        title: 'TryHackMe: Digital Forensics & Incident Response',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/module/digital-forensics-and-incident-response',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'MFT parsing, USN Journal analysis, Shimcache inspection, and timeline generation.'
      }
    ];
  }

  // Threat Hunting / KQL / Sysmon / ATT&CK
  if (t.includes('threat hunt') || t.includes('hunting') || t.includes('kql') || t.includes('sysmon') || t.includes('att&ck') || t.includes('sentinel')) {
    return [
      {
        title: 'CyberDefenders: Threat Hunting PCAPs & Logs',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Advanced',
        free: true,
        description: 'Proactively query event logs and network telemetry for APT persistence.'
      },
      {
        title: 'TryHackMe: Threat Hunting Module',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/threathunting',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Guided labs on KQL, Sysmon event correlation, and Sigma rule generation.'
      }
    ];
  }

  // Malware / Reverse Engineering / Ghidra / Assembly
  if (t.includes('malware') || t.includes('reverse') || t.includes('ghidra') || t.includes('assembly') || t.includes('dissect') || t.includes('sandbox')) {
    return [
      {
        title: 'ANY.RUN Interactive Malware Sandbox',
        platform: 'Other',
        url: 'https://any.run/',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'Interactive malware detonation sandbox inspecting network traffic and process trees.'
      },
      {
        title: 'TryHackMe: Intro to Malware Analysis',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/malmalwareintro',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Static and dynamic triage using PEStudio, Ghidra, and x64dbg.'
      }
    ];
  }

  // Cloud / AWS / Azure / GCP / IAM / Kubernetes
  if (t.includes('cloud') || t.includes('aws') || t.includes('azure') || t.includes('gcp') || t.includes('kubernetes') || t.includes('iac')) {
    return [
      {
        title: 'CloudGoat: Vulnerable AWS Deployment',
        platform: 'Other',
        url: 'https://github.com/RhinoSecurityLabs/cloudgoat',
        type: 'Wargame',
        difficulty: 'Intermediate',
        free: true,
        description: 'Vulnerable AWS cloud environments for testing SSRF, IAM privilege escalation, and S3 leaks.'
      },
      {
        title: 'TryHackMe: Cloud Security Module',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/module/cloud-security',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Auditing AWS CloudTrail, Entra ID risky sign-ins, and cloud infrastructure flaws.'
      }
    ];
  }

  // Network / Wireshark / Firewall / Packet / Protocol / Linux / CLI
  if (t.includes('network') || t.includes('wireshark') || t.includes('pcap') || t.includes('firewall') || t.includes('protocol') || t.includes('linux') || t.includes('command')) {
    return [
      {
        title: 'TryHackMe: Wireshark Packet Analysis',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/wireshark',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Packet capture inspection, display filters, and extracting HTTP credentials.'
      },
      {
        title: 'OverTheWire: Bandit Wargame',
        platform: 'OverTheWire',
        url: 'https://overthewire.org/wargames/bandit/',
        type: 'Wargame',
        difficulty: 'Beginner',
        free: true,
        description: 'Hands-on Linux command line wargame mastering SSH, grep, file permissions, and piping.'
      },
      {
        title: 'CMD Challenge Terminal Practice',
        platform: 'CMD Challenge',
        url: 'https://cmdchallenge.com/',
        type: 'Challenge',
        difficulty: 'Beginner',
        free: true,
        description: 'Short interactive shell challenges testing Linux command line productivity.'
      }
    ];
  }

  // Role-based Fallbacks
  if (roleId.includes('soc') || roleId.includes('cybersecurity')) {
    return [
      {
        title: 'TryHackMe: Cyber Defense Path',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/path/outline/cyberdefense',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Defensive security fundamentals, threat intelligence, and vulnerability management.'
      },
      {
        title: 'CyberDefenders: Blue Team Investigations',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Intermediate',
        free: true,
        description: 'Hands-on security investigation challenges inspecting PCAPs, logs, and SIEM telemetry.'
      }
    ];
  }

  if (roleId.includes('pentest') || roleId.includes('vapt') || roleId.includes('bounty') || roleId.includes('offensive')) {
    return [
      {
        title: 'HackTheBox: Penetration Testing Machines',
        platform: 'HackTheBox',
        url: 'https://www.hackthebox.com/',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Vulnerable virtual machines for hands-on network scanning and privilege escalation.'
      },
      {
        title: 'PortSwigger Web Security Academy',
        platform: 'PortSwigger',
        url: 'https://portswigger.net/web-security',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'Interactive web security labs covering top application vulnerabilities.'
      }
    ];
  }

  // Generic Default Fallback
  return [
    {
      title: 'TryHackMe: Hands-on Cyber Security Rooms',
      platform: 'TryHackMe',
      url: 'https://tryhackme.com/',
      type: 'Lab',
      difficulty: 'Beginner',
      free: true,
      description: 'Guided interactive security labs covering defensive and offensive concepts.'
    },
    {
      title: 'HackTheBox: Hands-On Practice',
      platform: 'HackTheBox',
      url: 'https://www.hackthebox.com/',
      type: 'Practice Platform',
      difficulty: 'Intermediate',
      free: true,
      description: 'Grounded cybersecurity challenges and target machines for practical learning.'
    }
  ];
};

const mapVideosToTopics = (videos: CuratedVideo[], roleId?: string): CurriculumTopic[] => {
  return videos.map((v) => ({
    topicNumber: v.topicNumber,
    topicName: v.topicName,
    sectionNumber: v.sectionNumber,
    sectionTitle: v.sectionTitle,
    videoTitle: v.videoTitle,
    youtubeUrl: v.youtubeUrl,
    directVideoUrl: v.directVideoUrl,
    embedUrl: v.embedUrl,
    videoId: v.videoId,
    channel: v.channel,
    durationApprox: v.durationApprox,
    description: v.description,
    keyTakeaways: v.keyTakeaways,
    externalLabs: getRelevantExternalLabs(roleId || v.trackId || '', v.topicName, v.videoTitle)
  }));
};

const withLabs = (roleId: string, topics: Array<Omit<CurriculumTopic, 'externalLabs'>>): CurriculumTopic[] => {
  return topics.map((t) => ({
    ...t,
    externalLabs: getRelevantExternalLabs(roleId, t.topicName, t.videoTitle)
  }));
};

// 1. SOC Analyst Track
export const SOC_ANALYST_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'soc-analyst',
  roleTitle: 'SOC Analyst',
  badge: 'Tier 1 / Tier 2 Defensive Operations',
  level: 'Beginner',
  description: 'Master fundamental network protocols, OSI layers, packet header analysis, Windows event logs (4624/4625), SIEM alert triage, and endpoint telemetry.',
  estimatedHours: '12 hours',
  iconName: 'ShieldCheck',
  color: 'emerald',
  topics: mapVideosToTopics(SOC_ANALYST_VIDEOS, 'soc-analyst')
};

// 2. Penetration Tester Track
export const PENETRATION_TESTER_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'penetration-tester',
  roleTitle: 'Penetration Tester / Ethical Hacker',
  badge: 'Offensive Security & Red Teaming',
  level: 'Intermediate',
  description: 'Learn offensive methodologies, recon (Nmap/Sublist3r), web exploitation (SQLi, XSS, SSRF), privilege escalation, Active Directory attacks, and C2 operations.',
  estimatedHours: '18 hours',
  iconName: 'Terminal',
  color: 'rose',
  topics: mapVideosToTopics(PENTESTING_VIDEOS, 'penetration-tester')
};

// 3. Cybersecurity Analyst Track
export const CYBERSECURITY_ANALYST_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'cybersecurity-analyst',
  roleTitle: 'Cybersecurity Analyst',
  badge: 'Enterprise Risk & Defensive Governance',
  level: 'Beginner',
  description: 'Comprehensive grounding in cybersecurity governance, NIST Cybersecurity Framework (CSF 2.0), risk assessment, identity management, and baseline security controls.',
  estimatedHours: '14 hours',
  iconName: 'Shield',
  color: 'teal',
  topics: withLabs('cybersecurity-analyst', [
    {
      topicNumber: 1,
      topicName: 'Cybersecurity Fundamentals & NIST CSF',
      videoTitle: 'Cyber Security In 7 Minutes | Cyber Security Training',
      youtubeUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
      directVideoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
      embedUrl: 'https://www.youtube-nocookie.com/embed/inWWhr5tnEA?rel=0',
      videoId: 'inWWhr5tnEA',
      channel: 'Simplilearn',
      durationApprox: '10 min',
      description: 'Foundational introduction to the CIA Triad (Confidentiality, Integrity, Availability), security policy frameworks, and risk management principles.',
      keyTakeaways: [
        'Core pillars of CIA Triad and non-repudiation',
        'NIST CSF 2.0 Functions: Govern, Identify, Protect, Detect, Respond, Recover',
        'Risk calculation formula: Risk = Threat × Vulnerability × Impact'
      ]
    },
    {
      topicNumber: 2,
      topicName: 'Identity & Access Management (IAM)',
      videoTitle: 'Identity and Access Management (IAM) Concepts',
      youtubeUrl: 'https://www.youtube.com/watch?v=yYJ4hL9u4Zk',
      directVideoUrl: 'https://www.youtube.com/watch?v=yYJ4hL9u4Zk',
      embedUrl: 'https://www.youtube-nocookie.com/embed/yYJ4hL9u4Zk?rel=0',
      videoId: 'yYJ4hL9u4Zk',
      channel: 'freeCodeCamp.org',
      durationApprox: '15 min',
      description: 'Deep dive into authentication vs authorization, MFA factors, SSO/SAML 2.0 protocols, and Role-Based Access Control (RBAC).',
      keyTakeaways: [
        'Authentication factors: Something you know, have, are, or do',
        'RBAC vs ABAC (Attribute-Based Access Control) policy models',
        'Enforcing Least Privilege to eliminate over-privileged service accounts'
      ]
    },
    {
      topicNumber: 3,
      topicName: 'Vulnerability Assessment & Patch Management',
      videoTitle: 'Vulnerability Management Process Breakdown',
      youtubeUrl: 'https://www.youtube.com/watch?v=w24d2H3N_sE',
      directVideoUrl: 'https://www.youtube.com/watch?v=w24d2H3N_sE',
      embedUrl: 'https://www.youtube-nocookie.com/embed/w24d2H3N_sE?rel=0',
      videoId: 'w24d2H3N_sE',
      channel: 'Professor Messer',
      durationApprox: '14 min',
      description: 'Systematic vulnerability scanning workflows, CVSS v3.1 scoring mechanics, patch prioritization, and reporting remediation timelines.',
      keyTakeaways: [
        'Credentialed vs Non-credentialed vulnerability scanning',
        'CVSS Base Score metrics: Exploitability, Access Vector, Impact',
        'Patch management lifecycles in enterprise staging environments'
      ]
    },
    {
      topicNumber: 4,
      topicName: 'CIS Baseline Hardening',
      videoTitle: 'Center for Internet Security (CIS) Controls Overview',
      youtubeUrl: 'https://www.youtube.com/watch?v=7_4hVq3d3e8',
      directVideoUrl: 'https://www.youtube.com/watch?v=7_4hVq3d3e8',
      embedUrl: 'https://www.youtube-nocookie.com/embed/7_4hVq3d3e8?rel=0',
      videoId: '7_4hVq3d3e8',
      channel: 'SANS Cyber Defense',
      durationApprox: '18 min',
      description: 'Implementation guide for CIS Benchmarks and 18 Critical Security Controls across endpoint workstations, servers, and cloud instances.',
      keyTakeaways: [
        'Group Policy Object (GPO) enforcement for Windows Server security baselines',
        'Disabling legacy protocols (SMBv1, NBT-NS, Telnet, SSLv3)',
        'Continuous asset inventory tracking and unauthorized device containment'
      ]
    }
  ])
};

// 4. VAPT Analyst Track
export const VAPT_ANALYST_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'vapt-analyst',
  roleTitle: 'VAPT Analyst',
  badge: 'Vulnerability Assessment & Penetration Testing',
  level: 'Intermediate',
  description: 'Specialize in automated vulnerability scanning, manual validation, proof-of-concept exploit creation, CVSS scoring, and remediation reporting.',
  estimatedHours: '16 hours',
  iconName: 'Crosshair',
  color: 'orange',
  topics: withLabs('vapt-analyst', [
    {
      topicNumber: 1,
      topicName: 'Automated Vulnerability Scanning',
      videoTitle: 'Nessus Vulnerability Scanner Full Tutorial',
      youtubeUrl: 'https://www.youtube.com/watch?v=2Tz8gD_bY0s',
      directVideoUrl: 'https://www.youtube.com/watch?v=2Tz8gD_bY0s',
      embedUrl: 'https://www.youtube-nocookie.com/embed/2Tz8gD_bY0s?rel=0',
      videoId: '2Tz8gD_bY0s',
      channel: 'NetworkChuck',
      durationApprox: '22 min',
      description: 'Hands-on guide to configuring automated scan policies in Tenable Nessus, auditing host credentials, and filtering false positives.',
      keyTakeaways: [
        'Setting up credentialed SSH/WMI audits for deep compliance scanning',
        'Differentiating true positives from scanner false positives',
        'Exporting CSV/PDF diagnostic executive summaries'
      ]
    },
    {
      topicNumber: 2,
      topicName: 'Web Application VAPT',
      videoTitle: 'OWASP Top 10 Web Application Security',
      youtubeUrl: 'https://www.youtube.com/watch?v=W0nL9YJzD4g',
      directVideoUrl: 'https://www.youtube.com/watch?v=W0nL9YJzD4g',
      embedUrl: 'https://www.youtube-nocookie.com/embed/W0nL9YJzD4g?rel=0',
      videoId: 'W0nL9YJzD4g',
      channel: 'freeCodeCamp.org',
      durationApprox: '35 min',
      description: 'Practical validation of OWASP Top 10 web vulnerabilities including SQLi, XSS, CSRF, SSRF, IDOR, and Broken Authentication.',
      keyTakeaways: [
        'Intercepting HTTP traffic using Burp Suite Proxy',
        'Crafting benign proof-of-concept (PoC) payloads for input validation flaws',
        'Evaluating server-side remediation controls'
      ]
    },
    {
      topicNumber: 3,
      topicName: 'Exploit Validation & Metasploit',
      videoTitle: 'Metasploit Framework Course for Beginners',
      youtubeUrl: 'https://www.youtube.com/watch?v=8lR27r8y1vA',
      directVideoUrl: 'https://www.youtube.com/watch?v=8lR27r8y1vA',
      embedUrl: 'https://www.youtube-nocookie.com/embed/8lR27r8y1vA?rel=0',
      videoId: '8lR27r8y1vA',
      channel: 'David Bombal',
      durationApprox: '40 min',
      description: 'Utilizing Metasploit Framework to safely validate scanner results through controlled exploit modules and payload delivery.',
      keyTakeaways: [
        'Searching MSF console modules and setting RHOSTS / LHOST options',
        'Meterpreter payload session management and interaction',
        'Safely verifying exploitability without causing service disruption'
      ]
    },
    {
      topicNumber: 4,
      topicName: 'VAPT Reporting & Remediation Guidance',
      videoTitle: 'How to Write a Professional Penetration Testing Report',
      youtubeUrl: 'https://www.youtube.com/watch?v=D6_E9zS7uA8',
      directVideoUrl: 'https://www.youtube.com/watch?v=D6_E9zS7uA8',
      embedUrl: 'https://www.youtube-nocookie.com/embed/D6_E9zS7uA8?rel=0',
      videoId: 'D6_E9zS7uA8',
      channel: 'The Cyber Mentor',
      durationApprox: '25 min',
      description: 'Structuring clear executive summaries, technical vulnerability descriptions, CVSS vector strings, and developer remediation steps.',
      keyTakeaways: [
        'Writing non-technical executive summaries for C-level leadership',
        'Documenting step-by-step PoCs with sanitized screenshots',
        'Providing actionable code-level patch recommendations'
      ]
    }
  ])
};

// 5. Bug Bounty Hunter Track
export const BUG_BOUNTY_HUNTER_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'bug-bounty-hunter',
  roleTitle: 'Bug Bounty Hunter',
  badge: 'Crowdsourced Web & API Security',
  level: 'Intermediate',
  description: 'Master crowdsourced security testing, recon techniques, sub-domain takeover, business logic flaw identification, and writing high-payout bug reports.',
  estimatedHours: '18 hours',
  iconName: 'Zap',
  color: 'amber',
  topics: withLabs('bug-bounty-hunter', [
    {
      topicNumber: 1,
      topicName: 'Burp Suite Setup & Extension Mastery',
      videoTitle: 'Burp Suite Pro & Community Setup Guide',
      youtubeUrl: 'https://www.youtube.com/watch?v=g2Ww_2n6X-M',
      directVideoUrl: 'https://www.youtube.com/watch?v=g2Ww_2n6X-M',
      embedUrl: 'https://www.youtube-nocookie.com/embed/g2Ww_2n6X-M?rel=0',
      videoId: 'g2Ww_2n6X-M',
      channel: 'InsiderPHD',
      durationApprox: '20 min',
      description: 'Configuring Burp Suite proxy, scope rules, match & replace rules, and installing essential BApp Store extensions (Autorize, Param Miner).',
      keyTakeaways: [
        'Intercepting client-side traffic and setting scope filters',
        'Automating authorization checks with Autorize extension',
        'Param Miner techniques for unlinked hidden parameter discovery'
      ]
    },
    {
      topicNumber: 2,
      topicName: 'Reconnaissance & Asset Discovery',
      videoTitle: 'Subdomain Recon & Automation Masterclass',
      youtubeUrl: 'https://www.youtube.com/watch?v=8n6YJ_s80E8',
      directVideoUrl: 'https://www.youtube.com/watch?v=8n6YJ_s80E8',
      embedUrl: 'https://www.youtube-nocookie.com/embed/8n6YJ_s80E8?rel=0',
      videoId: '8n6YJ_s80E8',
      channel: 'NahamSec',
      durationApprox: '30 min',
      description: 'Building an automated recon pipeline using subfinder, amass, httpx, and nuclei for rapid attack surface mapping.',
      keyTakeaways: [
        'Passive vs Active subdomain enumeration strategies',
        'Detecting dangling CNAME records for Subdomain Takeover',
        'Filtering live web endpoints and response status codes'
      ]
    },
    {
      topicNumber: 3,
      topicName: 'Business Logic & Access Control Flaws',
      videoTitle: 'Finding Broken Access Control Bugs (IDOR & Privilege Escalation)',
      youtubeUrl: 'https://www.youtube.com/watch?v=y3nE8yX3hF8',
      directVideoUrl: 'https://www.youtube.com/watch?v=y3nE8yX3hF8',
      embedUrl: 'https://www.youtube-nocookie.com/embed/y3nE8yX3hF8?rel=0',
      videoId: 'y3nE8yX3hF8',
      channel: 'LiveOverflow',
      durationApprox: '28 min',
      description: 'Deep dive into parameter tampering, race conditions, IDOR, and logic flaws that evade automated scanners.',
      keyTakeaways: [
        'Testing multi-step workflow logic bypasses',
        'Manipulating price parameters, UUIDs, and account state flags',
        'Exploiting HTTP request smuggling and race conditions'
      ]
    },
    {
      topicNumber: 4,
      topicName: 'Bug Report Crafting & HackerOne/Bugcrowd Payouts',
      videoTitle: 'How to Write Bug Reports That Get Paid Fast',
      youtubeUrl: 'https://www.youtube.com/watch?v=k9X3N8X4Y2c',
      directVideoUrl: 'https://www.youtube.com/watch?v=k9X3N8X4Y2c',
      embedUrl: 'https://www.youtube-nocookie.com/embed/k9X3N8X4Y2c?rel=0',
      videoId: 'k9X3N8X4Y2c',
      channel: 'STÖK',
      durationApprox: '18 min',
      description: 'Tips for writing clean, reproducible vulnerability submissions that triage analysts can quickly validate for maximum bounty payouts.',
      keyTakeaways: [
        'Clear title formatting: Vulnerability Type + Location + Business Impact',
        'Step-by-step reproduction scripts or cURL commands',
        'Demonstrating realistic impact while respecting program scope'
      ]
    }
  ])
};

// 6. Incident Responder Track
export const INCIDENT_RESPONDER_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'incident-responder',
  roleTitle: 'Incident Responder',
  badge: 'Emergency Breach Containment & Triage',
  level: 'Intermediate',
  description: 'Master the NIST SP 800-61 incident response lifecycle, host isolation, volatile memory dumps, ransomware containment, and post-incident lessons learned.',
  estimatedHours: '16 hours',
  iconName: 'AlertTriangle',
  color: 'red',
  topics: withLabs('incident-responder', [
    {
      topicNumber: 1,
      topicName: 'NIST SP 800-61 IR Lifecycle',
      videoTitle: 'Incident Response Lifecycle — NIST SP 800-61',
      youtubeUrl: 'https://www.youtube.com/watch?v=q6bE7_8yH0M',
      directVideoUrl: 'https://www.youtube.com/watch?v=q6bE7_8yH0M',
      embedUrl: 'https://www.youtube-nocookie.com/embed/q6bE7_8yH0M?rel=0',
      videoId: 'q6bE7_8yH0M',
      channel: 'SANS Cyber Defense',
      durationApprox: '20 min',
      description: 'Overview of the 4 key phases: Preparation, Detection & Analysis, Containment/Eradication/Recovery, and Post-Incident Activity.',
      keyTakeaways: [
        'Formulating Playbooks for Ransomware, Phishing, and Unauthorized Access',
        'Short-term vs Long-term containment strategies (network isolation vs account disablement)',
        'Chain of custody preservation for regulatory compliance'
      ]
    },
    {
      topicNumber: 2,
      topicName: 'Host Telemetry & Memory Triage',
      videoTitle: 'Volatile Memory & Endpoint Triage with FTK Imager & KAPE',
      youtubeUrl: 'https://www.youtube.com/watch?v=3R8Y5mX9k2c',
      directVideoUrl: 'https://www.youtube.com/watch?v=3R8Y5mX9k2c',
      embedUrl: 'https://www.youtube-nocookie.com/embed/3R8Y5mX9k2c?rel=0',
      videoId: '3R8Y5mX9k2c',
      channel: '13Cube',
      durationApprox: '32 min',
      description: 'Acquiring volatile RAM dumps, running KAPE target collection, and analyzing running processes before host power-down.',
      keyTakeaways: [
        'Order of volatility: RAM -> Network State -> Local Disk -> Backups',
        'Extracting injected DLLs and unbacked memory regions',
        'Correlating active socket connections with suspect process PIDs'
      ]
    },
    {
      topicNumber: 3,
      topicName: 'Ransomware Containment & Eradication',
      videoTitle: 'Anatomy of a Ransomware Intrusion & Containment',
      youtubeUrl: 'https://www.youtube.com/watch?v=m4Y6W1k8Y2c',
      directVideoUrl: 'https://www.youtube.com/watch?v=m4Y6W1k8Y2c',
      embedUrl: 'https://www.youtube-nocookie.com/embed/m4Y6W1k8Y2c?rel=0',
      videoId: 'm4Y6W1k8Y2c',
      channel: 'John Hammond',
      durationApprox: '38 min',
      description: 'Step-by-step containment of active ransomware outbreaks, identifying GPO propagation vectors, and blocking C2 IPs.',
      keyTakeaways: [
        'Blocking compromised Active Directory domain accounts',
        'Isolating VLANs and disabling SMB/PsExec lateral movement channels',
        'Validating clean system restores from out-of-band immutable backups'
      ]
    },
    {
      topicNumber: 4,
      topicName: 'Post-Incident Reporting & Root Cause',
      videoTitle: 'How to Conduct a Post-Incident Lessons Learned Review',
      youtubeUrl: 'https://www.youtube.com/watch?v=5k9X8Y7Z6x4',
      directVideoUrl: 'https://www.youtube.com/watch?v=5k9X8Y7Z6x4',
      embedUrl: 'https://www.youtube-nocookie.com/embed/5k9X8Y7Z6x4?rel=0',
      videoId: '5k9X8Y7Z6x4',
      channel: 'Gerald Auger — Simply Cyber',
      durationApprox: '22 min',
      description: 'Conducting root cause analysis (RCA), writing executive breach summaries, and updating detection rules to prevent repeat intrusions.',
      keyTakeaways: [
        'Developing the 5 Whys RCA framework for security incidents',
        'Converting incident IOCs into YARA rules and Sigma detection logic',
        'Presenting breach metrics to executive stakeholders'
      ]
    }
  ])
};

// 7. Digital Forensics Analyst Track
export const DIGITAL_FORENSICS_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'digital-forensics-analyst',
  roleTitle: 'Digital Forensics Analyst',
  badge: 'DFIR Evidence Acquisition & Timeline Reconstruction',
  level: 'Advanced',
  description: 'Master disk imaging, chain of custody, Windows Registry forensics, MFT/USN Journal analysis, browser artifacts, and Autopsy evidence processing.',
  estimatedHours: '20 hours',
  iconName: 'FileSearch',
  color: 'indigo',
  topics: withLabs('digital-forensics-analyst', [
    {
      topicNumber: 1,
      topicName: 'Disk Imaging & Chain of Custody',
      videoTitle: 'Forensic Disk Acquisition with FTK Imager',
      youtubeUrl: 'https://www.youtube.com/watch?v=4k9Y8Z7X6v5',
      directVideoUrl: 'https://www.youtube.com/watch?v=4k9Y8Z7X6v5',
      embedUrl: 'https://www.youtube-nocookie.com/embed/4k9Y8Z7X6v5?rel=0',
      videoId: '4k9Y8Z7X6v5',
      channel: '13Cube',
      durationApprox: '25 min',
      description: 'Bit-stream disk acquisition (E01/DD formats), write-blocker hardware usage, and cryptographic hash verification (MD5/SHA256).',
      keyTakeaways: [
        'Hardware vs Software write-blockers',
        'E01 expert witness format vs raw DD image files',
        'Maintaining immutable evidence logs for court admissibility'
      ]
    },
    {
      topicNumber: 2,
      topicName: 'Windows Registry Forensics',
      videoTitle: 'Windows Registry Forensics Masterclass',
      youtubeUrl: 'https://www.youtube.com/watch?v=6k9Y8Z7X6v5',
      directVideoUrl: 'https://www.youtube.com/watch?v=6k9Y8Z7X6v5',
      embedUrl: 'https://www.youtube-nocookie.com/embed/6k9Y8Z7X6v5?rel=0',
      videoId: '6k9Y8Z7X6v5',
      channel: '13Cube',
      durationApprox: '35 min',
      description: 'Parsing SYSTEM, NTUSER.DAT, and SOFTWARE hives for persistence keys, user activity, MRU lists, and USB connection history.',
      keyTakeaways: [
        'Registry Hives: SAM, SYSTEM, SOFTWARE, SECURITY, NTUSER.DAT',
        'Persistence keys: Run, RunOnce, UserInit, Services',
        'USB device tracking via USBSTOR and MountedDevices keys'
      ]
    },
    {
      topicNumber: 3,
      topicName: 'MFT & File System Timelines',
      videoTitle: 'NTFS Master File Table (MFT) & USN Journal Analysis',
      youtubeUrl: 'https://www.youtube.com/watch?v=7k9Y8Z7X6v5',
      directVideoUrl: 'https://www.youtube.com/watch?v=7k9Y8Z7X6v5',
      embedUrl: 'https://www.youtube-nocookie.com/embed/7k9Y8Z7X6v5?rel=0',
      videoId: '7k9Y8Z7X6v5',
      channel: 'SANS Forensics',
      durationApprox: '30 min',
      description: 'Analyzing $MFT record attributes ($STANDARD_INFORMATION, $FILE_NAME) to detect file timestomping and file deletion.',
      keyTakeaways: [
        'MACB Timestamps: Modified, Accessed, Created, Born',
        'Detecting timestomping anomalies (MFT record discrepancy)',
        'Parsing $UsnJrnl $J for granular file creation and execution trails'
      ]
    },
    {
      topicNumber: 4,
      topicName: 'Browser & Artifact Analysis',
      videoTitle: 'Web Browser Forensics & Autopsy Deep Dive',
      youtubeUrl: 'https://www.youtube.com/watch?v=8k9Y8Z7X6v5',
      directVideoUrl: 'https://www.youtube.com/watch?v=8k9Y8Z7X6v5',
      embedUrl: 'https://www.youtube-nocookie.com/embed/8k9Y8Z7X6v5?rel=0',
      videoId: '8k9Y8Z7X6v5',
      channel: 'DFIR Science',
      durationApprox: '28 min',
      description: 'Extracting SQLite databases for Chrome/Firefox history, cookies, session restore, and processing complete cases in Autopsy.',
      keyTakeaways: [
        'Parsing SQLite databases: History, Downloads, Web Data, Cookies',
        'Ingesting evidence images into Autopsy digital forensics suite',
        'Reconstructing user browsing timelines during malware download'
      ]
    }
  ])
};

// 8. Threat Hunter Track
export const THREAT_HUNTER_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'threat-hunter',
  roleTitle: 'Threat Hunter',
  badge: 'Proactive Threat Detection & Behavioral Analysis',
  level: 'Advanced',
  description: 'Proactively hunt stealthy adversaries using MITRE ATT&CK techniques, Sysmon Event ID correlation, KQL / Sigma queries, Memory Forensics (Volatility), and C2 beaconing analysis.',
  estimatedHours: '15 hours',
  iconName: 'Search',
  color: 'amber',
  topics: mapVideosToTopics(THREAT_HUNTER_VIDEOS, 'threat-hunter')
};

// 9. Threat Intelligence Analyst Track
export const THREAT_INTEL_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'threat-intel',
  roleTitle: 'Threat Intelligence Analyst',
  badge: 'CTI, OSINT & Adversary Profiling',
  level: 'Advanced',
  description: 'Leverage OSINT, evaluate IOCs vs IOAs, operationalize STIX 2.1 / TAXII 2.1 feeds, profile nation-state threat actors, and administer MISP & OpenCTI platforms.',
  estimatedHours: '14 hours',
  iconName: 'Globe',
  color: 'indigo',
  topics: mapVideosToTopics(THREAT_INTEL_VIDEOS, 'threat-intel')
};

// 10. Malware Analyst Track
export const MALWARE_ANALYST_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'malware-analyst',
  roleTitle: 'Malware Analyst',
  badge: 'Reverse Engineering & Static/Dynamic Triage',
  level: 'Advanced',
  description: 'Dissect malware samples in isolated sandboxes. Master PE file internals, entropy, process injection (RunPE), DLL sideloading, x86/x64 assembly, and Ghidra/IDA Pro reversing.',
  estimatedHours: '20 hours',
  iconName: 'Bug',
  color: 'purple',
  topics: mapVideosToTopics(MALWARE_ANALYST_VIDEOS, 'malware-analyst')
};

// 11. Security Engineer Track
export const SECURITY_ENGINEER_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'security-engineer',
  roleTitle: 'Security Engineer',
  badge: 'Enterprise Defense Architecture & IAM',
  level: 'Intermediate',
  description: 'Design, configure, and maintain defense infrastructure. Deploy NGFWs, inline IPS, ZTNA tunnels, IAM least-privilege policies, EDR/XDR agents, and CIS baseline hardening.',
  estimatedHours: '16 hours',
  iconName: 'Cpu',
  color: 'blue',
  topics: mapVideosToTopics(SECURITY_ENGINEER_VIDEOS, 'security-engineer')
};

// 12. Network Security Engineer Track
export const NETWORK_SECURITY_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'network-security-engineer',
  roleTitle: 'Network Security Engineer',
  badge: 'Layer 2-7 Defense, Segmentation & IPsec',
  level: 'Intermediate',
  description: 'Master enterprise networking defense from Layer 2 to Layer 7. Deep dive into DNSSEC, VLAN/PVLAN segmentation, IPsec VPN tunnels, WAFs, and PCAP/NetFlow traffic analysis.',
  estimatedHours: '15 hours',
  iconName: 'Network',
  color: 'cyan',
  topics: mapVideosToTopics(NETWORK_SECURITY_VIDEOS, 'network-security-engineer')
};

// 13. Cloud Security Engineer Track
export const CLOUD_SECURITY_ENGINEER_CURRICULUM: CurriculumRoleTrack = {
  roleId: 'cloud-security-engineer',
  roleTitle: 'Cloud Security Engineer',
  badge: 'AWS, Azure & GCP Multi-Cloud Hardening',
  level: 'Intermediate',
  description: 'Master public cloud security architecture. Apply the Shared Responsibility Model, author least-privilege IAM policies, detect SSRF/IMDSv2 risks, remediate S3 buckets, and scan IaC with Checkov.',
  estimatedHours: '16 hours',
  iconName: 'Cloud',
  color: 'sky',
  topics: mapVideosToTopics(CLOUD_SECURITY_VIDEOS, 'cloud-security-engineer')
};

export const ensureExternalLabsOnTrack = (track: CurriculumRoleTrack): CurriculumRoleTrack => {
  return {
    ...track,
    topics: track.topics.map((t) => ({
      ...t,
      externalLabs: (t.externalLabs && t.externalLabs.length > 0)
        ? t.externalLabs
        : getRelevantExternalLabs(track.roleId, t.topicName, t.videoTitle)
    }))
  };
};

// Full Master Cybersecurity Curriculum Export (13 Role Tracks)
export const CYBERSECURITY_CURRICULUM: CurriculumRoleTrack[] = [
  ensureExternalLabsOnTrack(SOC_ANALYST_CURRICULUM),
  ensureExternalLabsOnTrack(PENETRATION_TESTER_CURRICULUM),
  ensureExternalLabsOnTrack(CYBERSECURITY_ANALYST_CURRICULUM),
  ensureExternalLabsOnTrack(VAPT_ANALYST_CURRICULUM),
  ensureExternalLabsOnTrack(BUG_BOUNTY_HUNTER_CURRICULUM),
  ensureExternalLabsOnTrack(INCIDENT_RESPONDER_CURRICULUM),
  ensureExternalLabsOnTrack(DIGITAL_FORENSICS_CURRICULUM),
  ensureExternalLabsOnTrack(THREAT_HUNTER_CURRICULUM),
  ensureExternalLabsOnTrack(THREAT_INTEL_CURRICULUM),
  ensureExternalLabsOnTrack(MALWARE_ANALYST_CURRICULUM),
  ensureExternalLabsOnTrack(SECURITY_ENGINEER_CURRICULUM),
  ensureExternalLabsOnTrack(NETWORK_SECURITY_CURRICULUM),
  ensureExternalLabsOnTrack(CLOUD_SECURITY_ENGINEER_CURRICULUM)
];

export const CYBER_CURRICULUM = CYBERSECURITY_CURRICULUM;

export const CURRICULUM_BY_ROLE: Record<string, CurriculumRoleTrack> = {
  'soc-analyst': ensureExternalLabsOnTrack(SOC_ANALYST_CURRICULUM),
  'penetration-tester': ensureExternalLabsOnTrack(PENETRATION_TESTER_CURRICULUM),
  'cybersecurity-analyst': ensureExternalLabsOnTrack(CYBERSECURITY_ANALYST_CURRICULUM),
  'vapt-analyst': ensureExternalLabsOnTrack(VAPT_ANALYST_CURRICULUM),
  'bug-bounty-hunter': ensureExternalLabsOnTrack(BUG_BOUNTY_HUNTER_CURRICULUM),
  'incident-responder': ensureExternalLabsOnTrack(INCIDENT_RESPONDER_CURRICULUM),
  'digital-forensics-analyst': ensureExternalLabsOnTrack(DIGITAL_FORENSICS_CURRICULUM),
  'threat-hunter': ensureExternalLabsOnTrack(THREAT_HUNTER_CURRICULUM),
  'threat-intel': ensureExternalLabsOnTrack(THREAT_INTEL_CURRICULUM),
  'malware-analyst': ensureExternalLabsOnTrack(MALWARE_ANALYST_CURRICULUM),
  'security-engineer': ensureExternalLabsOnTrack(SECURITY_ENGINEER_CURRICULUM),
  'network-security-engineer': ensureExternalLabsOnTrack(NETWORK_SECURITY_CURRICULUM),
  'cloud-security-engineer': ensureExternalLabsOnTrack(CLOUD_SECURITY_ENGINEER_CURRICULUM)
};

export const getCurriculumTrack = (roleId: string): CurriculumRoleTrack | undefined => {
  return CURRICULUM_BY_ROLE[roleId];
};

export const getCurriculumTopic = (roleId: string, topicNumber: number): CurriculumTopic | undefined => {
  const track = CURRICULUM_BY_ROLE[roleId];
  if (!track) return undefined;
  return track.topics.find((t) => t.topicNumber === topicNumber);
};
