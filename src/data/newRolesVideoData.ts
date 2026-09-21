import { CuratedVideo } from './curatedVideoData';

// =========================================================================
// 9. THREAT INTELLIGENCE ANALYST (15 Topics)
// Base Video: "Intelligence Architect: OSINT and the STIX-TAXII Framework | Complete Cyber Threat Intelligence Masterclass"
// Link: https://www.youtube.com/watch?v=0b_mTLm-VMA
// =========================================================================
export const THREAT_INTEL_VIDEOS_DATA: CuratedVideo[] = [
  {
    id: 'cti-vid-1',
    topicNumber: 1,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 1,
    sectionTitle: 'CTI Foundations',
    topicName: 'Threat Intelligence Fundamentals',
    videoTitle: 'CTI Masterclass: Cyber Threat Intelligence Fundamentals',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '45 min',
    description: 'Foundations of Cyber Threat Intelligence (CTI): Strategic, Operational, Tactical, and Technical intelligence levels, and their role in adversary disruption.',
    keyTakeaways: [
      'Strategic vs Operational vs Tactical vs Technical Threat Intelligence definitions',
      'The Diamond Model of Intrusion Analysis (Adversary, Capability, Infrastructure, Victim)',
      'Evaluating intelligence reliability and credibility using the Admiralty Code'
    ]
  },
  {
    id: 'cti-vid-2',
    topicNumber: 2,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 1,
    sectionTitle: 'CTI Foundations',
    topicName: 'Intelligence Lifecycle',
    videoTitle: 'CTI Masterclass: The Threat Intelligence Lifecycle',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '38 min',
    description: 'The 6 phases of the CTI lifecycle: Planning & Direction, Collection, Processing, Analysis & Production, Dissemination, and Feedback loops.',
    keyTakeaways: [
      'Establishing Priority Intelligence Requirements (PIRs) and Specific Intelligence Requirements (SIRs)',
      'Data normalization and entity extraction from raw telemetry feeds',
      'Closing the loop: gathering consumer feedback from SOC and incident response teams'
    ]
  },
  {
    id: 'cti-vid-3',
    topicNumber: 3,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 2,
    sectionTitle: 'Collection & OSINT',
    topicName: 'OSINT Fundamentals',
    videoTitle: 'OSINT & STIX-TAXII: Open Source Intelligence Framework',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '50 min',
    description: 'Open Source Intelligence (OSINT) methodology: passive DNS discovery, certificate transparency logs, Shodan/Censys querying, and dark web forum monitoring.',
    keyTakeaways: [
      'Passive DNS (pDNS) correlation: tracking threat actor bulletproof hosting infrastructure over time',
      'SSL/TLS certificate fingerprinting and JARM hashes for discovering hidden C2 servers',
      'Operational Security (OPSEC) for intelligence analysts when querying adversary assets'
    ]
  },
  {
    id: 'cti-vid-4',
    topicNumber: 4,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 2,
    sectionTitle: 'Collection & OSINT',
    topicName: 'Indicators of Compromise (IOCs)',
    videoTitle: 'CTI Masterclass: Indicators of Compromise (IOCs)',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '32 min',
    description: 'Atomic, computed, and behavioral IOCs: managing MD5/SHA256 hashes, IP address reputation, malicious domains, and confidence scoring.',
    keyTakeaways: [
      'Atomic indicators (IPs, emails) vs Computed indicators (hashes) vs Behavioral artifacts',
      'The decay rate of IOCs and automated indicator expiration policies (TTL)',
      'False-positive reduction and confidence scoring formulas in SIEM/TIP integrations'
    ]
  },
  {
    id: 'cti-vid-5',
    topicNumber: 5,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 2,
    sectionTitle: 'Collection & OSINT',
    topicName: 'Indicators of Attack (IOAs)',
    videoTitle: 'CTI Masterclass: Indicators of Attack (IOAs)',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '30 min',
    description: 'IOCs vs IOAs: shifting from retrospective forensics to real-time intent and behavioral detection before damage occurs.',
    keyTakeaways: [
      'Why IOCs show what happened in the past while IOAs reveal adversary intent in progress',
      'Detecting credential dumping (LSASS access) and lateral movement as durable IOAs',
      'Authoring real-time behavioral correlation rules using IOA patterns'
    ]
  },
  {
    id: 'cti-vid-6',
    topicNumber: 6,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 3,
    sectionTitle: 'Taxonomies & Standards',
    topicName: 'MITRE ATT&CK',
    videoTitle: 'CTI Masterclass: MITRE ATT&CK for Threat Intelligence',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '42 min',
    description: 'Applying the MITRE ATT&CK framework in threat intelligence: mapping adversary behaviors, generating ATT&CK Navigator heatmaps, and threat profile comparison.',
    keyTakeaways: [
      'Mapping unstructured incident reports to standardized ATT&CK Techniques and Sub-techniques',
      'Building threat actor group profiles (e.g., APT29, FIN7, Sandworm) in ATT&CK Navigator',
      'Identifying visibility blind spots across security monitoring telemetry'
    ]
  },
  {
    id: 'cti-vid-7',
    topicNumber: 7,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 3,
    sectionTitle: 'Taxonomies & Standards',
    topicName: 'STIX 2.x',
    videoTitle: 'STIX & TAXII: Structured Threat Information Expression (STIX 2.1)',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '40 min',
    description: 'Deep dive into STIX 2.1 JSON specifications: Domain Objects (SDOs), Relationship Objects (SROs), Cyber-observable Objects (SCOs), and automated schema validation.',
    keyTakeaways: [
      'STIX Domain Objects: Threat-Actor, Malware, Attack-Pattern, Campaign, Vulnerability',
      'STIX Relationship Objects: linking Threat Actor "uses" Malware "targets" Identity',
      'Serializing and parsing STIX 2.1 JSON packages programmatically in Python'
    ]
  },
  {
    id: 'cti-vid-8',
    topicNumber: 8,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 3,
    sectionTitle: 'Taxonomies & Standards',
    topicName: 'TAXII 2.x',
    videoTitle: 'STIX & TAXII: Trusted Automated eXchange of Intelligence Information',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '35 min',
    description: 'TAXII 2.1 protocol architecture: RESTful API channels, Collections, API Roots, polling configurations, and sharing communities (ISACs).',
    keyTakeaways: [
      'TAXII 2.1 server architecture: discovery endpoints, collections, and status objects',
      'Configuring automated TAXII clients to ingest threat feeds directly into SIEM/TIP',
      'Traffic Light Protocol (TLP 2.0): TLP:RED, TLP:AMBER+STRICT, TLP:AMBER, TLP:GREEN, TLP:CLEAR'
    ]
  },
  {
    id: 'cti-vid-9',
    topicNumber: 9,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 4,
    sectionTitle: 'Profiling & Analysis',
    topicName: 'Threat Actor Profiling',
    videoTitle: 'CTI Masterclass: Threat Actor Profiling & Campaign Tracking',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '48 min',
    description: 'Adversary attribution methodologies: nation-state APTs vs cybercriminal ransomware syndicates vs hacktivists; tracking motives, infrastructure, and playbooks.',
    keyTakeaways: [
      'Attribution rigor: distinguishing false flag operations from genuine adversary signatures',
      'Tracking cybercrime ransomware affiliates (RaaS) and Initial Access Brokers (IABs)',
      'Maintaining longitudinal threat actor dossiers with victimology and targeting trends'
    ]
  },
  {
    id: 'cti-vid-10',
    topicNumber: 10,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 4,
    sectionTitle: 'Profiling & Analysis',
    topicName: 'Malware Intelligence',
    videoTitle: 'CTI Masterclass: Malware Intelligence & Threat Signatures',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '44 min',
    description: 'Analyzing malware trends, commodity loaders (Qakbot, Emotet, TrickBot), infostealers (RedLine, Lumma), and generating actionable YARA/YARA-L rules.',
    keyTakeaways: [
      'Commodity malware loader ecosystems and the dropper-to-ransomware execution pipeline',
      'Extracting C2 configuration files from memory dumps using automated parsers',
      'Writing cross-platform YARA detection rules based on unique byte sequences and strings'
    ]
  },
  {
    id: 'cti-vid-11',
    topicNumber: 11,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 4,
    sectionTitle: 'Profiling & Analysis',
    topicName: 'Vulnerability Intelligence',
    videoTitle: 'CTI Masterclass: Vulnerability Intelligence & Exploit Tracking',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '36 min',
    description: 'Prioritizing vulnerabilities beyond CVSS: CISA Known Exploited Vulnerabilities (KEV), Exploit Prediction Scoring System (EPSS), and underground zero-day chatter.',
    keyTakeaways: [
      'CVSS vs EPSS vs CISA KEV: focusing remediation on actively weaponized CVEs',
      'Monitoring underground forums and proof-of-concept (PoC) exploit release timelines',
      'Estimating weaponization timeframes: from public disclosure to automated scanning'
    ]
  },
  {
    id: 'cti-vid-12',
    topicNumber: 12,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 5,
    sectionTitle: 'Platforms & Reporting',
    topicName: 'Threat Intelligence Platforms',
    videoTitle: 'CTI Masterclass: Threat Intelligence Platforms (TIPs)',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '38 min',
    description: 'Architecture of modern TIPs: ingesting multi-source feeds, deduplication, automated correlation, enrichment, and pushing actionable blocklists to firewalls and EDRs.',
    keyTakeaways: [
      'Core TIP components: Ingestion, Normalization, Correlation, Scoring, Dissemination',
      'Integration patterns: feeding high-fidelity indicators into Palo Alto, CrowdStrike, and Sentinel',
      'Measuring TIP return on investment (ROI): alert fidelity increase and dwell time reduction'
    ]
  },
  {
    id: 'cti-vid-13',
    topicNumber: 13,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 5,
    sectionTitle: 'Platforms & Reporting',
    topicName: 'MISP',
    videoTitle: 'CTI Masterclass: Malware Information Sharing Platform (MISP)',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '45 min',
    description: 'Hands-on MISP administration: event creation, adding attributes, galaxies, taxonomies, correlation graphs, and synchronizing MISP instances across trust groups.',
    keyTakeaways: [
      'MISP event creation, attribute tagging, and correlation engines',
      'Using MISP Galaxies (threat actor, cluster, tool) and Taxonomies (TLP, admiralty-scale)',
      'Exporting MISP feeds in Suricata, Snort, and STIX formats for perimeter defenses'
    ]
  },
  {
    id: 'cti-vid-14',
    topicNumber: 14,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 5,
    sectionTitle: 'Platforms & Reporting',
    topicName: 'OpenCTI',
    videoTitle: 'CTI Masterclass: OpenCTI Knowledge Graph Architecture',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '40 min',
    description: 'Exploring OpenCTI: GraphQL API, STIX 2.1 native database, automated connectors, visual knowledge graph exploration, and incident investigation.',
    keyTakeaways: [
      'OpenCTI GraphQL backend and STIX 2.1 compliance model',
      'Configuring automated connectors: MITRE, AlienVault OTX, VirusTotal, CISA KEV',
      'Navigating interactive knowledge graphs to discover non-obvious entity relationships'
    ]
  },
  {
    id: 'cti-vid-15',
    topicNumber: 15,
    trackId: 'threat-intel',
    trackTitle: 'Threat Intelligence Analyst',
    sectionNumber: 5,
    sectionTitle: 'Platforms & Reporting',
    topicName: 'Threat Intelligence Reports',
    videoTitle: 'CTI Masterclass: Authoring Threat Intelligence Reports',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    directVideoUrl: 'https://www.youtube.com/watch?v=0b_mTLm-VMA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0b_mTLm-VMA?rel=0',
    videoId: '0b_mTLm-VMA',
    channel: 'Cyber Threat Intelligence Academy',
    durationApprox: '36 min',
    description: 'Producing impactful intelligence products: executive summaries, technical advisories, flash alerts, estimating confidence levels, and actionable recommendations.',
    keyTakeaways: [
      'Writing for the C-Suite (strategic risk impact) vs SOC Analysts (actionable IOCs/TTPs)',
      'Structuring Threat Advisory reports: Executive Summary, Threat Overview, Impact, Mitigations',
      'Using Words of Estimative Probability (WEP) to convey uncertainty accurately'
    ]
  }
];

