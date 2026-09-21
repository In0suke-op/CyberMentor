import { Lesson } from '../types';

export const LESSON_DETAILS: Record<string, Lesson> = {
  'net-les-1': {
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
    videoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    associatedQuizId: 'quiz-net-1',
    resources: [
      { title: 'RFC 9293 - Transmission Control Protocol (TCP) Specification', url: 'https://datatracker.ietf.org/doc/html/rfc9293', type: 'spec' },
      { title: 'SYN Cookies & Linux Kernel TCB Tuning Guide', url: 'https://lwn.net/Articles/277146/', type: 'guide' },
      { title: 'MITRE ATT&CK T1498: Network Denial of Service', url: 'https://attack.mitre.org/techniques/T1498/', type: 'mitre' }
    ],
    content: `
# TCP 3-Way Handshake & SYN Flood Mechanics

## 1. Protocol Architecture
The Transmission Control Protocol (TCP) is a connection-oriented, full-duplex transport layer protocol designed to guarantee in-order, reliable delivery of packet streams.

Before any application layer data (such as HTTP/1.1 or TLS client hellos) can be exchanged, the client and server must establish a Transmission Control Block (TCB) state using the 3-Way Handshake:

\`\`\`text
   Client                                  Server
     |                                       |
     |------- [SYN, Seq=x] ----------------->| (State: SYN_RECEIVED)
     |                                       | Allocates TCB memory
     |<------ [SYN-ACK, Seq=y, Ack=x+1] -----|
     |                                       |
     |------- [ACK, Seq=x+1, Ack=y+1] ------>| (State: ESTABLISHED)
     |                                       |
     |======= Application Data Flow ========|
\`\`\`

## 2. SYN Flood Mechanics (Denial of Service)
In a standard TCP implementation, when the server receives a \`SYN\` packet, it must allocate memory in its half-open connection table (\`backlog queue\`) to track state, sequence numbers, window scaling, and timers.

An attacker sends a massive barrage of spoofed \`SYN\` packets without ever returning the final \`ACK\`:
1. The server allocates TCB structures.
2. The server sends \`SYN-ACK\` and transitions to \`SYN_RECEIVED\`.
3. The server waits for timeout (often 60–120 seconds).
4. The system backlog table fills completely, causing immediate rejection of legitimate connections.

\`\`\`bash
# Examining TCP connection states on Linux host:
netstat -ant | awk '{print $6}' | sort | uniq -c | sort -n
\`\`\`

## 3. Cryptographic Mitigation: SYN Cookies
To defeat SYN flooding without unbounded memory exhaustion, the Linux kernel employs **SYN Cookies** (\`net.ipv4.tcp_syncookies = 1\`):
- The server refuses to allocate any memory for incoming SYN packets.
- Instead, the server encodes the connection state inside the 32-bit initial sequence number (\`ISN\`):
  \`ISN = SHA256(SecretKey, ClientIP, ClientPort, ServerIP, ServerPort, MSS_Bits, Timestamp)\`
- When the legitimate client sends the final \`ACK\` with \`AckNumber = ISN + 1\`, the server subtracts 1, recomputes the cryptographic hash, verifies the timestamp, and only then allocates the TCB!
    `
  },
  'web-les-1': {
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
    associatedQuizId: 'quiz-web-1',
    associatedLabId: 'lab-sqli-01',
    resources: [
      { title: 'OWASP Top 10 A03:2021 - Injection', url: 'https://owasp.org/Top10/A03_2021-Injection/', type: 'spec' },
      { title: 'PortSwigger Web Security Academy: SQL Injection', url: 'https://portswigger.net/web-security/sql-injection', type: 'guide' },
      { title: 'SQLi Cheat Sheet & Payload Bank', url: 'https://github.com/swisskyrepo/PayloadsAllTheThings', type: 'cheatsheet' }
    ],
    content: `
# SQL Injection (SQLi): Vulnerability Deep Dive

## 1. Vulnerability Root Cause
SQL Injection occurs when untrusted user input is directly concatenated into a dynamic database query string instead of being treated strictly as parameterized data.

### Vulnerable Code Example (Node.js / Express):
\`\`\`javascript
// ANTI-PATTERN: DO NOT USE IN PRODUCTION
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // Dynamic string interpolation breaks query logic:
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  const [user] = await db.query(query);
  if (user) return res.json({ token: generateJwt(user) });
  res.status(401).json({ error: 'Invalid credentials' });
});
\`\`\`

If an adversary supplies:
\`username = "admin' --"\`
The query becomes:
\`SELECT * FROM users WHERE username = 'admin' --' AND password = '...'\`
The double-dash comment \`--\` truncates the remainder of the SQL statement, executing the query strictly as \`WHERE username = 'admin'\`, granting instant unauthorized authentication!

## 2. Attack Classifications
1. **In-Band (Classic) SQLi**: The attacker uses the same channel of communication to launch the attack and gather results (e.g., Error-Based, UNION-Based).
2. **Inferential (Blind) SQLi**: The server does not reflect database content on the page, but the attacker reconstructs the database character-by-character through boolean conditions or time delays (\`pg_sleep(5)\`, \`WAITFOR DELAY '0:0:5'\`).
3. **Out-of-Band (OOB) SQLi**: The database triggers DNS lookups or HTTP requests to an external listener controlled by the attacker (e.g., Oracle \`UTL_HTTP\`).

## 3. The Definitive Defense: Prepared Statements
Parameterization enforces a strict separation between code interpretation and data evaluation:
\`\`\`typescript
// SECURE PATTERN: Parameterized Query
const query = 'SELECT id, username, role, password_hash FROM users WHERE username = $1';
const result = await db.query(query, [username]);
\`\`\`
The database parser compiles the query structure once. User parameters are passed strictly as raw literal bytes, making syntax breaking mathematically impossible.
    `
  },
  'soc-les-1': {
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
    associatedQuizId: 'quiz-soc-1',
    associatedLabId: 'lab-privesc-04',
    resources: [
      { title: 'Microsoft Security Auditing Reference', url: 'https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624', type: 'spec' },
      { title: 'Sysinternals Sysmon Configuration by SwiftOnSecurity', url: 'https://github.com/SwiftOnSecurity/sysmon-config', type: 'guide' },
      { title: 'MITRE ATT&CK T1078: Valid Accounts', url: 'https://attack.mitre.org/techniques/T1078/', type: 'mitre' }
    ],
    content: `
# Windows Event Logs & Sysmon Threat Hunting

## 1. High-Value Security Event IDs
As a SOC analyst or Incident Responder, mastering Windows Security Event Logs is mandatory for timeline reconstruction and identifying attacker persistence.

| Event ID | Name / Description | Crucial Fields to Inspect |
|---|---|---|
| **4624** | Successful Account Logon | \`LogonType\` (2=Interactive, 3=Network, 10=RDP), \`TargetUserName\`, \`IpAddress\` |
| **4625** | Failed Account Logon | \`FailureReason\`, \`SubStatus\` (0xC000006A = bad password, 0xC0000072 = disabled) |
| **4688** | Process Creation (Audit Process Tracking) | \`NewProcessName\`, \`CommandLine\`, \`ParentProcessName\` |
| **4720** | User Account Created | \`TargetUserName\`, \`SubjectUserName\` (Admin creating account) |
| **7045** | Service Installed (System Log) | \`ServiceName\`, \`ImagePath\` (Often lateral movement e.g. PsExec) |

## 2. Understanding LogonType Nuances
When reviewing Event ID 4624:
- **LogonType 2 (Interactive)**: Physical console login (keyboard/mouse directly attached).
- **LogonType 3 (Network)**: SMB access, file share access, or Kerberos network ticket usage (common during lateral movement).
- **LogonType 7 (Unlock)**: User unlocked workstation.
- **LogonType 10 (RemoteInteractive)**: Remote Desktop Protocol (RDP) connection. Note the source IP address in the event!

## 3. Sysmon (System Monitor) Power
Standard Windows Event 4688 does not log process command lines by default unless Group Policy is explicitly configured. Microsoft Sysmon fills this critical gap:
- **Sysmon Event 1**: Process creation with full hashes (SHA256, MD5) and command line arguments.
- **Sysmon Event 3**: Network connection initiated by executable.
- **Sysmon Event 7**: Image loaded (DLL injection detection).
- **Sysmon Event 8**: \`CreateRemoteThread\` detection (used by Cobalt Strike, Metasploit, Mimikatz).
    `
  }
};
