import { PENTESTING_VIDEOS_DATA } from './pentestVideoData';
import { THREAT_HUNTER_VIDEOS_DATA } from './threatHunterVideoData';
import {
  THREAT_INTEL_VIDEOS_DATA,
  MALWARE_ANALYST_VIDEOS_DATA,
  SECURITY_ENGINEER_VIDEOS_DATA,
  NETWORK_SECURITY_VIDEOS_DATA,
  CLOUD_SECURITY_VIDEOS_DATA
} from './newRolesVideoData';

export type CuratedTrackId =
  | 'soc-analyst'
  | 'penetration-tester'
  | 'threat-hunter'
  | 'threat-intel'
  | 'malware-analyst'
  | 'security-engineer'
  | 'network-security-engineer'
  | 'cloud-security-engineer';

export type CuratedTrackTitle =
  | 'SOC Analyst'
  | 'Penetration Tester / Ethical Hacker'
  | 'Threat Hunter'
  | 'Threat Intelligence Analyst'
  | 'Malware Analyst'
  | 'Security Engineer'
  | 'Network Security Engineer'
  | 'Cloud Security Engineer';

export interface CuratedVideo {
  id: string;
  topicNumber: number;
  trackId: CuratedTrackId;
  trackTitle: CuratedTrackTitle;
  sectionNumber?: number;
  sectionTitle?: string;
  topicName: string;
  videoTitle: string;
  youtubeUrl: string;       // Original link provided
  directVideoUrl: string;   // Direct watch link
  embedUrl: string;         // Iframe-playable embed link
  videoId: string;
  channel: string;
  durationApprox?: string;
  description: string;
  keyTakeaways: string[];
}