// =========================================================================
// 10. MALWARE ANALYST (20 Topics)
// Base Video: "Malware Analysis & Reverse Engineering Masterclass | Static, Dynamic Analysis, & IDA Pro"
// Link: https://www.youtube.com/watch?v=YlgduaC7XwI
// =========================================================================
export const MALWARE_ANALYST_VIDEOS_DATA: CuratedVideo[] = [
  {
    id: 'mal-vid-1',
    topicNumber: 1,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 1,
    sectionTitle: 'Fundamentals & Lab Setup',
    topicName: 'Malware Fundamentals',
    videoTitle: 'Malware Analysis Masterclass: Fundamentals of Malware',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '45 min',
    description: 'Core tenets of malware analysis: objectives, legal frameworks, ethics, and understanding binary compilation targets (C/C++, .NET, Golang, Rust).',
    keyTakeaways: [
      'Goals of malware analysis: attribution, capability assessment, IOC extraction, and signature creation',
      'Native binaries vs interpreted scripts vs intermediate language (.NET/Java)',
      'Establishing strict containment protocols to prevent accidental lab contagion'
    ]
  },
  {
    id: 'mal-vid-2',
    topicNumber: 2,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 1,
    sectionTitle: 'Fundamentals & Lab Setup',
    topicName: 'Types of Malware',
    videoTitle: 'Malware Analysis Masterclass: Taxonomy of Modern Malware',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '38 min',
    description: 'Comprehensive taxonomy: Ransomware, Banking Trojans, Infostealers, Droppers/Loaders, Rootkits, Botnets, and polymorphic cryptors.',
    keyTakeaways: [
      'Architectural differences: User-mode vs Kernel-mode rootkits',
      'The multi-tier cybercrime supply chain: Stagers -> Droppers -> Payloads',
      'Evasion characteristics of modern polymorphic and metamorphic malware'
    ]
  },
  {
    id: 'mal-vid-3',
    topicNumber: 3,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 1,
    sectionTitle: 'Fundamentals & Lab Setup',
    topicName: 'Malware Lifecycle',
    videoTitle: 'Malware Analysis Masterclass: The Malware Execution Lifecycle',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '35 min',
    description: 'Deconstructing the complete execution chain: initial delivery, environment fingerprinting, privilege escalation, persistence, and C2 callback.',
    keyTakeaways: [
      'Phases: Delivery -> Execution -> Anti-Analysis -> Persistence -> C2 Beacon -> Actions on Objectives',
      'Environmental keying: malware that only decrypts if joined to a target Active Directory domain',
      'Self-deletion and artifact scrubbing routines'
    ]
  },
  {
    id: 'mal-vid-4',
    topicNumber: 4,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 1,
    sectionTitle: 'Fundamentals & Lab Setup',
    topicName: 'Malware Analysis Lab',
    videoTitle: 'Malware Analysis Masterclass: Building an Isolated Analysis Lab',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '50 min',
    description: 'Setting up safe, isolated sandboxes: FlareVM, REMnux, host-only networking, INetSim fake Internet services, and clean snapshot management.',
    keyTakeaways: [
      'Configuring dual-VM sandbox: FlareVM (Windows victim) + REMnux (gateway simulator)',
      'Faking internet services with INetSim and PolarProxy for SSL interception',
      'Anti-VM detection hardening: modifying CPUID, registry flags, and MAC addresses'
    ]
  },
  {
    id: 'mal-vid-5',
    topicNumber: 5,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 2,
    sectionTitle: 'Static & Dynamic Triage',
    topicName: 'Static Analysis',
    videoTitle: 'Static & Dynamic Analysis: Static Analysis Techniques',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '42 min',
    description: 'Triage without executing code: file identification, calculating Shannon entropy to detect packing, PE headers, and import address table (IAT) inspection.',
    keyTakeaways: [
      'Detecting packers (UPX, Themida, VMProtect) via entropy analysis (>7.2 = encrypted/packed)',
      'Examining Import Address Tables (IAT): VirtualAlloc, WriteProcessMemory, CreateRemoteThread',
      'Inspecting embedded resources, digital certificate anomalies, and compilation timestamps'
    ]
  },
  {
    id: 'mal-vid-6',
    topicNumber: 6,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 2,
    sectionTitle: 'Static & Dynamic Triage',
    topicName: 'Dynamic Analysis',
    videoTitle: 'Static & Dynamic Analysis: Behavioral Sandbox Execution',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '48 min',
    description: 'Running malware in monitored sandboxes: tracking real-time filesystem changes (Procmon), network beacons (Wireshark), and registry keys (RegShot).',
    keyTakeaways: [
      'Mastering Process Monitor (Procmon) filtering: Process Name, Operation (CreateFile, RegSetValue)',
      'Capturing network traffic in Wireshark and simulating DNS responses using FakeDNS',
      'Comparing before/after system snapshots with RegShot to isolate persistent artifacts'
    ]
  },
  {
    id: 'mal-vid-7',
    topicNumber: 7,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 2,
    sectionTitle: 'Static & Dynamic Triage',
    topicName: 'Windows Internals',
    videoTitle: 'Malware Analysis Masterclass: Windows Internals for Analysts',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '46 min',
    description: 'Windows operating system internals: Process Environment Block (PEB), TEB, kernel mode vs user mode, handles, access tokens, and memory paging.',
    keyTakeaways: [
      'Traversing the PEB: BeingDebugged flag, NtGlobalFlag, and InLoadOrderModuleList',
      'User-mode (Ring 3) API calls transitioning to Kernel-mode (Ring 0) through SSDT/Syscalls',
      'Virtual memory structures: Page permissions (PAGE_EXECUTE_READWRITE) and memory maps'
    ]
  },
  {
    id: 'mal-vid-8',
    topicNumber: 8,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 3,
    sectionTitle: 'Binary Analysis',
    topicName: 'PE File Analysis',
    videoTitle: 'Malware Analysis Masterclass: Portable Executable (PE) File Format',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '52 min',
    description: 'Deep dive into DOS header, PE Signature, File Header, Optional Header, Section Headers (.text, .data, .rsrc), and exports/imports using PE-bear.',
    keyTakeaways: [
      'PE structure breakdown: e_lfanew pointer, Machine architecture, AddressOfEntryPoint',
      'Virtual vs Raw sizes: detecting code cave injections and hidden packed sections',
      'Parsing Export Directory and Import Address Table (IAT) with PE-bear and CFF Explorer'
    ]
  },
  {
    id: 'mal-vid-9',
    topicNumber: 9,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 3,
    sectionTitle: 'Binary Analysis',
    topicName: 'Strings & Hashes',
    videoTitle: 'Malware Analysis: Extracting Obfuscated Strings & Hashes',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '34 min',
    description: 'Deobfuscating strings: FLARE Obfuscated String Solver (FLOSS), XOR/Base64 decoding, SSDEEP fuzzy hashing, and imphash calculation.',
    keyTakeaways: [
      'Extracting stack strings and dynamically allocated strings using FLOSS',
      'SSDEEP fuzzy hashing: identifying malware code reuse and variants',
      'Import Hash (imphash): clustering related malware samples compiled from identical codebases'
    ]
  },
  {
    id: 'mal-vid-10',
    topicNumber: 10,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 3,
    sectionTitle: 'Binary Analysis',
    topicName: 'Process Analysis',
    videoTitle: 'Malware Analysis Masterclass: Process Analysis & Inspection',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '40 min',
    description: 'Inspecting live processes using Process Hacker / System Informer: thread inspection, open handles, environment variables, and memory strings.',
    keyTakeaways: [
      'Detecting orphan processes and parent PID spoofing',
      'Inspecting live memory regions for injected DLLs and unmapped executable memory (RWX)',
      'Dumping memory sections directly from Process Hacker for offline analysis'
    ]
  },
  {
    id: 'mal-vid-11',
    topicNumber: 11,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 4,
    sectionTitle: 'Behavioral Investigation',
    topicName: 'Network Analysis',
    videoTitle: 'Malware Analysis Masterclass: Malware Network Protocol Analysis',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '38 min',
    description: 'Dissecting C2 beaconing protocols: HTTP/S POST payloads, custom XOR/RC4 encrypted beacons, DNS tunneling, and domain generation algorithms (DGA).',
    keyTakeaways: [
      'Identifying Domain Generation Algorithms (DGA) through high entropy NXDOMAIN queries',
      'Extracting and decrypting encrypted HTTP POST C2 check-in messages',
      'Analyzing Tor, Telegram, and Discord Webhook C2 communication channels'
    ]
  },
  {
    id: 'mal-vid-12',
    topicNumber: 12,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 4,
    sectionTitle: 'Behavioral Investigation',
    topicName: 'Registry Analysis',
    videoTitle: 'Malware Analysis Masterclass: Windows Registry Analysis',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '33 min',
    description: 'Tracking registry modifications: Run/RunOnce keys, Shell Folders, COM object hijacking, AppInit_DLLs, and hidden registry null byte tricks.',
    keyTakeaways: [
      'Top autorun registry keys used by malware for persistence',
      'COM object hijacking via HKCU\\Software\\Classes\\CLSID overrides',
      'Detecting null-byte registry entries designed to crash native Windows registry tools'
    ]
  },
  {
    id: 'mal-vid-13',
    topicNumber: 13,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 4,
    sectionTitle: 'Behavioral Investigation',
    topicName: 'Persistence Mechanisms',
    videoTitle: 'Malware Analysis Masterclass: Advanced Persistence Mechanisms',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '44 min',
    description: 'Analyzing stealth persistence: Scheduled Tasks (XML schemas), WMI Event Subscriptions, Windows Services, and Accessibility binary hijacking (sethc.exe).',
    keyTakeaways: [
      'Auditing WMI event filters, consumers, and bindings using PowerShell and autoruns',
      'Detecting service creation with non-standard binary paths and unquoted service path exploits',
      'Inspecting Sticky Keys (sethc.exe) and Utilman.exe accessibility backdoor modifications'
    ]
  },
  {
    id: 'mal-vid-14',
    topicNumber: 14,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 5,
    sectionTitle: 'Injection & Advanced Exploitation',
    topicName: 'Process Injection',
    videoTitle: 'Malware Analysis Masterclass: Process Injection Techniques',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '55 min',
    description: 'Dissecting code injection: DLL Injection, Process Hollowing (RunPE), Thread Hijacking, and Early Bird APC injection in benign processes.',
    keyTakeaways: [
      'Classic injection API pattern: OpenProcess -> VirtualAllocEx -> WriteProcessMemory -> CreateRemoteThread',
      'Process Hollowing steps: CreateProcess (SUSPENDED) -> ZwUnmapViewOfSection -> SetThreadContext -> ResumeThread',
      'Detecting reflective DLL injection and manual module mapping without disk artifacts'
    ]
  },
  {
    id: 'mal-vid-15',
    topicNumber: 15,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 5,
    sectionTitle: 'Injection & Advanced Exploitation',
    topicName: 'DLL Hijacking',
    videoTitle: 'Malware Analysis Masterclass: DLL Search Order Hijacking & Sideloading',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '36 min',
    description: 'Investigating DLL hijacking: standard search order, side-loading benign signed executables with rogue DLLs, and DLL proxying forwarders.',
    keyTakeaways: [
      'The Windows dynamic link library search order hierarchy',
      'Adversary use of legitimate signed binaries (LOLBins) to execute unsigned malicious DLLs',
      'Using Procmon to detect NAME NOT FOUND results on DLL loads'
    ]
  },
  {
    id: 'mal-vid-16',
    topicNumber: 16,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 6,
    sectionTitle: 'Reverse Engineering & Disassembly',
    topicName: 'Assembly Basics',
    videoTitle: 'Malware Analysis & Reverse Engineering: x86/x64 Assembly Language',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '60 min',
    description: 'Foundational assembly for reverse engineers: registers (RAX, RBX, RCX, RDX, RSP, RBP, RIP), memory addressing, stack operations (push/pop), and calling conventions (cdecl, stdcall, fastcall).',
    keyTakeaways: [
      'x86/x64 CPU registers and their functional roles (pointers, accumulators, counters)',
      'Understanding the Call Stack, stack frames, and buffer layouts in memory',
      'Common instructions: MOV, LEA, XOR, CMP, JMP/JNE/JE, CALL, and RET'
    ]
  },
  {
    id: 'mal-vid-17',
    topicNumber: 17,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 6,
    sectionTitle: 'Reverse Engineering & Disassembly',
    topicName: 'Reverse Engineering',
    videoTitle: 'Malware Analysis & Reverse Engineering: Control Flow & Decompilation',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '58 min',
    description: 'Decompiling binary logic: control flow graphs (CFGs), reversing conditionals, loops, switch statements, and recovering high-level C data structures.',
    keyTakeaways: [
      'Reconstructing high-level programming constructs from assembly flowcharts',
      'Identifying string encryption decryption loops (XOR routines with rolling keys)',
      'Patching binaries during dynamic debugging to force conditional execution paths'
    ]
  },
  {
    id: 'mal-vid-18',
    topicNumber: 18,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 6,
    sectionTitle: 'Reverse Engineering & Disassembly',
    topicName: 'IDA Pro',
    videoTitle: 'Static/Dynamic Analysis & IDA Pro: Disassembly & Interactive Debugging',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '65 min',
    description: 'Mastering IDA Pro and Ghidra: graph view navigation, cross-references (Xrefs), type propagation, FLIRT signatures, and attaching debuggers.',
    keyTakeaways: [
      'Using Cross-References (Xrefs) to trace calls to cryptographic and networking APIs',
      'Renaming variables, defining custom struct definitions, and adjusting calling signatures',
      'Applying FLIRT signatures to identify static standard C library functions automatically'
    ]
  },
  {
    id: 'mal-vid-19',
    topicNumber: 19,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 7,
    sectionTitle: 'Specialized Threats',
    topicName: 'Ransomware Analysis',
    videoTitle: 'Malware Analysis Masterclass: Dissecting Modern Ransomware',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '50 min',
    description: 'Ransomware internals: hybrid encryption architecture (RSA-4096 + AES/ChaCha20), shadow copy deletion (vssadmin), service stopping, and ransom note drops.',
    keyTakeaways: [
      'The hybrid encryption workflow: per-file symmetric key encrypted by attacker public key',
      'Disabling defenses and backups: bcdedit, vssadmin delete shadows /all /quiet',
      'Analyzing intermittent encryption techniques designed to bypass heuristic anti-ransomware'
    ]
  },
  {
    id: 'mal-vid-20',
    topicNumber: 20,
    trackId: 'malware-analyst',
    trackTitle: 'Malware Analyst',
    sectionNumber: 7,
    sectionTitle: 'Specialized Threats',
    topicName: 'Banking Trojan Analysis',
    videoTitle: 'Malware Analysis Masterclass: Banking Trojans & Web Injects',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    directVideoUrl: 'https://www.youtube.com/watch?v=YlgduaC7XwI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YlgduaC7XwI?rel=0',
    videoId: 'YlgduaC7XwI',
    channel: 'Malware Analysis & Reverse Engineering Academy',
    durationApprox: '48 min',
    description: 'Deconstructing financial trojans (Dridex, TrickBot, Ursnif): Man-in-the-Browser (MitB), API hooking, web inject configuration parsing, and credential harvesting.',
    keyTakeaways: [
      'Man-in-the-Browser (MitB) inline API hooking of browser network functions (PR_Write, WSASend)',
      'Extracting and decrypting encrypted web inject configurations from memory',
      'Automated transfer systems (ATS) that execute unauthorized fund transfers in the victim session'
    ]
  }
];

