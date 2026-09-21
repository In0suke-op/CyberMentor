import { CuratedVideo, SOC_ANALYST_VIDEOS, PENTESTING_VIDEOS, THREAT_HUNTER_VIDEOS } from './curatedVideoData';

export interface ExternalLabOrCTF {
  title: string;
  platform: 'TryHackMe' | 'HackTheBox' | 'PortSwigger' | 'Blue Team Labs' | 'PicoCTF' | 'OverTheWire' | 'RangeForce' | 'CMD Challenge' | 'CyberDefenders' | 'VulnHub' | 'CryptoHack' | 'OWASP' | 'Other';
  url: string;
  type: 'CTF' | 'Lab' | 'Challenge' | 'Practice Platform' | 'Wargame';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  free: boolean;
  description?: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  pillar: 'foundations' | 'career-paths' | 'specialized-domains';
  pillarLabel: string;
  estimatedWeeks: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  coreConcepts: string[];
  toolsAndTech: string[];
  studyMethodology: {
    stage1Theory: string;
    stage2HandsOn: string;
    stage3Simulation: string;
    stage4Validation: string;
  };
  weeklySchedule: {
    week: number;
    title: string;
    focus: string;
  }[];
  recommendedCerts: string[];
  aiMentorPrompt: string;
  curatedVideos?: CuratedVideo[];
  externalLabsAndCTFs?: ExternalLabOrCTF[];
  mappedAppAction?: {
    type: 'course' | 'lab' | 'scenario';
    id?: string;
    label: string;
  };
}

export interface RoadmapPillar {
  id: 'foundations' | 'career-paths' | 'specialized-domains';
  title: string;
  badge: string;
  description: string;
  topics: StudyTopic[];
}