export const SOC_ANALYST_VIDEOS: CuratedVideo[] = [
  {
    id: 'soc-vid-1',
    topicNumber: 1,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'OSI Model',
    videoTitle: 'OSI Model Explained',
    youtubeUrl: 'https://www.youtube.com/watch?v=rIZ61PyDkH8',
    directVideoUrl: 'https://www.youtube.com/watch?v=rIZ61PyDkH8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/rIZ61PyDkH8?rel=0',
    videoId: 'rIZ61PyDkH8',
    channel: 'NetworkChuck',
    durationApprox: '18 min',
    description: 'A comprehensive breakdown of all 7 layers of the Open Systems Interconnection (OSI) model: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
    keyTakeaways: [
      'Encapsulation and decapsulation workflows as packets traverse from Layer 7 to Layer 1',
      'Protocol Data Units (PDUs): Bits, Frames, Packets, Segments, and Application Data',
      'Identifying which security controls (firewalls, switches, WAFs) operate at each layer'
    ]
  },
  {
    id: 'soc-vid-2',
    topicNumber: 2,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'IP Addressing',
    videoTitle: 'IP Addresses',
    youtubeUrl: 'https://www.youtube.com/watch?v=oieIGwUPaKE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oieIGwUPaKE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oieIGwUPaKE?rel=0',
    videoId: 'oieIGwUPaKE',
    channel: 'PowerCert Animated Videos',
    durationApprox: '12 min',
    description: 'Foundational guide to IPv4 and IPv6 addressing, public vs private subnets (RFC 1918), default gateways, and network interfaces.',
    keyTakeaways: [
      'Anatomy of an IPv4 address: Network bits vs Host bits',
      'Private address ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16',
      'How NAT translates private internal IPs to internet-routable public addresses'
    ]
  },
  {
    id: 'soc-vid-3',
    topicNumber: 3,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'MAC Address',
    videoTitle: 'MAC Addresses',
    youtubeUrl: 'https://www.youtube.com/watch?v=_Fdj1fY0gp8',
    directVideoUrl: 'https://www.youtube.com/watch?v=_Fdj1fY0gp8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/_Fdj1fY0gp8?rel=0',
    videoId: '_Fdj1fY0gp8',
    channel: 'PowerCert Animated Videos',
    durationApprox: '9 min',
    description: 'Layer 2 Media Access Control (MAC) addresses, physical hardware identification, OUI manufacturer prefixes, and ARP table resolution.',
    keyTakeaways: [
      '48-bit hex structure (e.g. 00:1A:2B:3C:4D:5E) and OUI vendor identifier decomposition',
      'How switches use CAM / MAC address tables for frame forwarding',
      'Security implications of MAC spoofing and ARP cache poisoning attacks'
    ]
  },
  {
    id: 'soc-vid-4',
    topicNumber: 4,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'Routing & Switching',
    videoTitle: 'Routing and Switching',
    youtubeUrl: 'https://www.youtube.com/watch?v=xSiE0tahshI',
    directVideoUrl: 'https://www.youtube.com/watch?v=xSiE0tahshI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/xSiE0tahshI?rel=0',
    videoId: 'xSiE0tahshI',
    channel: 'Sunny Classroom',
    durationApprox: '15 min',
    description: 'Clear visual demonstration comparing Layer 2 Ethernet switches (forwarding frames via MACs) and Layer 3 Routers (forwarding packets via IP routing tables).',
    keyTakeaways: [
      'Broadcast domains vs Collision domains in enterprise switching',
      'Routing tables, next-hop lookups, and default gateways',
      'VLAN segmentation and 802.1Q trunking fundamentals for network isolation'
    ]
  },
  {
    id: 'soc-vid-5',
    topicNumber: 5,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'TCP/IP',
    videoTitle: 'TCP/IP',
    youtubeUrl: 'https://www.youtube.com/watch?v=vCN0Um46YIk',
    directVideoUrl: 'https://www.youtube.com/watch?v=vCN0Um46YIk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/vCN0Um46YIk?rel=0',
    videoId: 'vCN0Um46YIk',
    channel: 'PowerCert Animated Videos',
    durationApprox: '11 min',
    description: 'In-depth overview of the 4-layer TCP/IP protocol suite (Network Access, Internet, Transport, Application) that powers the modern internet.',
    keyTakeaways: [
      'How the TCP/IP stack maps to the 7-layer OSI conceptual reference',
      'IP header fields: TTL, Source/Destination IPs, Protocol number (TCP 6, UDP 17)',
      'Packet journey across enterprise routers, stateful firewalls, and proxy gateways'
    ]
  },
  {
    id: 'soc-vid-6',
    topicNumber: 6,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'TCP vs UDP',
    videoTitle: 'TCP & UDP',
    youtubeUrl: 'https://www.youtube.com/watch?v=0-MldfyhIuo',
    directVideoUrl: 'https://www.youtube.com/watch?v=0-MldfyhIuo',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0-MldfyhIuo?rel=0',
    videoId: '0-MldfyhIuo',
    channel: 'PowerCert Animated Videos',
    durationApprox: '10 min',
    description: 'Comparison of connection-oriented, reliable TCP versus lightweight, connectionless UDP. Includes 3-way handshake and packet header analysis.',
    keyTakeaways: [
      'TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK lifecycle and state tables',
      'Why UDP is favored for DNS, VoIP, streaming, and fast amplification vectors',
      'TCP flags in SOC alerts: SYN floods, FIN scans, Xmas scans, and RST teardowns'
    ]
  },
  {
    id: 'soc-vid-7',
    topicNumber: 7,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'Ports & Protocols',
    videoTitle: 'Port / Protocols',
    youtubeUrl: 'https://www.youtube.com/watch?v=oiYrsR5oJSE',
    directVideoUrl: 'https://www.youtube.com/watch?v=oiYrsR5oJSE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/oiYrsR5oJSE?rel=0',
    videoId: 'oiYrsR5oJSE',
    channel: 'Sunny Classroom',
    durationApprox: '14 min',
    description: 'Essential well-known ports (0-1023), registered ports, and dynamic ephemeral ports every SOC analyst must recognize instantly on a SIEM dashboard.',
    keyTakeaways: [
      'Port memory anchors: 21 (FTP), 22 (SSH), 23 (Telnet), 53 (DNS), 80 (HTTP), 443 (HTTPS), 445 (SMB), 3389 (RDP)',
      'Spotting anomalous port bindings: C2 beacons over port 443 or unusual high ports',
      'Layer 4 socket definition: IP Address + Port Number combination'
    ]
  },
  {
    id: 'soc-vid-8',
    topicNumber: 8,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'DNS',
    videoTitle: 'DNS (Domain Name Service)',
    youtubeUrl: 'https://www.youtube.com/watch?v=TEa39TjT8Dg',
    directVideoUrl: 'https://www.youtube.com/watch?v=TEa39TjT8Dg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/TEa39TjT8Dg?rel=0',
    videoId: 'TEa39TjT8Dg',
    channel: 'PowerCert Animated Videos',
    durationApprox: '11 min',
    description: 'Complete breakdown of Domain Name System recursive resolution, root hints, TLD servers, authoritative name servers, and DNS record types.',
    keyTakeaways: [
      'DNS Record Types: A, AAAA, CNAME, MX, TXT (SPF/DKIM), NS, PTR',
      'DNS recursive query flow from local stub resolver to authoritative server',
      'Malicious DNS in SOC: DNS tunneling for data exfiltration and DGA (Domain Generation Algorithms)'
    ]
  },
  {
    id: 'soc-vid-9',
    topicNumber: 9,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'VPN',
    videoTitle: 'VPN Tunneling',
    youtubeUrl: 'https://www.youtube.com/watch?v=1ozFz3GJ4PM',
    directVideoUrl: 'https://www.youtube.com/watch?v=1ozFz3GJ4PM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/1ozFz3GJ4PM?rel=0',
    videoId: '1ozFz3GJ4PM',
    channel: 'PowerCert Animated Videos',
    durationApprox: '10 min',
    description: 'How Virtual Private Networks (VPNs) create encrypted tunnels across untrusted public networks using IPsec and SSL/TLS technologies.',
    keyTakeaways: [
      'Site-to-Site vs Remote Access VPN architectures',
      'Encapsulation, confidentiality, and integrity across the tunnel',
      'Triage of impossible travel alerts and anomalous VPN logins in SOC telemetry'
    ]
  },
  {
    id: 'soc-vid-10',
    topicNumber: 10,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'Windows Event Logs',
    videoTitle: 'Analyzing Windows Event Logs — SOC Analyst Course Demo',
    youtubeUrl: 'https://www.youtube.com/watch?v=IQQRY-edzD8',
    directVideoUrl: 'https://www.youtube.com/watch?v=IQQRY-edzD8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IQQRY-edzD8?rel=0',
    videoId: 'IQQRY-edzD8',
    channel: 'SOC Analyst Course Demo',
    durationApprox: '22 min',
    description: 'Practical walkthrough analyzing native Windows Security, System, and Application logs. Demystifies critical Event IDs like 4624 (Logon), 4625 (Failed Logon), and 4720 (User Created).',
    keyTakeaways: [
      'Key Security Event IDs: 4624 (Logon types 2, 3, 10), 4625 (Brute force), 4672 (Admin privileges assigned)',
      'XML structure of Event Viewer and parsing LogonType attributes',
      'Distinguishing benign admin activity from lateral movement pass-the-hash attacks'
    ]
  },
  {
    id: 'soc-vid-11',
    topicNumber: 11,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'Windows Process Monitoring',
    videoTitle: 'Read Windows Process Logs Like a SOC Analyst (4688 + Sysmon)',
    youtubeUrl: 'https://www.youtube.com/watch?v=MjU3JpnFc8E',
    directVideoUrl: 'https://www.youtube.com/watch?v=MjU3JpnFc8E',
    embedUrl: 'https://www.youtube-nocookie.com/embed/MjU3JpnFc8E?rel=0',
    videoId: 'MjU3JpnFc8E',
    channel: 'SOC Analyst Training',
    durationApprox: '28 min',
    description: 'Deep dive into Windows Process Creation monitoring using Security Event ID 4688 with command-line auditing enabled and Sysinternals Sysmon Event ID 1.',
    keyTakeaways: [
      'Analyzing Parent-Child process hierarchies (e.g. WINWORD.EXE -> CMD.EXE -> POWERSHELL.EXE)',
      'Sysmon Event ID 1 (Process Creation), ID 3 (Network Connection), ID 11 (File Creation)',
      'Detecting LOLBins (Living Off the Land Binaries): certutil, mshta, bitsadmin, wmic'
    ]
  },
  {
    id: 'soc-vid-12',
    topicNumber: 12,
    trackId: 'soc-analyst',
    trackTitle: 'SOC Analyst',
    topicName: 'Windows Security Monitoring',
    videoTitle: 'Windows Security Monitoring Crash Course',
    youtubeUrl: 'https://www.youtube.com/watch?v=a_PzlNyWzjo',
    directVideoUrl: 'https://www.youtube.com/watch?v=a_PzlNyWzjo',
    embedUrl: 'https://www.youtube-nocookie.com/embed/a_PzlNyWzjo?rel=0',
    videoId: 'a_PzlNyWzjo',
    channel: 'Cyber Security Crash Courses',
    durationApprox: '35 min',
    description: 'A masterclass covering end-to-end endpoint monitoring on Windows workstations and domain controllers: telemetry collection, audit policies, and SIEM correlation.',
    keyTakeaways: [
      'Configuring Advanced Audit Policies via Group Policy Objects (GPO)',
      'Detecting privilege escalation and Kerberoasting in Active Directory',
      'Correlating multiple telemetry streams to reconstruct adversary intrusion timelines'
    ]
  }
];