// =========================================================================
// 11. SECURITY ENGINEER (15 Topics)
// Base Videos: "Cybersecurity Fundamentals" (oAjYRJmenEE) & "Network Security Fundamentals" (IGVcbu1I7Hg)
// =========================================================================
export const SECURITY_ENGINEER_VIDEOS_DATA: CuratedVideo[] = [
  {
    id: 'se-vid-1',
    topicNumber: 1,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Engineering Foundations',
    topicName: 'Security Engineering Fundamentals',
    videoTitle: 'Cybersecurity Fundamentals: Principles of Security Engineering',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cyber Security Engineering Channel',
    durationApprox: '42 min',
    description: 'Core security engineering principles: Confidentiality, Integrity, Availability, Defense-in-Depth, Zero Trust Architecture, and attack surface reduction.',
    keyTakeaways: [
      'The CIA Triad and the Parkerian Hexad security models',
      'Designing layered defense-in-depth architecture across physical, network, endpoint, and application tiers',
      'Zero Trust core philosophy: Never Trust, Always Verify, Assume Breach'
    ]
  },
  {
    id: 'se-vid-2',
    topicNumber: 2,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Engineering Foundations',
    topicName: 'Network Security',
    videoTitle: 'Network Security Fundamentals for Security Engineers',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '50 min',
    description: 'Securing enterprise network perimeters: network topology design, DMZ isolation, segmentation, and securing critical network control protocols.',
    keyTakeaways: [
      'DMZ architecture: placing external-facing services isolated from corporate internal domains',
      'Securing routing protocols (BGP, OSPF) with authentication and route filters',
      'VLAN segmentation and 802.1Q trunking security controls'
    ]
  },
  {
    id: 'se-vid-3',
    topicNumber: 3,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Perimeter & Defense Controls',
    topicName: 'Firewalls',
    videoTitle: 'Firewall & Network Security: Next-Gen Firewall (NGFW) Deployment',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '44 min',
    description: 'Next-Generation Firewalls (NGFW): stateful packet inspection, deep packet inspection (DPI), App-ID, SSL decryption, and URL filtering policies.',
    keyTakeaways: [
      'Stateless packet filtering vs Stateful inspection vs Application-aware NGFW',
      'Implementing outbound SSL/TLS decryption (forward proxy) for threat inspection',
      'Authoring strict egress filtering rules to prevent attacker reverse shell connections'
    ]
  },
  {
    id: 'se-vid-4',
    topicNumber: 4,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Perimeter & Defense Controls',
    topicName: 'IDS',
    videoTitle: 'Network Security: Intrusion Detection Systems (IDS)',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '38 min',
    description: 'Designing and deploying NIDS (Snort, Suricata, Zeek): SPAN/TAP port configuration, signature vs anomaly detection, and tuning false positives.',
    keyTakeaways: [
      'Network TAP vs Switch Port Analyzer (SPAN) mirroring architectures',
      'Writing Suricata/Snort rules: header, options, content matching, and flow keywords',
      'Using Zeek for behavioral protocol metadata extraction without payload burden'
    ]
  },
  {
    id: 'se-vid-5',
    topicNumber: 5,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Perimeter & Defense Controls',
    topicName: 'IPS',
    videoTitle: 'Network Security: Intrusion Prevention Systems (IPS)',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '36 min',
    description: 'Inline IPS deployment: inline fail-open/fail-closed bypass switches, active packet dropping, TCP reset injection, and rate limiting brute force attacks.',
    keyTakeaways: [
      'Inline IPS deployment risks: avoiding network bottlenecks and business disruption',
      'Hardware bypass switches (fail-open mechanisms) during hardware/software crashes',
      'Automated rate-limiting and quarantine actions upon high-confidence exploit signatures'
    ]
  },
  {
    id: 'se-vid-6',
    topicNumber: 6,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Perimeter & Defense Controls',
    topicName: 'VPN',
    videoTitle: 'Network Security: Enterprise VPN Technologies & Secure Tunnels',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '40 min',
    description: 'Remote access and site-to-site VPNs: IPsec (IKEv2), OpenVPN, WireGuard, split-tunneling risks, and Zero Trust Network Access (ZTNA) migration.',
    keyTakeaways: [
      'IPsec IKEv1 vs IKEv2 phase negotiations and cryptographic suite selection',
      'The security risks of split-tunneling vs full-tunnel forced routing',
      'Migrating legacy VPNs to modern Identity-Aware ZTNA reverse application proxies'
    ]
  },
  {
    id: 'se-vid-7',
    topicNumber: 7,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Identity & Access Management',
    topicName: 'Authentication',
    videoTitle: 'Cloud Security & IAM: Modern Authentication Protocols',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cyber Security Engineering Channel',
    durationApprox: '46 min',
    description: 'Enterprise authentication systems: Kerberos, SAML 2.0, OAuth 2.0 / OpenID Connect (OIDC), FIDO2 / WebAuthn, and phishing-resistant MFA.',
    keyTakeaways: [
      'Kerberos authentication: Ticket Granting Service (TGS) and preventing Pass-the-Ticket / Golden Ticket',
      'SAML 2.0 single sign-on flows: Identity Provider (IdP) to Service Provider (SP)',
      'Phishing-resistant Multi-Factor Authentication (FIDO2/WebAuthn hardware tokens)'
    ]
  },
  {
    id: 'se-vid-8',
    topicNumber: 8,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Identity & Access Management',
    topicName: 'IAM',
    videoTitle: 'Cloud Security & IAM: Identity and Access Management Governance',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cyber Security Engineering Channel',
    durationApprox: '42 min',
    description: 'Engineering scalable IAM architectures: Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), and Privileged Access Management (PAM).',
    keyTakeaways: [
      'RBAC vs ABAC models: granting dynamic access based on user department, device health, and geo-location',
      'PAM solutions: credential vaulting, session recording, and Just-In-Time (JIT) privilege elevation',
      'Lifecycle governance: automated provisioning and de-provisioning via SCIM'
    ]
  },
  {
    id: 'se-vid-9',
    topicNumber: 9,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Identity & Access Management',
    topicName: 'Least Privilege',
    videoTitle: 'Cloud Security & IAM: Enforcing Principle of Least Privilege (PoLP)',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cyber Security Engineering Channel',
    durationApprox: '35 min',
    description: 'Eliminating excessive permissions across clouds and domains: permission boundary policies, reducing administrative sprawl, and service account hardening.',
    keyTakeaways: [
      'Auditing overprivileged accounts and shadow admin permissions',
      'Hardening Non-Human Identities: managed identities, service principals, and API tokens',
      'Continuous permission rightsizing using Cloud Infrastructure Entitlement Management (CIEM)'
    ]
  },
  {
    id: 'se-vid-10',
    topicNumber: 10,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Monitoring & Vulnerabilities',
    topicName: 'Security Monitoring',
    videoTitle: 'Network Security: Telemetry Engineering & Security Monitoring',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '45 min',
    description: 'Engineering log collection pipelines: Syslog, Windows Event Forwarding (WEF), Kafka streaming, data parsers, and SIEM ingestion cost optimization.',
    keyTakeaways: [
      'Architecting resilient log pipelines with Kafka, Logstash, and OpenTelemetry',
      'Standardizing log schemas to Common Event Format (CEF) and Elastic Common Schema (ECS)',
      'Filtering high-noise, zero-value events at the ingestion tier to cut SIEM licensing costs'
    ]
  },
  {
    id: 'se-vid-11',
    topicNumber: 11,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Monitoring & Vulnerabilities',
    topicName: 'Vulnerability Management',
    videoTitle: 'Cybersecurity Fundamentals: Enterprise Vulnerability Management',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cyber Security Engineering Channel',
    durationApprox: '38 min',
    description: 'Vulnerability management lifecycle: authenticated network scanning, agent-based discovery, risk-based prioritization, and SLA enforcement.',
    keyTakeaways: [
      'Agent-based vs Agentless vulnerability scanning advantages and limitations',
      'Prioritizing remediation using asset criticality, exploit availability, and threat intel',
      'Establishing automated patch deployment SLAs (e.g., Critical CVEs within 72 hours)'
    ]
  },
  {
    id: 'se-vid-12',
    topicNumber: 12,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 5,
    sectionTitle: 'Architecture & Endpoints',
    topicName: 'Security Architecture',
    videoTitle: 'Security Engineering: Enterprise Security Architecture & Frameworks',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '50 min',
    description: 'Architecting secure enterprise systems: SABSA, TOGAF, threat modeling (STRIDE, PASTA), and creating secure blueprint reference architectures.',
    keyTakeaways: [
      'Applying the STRIDE threat modeling framework to architectural component diagrams',
      'Aligning business capabilities to security controls using the SABSA framework',
      'Designing fault-tolerant security infrastructure with automated failover'
    ]
  },
  {
    id: 'se-vid-13',
    topicNumber: 13,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 5,
    sectionTitle: 'Architecture & Endpoints',
    topicName: 'Endpoint Security',
    videoTitle: 'Security Engineering: Endpoint Protection & Device Trust',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '40 min',
    description: 'Securing physical and virtual endpoints: Host-based Firewalls, USB device control, BitLocker/FileVault encryption, and TPM attestation.',
    keyTakeaways: [
      'Deploying Full Disk Encryption (BitLocker / FileVault) with hardware TPM 2.0 validation',
      'Restricting removable media and USB devices to prevent air-gap malware ingress',
      'Device posture checks as a prerequisite for network and cloud resource access'
    ]
  },
  {
    id: 'se-vid-14',
    topicNumber: 14,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 5,
    sectionTitle: 'Architecture & Endpoints',
    topicName: 'EDR/XDR Fundamentals',
    videoTitle: 'Security Engineering: Endpoint Detection & Response (EDR/XDR)',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '46 min',
    description: 'Deploying enterprise EDR/XDR: agent architecture, kernel drivers, behavioral telemetry, automated host isolation, and live remote shell response.',
    keyTakeaways: [
      'EDR sensor mechanics: hooking Windows kernel APIs via kernel drivers (ELAM / ETW TI)',
      'Automated containment playbooks: network isolation, process termination, and file quarantine',
      'XDR evolution: unifying endpoint, identity, email, and cloud telemetry into single incident graphs'
    ]
  },
  {
    id: 'se-vid-15',
    topicNumber: 15,
    trackId: 'security-engineer',
    trackTitle: 'Security Engineer',
    sectionNumber: 5,
    sectionTitle: 'Architecture & Endpoints',
    topicName: 'Security Hardening',
    videoTitle: 'Security Engineering: OS & Infrastructure Baseline Hardening',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '48 min',
    description: 'Implementing hardened baselines: CIS Benchmarks, DISA STIGs, disabling unnecessary protocols (LLMNR, NetBIOS, SMBv1), and AppLocker/WDAC application control.',
    keyTakeaways: [
      'Auditing and automating system configuration compliance using CIS Benchmarks',
      'Disabling legacy vulnerable protocols: NTLMv1, LLMNR, NetBIOS over TCP/IP, and SMBv1',
      'Enforcing strict Application Whitelisting using Windows Defender Application Control (WDAC)'
    ]
  }
];