export const STUDY_ROADMAP_DATA: StudyTopic[] = [
  // ==========================================
  // 1. FOUNDATIONS (6 Topics)
  // ==========================================
  {
    id: 'computer-fundamentals',
    title: 'Computer Fundamentals',
    pillar: 'foundations',
    pillarLabel: 'Foundations',
    estimatedWeeks: 3,
    difficulty: 'Beginner',
    summary: 'Hardware architecture, CPU registers, memory segments (Stack vs Heap), execution cycles, BIOS/UEFI, storage systems, and OS abstractions.',
    coreConcepts: [
      'Von Neumann Architecture & CPU execution cycle (Fetch, Decode, Execute)',
      'Memory Hierarchy: L1/L2/L3 Cache, RAM, Virtual Memory, Paging, TLB',
      'Stack vs. Heap Memory allocation and buffer overflow mechanics',
      'Endianness (Little-endian vs Big-endian) & Binary, Hexadecimal, ASCII encoding',
      'UEFI vs Legacy BIOS, Secure Boot, TPM (Trusted Platform Module) 2.0',
      'Virtualization primitives: Hypervisors (Type 1 vs Type 2), Containers vs VMs'
    ],
    toolsAndTech: ['Process Hacker', 'HxD Hex Editor', 'GDB', 'VirtualBox / VMware', 'CPU-Z', 'Sysinternals Coreinfo'],
    studyMethodology: {
      stage1Theory: 'Study OS memory segmentation, CPU register architectures (x86_64: RAX, RBX, RIP, RSP, RBP), and process lifecycle.',
      stage2HandsOn: 'Inspect running process memory using a hex editor; observe stack frame allocation during function calls using GDB or debugger.',
      stage3Simulation: 'Trace how an application crashes when attempting to write past allocated buffer boundaries into instruction pointers.',
      stage4Validation: 'Explain the difference between stack and heap memory corruption to a peer or using the Socratic AI Mentor.'
    },
    weeklySchedule: [
      { week: 1, title: 'CPU & Architecture', focus: 'Registers, instruction sets, CPU cycles, ALU, and low-level data representations.' },
      { week: 2, title: 'Memory & Storage Systems', focus: 'RAM segmentation, virtual memory management, paging, stack frames, and caching.' },
      { week: 3, title: 'Boot Process & OS Primitives', focus: 'UEFI Secure Boot, bootloaders, kernel space vs user space, system calls.' }
    ],
    recommendedCerts: ['CompTIA A+', 'CompTIA ITF+'],
    aiMentorPrompt: 'Explain how CPU registers and stack frames work during a C function call, and why writing beyond a buffer corrupts the return address.',
    externalLabsAndCTFs: [
      {
        title: 'CMD Challenge - Shell & Command Line Mastery',
        platform: 'CMD Challenge',
        url: 'https://cmdchallenge.com/',
        type: 'Challenge',
        difficulty: 'Beginner',
        free: true,
        description: 'Interactive browser shell challenges testing terminal commands, pipes, and text manipulation.'
      },
      {
        title: 'OverTheWire: Bandit Wargame (Levels 0-10)',
        platform: 'OverTheWire',
        url: 'https://overthewire.org/wargames/bandit/',
        type: 'Wargame',
        difficulty: 'Beginner',
        free: true,
        description: 'Classic wargame for learning Linux fundamentals, file searching, permissions, and SSH.'
      },
      {
        title: 'Intro to Hardware & Computer Architecture',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/introtohardware',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Hands-on room dissecting CPU execution cycles, RAM, storage, and firmware.'
      },
      {
        title: 'PicoCTF - General Skills Practice',
        platform: 'PicoCTF',
        url: 'https://play.picoctf.org/practice',
        type: 'CTF',
        difficulty: 'Beginner',
        free: true,
        description: 'Beginner-friendly CTF challenges covering binary representations, hex, and encoding.'
      }
    ],
    mappedAppAction: { type: 'course', id: 'course-fundamentals', label: 'Explore Computer Basics' }
  },
  {
    id: 'networking',
    title: 'Networking',
    pillar: 'foundations',
    pillarLabel: 'Foundations',
    estimatedWeeks: 4,
    difficulty: 'Beginner',
    summary: 'OSI 7-Layer & TCP/IP models, subnetting, packet inspection, core protocols (DNS, ARP, DHCP, TCP, UDP, TLS 1.3), routing and firewalling.',
    coreConcepts: [
      'OSI 7-Layer Model vs TCP/IP Stack encapsulation and decapsulation',
      'IPv4 Subnetting (CIDR notation, network vs host bits) & IPv6 fundamentals',
      'TCP 3-way handshake (SYN, SYN-ACK, ACK), 4-way teardown, sequence/ack numbers',
      'Core Protocols: DNS resolution chain, ARP request/reply, DHCP DORA process',
      'Transport Layer Security (TLS 1.3) handshake, asymmetric vs symmetric cipher exchange',
      'Routing protocols (OSPF, BGP basics), NAT/PAT, VLANs, and Packet Filtering'
    ],
    toolsAndTech: ['Wireshark', 'tcpdump', 'Nmap', 'Cisco Packet Tracer', 'iproute2', 'dig / nslookup', 'traceroute'],
    studyMethodology: {
      stage1Theory: 'Deep dive into RFC specifications for TCP (RFC 793), IP, DNS, and TLS 1.3.',
      stage2HandsOn: 'Capture live traffic with Wireshark; dissect TCP flags, ARP broadcast storms, and DNS query/response structures.',
      stage3Simulation: 'Simulate a Man-in-the-Middle (MitM) ARP cache poisoning attack in an isolated virtual lab and inspect the captured pcap.',
      stage4Validation: 'Reconstruct an HTTP stream from a packet capture without viewing application-layer payloads.'
    },
    weeklySchedule: [
      { week: 1, title: 'Network Models & Addressing', focus: 'OSI vs TCP/IP, MAC addresses, IPv4 CIDR subnetting calculations, IPv6 basics.' },
      { week: 2, title: 'Core Transport & Resolution', focus: 'TCP state machine, UDP, ARP spoofing mechanics, DNS recursion and records.' },
      { week: 3, title: 'Secure Transport & Application Layer', focus: 'TLS 1.3 handshake, HTTP/HTTPS, SSH, DHCP, ICMP diagnostics.' },
      { week: 4, title: 'Traffic Analysis & Packet Mastery', focus: 'Wireshark display filters, packet dissection, tcpdump command-line analysis.' }
    ],
    recommendedCerts: ['CompTIA Network+', 'Cisco CCNA (200-301)'],
    aiMentorPrompt: 'Step through every packet exchanged in a full TCP 3-way handshake and subsequent TLS 1.3 session establishment.',
    externalLabsAndCTFs: [
      {
        title: 'TryHackMe: Network Fundamentals Path',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/module/network-fundamentals',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Comprehensive guided rooms on OSI layers, IPv4/IPv6, LANs, routing, and DNS.'
      },
      {
        title: 'Wireshark 101 & Packet Analysis Lab',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/wireshark',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Interactive Wireshark pcap analysis room inspecting TCP streams, DNS, and HTTP.'
      },
      {
        title: 'CyberDefenders: Network Traffic Analysis (PCAP Challenge)',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/11',
        type: 'Challenge',
        difficulty: 'Intermediate',
        free: true,
        description: 'Analyze real-world network traffic captures to uncover ARP poisoning and DNS tunneling.'
      },
      {
        title: 'PicoCTF: Networking & Netcat Challenges',
        platform: 'PicoCTF',
        url: 'https://play.picoctf.org/practice?category=5',
        type: 'CTF',
        difficulty: 'Beginner',
        free: true,
        description: 'Hands-on network sockets, Wireshark, and protocol inspection CTF challenges.'
      }
    ],
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Launch Port Scanning Sandbox' }
  },
  {
    id: 'linux',
    title: 'Linux',
    pillar: 'foundations',
    pillarLabel: 'Foundations',
    estimatedWeeks: 4,
    difficulty: 'Beginner',
    summary: 'Linux filesystem hierarchy, POSIX permissions (SUID/SGID), Bash scripting, process/service control (systemd), SSH hardening, and kernel logging.',
    coreConcepts: [
      'Filesystem Hierarchy Standard (FHS): /etc, /var/log, /proc, /dev, /sys, /tmp',
      'POSIX Permissions: Read/Write/Execute, octal notation (755, 644), SUID, SGID, Sticky bit',
      'User & Group administration, /etc/passwd, /etc/shadow, sudoers configuration',
      'Process Management: ps, top, htop, kill signals (SIGTERM, SIGKILL), backgrounding jobs',
      'Systemd service architecture, systemctl unit files, journalctl logging',
      'Bash automation: pipes, redirections, loops, awk, sed, grep, cut, cron jobs'
    ],
    toolsAndTech: ['Bash', 'grep / awk / sed', 'systemctl', 'journalctl', 'tmux', 'chmod / chown', 'strace / ltrace', 'auditd'],
    studyMethodology: {
      stage1Theory: 'Learn Linux kernel and user space separation, file descriptors, and permission masks (umask).',
      stage2HandsOn: 'Build automated Bash scripts for log parsing; audit SUID binaries with `find / -perm -4000 2>/dev/null`.',
      stage3Simulation: 'Audit a misconfigured Linux VM for privilege escalation vectors (writable cron jobs, vulnerable sudo rules).',
      stage4Validation: 'Configure a hardened Debian/Ubuntu instance with UFW, SSH key-only auth, and fail2ban within 30 minutes.'
    },
    weeklySchedule: [
      { week: 1, title: 'Navigation & File Architecture', focus: 'FHS hierarchy, file operations, absolute vs relative paths, viewing logs.' },
      { week: 2, title: 'Permissions & User Management', focus: 'chmod, chown, SUID/SGID exploitation risks, sudoers security.' },
      { week: 3, title: 'Processes, Services & Networking', focus: 'systemd, process trees, netstat/ss, iptables/ufw, cron tasks.' },
      { week: 4, title: 'Scripting & Hardening', focus: 'Bash automation, awk/sed log extraction, SSH hardening, kernel auditing.' }
    ],
    recommendedCerts: ['Linux Professional Institute (LPIC-1)', 'Red Hat Certified System Administrator (RHCSA)'],
    aiMentorPrompt: 'Explain how SUID bit binaries can lead to privilege escalation in Linux if they execute external binaries without absolute paths.',
    externalLabsAndCTFs: [
      {
        title: 'OverTheWire: Bandit Wargame (34 Levels)',
        platform: 'OverTheWire',
        url: 'https://overthewire.org/wargames/bandit/',
        type: 'Wargame',
        difficulty: 'Beginner',
        free: true,
        description: 'The gold-standard Linux wargame covering SSH, permissions, grep, cron, and SUID.'
      },
      {
        title: 'TryHackMe: Linux Fundamentals 1, 2, 3',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/module/linux-fundamentals',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Interactive cloud VM rooms covering terminal commands, process control, and automation.'
      },
      {
        title: 'HTB Academy: Linux Fundamentals Module',
        platform: 'HackTheBox',
        url: 'https://academy.hackthebox.com/module/details/18',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'In-depth Linux system administration and security auditing module.'
      }
    ],
    mappedAppAction: { type: 'course', id: 'course-fundamentals', label: 'Study Linux System Security' }
  },
  {
    id: 'windows',
    title: 'Windows',
    pillar: 'foundations',
    pillarLabel: 'Foundations',
    estimatedWeeks: 4,
    difficulty: 'Beginner',
    summary: 'Windows OS internals, Registry hives, Active Directory domain architecture, Kerberos authentication, PowerShell, and Sysmon telemetry.',
    coreConcepts: [
      'Windows Architecture: Kernel mode (HAL, ntoskrnl) vs User mode (Win32 subsystems)',
      'Windows Registry Hives: HKLM, HKCU, HKCR, SAM, Run keys & persistence mechanisms',
      'Active Directory Domain Services (AD DS): Domains, Forests, Organizational Units (OUs)',
      'Kerberos Authentication: KDC, AS-REQ/AS-REP, TGS-REQ/TGS-REP, Golden & Silver Ticket basics',
      'PowerShell Core & Commandlets for security automation and auditing',
      'Windows Event Logs & Sysmon (Event ID 1 Process Creation, ID 3 Network, ID 10 Injection)'
    ],
    toolsAndTech: ['PowerShell', 'Sysinternals Suite (Autoruns, Procmon, Procexp)', 'Sysmon', 'Active Directory Users & Computers', 'Mimikatz (lab study)', 'BloodHound (lab study)'],
    studyMethodology: {
      stage1Theory: 'Study Windows security identifiers (SIDs), access tokens, integrity levels, and Kerberos ticket lifecycle.',
      stage2HandsOn: 'Configure Sysinternals Procmon and Sysmon to monitor real-time registry modifications and process executions.',
      stage3Simulation: 'Inspect an Active Directory lab environment to trace Group Policy Objects (GPOs) and identify privilege inheritance paths.',
      stage4Validation: 'Audit a compromised Windows VM event log to reconstruct an attacker lateral movement sequence.'
    },
    weeklySchedule: [
      { week: 1, title: 'OS Internals & Registry', focus: 'User/Kernel mode, Security Access Tokens, Registry hives, autoruns.' },
      { week: 2, title: 'Active Directory & Kerberos', focus: 'Domain controllers, LDAP, Kerberos protocol exchange, GPO administration.' },
      { week: 3, title: 'PowerShell Security & Defense', focus: 'PowerShell remoting, Execution Policies, Script Block Logging, AMSI.' },
      { week: 4, title: 'Telemetry, Event Logs & Sysmon', focus: 'Sysmon schema, Event IDs (4624, 4688, 4672), detecting persistence.' }
    ],
    recommendedCerts: ['CompTIA Security+', 'Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)'],
    aiMentorPrompt: 'How does Windows Kerberos authentication prevent password transmission over the wire, and how do ticket-granting tickets work?',
    externalLabsAndCTFs: [
      {
        title: 'TryHackMe: Windows Fundamentals Room',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/winfund1',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Hands-on exploration of Windows desktop, command line, UAC, and system services.'
      },
      {
        title: 'TryHackMe: Active Directory Basics',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/active-directory-basics',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Guided lab covering Domain Controllers, Kerberos, LDAP, and GPOs.'
      },
      {
        title: 'CyberDefenders: Active Directory Threat Hunting',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/72',
        type: 'Challenge',
        difficulty: 'Intermediate',
        free: true,
        description: 'Investigate real Windows Event Logs & Sysmon telemetry to spot Kerberoasting and lateral movement.'
      }
    ],
    mappedAppAction: { type: 'scenario', id: 'scenario-ransomware', label: 'Triage Windows Endpoint Incident' }
  },
  {
    id: 'python',
    title: 'Python for Cybersecurity',
    pillar: 'foundations',
    pillarLabel: 'Foundations',
    estimatedWeeks: 4,
    difficulty: 'Beginner',
    summary: 'Scripting for security automation, socket programming, HTTP client automation, packet crafting with Scapy, log extraction, and API integrations.',
    coreConcepts: [
      'Python Data Structures for security: dicts, lists, sets, regex (re module)',
      'Socket Programming: Creating TCP/UDP clients, multi-threaded port scanner development',
      'Web Automation: Requests library, handling HTTP headers, cookies, authentication tokens',
      'Packet Manipulation: Scapy for building custom ICMP, ARP, and TCP packets',
      'SIEM / Threat Intel API integrations: VirusTotal API, Shodan API, AlienVault OTX',
      'Log Parsing & Forensics automation: Processing CSV, JSON, Apache/Nginx web logs'
    ],
    toolsAndTech: ['Python 3.12+', 'Scapy', 'Requests', 'BeautifulSoup4', 'Socket library', 'Virtualenv', 'Shodan API'],
    studyMethodology: {
      stage1Theory: 'Understand asynchronous I/O, networking sockets, HTTP protocol structures, and API authentication.',
      stage2HandsOn: 'Write a multi-threaded TCP banner grabber and port scanner from scratch using the `socket` module.',
      stage3Simulation: 'Automate threat intelligence enrichment: write a script that queries a list of suspected IPs against AbuseIPDB/VirusTotal.',
      stage4Validation: 'Build a Scapy script that detects ARP spoofing attacks by tracking IP-to-MAC mapping changes in real time.'
    },
    weeklySchedule: [
      { week: 1, title: 'Python Fundamentals & Regex', focus: 'Data types, file I/O, regular expressions for extracting IPs, hashes, and emails.' },
      { week: 2, title: 'Socket Programming & Scanners', focus: 'TCP/UDP sockets, banner grabbing, multi-threading with concurrent.futures.' },
      { week: 3, title: 'Web Automation & Scapy', focus: 'HTTP requests, header tampering, crafting ARP/ICMP packets with Scapy.' },
      { week: 4, title: 'API Integration & Log Parsers', focus: 'Threat Intel APIs (VirusTotal), automated log parsing, JSON export.' }
    ],
    recommendedCerts: ['Certified Associate in Python Programming (PCAP)', 'GIAC Python Coder (GPYC)'],
    aiMentorPrompt: 'Demonstrate how to write a simple Python script using sockets that checks if ports 80, 443, and 22 are open and extracts their banner.',
    externalLabsAndCTFs: [
      {
        title: 'TryHackMe: Python for Cybersecurity Room',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/room/pythonforcybersecurity',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Build port scanners, hash crackers, and keyloggers in guided Python security labs.'
      },
      {
        title: 'HTB Academy: Introduction to Python for Hackers',
        platform: 'HackTheBox',
        url: 'https://academy.hackthebox.com/module/details/19',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Learn offensive Python scripting, socket programming, and automated web exploitation.'
      },
      {
        title: 'PicoCTF: Python Scripting Challenges',
        platform: 'PicoCTF',
        url: 'https://play.picoctf.org/practice',
        type: 'CTF',
        difficulty: 'Beginner',
        free: true,
        description: 'Solve cryptographic and socket-based CTF challenges using custom Python scripts.'
      }
    ],
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Practice Socket Network Analysis' }
  },
  {
    id: 'security-fundamentals',
    title: 'Security Fundamentals',
    pillar: 'foundations',
    pillarLabel: 'Foundations',
    estimatedWeeks: 3,
    difficulty: 'Beginner',
    summary: 'CIA Triad, Defense in Depth, Zero Trust Architecture, Threat Modeling (STRIDE), CVSS vulnerability scoring, and Access Control Models.',
    coreConcepts: [
      'The CIA Triad (Confidentiality, Integrity, Availability) & Parkerian Hexad',
      'Defense in Depth & Zero Trust Principles ("Never Trust, Always Verify")',
      'Access Control Models: Discretionary (DAC), Mandatory (MAC), Role-Based (RBAC), Attribute-Based (ABAC)',
      'Threat Modeling Frameworks: STRIDE, DREAD, PASTA methodology',
      'Vulnerability Management & Scoring: CVE, CWE, CVSS v3.1/v4.0 scoring vectors',
      'Security Governance & Risk Management: Risk Appetite, Residual Risk, Impact vs Likelihood'
    ],
    toolsAndTech: ['Microsoft Threat Modeling Tool', 'CVSS Calculator (NVD)', 'Draw.io for Arch Diagrams', 'NIST CSF Explorer'],
    studyMethodology: {
      stage1Theory: 'Study security primitives, cryptography foundations, and foundational defense frameworks.',
      stage2HandsOn: 'Calculate CVSS vectors for real-world CVEs and model an e-commerce payment gateway using STRIDE.',
      stage3Simulation: 'Simulate a third-party vendor compromise; map out which defense-in-depth controls halt lateral expansion.',
      stage4Validation: 'Present a threat model for a mobile banking application identifying at least 5 mitigation controls.'
    },
    weeklySchedule: [
      { week: 1, title: 'Core Principles & CIA Triad', focus: 'Confidentiality, Integrity, Availability, Least Privilege, Zero Trust architecture.' },
      { week: 2, title: 'Access Control & Threat Modeling', focus: 'RBAC vs ABAC, STRIDE methodology, asset decomposition, attack trees.' },
      { week: 3, title: 'Vulnerabilities, Risk & Compliance', focus: 'CVE/CWE databases, CVSS v3.1/4.0 calculation, Risk registers, NIST CSF.' }
    ],
    recommendedCerts: ['CompTIA Security+ (SY0-701)', 'ISC2 Systems Security Certified Practitioner (SSCP)'],
    aiMentorPrompt: 'Break down the STRIDE threat modeling framework with concrete examples of each threat type in a modern web app.',
    externalLabsAndCTFs: [
      {
        title: 'TryHackMe: Intro to Cybersecurity Path',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/module/intro-to-cybersecurity',
        type: 'Lab',
        difficulty: 'Beginner',
        free: true,
        description: 'Interactive introduction to offensive vs defensive security, threat modeling, and careers.'
      },
      {
        title: 'PicoCTF: PicoGym Practice Playground',
        platform: 'PicoCTF',
        url: 'https://play.picoctf.org/practice',
        type: 'CTF',
        difficulty: 'Beginner',
        free: true,
        description: 'Free year-round CTF practice platform covering security fundamentals, web, and cryptography.'
      }
    ],
    mappedAppAction: { type: 'course', id: 'course-fundamentals', label: 'Review Foundations Track' }
  },

  // ==========================================
  // 2. CAREER PATHS (17 Roles)
  // ==========================================
  {
    id: 'soc-analyst',
    title: 'SOC Analyst (Tier 1 / Tier 2)',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 10,
    difficulty: 'Beginner',
    summary: 'Monitor, detect, and triage real-time security alerts in 24/7 Security Operations Centers using SIEM, EDR, SOAR, and ticketing systems.',
    coreConcepts: [
      'SIEM Operations: Querying Splunk (SPL), Elastic (KQL), Microsoft Sentinel (KQL)',
      'EDR Telemetry & Process Tree analysis (CrowdStrike, Defender for Endpoint, SentinelOne)',
      'Phishing Email Analysis: Header parsing, SPF/DKIM/DMARC inspection, attachment sandboxing',
      'Indicator of Compromise (IOC) triage: Hashes, IP reputation, domain age, VirusTotal enrichment',
      'Incident Escalation Playbooks: True Positive vs False Positive categorization',
      'Ticketing & Incident Documentation in ServiceNow / Jira Align'
    ],
    toolsAndTech: ['Splunk', 'Microsoft Sentinel', 'Elasticsearch / Kibana', 'CrowdStrike Falcon', 'VirusTotal', 'Any.Run', 'Wireshark'],
    studyMethodology: {
      stage1Theory: 'Master alert classification, cyber kill chain, MITRE ATT&CK mapping, and triage decision trees.',
      stage2HandsOn: 'Write Splunk SPL queries to detect brute-force login attempts and beaconing C2 network connections.',
      stage3Simulation: 'Investigate a simulated business email compromise (BEC) phishing email, extracting payload URLs and macro scripts.',
      stage4Validation: 'Complete an end-to-end SOC alert triage and author a formal Incident Escalation Report.'
    },
    weeklySchedule: [
      { week: 1, title: 'SOC Fundamentals & SIEM', focus: 'SOC roles, SLA management, SIEM architectures, Splunk SPL basic queries.' },
      { week: 2, title: 'SIEM Querying Mastery', focus: 'Complex SPL/KQL correlation searches, statistical aggregations, alert tuning.' },
      { week: 3, title: 'EDR & Endpoint Telemetry', focus: 'Process parent-child relationships, injected DLLs, command-line arguments.' },
      { week: 4, title: 'Phishing Email Investigation', focus: 'RFC 5322 email headers, SPF/DKIM/DMARC, URL defense, sandbox detonation.' },
      { week: 5, title: 'Network Telemetry & Zeek/Suricata', focus: 'DNS logs, HTTP/HTTPS proxies, firewall drops, network anomaly detection.' },
      { week: 6, title: 'Threat Intelligence & IOCs', focus: 'OSINT enrichment, MISP, AlienVault OTX, tracking threat actor campaigns.' },
      { week: 7, title: 'SOAR & Playbook Automation', focus: 'Automated containment actions, isolating endpoints, blocking malicious IPs.' },
      { week: 8, title: 'Incident Triage Capstone', focus: 'Simulated multi-stage intrusions from initial ingress to alert closure.' }
    ],
    recommendedCerts: ['CompTIA CySA+ (CS0-003)', 'Blue Team Level 1 (BTL1)', 'Microsoft Certified: Security Operations Analyst (SC-200)'],
    aiMentorPrompt: 'Walk me through a step-by-step triage workflow when an EDR triggers an alert for certutil.exe downloading an unknown .exe file.',
    curatedVideos: SOC_ANALYST_VIDEOS,
    externalLabsAndCTFs: [
      {
        title: 'CyberDefenders: Blue Team Labs & SOC Investigation',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Realistic blue team investigations inspecting Splunk logs, PCAPs, and EDR telemetry.'
      },
      {
        title: 'Blue Team Labs Online (BTLO) Free Practice',
        platform: 'Blue Team Labs',
        url: 'https://blueteamlabs.online/',
        type: 'Practice Platform',
        difficulty: 'Beginner',
        free: true,
        description: 'Gamified blue team operational challenges covering SOC triage, phishing, and SIEM queries.'
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
        title: 'Let\'s Defend - Virtual SOC Platform',
        platform: 'Other',
        url: 'https://letsdefend.io/',
        type: 'Practice Platform',
        difficulty: 'Beginner',
        free: true,
        description: 'Hands-on virtual SOC experience handling real-time ticket queues and alert investigations.'
      }
    ],
    mappedAppAction: { type: 'scenario', id: 'scenario-ransomware', label: 'Triage Ransomware Incident in SOC' }
  },
  {
    id: 'penetration-tester',
    title: 'Penetration Tester (Ethical Hacker)',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 18,
    difficulty: 'Advanced',
    summary: 'Master authorized offensive cybersecurity: legal methodology, reconnaissance, scanning, enumeration, vulnerability assessment, web app testing, Metasploit, exploitation, privilege escalation, Active Directory attacks, network pivoting, wireless, API security, and reporting across 18 specialized stages.',
    coreConcepts: [
      '1. Pentesting Fundamentals: Legal authorization, Scope, Rules of Engagement (RoE), PTES & OSSTMM standards',
      '2. Reconnaissance & OSINT: Passive footprinting, Google dorking, WHOIS, DNS records, subfinder, theHarvester',
      '3. Network Scanning & Nmap: Host discovery, port states, TCP SYN/Connect, service fingerprinting, NSE scripting',
      '4. Deep Service Enumeration: SMB (enum4linux), SNMP, NFS, SSH, DNS zone transfers, LDAP queries',
      '5. Vulnerability Assessment: Nessus, OpenVAS, CVE/CWE triage, CVSS 3.1 scoring, prioritizing exploitability',
      '6. Web Application Pentesting & Burp Suite: OWASP Top 10, SQLi, XSS, CSRF, SSRF, IDOR, request tampering',
      '7. Metasploit Framework: Auxiliary modules, payload generation (msfvenom), handlers, Meterpreter pivot automation',
      '8. Exploitation & Shells: Reverse vs Bind shells, manual PoC weaponization, buffer overflow concepts',
      '9. Privilege Escalation: Linux (SUID, sudo, cron, LinPEAS) & Windows (Token impersonation, unquoted paths, WinPEAS)',
      '10. Active Directory Attacks: BloodHound, Kerberoasting, AS-REP roasting, Pass-the-Hash, DCSync, Golden Ticket',
      '11. Network Pentesting & Pivoting: Chisel, SSH tunneling, proxychains, traversing segmented internal networks',
      '12. Wireless Security: 802.11 frames, WPA2/WPA3 4-way handshake capture, Aircrack-ng, rogue AP defense',
      '13. API Security: REST & GraphQL testing, Broken Object Level Auth (BOLA), mass assignment, JWT token flaws',
      '14. Professional Reporting & Remediation: Executive summary, technical vulnerability writeup, CVSS, remediation steps',
      '15. Interview Preparation: Technical scenario defense, live terminal challenges, presenting client debriefs'
    ],
    toolsAndTech: ['Kali Linux', 'Nmap', 'Burp Suite', 'Metasploit Framework', 'BloodHound', 'Impacket', 'Wireshark', 'John the Ripper / Hashcat', 'LinPEAS / WinPEAS', 'Chisel'],
    studyMethodology: {
      stage1Theory: 'Master ethical hacking frameworks (PTES, OSSTMM, OWASP WSTG) and client engagement authorization.',
      stage2HandsOn: 'Follow the 72-topic hands-on video syllabus covering host discovery, port scanning, exploitation, and Active Directory takeover.',
      stage3Simulation: 'Simulate end-to-end multi-stage corporate network penetration tests across hybrid enterprise environments.',
      stage4Validation: 'Author an executive-ready, audit-compliant 30-page penetration testing deliverable with actionable mitigations.'
    },
    weeklySchedule: [
      { week: 1, title: 'Pentesting Fundamentals & Ethics', focus: 'Legal boundaries, Rules of Engagement (RoE), PTES methodology, lab architecture.' },
      { week: 2, title: 'Reconnaissance & OSINT', focus: 'Passive information gathering, Google dorking, WHOIS, DNS reconnaissance, subfinder.' },
      { week: 3, title: 'Nmap & Network Scanning', focus: 'Host discovery, TCP SYN/Connect scans, service versioning, OS detection, NSE scripts.' },
      { week: 4, title: 'Deep Service Enumeration', focus: 'SMB (enum4linux), SNMP, NFS exports, SSH configurations, DNS zone transfers.' },
      { week: 5, title: 'Vulnerability Assessment', focus: 'Nessus scanning, CVE analysis, manual verification, CVSS risk rating.' },
      { week: 6, title: 'Web App Pentesting & OWASP Top 10', focus: 'SQL injection, Cross-Site Scripting (XSS), IDOR, Command Injection, CSRF.' },
      { week: 7, title: 'Burp Suite Deep Dive', focus: 'HTTP proxy interception, Repeater analysis, Intruder attacks, custom Match & Replace rules.' },
      { week: 8, title: 'Metasploit Framework & Payloads', focus: 'msfconsole, auxiliary scanners, msfvenom payload generation, multi/handler.' },
      { week: 9, title: 'Exploitation & Shell Crafting', focus: 'Reverse vs Bind shells, Searchsploit, netcat/socat, shell upgrades to full TTY.' },
      { week: 10, title: 'Linux Privilege Escalation', focus: 'SUID/SGID permissions, sudo abuse, crontab exploits, capabilities, LinPEAS.' },
      { week: 11, title: 'Windows Privilege Escalation', focus: 'Service permissions, unquoted service paths, AlwaysInstallElevated, WinPEAS.' },
      { week: 12, title: 'Active Directory: Recon & BloodHound', focus: 'Domain enumeration, LDAP queries, BloodHound graph analysis for attack paths.' },
      { week: 13, title: 'Active Directory: Attack Execution', focus: 'Kerberoasting, AS-REP roasting, Pass-the-Hash, DCSync domain dominance.' },
      { week: 14, title: 'Network Pentesting & Pivoting', focus: 'Chisel, SSH dynamic tunneling, proxychains, traversing internal enterprise networks.' },
      { week: 15, title: 'Wireless Security Assessment', focus: '802.11 monitor mode, WPA2 4-way handshake capture, Aircrack-ng, Evil Twin defenses.' },
      { week: 16, title: 'API Security Testing', focus: 'REST/GraphQL auditing, Broken Object Level Authorization (BOLA), JWT token attacks.' },
      { week: 17, title: 'Pentest Reporting & Deliverables', focus: 'Executive summaries, technical risk matrices, remediation verification workflows.' },
      { week: 18, title: 'Technical Interview Preparation', focus: 'Scenario defense, explaining CVSS/OWASP to executives, hands-on lab demonstration.' }
    ],
    recommendedCerts: ['OffSec Certified Professional (OSCP)', 'Practical Network Penetration Tester (PNPT)', 'CompTIA PenTest+', 'Certified Ethical Hacker (CEH)'],
    aiMentorPrompt: 'Walk me through conducting an authorized penetration test on an external network: from initial OSINT to discovering an SMB flaw, exploiting it, escalating privileges, and writing the final report.',
    curatedVideos: PENTESTING_VIDEOS,
    externalLabsAndCTFs: [
      {
        title: 'HackTheBox: Penetration Tester Path & Machines',
        platform: 'HackTheBox',
        url: 'https://www.hackthebox.com/',
        type: 'Lab',
        difficulty: 'Advanced',
        free: true,
        description: 'Industry standard vulnerable VMs and structured penetration testing learning tracks.'
      },
      {
        title: 'TryHackMe: Offensive Pentesting Path',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/path/outline/pentest',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Guided labs covering Nmap, Metasploit, privilege escalation, and Active Directory exploitation.'
      },
      {
        title: 'PortSwigger Web Security Academy',
        platform: 'PortSwigger',
        url: 'https://portswigger.net/web-security',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'The premier 100% free web penetration testing lab environment created by the makers of Burp Suite.'
      },
      {
        title: 'VulnHub: Boot-to-Root Vulnerable VMs',
        platform: 'VulnHub',
        url: 'https://www.vulnhub.com/',
        type: 'Wargame',
        difficulty: 'Intermediate',
        free: true,
        description: 'Downloadable vulnerable virtual machines for offline penetration testing practice.'
      }
    ],
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Practice Active Reconnaissance' }
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 10,
    difficulty: 'Intermediate',
    summary: 'Holistic defensive security role managing organizational vulnerability posture, security baselines, risk mitigation, and compliance monitoring.',
    coreConcepts: [
      'Vulnerability Management Lifecycle: Discover, Prioritize, Assess, Remediate, Verify',
      'Center for Internet Security (CIS) Benchmarks & Hardening Standards',
      'Security metrics (MTTD, MTTR, Vulnerability Age, SLA Compliance)',
      'Patch management strategies and zero-day emergency remediation workflows',
      'Cloud and on-premise attack surface management (ASM)',
      'Security policy implementation and employee awareness training programs'
    ],
    toolsAndTech: ['Nessus Professional', 'Qualys VMDR', 'Tenable.io', 'OpenVAS', 'Microsoft Defender for Cloud', 'Jira Service Management'],
    studyMethodology: {
      stage1Theory: 'Learn vulnerability prioritization frameworks (EPSS - Exploit Prediction Scoring System, CISA KEV).',
      stage2HandsOn: 'Run authenticated Nessus scans against Linux and Windows hosts; interpret credentialed findings.',
      stage3Simulation: 'Simulate a Log4j or PrintNightmare crisis: prioritize which 50 out of 1,000 servers need emergency patches first.',
      stage4Validation: 'Present a quarterly vulnerability remediation report with risk burn-down charts to executive leadership.'
    },
    weeklySchedule: [
      { week: 1, title: 'Vulnerability Management', focus: 'Scanning methodologies, credentialed vs non-credentialed, EPSS scoring.' },
      { week: 2, title: 'Baseline Configuration & CIS', focus: 'CIS Benchmarks for Windows/Linux, Group Policy deployment, auditing tools.' },
      { week: 3, title: 'Risk Scoring & CISA KEV', focus: 'Exploitation in the wild, CVSS vs EPSS, setting SLA remediation timelines.' },
      { week: 4, title: 'Attack Surface Management', focus: 'External reconnaissance, subdomain discovery, certificate expiration monitoring.' }
    ],
    recommendedCerts: ['CompTIA CySA+', 'GIAC Security Essentials (GSEC)'],
    aiMentorPrompt: 'How does EPSS (Exploit Prediction Scoring System) differ from CVSS, and why should security analysts use both together?',
    externalLabsAndCTFs: [
      {
        title: 'TryHackMe: Cyber Defense Path',
        platform: 'TryHackMe',
        url: 'https://tryhackme.com/path/outline/cyberdefense',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Defensive fundamentals, threat intelligence, vulnerability management, and incident management.'
      },
      {
        title: 'CyberDefenders: Vulnerability Management Lab',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Intermediate',
        free: true,
        description: 'Hands-on vulnerability scanning report triage and prioritization challenges.'
      }
    ],
    mappedAppAction: { type: 'course', id: 'course-defensive', label: 'Study Defensive Operations' }
  },
  {
    id: 'vapt-analyst',
    title: 'VAPT Analyst',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 10,
    difficulty: 'Intermediate',
    summary: 'Specialize in automated vulnerability scanning paired with manual penetration validation across networks, mobile apps, and web interfaces.',
    coreConcepts: [
      'Dual-Discipline: Vulnerability Assessment (Breadth) + Penetration Testing (Depth)',
      'Automated scan policy optimization to eliminate false positives and avoid denial-of-service',
      'Manual Proof-of-Concept (PoC) validation for automated scanner findings',
      'OWASP Top 10 web validation & SANS Top 25 Software Errors',
      'Compliance-driven VAPT (PCI-DSS requirement 11.3, ISO 27001, RBI/SEBI norms)',
      'Remediation advisory: collaborating with developers to test and verify code fixes'
    ],
    toolsAndTech: ['Burp Suite', 'Nessus', 'Acunetix', 'OWASP ZAP', 'Postman', 'Checkmarx', 'Nmap'],
    studyMethodology: {
      stage1Theory: 'Master scanning mechanics, false-positive elimination strategies, and compliance testing mandates.',
      stage2HandsOn: 'Run automated scanners against deliberately vulnerable apps (Juice Shop, DVWA); manually verify all High/Critical findings.',
      stage3Simulation: 'Simulate a PCI-DSS annual penetration testing audit, compiling evidence for external QSA reviewers.',
      stage4Validation: 'Conduct a re-test audit to confirm that patched vulnerabilities cannot be bypassed with alternative payloads.'
    },
    weeklySchedule: [
      { week: 1, title: 'VA vs PT Methodologies', focus: 'Scanning scope, authenticated scans, risk rating, compliance scopes.' },
      { week: 2, title: 'Web App VAPT', focus: 'OWASP Top 10 manual validation, authentication/authorization bypasses.' },
      { week: 3, title: 'Network & Infrastructure VAPT', focus: 'Firewall rule audits, default credentials, exposed management ports.' },
      { week: 4, title: 'Reporting & Remediation Retesting', focus: 'Generating audit-ready reports, calculating business risk, verifying fixes.' }
    ],
    recommendedCerts: ['Certified Ethical Hacker (CEH Master)', 'CompTIA PenTest+', 'eLearnSecurity Junior Penetration Tester (eJPT)'],
    aiMentorPrompt: 'Why is automated scanning alone insufficient for VAPT, and give three examples of critical vulnerabilities scanners usually miss?',
    externalLabsAndCTFs: [
      {
        title: 'OWASP Juice Shop Practice Instance',
        platform: 'OWASP',
        url: 'https://juice-shop.herokuapp.com/',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'The most modern and sophisticated insecure web application for VAPT practice.'
      },
      {
        title: 'PortSwigger Web Security Academy Labs',
        platform: 'PortSwigger',
        url: 'https://portswigger.net/web-security/all-labs',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Interactive labs for auditing and manually validating web vulnerabilities.'
      }
    ],
    mappedAppAction: { type: 'course', id: 'course-offensive', label: 'Explore Offensive Track' }
  },
  {
    id: 'bug-bounty-hunter',
    title: 'Bug Bounty Hunter',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 12,
    difficulty: 'Advanced',
    summary: 'Discover high-impact, critical vulnerabilities in public and private bounty programs on platforms like HackerOne, Bugcrowd, and Intigriti.',
    coreConcepts: [
      'Wide-Scope Asset Discovery: Subdomain enumeration, ASN discovery, port scanning cloud ranges',
      'Content Discovery: Directory fuzzing (ffuf, feroxbuster), JavaScript file analysis, hidden endpoints',
      'High-Impact Bounty Vulnerabilities: Insecure Direct Object References (IDOR), Server-Side Request Forgery (SSRF)',
      'Business Logic Flaws: Race conditions, coupon/currency tampering, workflow bypasses',
      'API Security Testing: GraphQL introspection, undocumented v1/v2 API versions, JWT tampering',
      'Professional Triager Communication: Writing reproducible, high-signal vulnerability reports'
    ],
    toolsAndTech: ['Burp Suite Pro', 'Subfinder', 'httpx', 'ffuf', 'naabu', 'Katana / gau', 'Nuclei (custom templates)', 'Caido'],
    studyMethodology: {
      stage1Theory: 'Analyze hundreds of publicly disclosed Hacktivity reports on HackerOne to understand how elite hunters find bugs.',
      stage2HandsOn: 'Build a private VPS reconnaissance pipeline that continuously monitors target domains for new assets.',
      stage3Simulation: 'Test real hardened public bug bounty programs (focusing on in-scope business logic rather than basic XSS).',
      stage4Validation: 'Submit an accepted, triaged vulnerability report following strict responsible disclosure guidelines.'
    },
    weeklySchedule: [
      { week: 1, title: 'Reconnaissance & Automation', focus: 'Subfinder, amass, assetfinder, httpx, building custom bash recon pipelines.' },
      { week: 2, title: 'Content Discovery & JS Analysis', focus: 'ffuf wordlists, linkfinder, extracting hidden API keys and routes from JS bundles.' },
      { week: 3, title: 'Access Control & IDORs', focus: 'Multi-account testing, privilege tiers, parameter manipulation, finding BOLA in APIs.' },
      { week: 4, title: 'SSRF & Cloud Metadata', focus: 'Blind SSRF, out-of-band testing (Interactsh), bypassing regex filters, AWS IMDSv2.' },
      { week: 5, title: 'Business Logic & Race Conditions', focus: 'Turbo Intruder, financial tampering, state machine desync, concurrent requests.' },
      { week: 6, title: 'Report Writing & Triager Etiquette', focus: 'Writing clear markdown PoCs, calculating CVSS, respectful communication.' }
    ],
    recommendedCerts: ['PortSwigger Certified Web Security Practitioner (BSCP)', 'eLearnSecurity Web Application Penetration Tester (eWPT)'],
    aiMentorPrompt: 'Explain how to systematically hunt for Insecure Direct Object References (IDOR) in modern multi-tenant SaaS applications.',
    externalLabsAndCTFs: [
      {
        title: 'PortSwigger Web Security Academy',
        platform: 'PortSwigger',
        url: 'https://portswigger.net/web-security',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'Complete web security labs covering SSRF, IDOR, SQLi, XSS, and HTTP Request Smuggling.'
      },
      {
        title: 'HackerOne Hacktivity Public Reports',
        platform: 'Other',
        url: 'https://hackerone.com/hacktivity',
        type: 'Practice Platform',
        difficulty: 'Intermediate',
        free: true,
        description: 'Read real disclosed bug bounty reports from HackerOne to learn vulnerability patterns.'
      },
      {
        title: 'Hacker101 CTF Platform',
        platform: 'PicoCTF',
        url: 'https://ctf.hacker101.com/',
        type: 'CTF',
        difficulty: 'Beginner',
        free: true,
        description: 'Free CTF built by HackerOne specifically for aspiring bug bounty hunters.'
      }
    ],
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Practice Web & Network Recon' }
  },
  {
    id: 'incident-responder',
    title: 'Incident Responder (DFIR)',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 12,
    difficulty: 'Advanced',
    summary: 'Lead crisis response during major corporate security breaches: identify attacker root cause, contain intrusions, and restore operations safely.',
    coreConcepts: [
      'Incident Response Frameworks: SANS PICERL (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned)',
      'NIST SP 800-61 Rev. 2 Computer Security Incident Handling Guide',
      'Live Response & Forensic Triage: Collecting volatile data (RAM, network sockets, running processes) with KAPE or Velociraptor',
      'Lateral Movement Analysis: WMI, PsExec, WinRM, RDP session artifact hunting',
      'Containment Strategies: Network isolation, account disabling, credential resets, firewall blocking without tipping off the adversary',
      'Post-Incident Debriefs: Root cause analysis (RCA), timeline generation, executive incident briefings'
    ],
    toolsAndTech: ['Velociraptor', 'KAPE (Kroll Artifact Parser and Extractor)', 'Volatility 3', 'Plaso / log2timeline', 'Wireshark', 'EZ Tools (Eric Zimmerman)'],
    studyMethodology: {
      stage1Theory: 'Master legal requirements, chain of custody, evidence preservation, and the SANS PICERL lifecycle.',
      stage2HandsOn: 'Triage compromised memory dumps using Volatility 3 to locate injected Meterpreter and Cobalt Strike beacons.',
      stage3Simulation: 'Run a live ransomware incident response drill: isolate infected segments, locate initial access point, preserve hypervisor logs.',
      stage4Validation: 'Author an executive Root Cause Analysis (RCA) report explaining the complete breach timeline down to the minute.'
    },
    weeklySchedule: [
      { week: 1, title: 'IR Frameworks & Governance', focus: 'PICERL, NIST SP 800-61, legal obligations, war room management.' },
      { week: 2, title: 'Live Response & Triage', focus: 'KAPE artifact collection, volatile data preservation, memory capture.' },
      { week: 3, title: 'Windows Artifact Deep-Dive', focus: 'MFT, USN Journal, Shimcache, Amcache, Prefetch, Shellbags.' },
      { week: 4, title: 'Active Adversary Hunting', focus: 'Cobalt Strike malleable C2 profiles, living-off-the-land techniques.' },
      { week: 5, title: 'Containment & Remediation', focus: 'Domain-wide password resets, golden ticket invalidation, safe recovery.' },
      { week: 6, title: 'Lessons Learned & Executive RCA', focus: 'Root cause analysis, creating future detection rules, executive debrief.' }
    ],
    recommendedCerts: ['SANS GIAC Certified Incident Handler (GCIH)', 'Blue Team Level 2 (BTL2)', 'EC-Council Certified Incident Handler (ECIH)'],
    aiMentorPrompt: 'Walk me through the SANS PICERL phases during an active enterprise Ransomware breach where domain controllers are encrypted.',
    externalLabsAndCTFs: [
      {
        title: 'CyberDefenders: DFIR Incident Investigations',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Advanced',
        free: true,
        description: 'Investigate enterprise breach memory dumps, disk artifacts, and event logs.'
      },
      {
        title: 'Blue Team Labs Online: DFIR Incident Scenarios',
        platform: 'Blue Team Labs',
        url: 'https://blueteamlabs.online/',
        type: 'Lab',
        difficulty: 'Intermediate',
        free: true,
        description: 'Hands-on ransomware containment, volatile memory triage, and root-cause analysis.'
      }
    ],
    mappedAppAction: { type: 'scenario', id: 'scenario-ransomware', label: 'Enter Incident Crisis Room' }
  },
  {
    id: 'threat-hunter',
    title: 'Threat Hunter',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 12,
    difficulty: 'Advanced',
    summary: 'Proactively search across networks, endpoints, and multi-cloud telemetry to uncover stealthy, advanced persistent threats (APTs) that evade automated EDR/SIEM controls. Master the 15-stage threat hunting curriculum spanning MITRE ATT&CK, KQL, Microsoft Sentinel, and behavioral anomaly hunting.',
    coreConcepts: [
      '1. Threat Hunting Fundamentals: Shifting from reactive alerts to proactive adversary-centric hunts and dwell-time reduction',
      '2. MITRE ATT&CK Framework: Navigating Tactics (Why), Techniques (How), Sub-techniques, and ATT&CK Navigator coverage mapping',
      '3. Threat Hunting Methodology: SQRR lifecycle (Scope, Query, Refine, Report), data staging, and behavioral baselining',
      '4. KQL for Threat Hunting: Advanced Kusto Query Language operators, tabular joins, time-series anomaly detection, and JSON parsing',
      '5. Hunting Queries: Developing, optimizing, and executing high-yield hunting queries across petabytes of telemetry',
      '6. Microsoft Sentinel Hunting: Leveraging the Sentinel Hunting Blade, Livestreams, and Jupyter MSTICPy analytics notebooks',
      '7. APT Hunting: Tracking nation-state threat actors (APT28, APT29 Cozy Bear, Lazarus) across multi-stage intrusions',
      '8. Tactics, Techniques & Procedures (TTPs): Climbing the Pyramid of Pain and uncovering LOLBAS living-off-the-land binaries',
      '9. Hypothesis-Driven Hunting: Formulating and scientifically validating intelligence-driven threat hunting hypotheses',
      '10. Threat Detection vs Threat Hunting: Operationalizing the symbiotic feedback loop between hunting discoveries and automated detection rules',
      '11. Windows Threat Hunting: Deep endpoint telemetry analysis using Sysmon (Event IDs 1, 3, 10, 11), parent-child trees, and LSASS dumping',
      '12. Cloud Threat Hunting: Hunting identity anomalies in Microsoft Entra ID, risky sign-ins, token replay, and AWS/Azure control plane tampering',
      '13. Threat Intelligence in Hunting: Operationalizing STIX/TAXII feeds, MISP, AlienVault OTX, and pivoting on adversary infrastructure',
      '14. Hunting with SIEM: Big data correlation across network firewalls, endpoint telemetry, and authentication logs into hunting bookmarks',
      '15. Advanced Threat Hunting: Continuous adversary emulation with Atomic Red Team and automated threat hunting playbooks'
    ],
    toolsAndTech: ['Microsoft Sentinel', 'Kusto Query Language (KQL)', 'MITRE ATT&CK Navigator', 'Sysmon', 'Sigma Rules', 'YARA / YARA-L', 'Atomic Red Team', 'MSTICPy / Jupyter', 'Velociraptor', 'Splunk'],
    studyMethodology: {
      stage1Theory: 'Study the 15 curated masterclasses covering MITRE ATT&CK, adversary TTPs, and Sentinel hunting query architectures.',
      stage2HandsOn: 'Write complex KQL queries to detect living-off-the-land binaries (certutil, bitsadmin, mshta) and unquoted service path execution.',
      stage3Simulation: 'Execute proactive threat hunts across a multi-gigabyte enterprise Windows event dataset to uncover hidden C2 beaconing and credential dumps.',
      stage4Validation: 'Convert validated hunt logic into a permanent automated Sentinel Analytic Rule with documented false-positive mitigations.'
    },
    weeklySchedule: [
      { week: 1, title: 'Hunting Fundamentals & ATT&CK', focus: 'Threat hunting mindset, reactive vs proactive, MITRE ATT&CK navigation, and tactics mapping.' },
      { week: 2, title: 'Hunting Methodology & Hypotheses', focus: 'SQRR methodology, formulating testable threat hypotheses, and defining environmental baselines.' },
      { week: 3, title: 'KQL Deep-Dive for Hunters', focus: 'Kusto query operators, string manipulation, tabular joins, summarize aggregations, and time-series.' },
      { week: 4, title: 'Sentinel Hunting Blade & Queries', focus: 'Running Sentinel hunting queries, bookmarking findings, and configuring live real-time livestreams.' },
      { week: 5, title: 'APT Campaign Tracking & TTPs', focus: 'Deconstructing APT kill chains, the Pyramid of Pain, and LOLBAS living-off-the-land detection.' },
      { week: 6, title: 'Windows & Sysmon Endpoint Hunting', focus: 'Sysmon process creation, parent-child anomalies, LSASS memory access, and token theft.' },
      { week: 7, title: 'Cloud & Identity Threat Hunting', focus: 'Entra ID sign-in risk, OAuth permission abuse, AWS CloudTrail / Azure Activity audit logs.' },
      { week: 8, title: 'Threat Intelligence & Infrastructure Pivoting', focus: 'STIX/TAXII integration, pivoting on passive DNS, SSL hashes, and tracking threat actor pivots.' },
      { week: 9, title: 'Big Data SIEM Correlation & Notebooks', focus: 'Multi-stream correlation, Jupyter Notebooks with MSTICPy, and graph visualization of attacks.' },
      { week: 10, title: 'Advanced Adversary Emulation Capstone', focus: 'Testing hunting queries against Atomic Red Team simulations and deploying automated rules.' }
    ],
    recommendedCerts: ['GIAC Certified Threat Analyst (GCTA)', 'Certified Threat Hunting Professional (eCTHPv2)', 'Microsoft SC-200: Security Operations Analyst'],
    aiMentorPrompt: 'How do you formulate a threat hunting hypothesis for detecting DLL search order hijacking across Windows workstations using Sysmon and KQL?',
    curatedVideos: THREAT_HUNTER_VIDEOS,
    externalLabsAndCTFs: [
      {
        title: 'CyberDefenders: Threat Hunting Lab & PCAPs',
        platform: 'CyberDefenders',
        url: 'https://cyberdefenders.org/blueteam-labs/',
        type: 'Challenge',
        difficulty: 'Advanced',
        free: true,
        description: 'Proactively search event logs and network telemetry for APT persistence.'
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
    ],
    mappedAppAction: { type: 'course', id: 'threathunt-501', label: 'Study Threat Hunter Course & Masterclasses' }
  },
  {
    id: 'digital-forensics-analyst',
    title: 'Digital Forensics Analyst',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 12,
    difficulty: 'Advanced',
    summary: 'Extract, preserve, and scientifically analyze digital evidence from computers, disks, mobile devices, and memory for legal or corporate investigations.',
    coreConcepts: [
      'Forensic Science Primitives: Locard Exchange Principle, Chain of Custody, Write-blockers, Cryptographic hashing (SHA-256)',
      'Disk Imaging: Bit-stream RAW/DD, E01 (Expert Witness Format), AFF',
      'File System Forensics: NTFS (MFT, $LogFile, USN Journal), FAT32, EXT4, APFS',
      'Windows Forensic Artifacts: Prefetch files, Shimcache, Amcache, Shellbags, LNK shortcuts, UserAssist',
      'Browser Forensics: History SQLite databases, cache, session storage, deleted record carving',
      'Memory Forensics: Volatile acquisition, kernel object pools, hollowed processes, network sockets'
    ],
    toolsAndTech: ['FTK Imager', 'Autopsy Forensic Browser', 'Eric Zimmerman Tools (MFTECmd, PECmd, JLECmd)', 'Volatility 3', 'EnCase / Axiom (concepts)', 'X-Ways'],
    studyMethodology: {
      stage1Theory: 'Study file system internal data structures (NTFS clusters, MFT record attributes $STANDARD_INFORMATION and $FILE_NAME).',
      stage2HandsOn: 'Create a forensic disk image of a USB stick; parse deleted files using Autopsy and recover fragmented files.',
      stage3Simulation: 'Investigate an insider threat data exfiltration case: prove an employee inserted an unapproved USB drive and copied proprietary files.',
      stage4Validation: 'Prepare a court-ready expert witness forensic report documenting hash verification and artifact timelines.'
    },
    weeklySchedule: [
      { week: 1, title: 'Evidence Handling & Imaging', focus: 'Chain of custody, write-blocking hardware/software, raw dd and E01 imaging.' },
      { week: 2, title: 'File System Internals (NTFS/EXT4)', focus: 'MFT attributes, data runs, file allocation tables, timestamp analysis (MACB).' },
      { week: 3, title: 'Execution & Persistence Artifacts', focus: 'Prefetch, Shimcache, Amcache, Scheduled Tasks, Run keys.' },
      { week: 4, title: 'User Activity & Device Artifacts', focus: 'Shellbags, LNK files, USB device mounting history in SYSTEM registry hive.' },
      { week: 5, title: 'Browser & Email Forensics', focus: 'SQLite database carving, recovering deleted Chrome/Edge history, email headers.' },
      { week: 6, title: 'Expert Reporting & Legal Standards', focus: 'Writing forensic affidavits, presenting evidence according to Daubert standard.' }
    ],
    recommendedCerts: ['GIAC Certified Forensic Examiner (GCFE)', 'GIAC Certified Forensic Analyst (GCFA)', 'Certified Forensic Computer Examiner (CFCE)'],
    aiMentorPrompt: 'Explain how Windows Shellbags and LNK files allow a forensic analyst to prove a user browsed a specific folder on an external drive.',
    mappedAppAction: { type: 'course', id: 'course-incident-response', label: 'Study Digital Evidence Analysis' }
  },
  {
    id: 'malware-analyst',
    title: 'Malware Analyst & Reverse Engineer',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 14,
    difficulty: 'Advanced',
    summary: 'Dissect malicious binaries to understand capabilities, communication protocols, indicators of compromise, and author attribution.',
    coreConcepts: [
      'Static Analysis: Portable Executable (PE) headers, import/export tables (IAT), strings, entropy analysis',
      'Dynamic Analysis: Sandboxing, ProcMon, RegShot, INetSim, capturing C2 traffic with Wireshark',
      'Assembly & Disassembly: x86/x64 assembly instructions, function calling conventions, stack frames',
      'Reverse Engineering with Decompilers: Ghidra, IDA Pro, Binary Ninja, x64dbg',
      'Unpacking & De-obfuscation: Identifying UPX, custom XOR loops, API hashing, anti-analysis checks',
      'YARA Rule Creation: Writing robust signature rules to detect malware families across variants'
    ],
    toolsAndTech: ['Ghidra', 'x64dbg / OllyDbg', 'PEview / CFF Explorer', 'Process Hacker', 'RegShot', 'INetSim', 'YARA', 'FLOSS'],
    studyMethodology: {
      stage1Theory: 'Study x86/x64 assembly, Windows internal API functions (VirtualAlloc, WriteProcessMemory, CreateRemoteThread).',
      stage2HandsOn: 'Set up an isolated REMnux/Windows sandbox VM; analyze real malware samples from MalwareBazaar in safe environment.',
      stage3Simulation: 'Unpack a packed keylogger binary: bypass anti-debugging timing checks and locate the original entry point (OEP).',
      stage4Validation: 'Publish a detailed malware technical analysis report with extracted C2 server IP, decrypted config, and YARA rule.'
    },
    weeklySchedule: [
      { week: 1, title: 'Malware Lab Setup & Safety', focus: 'Host-only networking, sandbox isolation, snapshot management, malware hygiene.' },
      { week: 2, title: 'Static PE Header Analysis', focus: 'PE structure, sections (.text, .data, .rsrc), IAT, entropy, hashes.' },
      { week: 3, title: 'Dynamic Analysis & Telemetry', focus: 'Procmon filters, Regshot diffing, network simulation with INetSim and ApateDNS.' },
      { week: 4, title: 'Assembly & Reverse Engineering', focus: 'x86 registers, branching, loops, decompilation in Ghidra, reversing functions.' },
      { week: 5, title: 'Debugging & Unpacking', focus: 'Setting breakpoints in x64dbg, tracing execution, dumping unpacked binaries.' },
      { week: 6, title: 'Anti-Analysis & Evasion Techniques', focus: 'IsDebuggerPresent, CPUID, RDTSC timing checks, process hollowing reversing.' }
    ],
    recommendedCerts: ['GIAC Reverse Engineering Malware (GREM)', 'Practical Malware Analysis and Triage (PMAT)'],
    aiMentorPrompt: 'How does process hollowing work at the Windows API level, and what API calls should an analyst look for in Ghidra?',
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Explore Reverse Engineering' }
  },
  {
    id: 'security-engineer',
    title: 'Security Engineer',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 12,
    difficulty: 'Intermediate',
    summary: 'Design, deploy, and maintain corporate security infrastructure including firewalls, WAFs, IDS/IPS, VPNs, and endpoint agents.',
    coreConcepts: [
      'Next-Gen Firewalls (NGFW) & Network Segmentation: Palo Alto, Fortinet, pfSense',
      'Intrusion Detection/Prevention Systems (IDS/IPS): Snort, Suricata, Zeek',
      'Web Application Firewalls (WAF): ModSecurity, AWS WAF, Cloudflare rules',
      'Public Key Infrastructure (PKI): Certificate Authorities, SSL/TLS inspection, certificate pinning',
      'Zero Trust Network Access (ZTNA) vs legacy VPN architectures',
      'Security Automation & Infrastructure as Code (Ansible, Terraform)'
    ],
    toolsAndTech: ['pfSense / OPNsense', 'Suricata', 'Zeek', 'Snort', 'Palo Alto Panorama', 'OpenVPN / WireGuard', 'Terraform'],
    studyMethodology: {
      stage1Theory: 'Learn enterprise network architecture, demilitarized zones (DMZ), stateful inspection, and zero trust models.',
      stage2HandsOn: 'Deploy an OPNsense/pfSense firewall VM; configure VLANs, DMZ routing, and Suricata IDS alerts.',
      stage3Simulation: 'Implement enterprise SSL/TLS decryption on an edge gateway; test and tune alert signatures to avoid user disruption.',
      stage4Validation: 'Architect a secure high-availability network topology connecting multiple branch offices and cloud VPCs.'
    },
    weeklySchedule: [
      { week: 1, title: 'Network Defense & Firewalls', focus: 'Packet filtering, stateful inspection, NGFW application identification.' },
      { week: 2, title: 'IDS/IPS & Network Telemetry', focus: 'Suricata rule writing, Zeek protocol extraction, tuning false positives.' },
      { week: 3, title: 'Secure Access & PKI', focus: 'ZTNA, WireGuard VPNs, 802.1X network authentication, enterprise PKI.' },
      { week: 4, title: 'Infrastructure Hardening', focus: 'CIS benchmarks, bastion hosts, automated provisioning with Terraform/Ansible.' }
    ],
    recommendedCerts: ['Certified Information Systems Security Professional (CISSP)', 'CompTIA Security+', 'Cisco CCNP Security'],
    aiMentorPrompt: 'Explain how Next-Gen Firewalls differ from traditional stateful firewalls, specifically regarding Layer 7 application inspection.',
    mappedAppAction: { type: 'course', id: 'course-defensive', label: 'Study Infrastructure Defense' }
  },
  {
    id: 'cloud-security-engineer',
    title: 'Cloud Security Engineer',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 12,
    difficulty: 'Intermediate',
    summary: 'Secure public cloud environments (AWS, Azure, GCP) across IAM policies, VPC network controls, serverless, and cloud posture management.',
    coreConcepts: [
      'Cloud Shared Responsibility Model: IaaS vs PaaS vs SaaS security boundaries',
      'Cloud Identity & Access Management (IAM): Least privilege policies, roles, trust relationships, permission boundaries',
      'Cloud Security Posture Management (CSPM) & Cloud Workload Protection (CWPP)',
      'Storage & Compute Security: S3 bucket policies, KMS encryption at rest and in transit, EC2 instance metadata (IMDSv2)',
      'Cloud Networking: VPCs, Security Groups, Network ACLs, Transit Gateways, VPC Flow Logs',
      'Cloud Detection & Logging: AWS CloudTrail, GuardDuty, Azure Sentinel, GCP Cloud Logging'
    ],
    toolsAndTech: ['AWS CLI / Console', 'Prowler', 'ScoutSuite', 'Checkov', 'Terraform', 'AWS CloudTrail', 'Tfsec'],
    studyMethodology: {
      stage1Theory: 'Study AWS/Azure/GCP cloud security architectures, IAM evaluation logic, and common cloud attack vectors.',
      stage2HandsOn: 'Run Prowler or ScoutSuite against an AWS sandbox account; identify misconfigurations and overly permissive IAM roles.',
      stage3Simulation: 'Remediate a simulated AWS S3 data leak incident: lock down public bucket permissions and rotate leaked access keys.',
      stage4Validation: 'Write Infrastructure as Code (Terraform) to deploy a PCI-compliant, encrypted AWS multi-tier VPC landing zone.'
    },
    weeklySchedule: [
      { week: 1, title: 'Cloud Architecture & Shared Responsibility', focus: 'IaaS/PaaS/SaaS boundaries, multi-account strategy (AWS Organizations).' },
      { week: 2, title: 'Cloud IAM & Least Privilege', focus: 'JSON policies, STS assume role, cross-account access, permission boundaries.' },
      { week: 3, title: 'Data Encryption & Storage Security', focus: 'KMS customer-managed keys, S3 bucket policies, envelope encryption.' },
      { week: 4, title: 'Cloud Networking & VPC Security', focus: 'Security Groups vs NACLs, VPC Peering, PrivateLink, Flow Logs analysis.' },
      { week: 5, title: 'Cloud Detection & Incident Response', focus: 'CloudTrail log integrity, GuardDuty alerts, automated Lambda remediation.' },
      { week: 6, title: 'CSPM & DevSecOps Scanning', focus: 'Prowler audits, scanning Terraform with Checkov in GitHub Actions.' }
    ],
    recommendedCerts: ['AWS Certified Security - Specialty', 'Microsoft Certified: Azure Security Engineer Associate (AZ-500)', 'CCSK (Certificate of Cloud Security Knowledge)'],
    aiMentorPrompt: 'Explain how AWS IAM policy evaluation logic works, specifically regarding Explicit Deny vs Explicit Allow and SCPs.',
    mappedAppAction: { type: 'course', id: 'course-cloud-iam', label: 'Study Cloud Security Track' }
  },
  {
    id: 'appsec-engineer',
    title: 'AppSec Engineer (Application Security)',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 12,
    difficulty: 'Intermediate',
    summary: 'Partner with software engineering teams to embed security throughout the SDLC via threat modeling, SAST/DAST, and secure code reviews.',
    coreConcepts: [
      'Secure Software Development Lifecycle (SSDLC): Microsoft SDL, OWASP SAMM',
      'Static Application Security Testing (SAST) & Dynamic Testing (DAST)',
      'Software Composition Analysis (SCA) & Software Bill of Materials (SBOM)',
      'Threat Modeling for Microservices: Data Flow Diagrams (DFDs), STRIDE, trust boundaries',
      'OWASP Top 10 mitigation: Parameterized queries, context-aware output encoding, CSRF tokens',
      'Developer Security Champions Program & Security Culture'
    ],
    toolsAndTech: ['Semgrep', 'SonarQube', 'Snyk', 'OWASP ZAP', 'Burp Suite', 'Dependency-Check', 'Trivy'],
    studyMethodology: {
      stage1Theory: 'Deep-dive into OWASP Top 10 web and API security vulnerabilities down to source-code root causes.',
      stage2HandsOn: 'Write custom Semgrep rules to detect insecure deserialization and SQL injection patterns in Python/JavaScript codebases.',
      stage3Simulation: 'Conduct a secure code review on a pull request containing a subtle authentication bypass flaw.',
      stage4Validation: 'Build a secure coding guidelines standard and present it in a simulated developer training workshop.'
    },
    weeklySchedule: [
      { week: 1, title: 'Secure SDLC & Frameworks', focus: 'OWASP SAMM, BSIMM, shifting left, security requirements engineering.' },
      { week: 2, title: 'SAST & Code Auditing', focus: 'Semgrep custom rules, SonarQube quality gates, finding flaws in source code.' },
      { week: 3, title: 'DAST & Web Vulnerability Fixes', focus: 'Automated ZAP scanning, verifying SQLi/XSS/SSRF remediations.' },
      { week: 4, title: 'SCA, Supply Chain & SBOM', focus: 'Dependency scanning, vulnerable npm/PyPI packages, CycloneDX SBOMs.' }
    ],
    recommendedCerts: ['Certified Application Security Engineer (CASE)', 'GIAC Certified Web Application Defender (GWEB)'],
    aiMentorPrompt: 'Show me an example of insecure vs secure database queries in Node.js/Python and explain how prepared statements neutralize SQLi.',
    mappedAppAction: { type: 'course', id: 'course-fundamentals', label: 'Review Secure Development' }
  },
  {
    id: 'devsecops-engineer',
    title: 'DevSecOps Engineer',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 10,
    difficulty: 'Intermediate',
    summary: 'Automate security checks into CI/CD pipelines, container registries, Kubernetes clusters, and cloud deployment pipelines.',
    coreConcepts: [
      'CI/CD Pipeline Security Integration: GitHub Actions, GitLab CI, Jenkins',
      'Automated Secrets Detection in Git: Preventing leaked API keys and SSH private keys',
      'Container Security: Dockerfile hardening, multi-stage builds, rootless containers, base image scanning',
      'Kubernetes Security: RBAC, Network Policies, Pod Security Standards, Admission Controllers',
      'Policy as Code: Open Policy Agent (OPA) / Rego, Kyverno',
      'Infrastructure as Code (IaC) security auditing: Terraform, CloudFormation, Helm'
    ],
    toolsAndTech: ['GitHub Actions', 'Gitleaks', 'Trivy', 'Open Policy Agent (OPA)', 'Checkov', 'Kubernetes / Minikube', 'Falco'],
    studyMethodology: {
      stage1Theory: 'Study pipeline security, software supply chain attacks (e.g. SolarWinds, Codecov), and SLSA framework.',
      stage2HandsOn: 'Build a complete GitHub Actions CI/CD pipeline that blocks PRs on secrets detection, high CVEs, or IaC flaws.',
      stage3Simulation: 'Deploy Falco runtime security in a Kubernetes cluster to detect live shell spawning inside a production container.',
      stage4Validation: 'Author an OPA Rego policy that prevents any container from running as UID 0 (root) in your cluster.'
    },
    weeklySchedule: [
      { week: 1, title: 'CI/CD Pipelines & Secrets Scanning', focus: 'GitHub Actions workflows, pre-commit hooks, Gitleaks, Trufflehog.' },
      { week: 2, title: 'Container Security & Trivy', focus: 'Docker best practices, minimal distroless images, image vulnerability scanning.' },
      { week: 3, title: 'Kubernetes Security & RBAC', focus: 'Kube-bench, Network Policies, Pod Security Admission, admission webhooks.' },
      { week: 4, title: 'Policy as Code & Runtime Defense', focus: 'OPA Rego rules, Kyverno validation, Falco runtime anomaly detection.' }
    ],
    recommendedCerts: ['Certified Kubernetes Security Specialist (CKS)', 'GIAC Cloud Security Automation (GCSA)'],
    aiMentorPrompt: 'Explain how to write a simple OPA Rego policy that enforces that no Docker image deployed to Kubernetes uses the :latest tag.',
    mappedAppAction: { type: 'course', id: 'course-cloud-iam', label: 'Study Cloud & DevSecOps' }
  },
  {
    id: 'grc-analyst',
    title: 'GRC Analyst (Governance, Risk, Compliance)',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 8,
    difficulty: 'Beginner',
    summary: 'Align cybersecurity programs with industry standards, legal regulations, corporate policies, and enterprise risk management frameworks.',
    coreConcepts: [
      'Core GRC Frameworks: NIST Cybersecurity Framework 2.0 (CSF), ISO/IEC 27001:2022, SOC 2 Type II',
      'Regulatory Compliance: GDPR, CCPA, HIPAA Security Rule, PCI-DSS v4.0',
      'Enterprise Risk Assessment: Qualitative vs Quantitative Risk Analysis (FAIR model)',
      'Risk Register Management: Tracking inherent risk, control effectiveness, and residual risk',
      'Third-Party / Vendor Risk Management (TPRM): Security questionnaires, SOC report reviews',
      'Security Policy Authoring: Acceptable Use Policy, Data Classification, Password Standards'
    ],
    toolsAndTech: ['Vanta', 'Drata', 'OneTrust', 'ServiceNow GRC', 'NIST CSF Tool', 'Excel / Sheets Risk Matrix'],
    studyMethodology: {
      stage1Theory: 'Study ISO 27001 Annex A controls, NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover).',
      stage2HandsOn: 'Construct an enterprise Risk Register evaluating 10 critical organizational threat scenarios.',
      stage3Simulation: 'Review a vendor SOC 2 Type II report; identify noted control exceptions and recommend compensating controls.',
      stage4Validation: 'Draft a comprehensive corporate Information Security Policy (InfoSec Policy) compliant with ISO 27001.'
    },
    weeklySchedule: [
      { week: 1, title: 'GRC Foundations & NIST CSF', focus: 'Govern, Identify, Protect, Detect, Respond, Recover; risk appetite.' },
      { week: 2, title: 'ISO 27001 & SOC 2 Audits', focus: 'ISMS lifecycle, ISO 27001:2022 Annex A controls, SOC 2 Trust Services Criteria.' },
      { week: 3, title: 'Risk Management & FAIR Model', focus: 'Qualitative matrices, FAIR quantitative risk modeling, risk registers.' },
      { week: 4, title: 'Third-Party Risk & Regulations', focus: 'TPRM, vendor assessments, GDPR privacy requirements, PCI-DSS v4.0.' }
    ],
    recommendedCerts: ['ISACA Certified Information Security Manager (CISM)', 'Certified in Risk and Information Systems Control (CRISC)', 'CompTIA Security+'],
    aiMentorPrompt: 'How does the NIST CSF 2.0 "Govern" function change how organizations structure their cybersecurity programs?',
    mappedAppAction: { type: 'course', id: 'course-fundamentals', label: 'Study Governance & Policies' }
  },
  {
    id: 'security-auditor',
    title: 'Security Auditor (Internal / External)',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 8,
    difficulty: 'Intermediate',
    summary: 'Objectively evaluate whether technical controls, policies, and procedures are effectively designed and operating as intended.',
    coreConcepts: [
      'Audit Principles: Independence, Objectivity, Professional Skepticism, Evidence Sampling',
      'Control Testing: Design Effectiveness Testing (DET) vs Operating Effectiveness Testing (OET)',
      'Audit Evidence Collection: Screenshots, system configuration dumps, interview transcripts, log exports',
      'Audit Workpapers & Documenting Deficiencies: Finding, Criteria, Condition, Cause, Effect, Recommendation',
      'SOC 1 vs SOC 2 vs ISO 27001 audit workflows',
      'Audit Exit Conferences & Management Remediation Commitments'
    ],
    toolsAndTech: ['AuditBoard', 'Excel / Data Analysis Tools', 'PowerBI', 'ServiceNow GRC', 'Nessus (audit mode)'],
    studyMethodology: {
      stage1Theory: 'Learn auditing standards (ISACA ITAF, AICPA SSAE 18, IIA International Standards).',
      stage2HandsOn: 'Perform sample-based control testing on user access reviews across 50 Active Directory accounts.',
      stage3Simulation: 'Simulate a formal external SOC 2 audit interview with an IT Director regarding quarterly firewall rule reviews.',
      stage4Validation: 'Write an official Audit Finding and Recommendation memorandum for an unpatched critical server cluster.'
    },
    weeklySchedule: [
      { week: 1, title: 'Auditing Standards & Planning', focus: 'Audit charters, scoping, risk-based audit planning, sampling methods.' },
      { week: 2, title: 'Control Testing & Fieldwork', focus: 'DET vs OET testing, testing password complexity, access control lists.' },
      { week: 3, title: 'Evidence & Workpapers', focus: 'Maintaining evidence integrity, writing defensible audit workpapers.' },
      { week: 4, title: 'Reporting & Remediation Tracking', focus: 'Drafting audit findings, severity ratings, tracking remediation commitments.' }
    ],
    recommendedCerts: ['ISACA Certified Information Systems Auditor (CISA)', 'ISO 27001 Lead Auditor'],
    aiMentorPrompt: 'What is the difference between Design Effectiveness Testing (DET) and Operating Effectiveness Testing (OET) during a security audit?',
    mappedAppAction: { type: 'course', id: 'course-defensive', label: 'Review Defensive Controls' }
  },
  {
    id: 'iam-analyst',
    title: 'IAM Analyst (Identity & Access Management)',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 8,
    difficulty: 'Intermediate',
    summary: 'Manage digital identities, single sign-on (SSO), multi-factor authentication (MFA), privileged access management (PAM), and zero trust access.',
    coreConcepts: [
      'Identity Federation & Protocols: SAML 2.0, OAuth 2.0, OpenID Connect (OIDC), SCIM user provisioning',
      'Directory Services: Microsoft Entra ID (Azure AD), Active Directory, Okta, Ping Identity',
      'Privileged Access Management (PAM): Just-in-Time access, credential vaulting, session recording (CyberArk, BeyondTrust)',
      'Multi-Factor Authentication (MFA): FIDO2 / WebAuthn, hardware tokens, push notifications, defeating phishing with Passkeys',
      'Access Governance: Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), user lifecycle (JML - Joiner, Mover, Leaver)',
      'Identity Threat Detection & Response (ITDR): Detecting credential stuffing, token replay, impossible travel anomalies'
    ],
    toolsAndTech: ['Okta', 'Microsoft Entra ID', 'CyberArk', 'Postman (OAuth testing)', 'PingFederate', 'HashiCorp Vault'],
    studyMethodology: {
      stage1Theory: 'Study OAuth 2.0 grant types (Authorization Code + PKCE), SAML assertion exchanges, and token validation.',
      stage2HandsOn: 'Set up an Okta / Entra ID developer tenant; configure SSO and SCIM provisioning for a test SaaS application.',
      stage3Simulation: 'Investigate and mitigate a session token theft / adversary-in-the-middle (AiTM) phishing attack.',
      stage4Validation: 'Design a zero-trust Privileged Access Management (PAM) policy requiring hardware-bound MFA for all cloud admins.'
    },
    weeklySchedule: [
      { week: 1, title: 'Identity Fundamentals & Directories', focus: 'Directory services, user attributes, JML processes, Active Directory vs Entra ID.' },
      { week: 2, title: 'Federation: SAML, OAuth & OIDC', focus: 'SAML 2.0 XML exchanges, OAuth 2.0 tokens (JWT), OpenID Connect claims.' },
      { week: 3, title: 'Privileged Access Management (PAM)', focus: 'Credential vaults, Just-in-Time elevation, session monitoring with CyberArk.' },
      { week: 4, title: 'MFA, Passkeys & ITDR', focus: 'FIDO2 / WebAuthn, Conditional Access Policies, detecting token theft.' }
    ],
    recommendedCerts: ['Microsoft Certified: Identity and Access Administrator Associate (SC-300)', 'Okta Certified Professional'],
    aiMentorPrompt: 'Diagram and explain the OAuth 2.0 Authorization Code Flow with PKCE and why PKCE is essential for modern applications.',
    mappedAppAction: { type: 'course', id: 'course-cloud-iam', label: 'Study IAM & Access Architecture' }
  },
  {
    id: 'security-architect',
    title: 'Security Architect',
    pillar: 'career-paths',
    pillarLabel: 'Career Paths',
    estimatedWeeks: 14,
    difficulty: 'Advanced',
    summary: 'Senior strategic leadership role designing resilient enterprise security architectures across hybrid cloud, networks, and data estates.',
    coreConcepts: [
      'Enterprise Architecture Frameworks: SABSA (Sherwood Applied Business Security Architecture), TOGAF',
      'Zero Trust Enterprise Architecture (NIST SP 800-207): Identity, devices, network, workloads, data',
      'Cloud Landing Zone & Multi-Cloud Architecture: Hub-and-spoke topologies, transit gateways, microsegmentation',
      'Data Protection Architecture: Data classification, tokenization, hardware security modules (HSM), key management',
      'Secure High-Availability & Disaster Recovery: RTO, RPO, multi-region failover, immutable backups',
      'C-Suite Strategic Alignment & Security Economics: TCO of security tools, business enablement'
    ],
    toolsAndTech: ['Archi / Enterprise Architect', 'Lucidchart / Visio', 'AWS Organizations / Azure Management Groups', 'HashiCorp Vault Enterprise', 'NIST SP 800-207'],
    studyMethodology: {
      stage1Theory: 'Study SABSA business-driven security architecture matrix, NIST SP 800-207, and zero trust reference architectures.',
      stage2HandsOn: 'Design an end-to-end multi-region cloud landing zone architecture incorporating perimeter defense, centralized logging, and KMS.',
      stage3Simulation: 'Present an architecture trade-off proposal to an executive board: balancing developer agility against strict data compliance.',
      stage4Validation: 'Author an Enterprise Zero Trust Migration Roadmap outlining a 3-year transformation program.'
    },
    weeklySchedule: [
      { week: 1, title: 'Enterprise Frameworks & SABSA', focus: 'SABSA 6-layer matrix, business attribute profiling, aligning with TOGAF.' },
      { week: 2, title: 'Zero Trust Reference Architecture', focus: 'NIST SP 800-207, Policy Decision Points (PDP) and Policy Enforcement Points (PEP).' },
      { week: 3, title: 'Hybrid Cloud & Network Architecture', focus: 'Hub-and-spoke VPCs, software-defined perimeters, microsegmentation.' },
      { week: 4, title: 'Data Security & Cryptographic Architecture', focus: 'HSM integration, enterprise KMS, tokenization, database field encryption.' }
    ],
    recommendedCerts: ['ISC2 Information Systems Security Architecture Professional (CISSP-ISSAP)', 'SABSA Chartered Security Architect (SCF)', 'AWS Certified Solutions Architect'],
    aiMentorPrompt: 'How do you design a Zero Trust Architecture using NIST SP 800-207 for an enterprise with hybrid on-premise and multi-cloud systems?',
    mappedAppAction: { type: 'course', id: 'course-defensive', label: 'Study Enterprise Architecture' }
  },

  // ==========================================
  // 3. SPECIALIZED DOMAINS (9 Domains)
  // ==========================================
  {
    id: 'web-security',
    title: 'Web Security',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 6,
    difficulty: 'Intermediate',
    summary: 'Deep-dive into modern web application vulnerabilities, exploitation mechanisms, browser security models, and robust defense controls.',
    coreConcepts: [
      'OWASP Top 10 (2021/2025): Broken Access Control, Cryptographic Failures, Injection, Insecure Design',
      'SQL Injection (SQLi): In-band (UNION), Error-based, Blind (Boolean/Time-based), Second-order',
      'Cross-Site Scripting (XSS): Stored, Reflected, DOM-based, CSP bypasses, cookie theft',
      'Server-Side Request Forgery (SSRF) & Blind SSRF via DNS rebinding and cloud metadata endpoints',
      'Cross-Site Request Forgery (CSRF) & SameSite cookie attributes (Strict, Lax, None)',
      'HTTP Request Smuggling, Cross-Origin Resource Sharing (CORS) misconfigurations, Clickjacking'
    ],
    toolsAndTech: ['Burp Suite Professional', 'OWASP ZAP', 'SQLmap', 'ffuf', 'Browser DevTools', 'Postman'],
    studyMethodology: {
      stage1Theory: 'Study HTTP/1.1 and HTTP/2 RFCs, Same-Origin Policy (SOP), Content Security Policy (CSP), and browser sandbox security.',
      stage2HandsOn: 'Solve 30+ PortSwigger Web Security Academy labs covering SQLi, XSS, and SSRF.',
      stage3Simulation: 'Exploit and then remediate a multi-stage web challenge involving blind SQLi leading to administrative takeover.',
      stage4Validation: 'Implement strict Content Security Policy (CSP) headers and parameterized queries to eliminate all XSS and SQLi vulnerabilities.'
    },
    weeklySchedule: [
      { week: 1, title: 'HTTP, Browser Security & Burp Mastery', focus: 'SOP, CORS, cookie attributes, configuring Burp Suite proxy and repeater.' },
      { week: 2, title: 'SQL Injection Deep-Dive', focus: 'UNION attacks, Blind Boolean/Time injection, second-order SQLi, mitigation.' },
      { week: 3, title: 'XSS & Client-Side Attacks', focus: 'Reflected, Stored, DOM XSS, cookie stealing, CSP bypasses, DOM clobbering.' },
      { week: 4, title: 'SSRF, CSRF & Access Control', focus: 'AWS metadata extraction, bypassing IP filters, CSRF tokens, IDOR validation.' }
    ],
    recommendedCerts: ['PortSwigger Certified Web Security Practitioner (BSCP)', 'eWPTX (eLearnSecurity Web Application Penetration Tester eXtreme)'],
    aiMentorPrompt: 'Explain how Content Security Policy (CSP) nonces work to mitigate Cross-Site Scripting (XSS), and how inline eval scripts weaken it.',
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Practice Web Testing Sandbox' }
  },
  {
    id: 'api-security',
    title: 'API Security',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 5,
    difficulty: 'Intermediate',
    summary: 'Specialize in testing and securing REST, GraphQL, and gRPC APIs against authorization flaws, mass assignment, and data leakage.',
    coreConcepts: [
      'OWASP API Security Top 10 (2023): Broken Object Level Authorization (BOLA), Broken Object Property Level Authorization',
      'BOLA / IDOR in APIs: Tampering with numeric and UUID object IDs in REST endpoints',
      'Mass Assignment: Modifying unauthorized object attributes (e.g. is_admin: true)',
      'GraphQL Vulnerabilities: Introspection queries, batching attacks, deep recursion denial of service',
      'JSON Web Token (JWT) Attacks: Alg: none, weak secret cracking, key confusion attacks (RS256 vs HS256)',
      'API Gateways & Rate Limiting: Token buckets, schema validation, mutual TLS (mTLS)'
    ],
    toolsAndTech: ['Postman', 'Burp Suite (API extensions)', 'InQL (GraphQL Scanner)', 'jwt_tool', 'Kiterunner', 'Swagger / OpenAPI'],
    studyMethodology: {
      stage1Theory: 'Learn RESTful API principles, GraphQL AST structures, and RFC 7519 JSON Web Token specification.',
      stage2HandsOn: 'Analyze a target API with Kiterunner to discover hidden legacy endpoints; test for BOLA using multi-user tokens.',
      stage3Simulation: 'Exploit a weak HMAC secret on a JWT using hashcat; forge an administrative signature to access confidential records.',
      stage4Validation: 'Deploy an API gateway rule implementing strict OpenAPI schema validation and rate-limiting.'
    },
    weeklySchedule: [
      { week: 1, title: 'API Protocols & OWASP API Top 10', focus: 'REST vs GraphQL vs gRPC, Postman automation, Swagger/OpenAPI documentation.' },
      { week: 2, title: 'BOLA & Authorization Flaws', focus: 'Testing multi-tenant boundaries, vertical/horizontal privilege escalation in APIs.' },
      { week: 3, title: 'JWT Vulnerabilities & Crypto Flaws', focus: 'Tampering header alg, brute-forcing secrets, cracking RS256/HS256 misconfigs.' },
      { week: 4, title: 'GraphQL Security & Defenses', focus: 'Introspection queries, circular query DoS, implementing query depth limits.' }
    ],
    recommendedCerts: ['APIsec Certified Practitioner', 'PortSwigger BSCP'],
    aiMentorPrompt: 'Why is BOLA (Broken Object Level Authorization) the #1 vulnerability in the OWASP API Top 10, and how do you fix it in code?',
    mappedAppAction: { type: 'course', id: 'course-fundamentals', label: 'Study API Security Fundamentals' }
  },
  {
    id: 'cloud-security-domain',
    title: 'Cloud Security',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 6,
    difficulty: 'Intermediate',
    summary: 'Cloud-native defense across Amazon Web Services, Microsoft Azure, and Google Cloud Platform, including container and serverless security.',
    coreConcepts: [
      'Multi-Cloud Security Architecture: AWS vs Azure vs GCP security comparisons',
      'Cloud Identity Federation & Workload Identity: AWS IAM Roles Anywhere, GCP Workload Identity',
      'Serverless Security: AWS Lambda permissions, event injection, cold start attack vectors',
      'Cloud Storage Forensics: S3 server access logs, Azure Blob storage auditing, GCP audit trails',
      'Container Escape Techniques & Linux Kernel Namespaces / cgroups isolation',
      'Kubernetes Cluster Hardening: CIS Kubernetes Benchmark, etcd encryption at rest'
    ],
    toolsAndTech: ['Pacu (AWS exploitation framework)', 'Prowler', 'Cloudsplaining', 'Trivy', 'Kubescape', 'AWS KMS'],
    studyMethodology: {
      stage1Theory: 'Study cloud control planes, identity provider integrations, and cloud-native logging architectures.',
      stage2HandsOn: 'Audit an AWS infrastructure using Pacu to detect IAM privilege escalation vectors (e.g. iam:CreatePolicyVersion).',
      stage3Simulation: 'Simulate a compromised AWS EC2 instance attempting to query the link-local metadata address (169.254.169.254).',
      stage4Validation: 'Enforce IMDSv2 across an entire cloud organization using AWS Service Control Policies (SCPs).'
    },
    weeklySchedule: [
      { week: 1, title: 'Cloud Infrastructure & IAM Deep-Dive', focus: 'IAM trust policies, cross-account assumptions, least privilege automation.' },
      { week: 2, title: 'Cloud Data Protection & Storage', focus: 'S3 bucket lockdowns, KMS envelope encryption, cloud data loss prevention.' },
      { week: 3, title: 'Containers & Kubernetes Security', focus: 'K8s admission controllers, namespace isolation, scanning container images.' },
      { week: 4, title: 'Cloud Auditing & Attack Simulation', focus: 'Pacu exploitation framework, CloudTrail threat detection, Prowler compliance.' }
    ],
    recommendedCerts: ['AWS Certified Security - Specialty', 'Google Professional Cloud Security Engineer', 'CCSP (Certified Cloud Security Professional)'],
    aiMentorPrompt: 'Explain how SSRF can be leveraged to steal AWS IAM credentials via the metadata service, and how IMDSv2 blocks this attack.',
    mappedAppAction: { type: 'course', id: 'course-cloud-iam', label: 'Explore Cloud Security Module' }
  },
  {
    id: 'mobile-security',
    title: 'Mobile Security (Android & iOS)',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 6,
    difficulty: 'Advanced',
    summary: 'Analyze and test mobile application binaries (APK, IPA), perform dynamic instrumentation with Frida, and audit mobile APIs.',
    coreConcepts: [
      'Android Security Model: Linux sandbox, AndroidManifest.xml, Intents, Activities, Content Providers, Keystore',
      'iOS Security Model: App Sandbox, Keychain, Code Signing, Data Protection API',
      'Static APK Analysis: Decompiling with JADX, inspecting smali code, detecting hardcoded secrets',
      'Dynamic Instrumentation with Frida & Objection: SSL Pinning bypass, root/jailbreak detection bypass',
      'Local Data Storage: SQLite databases, SharedPreferences, unencrypted caching of sensitive PII',
      'OWASP Mobile Application Security Verification Standard (MASVS)'
    ],
    toolsAndTech: ['JADX-GUI', 'Frida', 'Objection', 'MobSF (Mobile Security Framework)', 'Android Studio Emulator', 'Burp Suite'],
    studyMethodology: {
      stage1Theory: 'Study Android IPC mechanisms, iOS entitlements, and the OWASP MASVS requirements.',
      stage2HandsOn: 'Decompile an Android APK using JADX; locate hardcoded API tokens and review exported activities.',
      stage3Simulation: 'Hook a mobile banking app using Frida and Objection to bypass SSL pinning and inspect encrypted API traffic.',
      stage4Validation: 'Implement Android Keystore hardware-backed encryption for all local cached credentials.'
    },
    weeklySchedule: [
      { week: 1, title: 'Mobile OS Architecture & OWASP MASVS', focus: 'Android vs iOS sandboxing, permission models, application signing.' },
      { week: 2, title: 'Static Reverse Engineering (APK/IPA)', focus: 'JADX decompiler, smali patching, MobSF automated vulnerability reports.' },
      { week: 3, title: 'Dynamic Instrumentation with Frida', focus: 'Frida scripting, function hooking, bypassing root detection and certificate pinning.' },
      { week: 4, title: 'Secure Mobile Storage & Keystore', focus: 'Android Keystore API, iOS Keychain, biometric authentication implementations.' }
    ],
    recommendedCerts: ['eLearnSecurity Mobile Application Penetration Tester (eMAPT)', 'GIAC Mobile Device Security Analyst (GMOB)'],
    aiMentorPrompt: 'How does SSL Pinning work in mobile apps and how does Frida hook TLS validation methods in memory to bypass it?',
    mappedAppAction: { type: 'course', id: 'course-offensive', label: 'Study Reverse Engineering' }
  },
  {
    id: 'ai-security',
    title: 'AI & LLM Security',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 5,
    difficulty: 'Intermediate',
    summary: 'Secure artificial intelligence systems, large language models (LLMs), RAG pipelines, and agentic workflows against adversarial attacks.',
    coreConcepts: [
      'OWASP Top 10 for Large Language Models (2025): Prompt Injection, Insecure Output Handling, Training Data Poisoning',
      'Direct vs Indirect Prompt Injection (via malicious web pages, emails, or uploaded documents)',
      'RAG (Retrieval-Augmented Generation) Security: Vector database poisoning, unauthorized document retrieval',
      'Model Inversion & Membership Inference: Extracting confidential training data from model weights',
      'Adversarial Attacks on Machine Learning: Evasion attacks, perturbation, jailbreaking guardrails',
      'AI Agent Security: Tool-call permission boundaries, sandbox execution of LLM-generated code'
    ],
    toolsAndTech: ['Garak (LLM vulnerability scanner)', 'PyRIT (Python Risk Identification Tool)', 'Llama-Guard', 'LangChain Security', 'Promptfoo'],
    studyMethodology: {
      stage1Theory: 'Understand transformer attention mechanisms, tokenization, system prompts vs user prompts, and guardrail architectures.',
      stage2HandsOn: 'Run Garak against an open-source LLM endpoint to identify prompt injection vulnerabilities and data leakage.',
      stage3Simulation: 'Craft an indirect prompt injection attack hidden inside a PDF document that tricks a summarizer into exfiltrating session history.',
      stage4Validation: 'Implement dual-LLM guardrail architectures and strict JSON schema output validation for all agent tool calls.'
    },
    weeklySchedule: [
      { week: 1, title: 'AI Foundations & OWASP LLM Top 10', focus: 'Generative AI threat model, prompt injection, system prompt leakage.' },
      { week: 2, title: 'Indirect Prompt Injection & RAG Security', focus: 'Poisoning search indices, vector database access control, document injection.' },
      { week: 3, title: 'Jailbreaks & Guardrail Testing', focus: 'Adversarial suffixes, Garak scanning, Llama Guard and NeMo guardrails.' },
      { week: 4, title: 'AI Agent & Tool-Execution Security', focus: 'Sandboxing Python code executors, human-in-the-loop approvals, least privilege tools.' }
    ],
    recommendedCerts: ['Certified AI Security Professional (CAISP)', 'Google Cloud Generative AI Engineer'],
    aiMentorPrompt: 'Explain indirect prompt injection and give an example of how an attacker can manipulate an AI assistant reading an email.',
    mappedAppAction: { type: 'course', id: 'course-fundamentals', label: 'Explore AI Security Core' }
  },
  {
    id: 'iot-security',
    title: 'IoT Security (Internet of Things)',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 6,
    difficulty: 'Advanced',
    summary: 'Hardware, firmware, and wireless protocol security across connected consumer and enterprise smart devices.',
    coreConcepts: [
      'Hardware Debug Interfaces: UART, JTAG, SPI, I2C discovery and pinout identification',
      'Firmware Extraction & Analysis: Desoldering flash chips, SPI dumping, unpacking with Binwalk',
      'Embedded Linux Reversing: Busybox environments, discovering backdoors, hardcoded root passwords',
      'IoT Communication Protocols: MQTT (broker security, lack of auth), CoAP, Zigbee, BLE (Bluetooth Low Energy)',
      'Secure Boot & Firmware Signing in Microcontrollers (ARM Cortex-M, ESP32)',
      'OWASP IoT Top 10: Weak passwords, insecure network services, unencrypted storage'
    ],
    toolsAndTech: ['Binwalk', 'QEMU (firmware emulation)', 'Ghidra', 'Bus Pirate / Logic Analyzer', 'Wireshark', 'Mosquitto (MQTT testing)'],
    studyMethodology: {
      stage1Theory: 'Study embedded system architectures, microcontroller memory maps, and hardware bus protocols.',
      stage2HandsOn: 'Extract filesystem components from a router firmware bin file using Binwalk; emulate the web server using QEMU.',
      stage3Simulation: 'Intercept unencrypted MQTT telemetry packets broadcast from a smart sensor and inject fraudulent control commands.',
      stage4Validation: 'Design a hardware-backed secure boot configuration with encrypted flash storage for an IoT sensor.'
    },
    weeklySchedule: [
      { week: 1, title: 'IoT Architecture & Threat Model', focus: 'Hardware vs firmware vs network layers, OWASP IoT Top 10.' },
      { week: 2, title: 'Firmware Extraction & Analysis', focus: 'Binwalk extraction, cramfs/squashfs filesystems, hunting hardcoded keys.' },
      { week: 3, title: 'Hardware Hacking Primitives', focus: 'UART console discovery, logic analyzers, dumping SPI flash chips.' },
      { week: 4, title: 'IoT Protocols & Secure Boot', focus: 'MQTT authentication, BLE sniffing, cryptographic signature verification at boot.' }
    ],
    recommendedCerts: ['Certified IoT Security Practitioner (CIoTSP)', 'Practical IoT Hacking (concepts)'],
    aiMentorPrompt: 'How do security researchers use UART pins on a circuit board to gain a root root shell on an IoT device?',
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Practice Network Protocols' }
  },
  {
    id: 'ot-ics-security',
    title: 'OT/ICS Security (Operational Technology)',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 6,
    difficulty: 'Advanced',
    summary: 'Defend industrial control systems (ICS), SCADA networks, PLCs, and critical infrastructure facilities against catastrophic cyber incidents.',
    coreConcepts: [
      'The Purdue Enterprise Reference Architecture (Levels 0 through 5)',
      'Industrial Protocols: Modbus TCP/IP, DNP3, EtherNet/IP, PROFINET, OPC UA',
      'Programmable Logic Controllers (PLCs), Remote Terminal Units (RTUs), Human-Machine Interfaces (HMIs)',
      'Safety Instrumented Systems (SIS) & Fail-Safe Engineering Principles',
      'Cyber-Physical Threat Actors (Stuxnet, Industroyer, Triton/Trisis case studies)',
      'Air-gapped network defense, unidirectional security gateways (data diodes), IEC 62443 standard'
    ],
    toolsAndTech: ['Wireshark (ICS dissectors)', 'GrassMarlin', 'ModbusPal', 'ScadaBR', 'Nozomi / Claroty (concepts)', 'Snyk'],
    studyMethodology: {
      stage1Theory: 'Study the Purdue Model, differences between IT and OT security (Safety & Availability > Confidentiality).',
      stage2HandsOn: 'Simulate a Modbus TCP industrial environment; dissect coils, holding registers, and function codes in Wireshark.',
      stage3Simulation: 'Analyze the Triton/Trisis attack lifecycle: trace how attackers targeted Triconex Safety Instrumented Systems.',
      stage4Validation: 'Architect an IEC 62443-compliant defense-in-depth zone and conduit network model for a municipal water treatment facility.'
    },
    weeklySchedule: [
      { week: 1, title: 'Purdue Model & ICS Primitives', focus: 'Safety vs availability, Levels 0-5, PLCs, RTUs, HMIs, air-gap realities.' },
      { week: 2, title: 'Industrial Protocols Deep-Dive', focus: 'Modbus TCP function codes, DNP3, lack of authentication, packet dissection.' },
      { week: 3, title: 'Notable OT Breaches & TTPs', focus: 'Stuxnet, Ukraine Grid attacks, Triton malware, MITRE ATT&CK for ICS.' },
      { week: 4, title: 'Defenses & IEC 62443 Compliance', focus: 'Zones and conduits, network data diodes, passive ICS network monitoring.' }
    ],
    recommendedCerts: ['Global Industrial Cybersecurity Professional (GICSP)', 'Certified SCADA Security Architect (CSSA)'],
    aiMentorPrompt: 'Why are traditional active port scanners like Nmap dangerous to run on legacy OT/ICS networks, and what passive alternatives exist?',
    mappedAppAction: { type: 'scenario', id: 'scenario-apt', label: 'Triage Critical Infrastructure Breach' }
  },
  {
    id: 'cryptography',
    title: 'Applied Cryptography',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 6,
    difficulty: 'Intermediate',
    summary: 'Master mathematical security primitives, modern symmetric and asymmetric encryption, hashing, PKI, and post-quantum transitions.',
    coreConcepts: [
      'Symmetric Encryption: Block ciphers (AES-128/256), modes of operation (CBC, CTR, GCM - Galois/Counter Mode)',
      'Asymmetric Encryption & Key Exchange: RSA, Diffie-Hellman, Elliptic Curve Cryptography (ECC / ECDH, Ed25519)',
      'Cryptographic Hash Functions & MACs: SHA-256/SHA-3, HMAC, Password hashing (Argon2id, bcrypt, scrypt)',
      'Public Key Infrastructure (PKI): X.509 certificates, Certificate Revocation Lists (CRLs), OCSP Stapling',
      'Common Cryptographic Flaws: ECB penguin, IV reuse in GCM, padding oracle attacks, weak PRNGs',
      'Post-Quantum Cryptography (PQC): NIST standards (ML-KEM / Kyber, ML-DSA / Dilithium)'
    ],
    toolsAndTech: ['OpenSSL CLI', 'CyberChef', 'Python Cryptography library', 'Hashcat', 'GnuPG'],
    studyMethodology: {
      stage1Theory: 'Study mathematical fundamentals: modular arithmetic, discrete logarithms, and entropy requirements.',
      stage2HandsOn: 'Use OpenSSL to manually generate private keys, CSRs, self-signed certificates, and encrypt files with AES-256-GCM.',
      stage3Simulation: 'Demonstrate a CBC padding oracle attack against an unauthenticated encryption endpoint using CyberChef or Python.',
      stage4Validation: 'Audit an enterprise cipher suite configuration to remove legacy TLS 1.0/1.1 and deprecated RC4/3DES ciphers.'
    },
    weeklySchedule: [
      { week: 1, title: 'Symmetric Ciphers & Modes', focus: 'AES architecture, ECB vs CBC vs GCM, authenticated encryption with associated data (AEAD).' },
      { week: 2, title: 'Asymmetric Crypto & ECC', focus: 'RSA mathematics, Elliptic Curve cryptography, Diffie-Hellman key exchange.' },
      { week: 3, title: 'Hashes, MACs & Password Storage', focus: 'Collision resistance, HMAC verification, salt and pepper, Argon2id vs PBKDF2.' },
      { week: 4, title: 'PKI, TLS & Quantum Era', focus: 'X.509 certificate chains, OCSP, Post-Quantum Cryptography (Kyber/Dilithium).' }
    ],
    recommendedCerts: ['EC-Council Certified Encryption Specialist (ECES)', 'GIAC Critical Controls Certification (GCCC)'],
    aiMentorPrompt: 'Explain why AES-GCM (Galois/Counter Mode) is preferred over AES-CBC, and what catastrophe occurs if an initialization vector (IV) is reused in GCM.',
    mappedAppAction: { type: 'lab', id: 'lab-port-scan', label: 'Explore Cryptographic Primitives' }
  },
  {
    id: 'security-automation',
    title: 'Security Automation & SOAR',
    pillar: 'specialized-domains',
    pillarLabel: 'Specialized Domains',
    estimatedWeeks: 5,
    difficulty: 'Intermediate',
    summary: 'Build automated threat enrichment pipelines, custom security tooling in Python and Go, and SOAR playbooks for rapid incident response.',
    coreConcepts: [
      'Security Orchestration, Automation, and Response (SOAR): Triggers, actions, playbooks, approval gates',
      'Open-Source SOAR platforms: Shuffle, Tines, n8n for cybersecurity workflows',
      'Automating Threat Intelligence Enrichment: Querying VirusTotal, Shodan, AbuseIPDB, URLScan via APIs',
      'Custom Security Tooling in Python & Go: Developing CLI utilities for reconnaissance and log auditing',
      'Webhook Listeners & ChatOps: Slack / Microsoft Teams alerting and interactive incident response buttons',
      'Automated Isolation & Containment: Interfacing with EDR and firewall APIs to block malicious actors in seconds'
    ],
    toolsAndTech: ['Python', 'Golang', 'Shuffle SOAR', 'Tines', 'FastAPI', 'Docker', 'Slack / Teams Webhooks'],
    studyMethodology: {
      stage1Theory: 'Learn event-driven architectures, RESTful API consumption, rate-limiting, and error retry patterns.',
      stage2HandsOn: 'Build a Python FastAPI microservice that receives phishing alerts and automatically enriches all extracted domains.',
      stage3Simulation: 'Configure a Shuffle/Tines SOAR playbook: when a high-priority alert triggers, automatically isolate the workstation.',
      stage4Validation: 'Write a high-performance Go CLI utility that scans thousands of subdomains and outputs live JSON telemetry.'
    },
    weeklySchedule: [
      { week: 1, title: 'Automation Architecture & APIs', focus: 'REST APIs, API authentication tokens, webhook handlers in Python.' },
      { week: 2, title: 'SOAR Playbooks & Shuffle', focus: 'Visual workflow builders, connecting SIEM alerts to automated triage.' },
      { week: 3, title: 'Threat Intel & ChatOps Pipelines', focus: 'VirusTotal/Shodan enrichment, Slack/Discord notification bots with action buttons.' },
      { week: 4, title: 'Custom Tooling in Go / Python', focus: 'Building fast concurrent network tools, distributing standalone binaries.' }
    ],
    recommendedCerts: ['GIAC Cloud Security Automation (GCSA)', 'SANS SEC540'],
    aiMentorPrompt: 'How do you design a SOAR playbook that safely automates host isolation without accidentally locking out mission-critical servers?',
    mappedAppAction: { type: 'course', id: 'course-defensive', label: 'Study Automated Defenses' }
  }
];

export const ROADMAP_PILLARS: RoadmapPillar[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    badge: '6 Core Modules',
    description: 'The fundamental prerequisites every cybersecurity professional must master before selecting a specialization.',
    topics: STUDY_ROADMAP_DATA.filter(t => t.pillar === 'foundations')
  },
  {
    id: 'career-paths',
    title: 'Career Paths',
    badge: '17 Industry Roles',
    description: 'Comprehensive, role-specific career roadmaps with targeted skills, tools, and industry certifications.',
    topics: STUDY_ROADMAP_DATA.filter(t => t.pillar === 'career-paths')
  },
  {
    id: 'specialized-domains',
    title: 'Specialized Domains',
    badge: '9 Advanced Fields',
    description: 'Deep technical specializations across emerging technological frontiers from Web & Cloud to AI, IoT, and OT/ICS.',
    topics: STUDY_ROADMAP_DATA.filter(t => t.pillar === 'specialized-domains')
  }
];