export const PENTESTING_VIDEOS: CuratedVideo[] = PENTESTING_VIDEOS_DATA;

export const THREAT_HUNTER_VIDEOS: CuratedVideo[] = THREAT_HUNTER_VIDEOS_DATA;

export const THREAT_INTEL_VIDEOS: CuratedVideo[] = THREAT_INTEL_VIDEOS_DATA;

export const MALWARE_ANALYST_VIDEOS: CuratedVideo[] = MALWARE_ANALYST_VIDEOS_DATA;

export const SECURITY_ENGINEER_VIDEOS: CuratedVideo[] = SECURITY_ENGINEER_VIDEOS_DATA;

export const NETWORK_SECURITY_VIDEOS: CuratedVideo[] = NETWORK_SECURITY_VIDEOS_DATA;

export const CLOUD_SECURITY_VIDEOS: CuratedVideo[] = CLOUD_SECURITY_VIDEOS_DATA;

export const ALL_CURATED_VIDEOS: CuratedVideo[] = [
  ...SOC_ANALYST_VIDEOS,
  ...PENTESTING_VIDEOS,
  ...THREAT_HUNTER_VIDEOS,
  ...THREAT_INTEL_VIDEOS,
  ...MALWARE_ANALYST_VIDEOS,
  ...SECURITY_ENGINEER_VIDEOS,
  ...NETWORK_SECURITY_VIDEOS,
  ...CLOUD_SECURITY_VIDEOS
];