// =========================================================================
// 12. NETWORK SECURITY ENGINEER (15 Topics)
// Base Videos: "Networking for Hackers" (IGVcbu1I7Hg) & Protocol-Specific Walkthroughs
// =========================================================================
export const NETWORK_SECURITY_VIDEOS_DATA: CuratedVideo[] = [
  {
    id: 'net-vid-1',
    topicNumber: 1,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Network Architecture & Protocols',
    topicName: 'Network Security Fundamentals',
    videoTitle: 'Networking for Hackers & Engineers: Foundations of Network Defense',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '48 min',
    description: 'Network engineering fundamentals: physical network infrastructure, packet lifecycle, network security zones, and threat surfaces across corporate backbones.',
    keyTakeaways: [
      'Understanding packet encapsulation and transmission across routed boundaries',
      'Designing defense-in-depth network zones (Core, Distribution, Access, DMZ)',
      'Threats at Layer 2 and Layer 3: ARP poisoning, DHCP starvation, and IP spoofing'
    ]
  },
  {
    id: 'net-vid-2',
    topicNumber: 2,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Network Architecture & Protocols',
    topicName: 'OSI Model',
    videoTitle: 'OSI Model: The 7 Layers of Networking & Security Controls',
    youtubeUrl: 'https://www.youtube.com/watch?v=rIZ61PyDkH8',
    directVideoUrl: 'https://www.youtube.com/watch?v=rIZ61PyDkH8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/rIZ61PyDkH8?rel=0',
    videoId: 'rIZ61PyDkH8',
    channel: 'Network Direction & Engineering',
    durationApprox: '32 min',
    description: 'Comprehensive breakdown of the 7-Layer OSI model: Physical, Data Link, Network, Transport, Session, Presentation, Application—and attacks/defenses at each layer.',
    keyTakeaways: [
      'Layer 2 (MAC/Switches) vs Layer 3 (IP/Routers) vs Layer 4 (Ports/TCP-UDP) security controls',
      'Protocol Data Units (PDUs): Bits -> Frames -> Packets -> Segments -> Data',
      'Mapping security appliances to OSI layers (Switches, Routers, Firewalls, WAFs)'
    ]
  },
  {
    id: 'net-vid-3',
    topicNumber: 3,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Network Architecture & Protocols',
    topicName: 'TCP/IP',
    videoTitle: 'TCP/IP Protocol Suite Deep Dive & Packet Analysis',
    youtubeUrl: 'https://www.youtube.com/watch?v=vCN0Um46YIk',
    directVideoUrl: 'https://www.youtube.com/watch?v=vCN0Um46YIk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/vCN0Um46YIk?rel=0',
    videoId: 'vCN0Um46YIk',
    channel: 'Computer Networking Deep Dives',
    durationApprox: '40 min',
    description: 'The TCP/IP model: IPv4/IPv6 packet headers, subnetting (CIDR), TCP flags (SYN, ACK, FIN, RST, PSH, URG), and analyzing packet captures in Wireshark.',
    keyTakeaways: [
      'IPv4 vs IPv6 header fields: TTL, checksums, flow labels, and extension headers',
      'CIDR subnetting and supernetting for enterprise route planning',
      'Detecting abnormal TCP flag combinations (SYN-FIN, NULL scans, XMAS scans)'
    ]
  },
  {
    id: 'net-vid-4',
    topicNumber: 4,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Network Architecture & Protocols',
    topicName: 'TCP vs UDP',
    videoTitle: 'TCP & UDP: Transport Layer Protocol Differences & Attack Vectors',
    youtubeUrl: 'https://www.youtube.com/watch?v=0-MldfyhIuo',
    directVideoUrl: 'https://www.youtube.com/watch?v=0-MldfyhIuo',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0-MldfyhIuo?rel=0',
    videoId: '0-MldfyhIuo',
    channel: 'Network Direction & Engineering',
    durationApprox: '28 min',
    description: 'Connection-oriented TCP (3-way handshake, windowing, flow control) vs connectionless UDP (speed, overhead); volumetric amplification DDoS risks.',
    keyTakeaways: [
      'The TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK) and SYN Flood denial of service',
      'UDP reflection and amplification attacks (NTP, DNS, CLDAP, SNMP) using spoofed source IPs',
      'Configuring SYN cookies and rate limiting on edge firewalls'
    ]
  },
  {
    id: 'net-vid-5',
    topicNumber: 5,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Network Architecture & Protocols',
    topicName: 'Ports & Protocols',
    videoTitle: 'Ports & Protocols: Common Network Services & Vulnerabilities',
    youtubeUrl: 'https://www.youtube.com/watch?v=oiYrsR5oJSE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oiYrsR5oJSE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oiYrsR5oJSE?rel=0',
    videoId: 'oiYrsR5oJSE',
    channel: 'Practical Networking',
    durationApprox: '34 min',
    description: 'IANA standard port ranges: well-known (0-1023), registered, and ephemeral ports; securing HTTP (80/443), SSH (22), RDP (3389), SMB (445), and LDAP (389/636).',
    keyTakeaways: [
      'Port classifications: Well-known (0–1023), Registered (1024–49151), Dynamic/Private (49152–65535)',
      'Auditing high-risk exposed ports: Telnet (23), RDP (3389), SMB (445), and VNC (5900)',
      'Port knocking and non-standard port strategies for service cloaking'
    ]
  },
  {
    id: 'net-vid-6',
    topicNumber: 6,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Infrastructure & Perimeter Defenses',
    topicName: 'DNS Security',
    videoTitle: 'DNS Architecture, DNSSEC & DNS Tunneling Defense',
    youtubeUrl: 'https://www.youtube.com/watch?v=TEa39TjT8Dg',
    directVideoUrl: 'https://www.youtube.com/watch?v=TEa39TjT8Dg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/TEa39TjT8Dg?rel=0',
    videoId: 'TEa39TjT8Dg',
    channel: 'PowerDNS & Internet Security Academy',
    durationApprox: '38 min',
    description: 'Domain Name System (DNS) security: authoritative vs recursive resolvers, cache poisoning (Kaminsky bug), DNSSEC cryptographic verification, and detecting DNS tunneling (iodine, dnscat2).',
    keyTakeaways: [
      'DNS recursive resolution flow: Root -> TLD -> Authoritative name servers',
      'Deploying DNSSEC: RRSIG, DNSKEY, and DS records to prevent cache poisoning',
      'Detecting DNS exfiltration and C2 tunneling through high request entropy and TXT record volume'
    ]
  },
  {
    id: 'net-vid-7',
    topicNumber: 7,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Infrastructure & Perimeter Defenses',
    topicName: 'Routing & Switching',
    videoTitle: 'Routing & Switching Security: Hardening Enterprise Infrastructure',
    youtubeUrl: 'https://www.youtube.com/watch?v=xSiE0tahshI',
    directVideoUrl: 'https://www.youtube.com/watch?v=xSiE0tahshI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/xSiE0tahshI?rel=0',
    videoId: 'xSiE0tahshI',
    channel: 'Network Direction & Engineering',
    durationApprox: '45 min',
    description: 'Layer 2 and Layer 3 infrastructure hardening: Port Security, Dynamic ARP Inspection (DAI), DHCP Snooping, BPDU Guard, and router control plane policing (CoPP).',
    keyTakeaways: [
      'Mitigating Layer 2 attacks: Port Security (MAC limiting) and DHCP Snooping',
      'Dynamic ARP Inspection (DAI) to defeat man-in-the-middle ARP cache spoofing',
      'Control Plane Policing (CoPP) on core routers to protect the CPU from DoS exhaustion'
    ]
  },
  {
    id: 'net-vid-8',
    topicNumber: 8,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Infrastructure & Perimeter Defenses',
    topicName: 'Firewalls',
    videoTitle: 'Network Security / Firewalls: Enterprise Rule Architectures',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '50 min',
    description: 'Enterprise firewall architecture: top-down rule order evaluation, default-deny posture, zone-based firewalling, and high-availability (HA) Active/Passive clustering.',
    keyTakeaways: [
      'Zone-Based Policy Firewall (ZBPF) design: defining inter-zone communication matrices',
      'Rule order optimization: placing high-volume specific rules above broad permit policies',
      'Configuring Active/Passive stateful failover with sub-second heartbeats'
    ]
  },
  {
    id: 'net-vid-9',
    topicNumber: 9,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Infrastructure & Perimeter Defenses',
    topicName: 'IDS/IPS',
    videoTitle: 'Network Security: Deploying and Tuning Enterprise IDS/IPS',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '44 min',
    description: 'Operationalizing IDS/IPS: sensor placement strategies (external vs internal), rule tuning, suppressing noise, and integrating automated threat blocklists.',
    keyTakeaways: [
      'Strategic sensor placement: pre-firewall (threat volume) vs post-firewall (true threats)',
      'Tuning signature thresholds to prevent alert fatigue without creating blind spots',
      'Automated integration of commercial and open-source threat intelligence feeds'
    ]
  },
  {
    id: 'net-vid-10',
    topicNumber: 10,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Segmentation & Tunnels',
    topicName: 'VPN & Tunneling',
    videoTitle: 'VPN Tunneling: Protocols, Cryptography & Secure Site-to-Site Tunnels',
    youtubeUrl: 'https://www.youtube.com/watch?v=1ozFz3GJ4PM',
    directVideoUrl: 'https://www.youtube.com/watch?v=1ozFz3GJ4PM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/1ozFz3GJ4PM?rel=0',
    videoId: '1ozFz3GJ4PM',
    channel: 'Practical Networking',
    durationApprox: '42 min',
    description: 'Virtual Private Networks: GRE tunnels, IPsec encapsulation, SSL/TLS VPNs, cryptographic handshakes, and securing multi-cloud cross-connects.',
    keyTakeaways: [
      'Generic Routing Encapsulation (GRE) over IPsec for dynamic routing protocol transport',
      'Comparing IPsec Tunnel Mode (full packet encapsulation) vs Transport Mode (payload only)',
      'Configuring secure site-to-site VPNs connecting on-premises data centers to AWS/Azure'
    ]
  },
  {
    id: 'net-vid-11',
    topicNumber: 11,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Segmentation & Tunnels',
    topicName: 'Network Segmentation',
    videoTitle: 'Network Security: Micro-segmentation & Zero Trust Network Isolation',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '46 min',
    description: 'Preventing lateral attacker movement: micro-segmentation, software-defined networking (SDN), private VLANs (PVLANs), and workload isolation.',
    keyTakeaways: [
      'Private VLANs (PVLANs): Isolated ports, Community ports, and Promiscuous ports',
      'Micro-segmentation at the hypervisor/cloud workload tier (host firewall policies)',
      'Designing strict security policies between Production, Staging, and Development environments'
    ]
  },
  {
    id: 'net-vid-12',
    topicNumber: 12,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Segmentation & Tunnels',
    topicName: 'NAT',
    videoTitle: 'Network Security Elements: Network Address Translation (NAT/PAT)',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '32 min',
    description: 'NAT mechanics: Static NAT, Dynamic NAT, Port Address Translation (PAT/NAT Overload), security benefits, and logging translation tables for forensic attribution.',
    keyTakeaways: [
      'Static NAT (one-to-one) vs PAT / NAT Overload (many-to-one port mapping)',
      'Why NAT is not a substitute for stateful firewall security controls',
      'Exporting NetFlow / IPFIX NAT event logs to trace malicious external connections to internal hosts'
    ]
  },
  {
    id: 'net-vid-13',
    topicNumber: 13,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Proxies & Encryption',
    topicName: 'Proxy Servers',
    videoTitle: 'Network Security: Forward Proxies, Reverse Proxies & WAFs',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '38 min',
    description: 'Proxy architectures: Forward Proxies for user web filtering and DLP, Reverse Proxies for server load balancing and SSL termination, and Web Application Firewalls (WAF).',
    keyTakeaways: [
      'Forward Proxy vs Reverse Proxy: protecting users outbound vs protecting servers inbound',
      'Web Application Firewall (WAF) rule engines: OWASP Top 10 mitigation and virtual patching',
      'Configuring SSL/TLS offloading and HTTP header inspection (X-Forwarded-For)'
    ]
  },
  {
    id: 'net-vid-14',
    topicNumber: 14,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Proxies & Encryption',
    topicName: 'IPSec',
    videoTitle: 'Network Security: IPSec Architecture, AH, ESP & Cryptographic Suites',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '40 min',
    description: 'IPsec technical specifications: Authentication Header (AH) vs Encapsulating Security Payload (ESP), Diffie-Hellman groups, and Perfect Forward Secrecy (PFS).',
    keyTakeaways: [
      'Authentication Header (AH protocol 51) integrity vs Encapsulating Security Payload (ESP protocol 50) encryption',
      'Diffie-Hellman key exchange groups: choosing DH Group 14+ / Group 19 (ECDH) for modern security',
      'Enforcing Perfect Forward Secrecy (PFS) to prevent retrospective session decryption'
    ]
  },
  {
    id: 'net-vid-15',
    topicNumber: 15,
    trackId: 'network-security-engineer',
    trackTitle: 'Network Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Proxies & Encryption',
    topicName: 'Network Monitoring',
    videoTitle: 'Networking for Hackers & Engineers: Full Packet Capture & Flow Analysis',
    youtubeUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    directVideoUrl: 'https://www.youtube.com/watch?v=IGVcbu1I7Hg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IGVcbu1I7Hg?rel=0',
    videoId: 'IGVcbu1I7Hg',
    channel: 'Network Security & Hacking Academy',
    durationApprox: '48 min',
    description: 'Network telemetry and visibility: Full Packet Capture (PCAP), NetFlow/sFlow/IPFIX collection, bandwidth baseline monitoring, and anomaly detection.',
    keyTakeaways: [
      'Flow records (NetFlow v9 / IPFIX) vs Full Packet Capture (PCAP) trade-offs and storage math',
      'Establishing statistical bandwidth baselines to identify unauthorized bulk data exfiltration',
      'Deploying open-source network security monitoring (Arkime, Zeek, Suricata) stacks'
    ]
  }
];

// =========================================================================
// 13. CLOUD SECURITY ENGINEER (15 Topics)
// Base Video: "Cloud Security Basics: AWS vs Azure vs GCP + IAM Explained"
// Link: https://www.youtube.com/watch?v=oAjYRJmenEE
// =========================================================================
export const CLOUD_SECURITY_VIDEOS_DATA: CuratedVideo[] = [
  {
    id: 'cld-vid-1',
    topicNumber: 1,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Cloud Foundations & Providers',
    topicName: 'Cloud Security Fundamentals',
    videoTitle: 'Cloud Security Basics: Core Principles of Secure Cloud Computing',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '45 min',
    description: 'Cloud security fundamentals: service models (IaaS, PaaS, SaaS), deployment models (Public, Private, Hybrid, Multi-cloud), and cloud threat landscapes.',
    keyTakeaways: [
      'Differences in security responsibilities across IaaS, PaaS, and SaaS',
      'The multi-cloud attack surface: control plane API risks vs data plane exposure',
      'Zero Trust architecture applied to cloud resource perimeters'
    ]
  },
  {
    id: 'cld-vid-2',
    topicNumber: 2,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Cloud Foundations & Providers',
    topicName: 'AWS Security',
    videoTitle: 'Cloud Security Basics: Amazon Web Services (AWS) Security Architecture',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '50 min',
    description: 'AWS security services: AWS IAM, AWS Organizations (SCPs), GuardDuty threat detection, Security Hub, AWS KMS encryption, and AWS WAF/Shield.',
    keyTakeaways: [
      'Multi-account AWS governance using AWS Organizations and Service Control Policies (SCPs)',
      'Automating threat detection with Amazon GuardDuty (machine learning over CloudTrail, VPC Flow, and DNS logs)',
      'Key Management Service (KMS): Customer Managed Keys (CMK) vs AWS Managed Keys'
    ]
  },
  {
    id: 'cld-vid-3',
    topicNumber: 3,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Cloud Foundations & Providers',
    topicName: 'Azure Security',
    videoTitle: 'Cloud Security Basics: Microsoft Azure Security & Entra ID',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '48 min',
    description: 'Microsoft Azure security ecosystem: Microsoft Entra ID (formerly Azure AD), Conditional Access, Microsoft Defender for Cloud, Azure Key Vault, and Azure Policy.',
    keyTakeaways: [
      'Microsoft Entra ID identity perimeter: Conditional Access policies based on user risk and device state',
      'Enforcing compliance baselines across subscriptions using Azure Policy and Management Groups',
      'Microsoft Defender for Cloud: Cloud Workload Protection (CWP) and Cloud Security Posture Management (CSPM)'
    ]
  },
  {
    id: 'cld-vid-4',
    topicNumber: 4,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 1,
    sectionTitle: 'Cloud Foundations & Providers',
    topicName: 'GCP Security',
    videoTitle: 'Cloud Security Basics: Google Cloud Platform (GCP) Security Architecture',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '46 min',
    description: 'Google Cloud Platform security architecture: Cloud IAM hierarchies (Org -> Folder -> Project -> Resource), VPC Service Controls, and Security Command Center (SCC).',
    keyTakeaways: [
      'GCP Resource Hierarchy inheritance and IAM role bindings (Primitive, Predefined, Custom)',
      'VPC Service Controls: creating cryptographic data perimeters to prevent data exfiltration from GCS/BigQuery',
      'Google Cloud Security Command Center (SCC) vulnerability and threat monitoring'
    ]
  },
  {
    id: 'cld-vid-5',
    topicNumber: 5,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Governance & Identity',
    topicName: 'Shared Responsibility Model',
    videoTitle: 'Cloud Security Basics: The Shared Responsibility Model Breakdown',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '32 min',
    description: 'Detailed analysis of cloud boundaries: Cloud Service Provider (CSP) responsibilities (Security OF the Cloud) vs Customer responsibilities (Security IN the Cloud).',
    keyTakeaways: [
      'Security OF the Cloud (hardware, hypervisor, facilities) vs Security IN the Cloud (data, IAM, OS, apps)',
      'How the boundary shifts between EC2/Compute Engine (IaaS), Lambda/Cloud Functions (Serverless), and SaaS',
      'Common customer misunderstandings that lead to catastrophic breaches'
    ]
  },
  {
    id: 'cld-vid-6',
    topicNumber: 6,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Governance & Identity',
    topicName: 'Cloud IAM',
    videoTitle: 'Cloud IAM: Identity & Access Management Across AWS, Azure & GCP',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '52 min',
    description: 'Deep dive into Cloud IAM: JSON policy documents (Effect, Action, Resource, Condition), role assumption, federation, and cross-account access.',
    keyTakeaways: [
      'Authoring secure IAM JSON policies: avoiding wildcard "*" in Actions and Resources',
      'AssumeRole workflows and temporary STS credentials vs permanent access keys',
      'Identity Federation with enterprise IdPs via SAML 2.0 and OIDC'
    ]
  },
  {
    id: 'cld-vid-7',
    topicNumber: 7,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 2,
    sectionTitle: 'Governance & Identity',
    topicName: 'Least Privilege',
    videoTitle: 'Least Privilege & IAM: Auditing Permissions & CIEM in the Cloud',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '38 min',
    description: 'Enforcing least privilege across clouds: IAM Access Analyzer, rightsizing roles based on actual CloudTrail usage, and permission boundaries.',
    keyTakeaways: [
      'Using IAM Access Analyzer to identify unintended public or cross-account access',
      'Generating least-privilege IAM policies directly from observed AWS CloudTrail API events',
      'Preventing privilege escalation: auditing PassRole, CreateAccessKey, and AttachUserPolicy permissions'
    ]
  },
  {
    id: 'cld-vid-8',
    topicNumber: 8,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Posture & Threat Defense',
    topicName: 'Cloud Misconfigurations',
    videoTitle: 'Cloud Security Basics: Detecting & Remedying Cloud Misconfigurations',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '44 min',
    description: 'Top cloud configuration errors: publicly exposed storage buckets (S3, Azure Blob), permissive Security Groups (0.0.0.0/0 on port 22/3389), and unencrypted volumes.',
    keyTakeaways: [
      'Remediating open storage buckets: enforcing S3 Block Public Access at the organization level',
      'Auditing Security Group inbound rules to eliminate unrestricted ingress',
      'Automated remediation using Cloud Custodian, AWS Config Rules, and Azure Policy'
    ]
  },
  {
    id: 'cld-vid-9',
    topicNumber: 9,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 3,
    sectionTitle: 'Posture & Threat Defense',
    topicName: 'Cloud Threats',
    videoTitle: 'Cloud Security Basics: Threat Vectors & Attacks in Cloud Environments',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '42 min',
    description: 'Cloud threat actor methodologies: SSRF credential theft via Instance Metadata Service (IMDSv1), cryptojacking on compromised EC2 instances, and token exfiltration.',
    keyTakeaways: [
      'Server-Side Request Forgery (SSRF) against 169.254.169.254 and migrating to IMDSv2 (token-based)',
      'Detecting unauthorized cryptomining clusters spun up via compromised root API keys',
      'Cloud-native ransomware: snapshot deletion, bucket encryption, and KMS key lockouts'
    ]
  },
  {
    id: 'cld-vid-10',
    topicNumber: 10,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Network, Data & Monitoring',
    topicName: 'Cloud Network Security',
    videoTitle: 'Cloud Security Basics: Virtual Private Cloud (VPC) Security & Micro-segmentation',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '46 min',
    description: 'Securing cloud virtual networks: VPC architecture, public vs private subnets, Security Groups vs Network ACLs, Transit Gateway, and VPC Endpoints (PrivateLink).',
    keyTakeaways: [
      'Security Groups (stateful, instance-level) vs Network ACLs (stateless, subnet-level)',
      'Keeping traffic off the public internet using AWS PrivateLink / Azure Private Endpoints',
      'Centralized network egress inspection using Transit Gateway and cloud-native firewalls'
    ]
  },
  {
    id: 'cld-vid-11',
    topicNumber: 11,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Network, Data & Monitoring',
    topicName: 'Cloud Data Security',
    videoTitle: 'Cloud Security Basics: Data Protection & Cryptography in the Cloud',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '40 min',
    description: 'Data security in cloud storage: Encryption at Rest (SSE-S3, SSE-KMS, SSE-C), Encryption in Transit (TLS 1.3), envelope encryption, and data classification (Amazon Macie).',
    keyTakeaways: [
      'Envelope encryption mechanics: Data Encryption Key (DEK) encrypted by Key Encryption Key (KEK)',
      'Automated PII and sensitive data discovery using Amazon Macie and Cloud DLP',
      'Enforcing object lock (WORM storage) to protect immutable backups from ransomware deletion'
    ]
  },
  {
    id: 'cld-vid-12',
    topicNumber: 12,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 4,
    sectionTitle: 'Network, Data & Monitoring',
    topicName: 'Cloud Monitoring',
    videoTitle: 'Cloud Security Basics: Cloud Telemetry, Audit Trails & Alerting',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '45 min',
    description: 'Audit logging across cloud platforms: AWS CloudTrail (management vs data events), VPC Flow Logs, Azure Monitor / Activity Logs, and CloudWatch alert automation.',
    keyTakeaways: [
      'Securing AWS CloudTrail: multi-region trails, log file validation, and immutable S3 storage',
      'Analyzing VPC Flow Logs to detect anomalous external data transfers and port scans',
      'Creating EventBridge / Lambda automations to trigger real-time incident responses'
    ]
  },
  {
    id: 'cld-vid-13',
    topicNumber: 13,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 5,
    sectionTitle: 'Architecture & Best Practices',
    topicName: 'Cloud Security Architecture',
    videoTitle: 'Cloud Security Basics: Enterprise Well-Architected Security Pillar',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '52 min',
    description: 'Designing resilient cloud architecture: AWS Well-Architected Framework (Security Pillar), multi-account isolation strategies (Landing Zones), and CSPM tools.',
    keyTakeaways: [
      'The 7 Design Principles for security in the cloud from the AWS Well-Architected Framework',
      'Landing Zone architecture: dedicated Security, Logging, Shared Services, and Workload accounts',
      'Deploying Cloud Security Posture Management (CSPM) for continuous compliance auditing'
    ]
  },
  {
    id: 'cld-vid-14',
    topicNumber: 14,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 5,
    sectionTitle: 'Architecture & Best Practices',
    topicName: 'DevSecOps & Cloud',
    videoTitle: 'Cloud Security Basics: DevSecOps & Infrastructure as Code (IaC) Security',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '44 min',
    description: 'Integrating security into CI/CD pipelines: scanning Terraform/CloudFormation with Checkov and tfsec, container image scanning (Trivy), and Git secret detection.',
    keyTakeaways: [
      'Shifting security left: scanning Infrastructure as Code (IaC) before cloud provisioning',
      'Static analysis of Terraform scripts to block open security groups and unencrypted resources',
      'Enforcing immutable container deployments and ephemeral pipeline credentials'
    ]
  },
  {
    id: 'cld-vid-15',
    topicNumber: 15,
    trackId: 'cloud-security-engineer',
    trackTitle: 'Cloud Security Engineer',
    sectionNumber: 5,
    sectionTitle: 'Architecture & Best Practices',
    topicName: 'Cloud Security Best Practices',
    videoTitle: 'Cloud Security Basics: Essential Hardening & Compliance Checklist',
    youtubeUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oAjYRJmenEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oAjYRJmenEE?rel=0',
    videoId: 'oAjYRJmenEE',
    channel: 'Cloud Security Academy',
    durationApprox: '36 min',
    description: 'The definitive cloud hardening checklist: securing the root account, enforcing MFA, rotation of credentials, immutable backup vaults, and incident preparedness.',
    keyTakeaways: [
      'Securing the AWS Root account: hardware MFA, zero active access keys, and budget alarms',
      'Enforcing automated key rotation in KMS and secret rotation in Secrets Manager',
      'Testing disaster recovery and incident response playbooks in isolated sandbox accounts'
    ]
  }
];
