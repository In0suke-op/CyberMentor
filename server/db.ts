import crypto from 'crypto';
import {
  User,
  TopicMastery,
  StudentNote,
  Course,
  Lab,
  IncidentScenario,
  Certification,
  Badge,
  UserBadgesSummary,
  ProgressAnalyticsSummary,
  ProgressDataPoint,
  MajorMilestone
} from '../src/types';
import { COURSES, CTF_LABS, INCIDENT_SCENARIOS, CERTIFICATIONS } from '../src/data/cyberData';

// Salted hash helper for CTF flags (constant-time verification)
export function hashFlag(flag: string, salt: string = 'cybermentor-ctf-salt-2026'): string {
  return crypto.createHmac('sha256', salt).update(flag.trim()).digest('hex');
}

// Server-authoritative quizzes with correct answers masked from clients
export interface ServerQuizQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'boolean';
  options: string[];
  correctIndices: number[];
  points: number;
  explanation: string;
}

export interface ServerQuiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  passingScorePercent: number;
  xpReward: number;
  timeLimitSeconds: number;
  questions: ServerQuizQuestion[];
}

export const SERVER_QUIZZES: Record<string, ServerQuiz> = {
  'quiz-net-1': {
    id: 'quiz-net-1',
    courseId: 'netsec-101',
    lessonId: 'net-les-1',
    title: 'Assessment: TCP 3-Way Handshake & SYN Floods',
    passingScorePercent: 75,
    xpReward: 80,
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'q1',
        text: 'What sequence of TCP control flags completes the standard connection establishment between client and server?',
        type: 'single',
        options: [
          'SYN -> ACK -> FIN',
          'SYN -> SYN-ACK -> ACK',
          'RST -> SYN -> ACK',
          'ACK -> SYN -> PSH'
        ],
        correctIndices: [1],
        points: 25,
        explanation: 'The TCP 3-way handshake begins with client sending SYN, server acknowledging with SYN-ACK, and client concluding with ACK.'
      },
      {
        id: 'q2',
        text: 'What is the primary advantage of Linux SYN Cookies (tcp_syncookies) in mitigating SYN flood attacks?',
        type: 'single',
        options: [
          'It drops all inbound packets from external IP addresses',
          'It encodes connection state mathematically in the 32-bit ISN sequence number, preventing state allocation until final ACK',
          'It forces clients to authenticate using asymmetric RSA signatures',
          'It automatically reroutes traffic to Cloudflare via BGP'
        ],
        correctIndices: [1],
        points: 25,
        explanation: 'SYN Cookies eliminate the half-open backlog exhaustion by encoding the connection parameters into the Initial Sequence Number (ISN) with a cryptographic MAC.'
      },
      {
        id: 'q3',
        text: 'Which state in the TCP finite state machine does the server enter immediately after transmitting SYN-ACK to a client?',
        type: 'single',
        options: ['LISTEN', 'SYN_RECEIVED', 'ESTABLISHED', 'TIME_WAIT'],
        correctIndices: [1],
        points: 25,
        explanation: 'After receiving a SYN and replying with SYN-ACK, the server resides in the SYN_RECEIVED state awaiting the client ACK.'
      },
      {
        id: 'q4',
        text: 'Which of the following TCP flags are commonly utilized in stealth port scans such as Nmap Xmas scan? (Select all that apply)',
        type: 'multiple',
        options: ['FIN', 'PSH', 'URG', 'SYN'],
        correctIndices: [0, 1, 2],
        points: 25,
        explanation: 'An Xmas scan illuminates the packet like a Christmas tree by activating the FIN, PSH, and URG flags together without SYN or ACK.'
      }
    ]
  },
  'quiz-web-1': {
    id: 'quiz-web-1',
    courseId: 'websec-201',
    lessonId: 'web-les-1',
    title: 'Assessment: SQL Injection Mechanics & Prevention',
    passingScorePercent: 80,
    xpReward: 90,
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'qw1',
        text: 'Why do Parameterized Queries (Prepared Statements) definitively neutralize SQL Injection?',
        type: 'single',
        options: [
          'They encode all user strings using base64',
          'The database query structure is compiled first, forcing user inputs to be evaluated strictly as data parameters rather than executable SQL syntax',
          'They execute queries in an isolated Docker container',
          'They strip all quotation marks before sending to the database'
        ],
        correctIndices: [1],
        points: 30,
        explanation: 'Prepared statements guarantee that the database engine parses SQL semantics prior to binding data variables, neutralizing input syntax escaping.'
      },
      {
        id: 'qw2',
        text: 'In a UNION-based SQL Injection attack, what condition must be satisfied between the original query and the injected SELECT query?',
        type: 'single',
        options: [
          'Both queries must run under the postgres superuser role',
          'Both queries must have identical number of columns and compatible data types',
          'Both queries must have zero WHERE clauses',
          'The target table must be encrypted with AES'
        ],
        correctIndices: [1],
        points: 35,
        explanation: 'The SQL UNION operator requires both operands to contain the exact same column count and compatible data types in corresponding columns.'
      },
      {
        id: 'qw3',
        text: 'Which SQL function can be leveraged by an attacker to execute Time-Based Blind SQLi in PostgreSQL?',
        type: 'single',
        options: ['SLEEP()', 'pg_sleep()', 'WAITFOR DELAY', 'BENCHMARK()'],
        correctIndices: [1],
        points: 35,
        explanation: 'PostgreSQL provides pg_sleep(seconds). SLEEP() is MySQL, and WAITFOR DELAY is Microsoft SQL Server.'
      }
    ]
  },
  'quiz-soc-1': {
    id: 'quiz-soc-1',
    courseId: 'soc-401',
    lessonId: 'soc-les-1',
    title: 'Assessment: Windows Event Log Triage & Forensics',
    passingScorePercent: 75,
    xpReward: 100,
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'qs1',
        text: 'In Windows Event Security auditing, what does LogonType 3 inside Event ID 4624 indicate?',
        type: 'single',
        options: [
          'Interactive console login directly at physical monitor',
          'Network logon via SMB, RPC, or mapped shared folder',
          'Remote Desktop Protocol (RDP) connection',
          'Scheduled task execution'
        ],
        correctIndices: [1],
        points: 30,
        explanation: 'LogonType 3 represents a Network logon, frequently generated when accessing network shares, remote WMI, or lateral movement over SMB.'
      },
      {
        id: 'qs2',
        text: 'Which Sysmon Event ID records when a process creates a remote thread into another process (a signature artifact of Mimikatz or Cobalt Strike DLL injection)?',
        type: 'single',
        options: ['Sysmon Event 1', 'Sysmon Event 3', 'Sysmon Event 8', 'Sysmon Event 11'],
        correctIndices: [2],
        points: 35,
        explanation: 'Sysmon Event 8 records CreateRemoteThread API calls, a core indicator of process injection techniques (MITRE T1055).'
      },
      {
        id: 'qs3',
        text: 'When investigating failed logons (Event ID 4625), what does SubStatus 0xC000006A signify?',
        type: 'single',
        options: [
          'User account is locked out',
          'User entered an incorrect password',
          'User account does not exist in domain',
          'User attempted login outside authorized hours'
        ],
        correctIndices: [1],
        points: 35,
        explanation: 'SubStatus 0xC000006A specifically maps to STATUS_WRONG_PASSWORD.'
      }
    ]
  }
};

// Authoritative CTF lab flags with salted SHA256 hashes
export const LAB_FLAG_HASHES: Record<string, string> = {
  'lab-sqli-01': hashFlag('FLAG{sqli_un10n_auth_byp4ss_m4st3r_2026}'),
  'lab-idor-02': hashFlag('FLAG{1d0r_h0r1z0nt4l_p4t13nt_3xf1l_992}'),
  'lab-xss-03': hashFlag('FLAG{xss_c00k13_th3ft_csp_3v4s10n_31337}'),
  'lab-privesc-04': hashFlag('FLAG{su1d_t4r_w1ldc4rd_r00t_sh3ll_pwn3d}')
};

export interface UserLessonProgress {
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  completedAt: string;
  xpEarned: number;
}

export interface UserQuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  scorePercent: number;
  passed: boolean;
  xpEarned: number;
  attemptedAt: string;
}

export interface UserLabProgress {
  userId: string;
  labId: string;
  completed: boolean;
  completedAt: string;
  xpEarned: number;
  unlockedHintIds: string[];
}

export interface UserScenarioProgress {
  userId: string;
  scenarioId: string;
  completed: boolean;
  completedAt: string;
  finalScore: number;
  xpEarned: number;
}

// In-memory Database with atomic state methods
class Database {
  users: Map<string, User> = new Map();
  userCredentials: Map<string, { passwordHash: string; salt: string }> = new Map();
  topicMasteries: Map<string, TopicMastery> = new Map(); // key: `${userId}:${topicId}`
  lessonProgress: Map<string, UserLessonProgress> = new Map(); // key: `${userId}:${lessonId}`
  quizAttempts: UserQuizAttempt[] = [];
  labProgress: Map<string, UserLabProgress> = new Map(); // key: `${userId}:${labId}`
  scenarioProgress: Map<string, UserScenarioProgress> = new Map(); // key: `${userId}:${scenarioId}`
  notes: Map<string, StudentNote> = new Map();
  completedMilestones: Set<string> = new Set(); // `${userId}:${milestoneId}`

  constructor() {
    this.seedDefaultUser();
  }

  private seedDefaultUser() {
    // Seed default student account: analyst@cybermentor.dev / CyberAdmin2026!
    const defaultUserId = 'usr-cadet-001';
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync('CyberCadet2026!', salt, 600000, 32, 'sha256').toString('hex');

    const user: User = {
      id: defaultUserId,
      email: 'cadet@cybermentor.io',
      username: 'CyberCadet',
      fullName: 'Alex Vance',
      role: 'student',
      xp: 420,
      level: 2,
      dailyStreak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      freezeShields: 2,
      dailyXpEarned: 120,
      dailyXpResetDate: new Date().toISOString().split('T')[0],
      skillTier: 'intermediate',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    };

    this.users.set(defaultUserId, user);
    this.userCredentials.set(defaultUserId, { passwordHash, salt });

    // Seed alternate analyst@cybermentor.dev with CyberAdmin2026!
    const analystId = 'usr-analyst-002';
    const salt2 = crypto.randomBytes(16).toString('hex');
    const hash2 = crypto.pbkdf2Sync('CyberAdmin2026!', salt2, 600000, 32, 'sha256').toString('hex');
    this.users.set(analystId, {
      ...user,
      id: analystId,
      email: 'analyst@cybermentor.dev',
      username: 'AnalystVance'
    });
    this.userCredentials.set(analystId, { passwordHash: hash2, salt: salt2 });

    // Seed topic masteries
    const initialTopics = [
      { id: 'tcp-handshake', name: 'TCP/IP Handshake & Flags', domain: 'Network Security', score: 85 },
      { id: 'sqli', name: 'SQL Injection Exploitation & Defense', domain: 'Web Security', score: 78 },
      { id: 'event-logs', name: 'Windows Security Event Logs', domain: 'Incident Response', score: 62 },
      { id: 'crypto-primitives', name: 'Symmetric & Asymmetric Primitives', domain: 'Cryptography', score: 45 },
      { id: 'linux-suid', name: 'Linux PrivEsc & SUID Binaries', domain: 'System Security', score: 50 }
    ];

    for (const t of initialTopics) {
      const key = `${defaultUserId}:${t.id}`;
      this.topicMasteries.set(key, {
        topicId: t.id,
        topicName: t.name,
        domain: t.domain,
        masteryScore: t.score,
        attemptsCount: 2,
        lastTestedAt: new Date().toISOString()
      });
    }

    // Seed notes
    const noteId = 'note-init-01';
    this.notes.set(noteId, {
      id: noteId,
      userId: defaultUserId,
      title: 'Active Directory Triage Checklist',
      content: '# Immediate Actions on AD Alert:\n- Check Event ID 4624 LogonType 3 for unusual source IPs\n- Isolate affected endpoint from network\n- Check KRBTGT last password change time\n- Dump RAM memory image before pulling power',
      courseId: 'soc-401',
      courseTitle: 'SOC Analyst & Enterprise Incident Response',
      tags: ['ad', 'triage', 'incident-response', 'krbtgt'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Seed completed activities across courses, labs, and scenarios for default cadet
    const DAY_MS = 86400000;
    // 3 days ago: completed foundational network security lesson
    this.lessonProgress.set(`${defaultUserId}:net-les-1`, {
      userId: defaultUserId,
      lessonId: 'net-les-1',
      courseId: 'netsec-101',
      completed: true,
      completedAt: new Date(Date.now() - 3 * DAY_MS).toISOString(),
      xpEarned: 50
    });

    // 2 days ago: completed web security lesson
    this.lessonProgress.set(`${defaultUserId}:web-les-1`, {
      userId: defaultUserId,
      lessonId: 'web-les-1',
      courseId: 'websec-201',
      completed: true,
      completedAt: new Date(Date.now() - 2 * DAY_MS).toISOString(),
      xpEarned: 60
    });

    // 1 day ago: captured first CTF sandbox flag
    this.labProgress.set(`${defaultUserId}:lab-sqli-01`, {
      userId: defaultUserId,
      labId: 'lab-sqli-01',
      completed: true,
      completedAt: new Date(Date.now() - 1 * DAY_MS).toISOString(),
      xpEarned: 120,
      unlockedHintIds: []
    });

    // Today: contained initial ransomware scenario
    this.scenarioProgress.set(`${defaultUserId}:sc-lockbit-01`, {
      userId: defaultUserId,
      scenarioId: 'sc-lockbit-01',
      completed: true,
      completedAt: new Date().toISOString(),
      finalScore: 92,
      xpEarned: 190
    });
  }

  // Authoritative XP adder with daily cap check (1,500 XP / day max)
  addXp(userId: string, xpAmount: number): { awarded: number; currentXp: number; level: number } {
    const user = this.users.get(userId);
    if (!user) return { awarded: 0, currentXp: 0, level: 1 };

    const today = new Date().toISOString().split('T')[0];
    if (user.dailyXpResetDate !== today) {
      user.dailyXpEarned = 0;
      user.dailyXpResetDate = today;
    }

    const DAILY_XP_CAP = 1500;
    const remainingCap = Math.max(0, DAILY_XP_CAP - user.dailyXpEarned);
    const awarded = Math.min(xpAmount, remainingCap);

    user.xp += awarded;
    user.dailyXpEarned += awarded;

    // Authoritative Level Calculation: Level = Math.floor(Math.sqrt(XP / 100)) + 1
    user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;

    // Daily streak management
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        user.dailyStreak += 1;
      } else {
        // Did user have freeze shield?
        if (user.freezeShields > 0) {
          user.freezeShields -= 1;
        } else {
          user.dailyStreak = 1;
        }
      }
      user.lastActiveDate = today;
    }

    return { awarded, currentXp: user.xp, level: user.level };
  }

  updateTopicMastery(userId: string, topicId: string, topicName: string, domain: string, scoreAchieved: number) {
    const key = `${userId}:${topicId}`;
    const existing = this.topicMasteries.get(key);
    if (existing) {
      // Exponential Moving Average (EMA): newScore = old * 0.4 + achieved * 0.6
      existing.masteryScore = Math.round(existing.masteryScore * 0.4 + scoreAchieved * 0.6);
      existing.attemptsCount += 1;
      existing.lastTestedAt = new Date().toISOString();
    } else {
      this.topicMasteries.set(key, {
        topicId,
        topicName,
        domain,
        masteryScore: scoreAchieved,
        attemptsCount: 1,
        lastTestedAt: new Date().toISOString()
      });
    }
  }

  getUserBadges(userId: string): UserBadgesSummary {
    const user = this.users.get(userId);

    // 1. Calculate user achievements progress
    const completedLessons: UserLessonProgress[] = [];
    for (const prog of this.lessonProgress.values()) {
      if (prog.userId === userId && prog.completed) {
        completedLessons.push(prog);
      }
    }

    const completedLabs: UserLabProgress[] = [];
    for (const prog of this.labProgress.values()) {
      if (prog.userId === userId && prog.completed) {
        completedLabs.push(prog);
      }
    }

    const completedScenarios: UserScenarioProgress[] = [];
    for (const prog of this.scenarioProgress.values()) {
      if (prog.userId === userId && prog.completed) {
        completedScenarios.push(prog);
      }
    }

    const lessonsDone = completedLessons.length;
    const labsDone = completedLabs.length;
    const scenariosDone = completedScenarios.length;

    // Specific milestones
    const netsecLessonsDone = completedLessons.filter(l => l.courseId === 'netsec-101').length;
    const sqliLabDone = completedLabs.find(l => l.labId === 'lab-sqli-01');
    const privescLabDone = completedLabs.find(l => l.labId === 'lab-privesc-04');
    const ransomwareScenarioDone = completedScenarios.find(s => s.scenarioId === 'scen-ransomware-01');

    // Timestamps for unlocked badges
    const firstLessonTime = completedLessons[0]?.completedAt;
    const firstLabTime = completedLabs[0]?.completedAt;
    const firstScenarioTime = completedScenarios[0]?.completedAt;

    const badges: Badge[] = [
      // --- LESSONS BADGES ---
      {
        id: 'badge-lesson-first',
        title: 'First Packet Sent',
        description: 'Completed your first technical cybersecurity curriculum lesson.',
        category: 'lessons',
        rarity: 'common',
        icon: 'BookOpen',
        xpReward: 50,
        criteriaLabel: 'Complete 1 curriculum lesson',
        unlocked: lessonsDone >= 1,
        unlockedAt: firstLessonTime,
        progress: {
          current: Math.min(1, lessonsDone),
          target: 1,
          percentage: Math.min(100, Math.round((lessonsDone / 1) * 100))
        },
        actionHint: {
          type: 'course',
          targetId: 'netsec-101',
          label: 'Explore Curriculum'
        }
      },
      {
        id: 'badge-lesson-scholar',
        title: 'Protocol Scholar',
        description: 'Completed 3 curriculum lessons across defense and web security tracks.',
        category: 'lessons',
        rarity: 'rare',
        icon: 'GraduationCap',
        xpReward: 100,
        criteriaLabel: 'Complete 3 curriculum lessons',
        unlocked: lessonsDone >= 3,
        unlockedAt: completedLessons[2]?.completedAt,
        progress: {
          current: Math.min(3, lessonsDone),
          target: 3,
          percentage: Math.min(100, Math.round((lessonsDone / 3) * 100))
        },
        actionHint: {
          type: 'course',
          targetId: 'netsec-101',
          label: 'Continue Lessons'
        }
      },
      {
        id: 'badge-lesson-netsec',
        title: 'Network Defense Specialist',
        description: 'Mastered all foundational network defense and packet inspection lessons.',
        category: 'lessons',
        rarity: 'rare',
        icon: 'Network',
        xpReward: 150,
        criteriaLabel: 'Complete all 4 Network Defense lessons',
        unlocked: netsecLessonsDone >= 4,
        unlockedAt: netsecLessonsDone >= 4 ? completedLessons.find(l => l.courseId === 'netsec-101')?.completedAt : undefined,
        progress: {
          current: Math.min(4, netsecLessonsDone),
          target: 4,
          percentage: Math.min(100, Math.round((netsecLessonsDone / 4) * 100))
        },
        actionHint: {
          type: 'course',
          targetId: 'netsec-101',
          label: 'Study NetSec Track'
        }
      },
      {
        id: 'badge-lesson-master',
        title: 'Grand Cyber Scholar',
        description: 'Demonstrated extensive domain mastery by completing 5 or more technical lessons.',
        category: 'lessons',
        rarity: 'epic',
        icon: 'Library',
        xpReward: 250,
        criteriaLabel: 'Complete 5 curriculum lessons',
        unlocked: lessonsDone >= 5,
        unlockedAt: completedLessons[4]?.completedAt,
        progress: {
          current: Math.min(5, lessonsDone),
          target: 5,
          percentage: Math.min(100, Math.round((lessonsDone / 5) * 100))
        },
        actionHint: {
          type: 'course',
          targetId: 'soc-401',
          label: 'Master Lessons'
        }
      },

      // --- CTF LABS BADGES ---
      {
        id: 'badge-lab-first',
        title: 'Flag Captor',
        description: 'Successfully penetrated a target system and captured your first verified CTF flag.',
        category: 'labs',
        rarity: 'common',
        icon: 'Flag',
        xpReward: 75,
        criteriaLabel: 'Capture 1 CTF sandbox flag',
        unlocked: labsDone >= 1,
        unlockedAt: firstLabTime,
        progress: {
          current: Math.min(1, labsDone),
          target: 1,
          percentage: Math.min(100, Math.round((labsDone / 1) * 100))
        },
        actionHint: {
          type: 'lab',
          targetId: 'lab-sqli-01',
          label: 'Launch SQLi Sandbox'
        }
      },
      {
        id: 'badge-lab-sqli',
        title: 'Injection Infiltrator',
        description: 'Bypassed authentication using SQL Injection string manipulation in the sandbox terminal.',
        category: 'labs',
        rarity: 'rare',
        icon: 'Terminal',
        xpReward: 150,
        criteriaLabel: 'Capture flag in SQLi Authentication Bypass lab',
        unlocked: !!sqliLabDone,
        unlockedAt: sqliLabDone?.completedAt,
        progress: {
          current: sqliLabDone ? 1 : 0,
          target: 1,
          percentage: sqliLabDone ? 100 : 0
        },
        actionHint: {
          type: 'lab',
          targetId: 'lab-sqli-01',
          label: 'Launch SQLi Lab'
        }
      },
      {
        id: 'badge-lab-privesc',
        title: 'Root Escalation Operator',
        description: 'Exploited Linux SUID tar wildcard execution to capture the root system shell flag.',
        category: 'labs',
        rarity: 'epic',
        icon: 'KeyRound',
        xpReward: 200,
        criteriaLabel: 'Capture flag in Linux PrivEsc SUID lab',
        unlocked: !!privescLabDone,
        unlockedAt: privescLabDone?.completedAt,
        progress: {
          current: privescLabDone ? 1 : 0,
          target: 1,
          percentage: privescLabDone ? 100 : 0
        },
        actionHint: {
          type: 'lab',
          targetId: 'lab-privesc-04',
          label: 'Launch PrivEsc Lab'
        }
      },
      {
        id: 'badge-lab-pwnmaster',
        title: 'Elite Pwn Master',
        description: 'Captured flags in 3 or more hands-on CTF sandbox challenge environments.',
        category: 'labs',
        rarity: 'legendary',
        icon: 'Trophy',
        xpReward: 350,
        criteriaLabel: 'Capture flags in 3 CTF sandbox labs',
        unlocked: labsDone >= 3,
        unlockedAt: completedLabs[2]?.completedAt,
        progress: {
          current: Math.min(3, labsDone),
          target: 3,
          percentage: Math.min(100, Math.round((labsDone / 3) * 100))
        },
        actionHint: {
          type: 'lab',
          targetId: 'lab-idor-02',
          label: 'Solve More Labs'
        }
      },

      // --- SCENARIOS (CRISIS ROOMS) BADGES ---
      {
        id: 'badge-scen-first',
        title: 'First Responder',
        description: 'Successfully contained and resolved your first enterprise incident crisis simulation.',
        category: 'scenarios',
        rarity: 'common',
        icon: 'AlertTriangle',
        xpReward: 75,
        criteriaLabel: 'Resolve 1 incident crisis simulation',
        unlocked: scenariosDone >= 1,
        unlockedAt: firstScenarioTime,
        progress: {
          current: Math.min(1, scenariosDone),
          target: 1,
          percentage: Math.min(100, Math.round((scenariosDone / 1) * 100))
        },
        actionHint: {
          type: 'scenario',
          targetId: 'scen-ransomware-01',
          label: 'Enter Incident Room'
        }
      },
      {
        id: 'badge-scen-ransomware',
        title: 'LockBit Annihilator',
        description: 'Contained LockBit 3.0 ransomware outbreak and executed KRBTGT double-reset.',
        category: 'scenarios',
        rarity: 'rare',
        icon: 'ShieldAlert',
        xpReward: 150,
        criteriaLabel: 'Resolve LockBit 3.0 Ransomware crisis scenario',
        unlocked: !!ransomwareScenarioDone,
        unlockedAt: ransomwareScenarioDone?.completedAt,
        progress: {
          current: ransomwareScenarioDone ? 1 : 0,
          target: 1,
          percentage: ransomwareScenarioDone ? 100 : 0
        },
        actionHint: {
          type: 'scenario',
          targetId: 'scen-ransomware-01',
          label: 'Play LockBit Scenario'
        }
      },
      {
        id: 'badge-scen-commander',
        title: 'SOC Incident Commander',
        description: 'Neutralized both enterprise crisis rooms, preserving volatile digital evidence.',
        category: 'scenarios',
        rarity: 'epic',
        icon: 'Radio',
        xpReward: 250,
        criteriaLabel: 'Resolve 2 incident crisis simulations',
        unlocked: scenariosDone >= 2,
        unlockedAt: completedScenarios[1]?.completedAt,
        progress: {
          current: Math.min(2, scenariosDone),
          target: 2,
          percentage: Math.min(100, Math.round((scenariosDone / 2) * 100))
        },
        actionHint: {
          type: 'scenario',
          targetId: 'scen-insider-02',
          label: 'Triage Insider Threat'
        }
      },

      // --- MASTERY / MULTI-DOMAIN BADGES ---
      {
        id: 'badge-mastery-triad',
        title: 'Cyber Defense Triad',
        description: 'Attained true cross-disciplinary readiness: completed a lesson, a lab, and a scenario.',
        category: 'mastery',
        rarity: 'epic',
        icon: 'Compass',
        xpReward: 300,
        criteriaLabel: 'Complete 1 lesson, 1 lab, and 1 scenario',
        unlocked: lessonsDone >= 1 && labsDone >= 1 && scenariosDone >= 1,
        unlockedAt: (lessonsDone >= 1 && labsDone >= 1 && scenariosDone >= 1) ? new Date().toISOString() : undefined,
        progress: {
          current: (lessonsDone >= 1 ? 1 : 0) + (labsDone >= 1 ? 1 : 0) + (scenariosDone >= 1 ? 1 : 0),
          target: 3,
          percentage: Math.round((((lessonsDone >= 1 ? 1 : 0) + (labsDone >= 1 ? 1 : 0) + (scenariosDone >= 1 ? 1 : 0)) / 3) * 100)
        }
      },
      {
        id: 'badge-mastery-sentinel',
        title: 'SOC Cyber Sentinel',
        description: 'Achieved Level 3+ rank with 500+ XP in authoritative cybersecurity operations.',
        category: 'mastery',
        rarity: 'legendary',
        icon: 'ShieldCheck',
        xpReward: 500,
        criteriaLabel: 'Attain Level 3 and 500+ XP',
        unlocked: (user?.level || 1) >= 3 && (user?.xp || 0) >= 500,
        unlockedAt: ((user?.level || 1) >= 3 && (user?.xp || 0) >= 500) ? new Date().toISOString() : undefined,
        progress: {
          current: Math.min(500, user?.xp || 0),
          target: 500,
          percentage: Math.min(100, Math.round(((user?.xp || 0) / 500) * 100))
        }
      }
    ];

    const unlockedCount = badges.filter(b => b.unlocked).length;
    const totalXpFromBadges = badges.filter(b => b.unlocked).reduce((sum, b) => sum + b.xpReward, 0);

    return {
      totalBadges: badges.length,
      unlockedCount,
      totalXpFromBadges,
      completionPercentage: Math.round((unlockedCount / badges.length) * 100),
      lessonsCompletedCount: lessonsDone,
      labsCompletedCount: labsDone,
      scenariosCompletedCount: scenariosDone,
      badges
    };
  }

  // Authoritative Progress Analytics Engine
  getProgressAnalytics(userId: string): ProgressAnalyticsSummary {
    const totalCourses = 4;
    const totalLessons = 12; // 4 in netsec, 3 in websec, 3 in soc, 2 in cloudsec
    const totalLabs = 6;
    const totalScenarios = 4;

    const userLessons = Array.from(this.lessonProgress.values()).filter(
      (lp) => lp.userId === userId && lp.completed
    );
    const userLabs = Array.from(this.labProgress.values()).filter(
      (lp) => lp.userId === userId && lp.completed
    );
    const userScenarios = Array.from(this.scenarioProgress.values()).filter(
      (sp) => sp.userId === userId && sp.completed
    );

    const completedLessons = userLessons.length;
    const completedLabs = userLabs.length;
    const completedScenarios = userScenarios.length;

    // Course completion: count courses where all lessons are completed
    const netsecLessons = ['net-les-1', 'net-les-2', 'net-les-3', 'net-les-4'];
    const websecLessons = ['web-les-1', 'web-les-2', 'web-les-3'];
    const socLessons = ['soc-les-1', 'soc-les-2', 'soc-les-3'];
    const cloudsecLessons = ['cloud-les-1', 'cloud-les-2'];

    const isCourseComplete = (lessonIds: string[]) =>
      lessonIds.every((id) => userLessons.some((l) => l.lessonId === id));

    let completedCourses = 0;
    if (isCourseComplete(netsecLessons)) completedCourses++;
    if (isCourseComplete(websecLessons)) completedCourses++;
    if (isCourseComplete(socLessons)) completedCourses++;
    if (isCourseComplete(cloudsecLessons)) completedCourses++;

    const coursesRate = Math.min(100, Math.round((completedLessons / totalLessons) * 100));
    const labsRate = Math.min(100, Math.round((completedLabs / totalLabs) * 100));
    const scenariosRate = Math.min(100, Math.round((completedScenarios / totalScenarios) * 100));
    const overallCompletionRate = Math.min(
      100,
      Math.round(
        ((completedLessons + completedLabs + completedScenarios) /
          (totalLessons + totalLabs + totalScenarios)) *
          100
      )
    );

    // Generate 14-day timeline (from 13 days ago to today)
    const timeline: ProgressDataPoint[] = [];
    const now = Date.now();
    const DAY_MS = 86400000;

    for (let i = 13; i >= 0; i--) {
      const dayTimestamp = now - i * DAY_MS;
      const dateObj = new Date(dayTimestamp);
      const dateStr = dateObj.toISOString().split('T')[0];
      const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endOfDay = new Date(dateStr + 'T23:59:59.999Z').getTime();

      const cumulativeLessons = userLessons.filter(
        (l) => new Date(l.completedAt).getTime() <= endOfDay
      ).length;

      const cumulativeLabs = userLabs.filter(
        (l) => new Date(l.completedAt).getTime() <= endOfDay
      ).length;

      const cumulativeScenarios = userScenarios.filter(
        (s) => new Date(s.completedAt).getTime() <= endOfDay
      ).length;

      const cRate = Math.min(100, Math.round((cumulativeLessons / totalLessons) * 100));
      const lRate = Math.min(100, Math.round((cumulativeLabs / totalLabs) * 100));
      const sRate = Math.min(100, Math.round((cumulativeScenarios / totalScenarios) * 100));
      const oRate = Math.min(
        100,
        Math.round(
          ((cumulativeLessons + cumulativeLabs + cumulativeScenarios) /
            (totalLessons + totalLabs + totalScenarios)) *
            100
        )
      );

      const xpFromLessons = userLessons
        .filter((l) => new Date(l.completedAt).getTime() <= endOfDay)
        .reduce((sum, l) => sum + (l.xpEarned || 0), 0);
      const xpFromLabs = userLabs
        .filter((l) => new Date(l.completedAt).getTime() <= endOfDay)
        .reduce((sum, l) => sum + (l.xpEarned || 0), 0);
      const xpFromScenarios = userScenarios
        .filter((s) => new Date(s.completedAt).getTime() <= endOfDay)
        .reduce((sum, s) => sum + (s.xpEarned || 0), 0);

      timeline.push({
        date: dateStr,
        label,
        coursesRate: cRate,
        labsRate: lRate,
        scenariosRate: sRate,
        overallRate: oRate,
        lessonsCompleted: cumulativeLessons,
        labsCompleted: cumulativeLabs,
        scenariosCompleted: cumulativeScenarios,
        xpEarned: xpFromLessons + xpFromLabs + xpFromScenarios
      });
    }

    // Weekly velocity (past 4 weeks)
    const weeklyVelocity = [
      { week: 'W-3', lessons: 0, labs: 0, scenarios: 0, xp: 0 },
      { week: 'W-2', lessons: 0, labs: 0, scenarios: 0, xp: 0 },
      { week: 'Last Week', lessons: 1, labs: 0, scenarios: 0, xp: 50 },
      {
        week: 'This Week',
        lessons: Math.max(1, completedLessons),
        labs: completedLabs,
        scenarios: completedScenarios,
        xp: userLessons.reduce((sum, l) => sum + l.xpEarned, 0) + userLabs.reduce((sum, l) => sum + l.xpEarned, 0) + userScenarios.reduce((sum, s) => sum + s.xpEarned, 0)
      }
    ];

    // Domain Breakdown
    const domainBreakdown = [
      {
        domain: 'Network Defense',
        coursesRate: Math.min(100, Math.round((userLessons.filter(l => l.courseId === 'netsec-101').length / 4) * 100)),
        labsRate: Math.min(100, Math.round((userLabs.filter(l => l.labId.includes('pcap') || l.labId.includes('net')).length / 2) * 100)),
        scenariosRate: 0,
        totalUnits: 6,
        completedUnits: userLessons.filter(l => l.courseId === 'netsec-101').length
      },
      {
        domain: 'Web Pentesting',
        coursesRate: Math.min(100, Math.round((userLessons.filter(l => l.courseId === 'websec-201').length / 3) * 100)),
        labsRate: Math.min(100, Math.round((userLabs.filter(l => l.labId.includes('sqli') || l.labId.includes('idor') || l.labId.includes('xss')).length / 3) * 100)),
        scenariosRate: 0,
        totalUnits: 6,
        completedUnits: userLessons.filter(l => l.courseId === 'websec-201').length + (userLabs.some(l => l.labId === 'lab-sqli-01') ? 1 : 0)
      },
      {
        domain: 'Incident Response & SOC',
        coursesRate: Math.min(100, Math.round((userLessons.filter(l => l.courseId === 'soc-401').length / 3) * 100)),
        labsRate: 0,
        scenariosRate: Math.min(100, Math.round((userScenarios.filter(s => s.scenarioId.includes('lockbit') || s.scenarioId.includes('kerberoast')).length / 2) * 100)),
        totalUnits: 5,
        completedUnits: (userScenarios.some(s => s.scenarioId === 'sc-lockbit-01') ? 1 : 0)
      },
      {
        domain: 'Cloud Security',
        coursesRate: Math.min(100, Math.round((userLessons.filter(l => l.courseId === 'cloudsec-501').length / 2) * 100)),
        labsRate: Math.min(100, Math.round((userLabs.filter(l => l.labId.includes('jwt') || l.labId.includes('hash')).length / 2) * 100)),
        scenariosRate: Math.min(100, Math.round((userScenarios.filter(s => s.scenarioId.includes('s3')).length / 1) * 100)),
        totalUnits: 5,
        completedUnits: 0
      }
    ];

    return {
      totalCourses,
      completedCourses,
      coursesRate,
      totalLessons,
      completedLessons,
      lessonsRate: coursesRate,
      totalLabs,
      completedLabs,
      labsRate,
      totalScenarios,
      completedScenarios,
      scenariosRate,
      overallCompletionRate,
      timeline,
      weeklyVelocity,
      domainBreakdown
    };
  }

  // Major Milestones & Certification Achievements System
  getMilestones(userId: string): MajorMilestone[] {
    const user = this.users.get(userId);
    const userLessons = Array.from(this.lessonProgress.values()).filter(lp => lp.userId === userId && lp.completed);
    const userLabs = Array.from(this.labProgress.values()).filter(lp => lp.userId === userId && lp.completed);
    const userScenarios = Array.from(this.scenarioProgress.values()).filter(sp => sp.userId === userId && sp.completed);

    const isClaimed = (id: string) => this.completedMilestones.has(`${userId}:${id}`);

    const secPlusReadiness = CERTIFICATIONS[0]?.readinessScore || 68;

    const milestones: MajorMilestone[] = [
      {
        id: 'ms-secplus-blueprint',
        title: 'CompTIA Security+ Blueprint Benchmark (SY0-701)',
        category: 'certification',
        description: 'Attain validated exam readiness across DoD 8570 approved security baseline domains.',
        xpReward: 300,
        completed: isClaimed('ms-secplus-blueprint'),
        progressPercent: Math.min(100, Math.round((secPlusReadiness / 85) * 100)),
        criteria: 'Clear benchmark readiness evaluation or complete foundational curriculum modules.',
        certificationCode: 'SY0-701'
      },
      {
        id: 'ms-ceh-flag-hunter',
        title: 'Certified Ethical Hacker: First Blood Sandbox Flag',
        category: 'certification',
        description: 'Execute live ethical exploitation against a hardened sandbox target and capture verified flag.',
        xpReward: 250,
        completed: isClaimed('ms-ceh-flag-hunter') || userLabs.some(l => l.labId === 'lab-sqli-01'),
        progressPercent: userLabs.length > 0 ? 100 : 0,
        criteria: 'Capture and submit the live flag in CTF SQLi or IDOR lab sandbox.',
        certificationCode: 'CEH v12'
      },
      {
        id: 'ms-cysa-triage',
        title: 'CompTIA CySA+: SOC Incident Commander Containment',
        category: 'certification',
        description: 'Successfully isolate host DC01, preserve forensic volatile artifacts, and neutralize adversary breach.',
        xpReward: 350,
        completed: isClaimed('ms-cysa-triage') || userScenarios.some(s => s.scenarioId === 'sc-lockbit-01'),
        progressPercent: userScenarios.length > 0 ? 100 : 50,
        criteria: 'Complete the enterprise LockBit 3.0 Ransomware Containment simulation.',
        certificationCode: 'CS0-003'
      },
      {
        id: 'ms-netsec-defense',
        title: 'Perimeter Defense: Packet Inspection Specialist',
        category: 'curriculum',
        description: 'Master Wireshark PCAP analysis, TCP flags, and SYN flood mitigation techniques.',
        xpReward: 200,
        completed: isClaimed('ms-netsec-defense') || userLessons.some(l => l.lessonId === 'net-les-1'),
        progressPercent: userLessons.filter(l => l.courseId === 'netsec-101').length >= 2 ? 100 : 50,
        criteria: 'Complete Network Security 101 foundational modules and packet dissection.',
      },
      {
        id: 'ms-streak-sentinel',
        title: 'Operational Readiness: 3-Day Defense Streak',
        category: 'streak',
        description: 'Maintain uninterrupted daily operational cadence to protect freeze shields.',
        xpReward: 150,
        completed: isClaimed('ms-streak-sentinel') || (user?.dailyStreak || 0) >= 3,
        progressPercent: Math.min(100, Math.round(((user?.dailyStreak || 1) / 3) * 100)),
        criteria: 'Log in and execute at least one learning exercise for 3 consecutive days.',
      }
    ];

    return milestones;
  }

  claimMilestone(userId: string, milestoneId: string): {
    success: boolean;
    milestone?: MajorMilestone;
    xpAwarded: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
    error?: string;
  } {
    const user = this.users.get(userId);
    if (!user) return { success: false, xpAwarded: 0, oldLevel: 1, newLevel: 1, leveledUp: false, error: 'User not found' };

    const milestones = this.getMilestones(userId);
    const ms = milestones.find(m => m.id === milestoneId);
    if (!ms) return { success: false, xpAwarded: 0, oldLevel: user.level, newLevel: user.level, leveledUp: false, error: 'Milestone not found' };

    const key = `${userId}:${milestoneId}`;
    if (this.completedMilestones.has(key)) {
      return { success: false, xpAwarded: 0, oldLevel: user.level, newLevel: user.level, leveledUp: false, error: 'Milestone already claimed' };
    }

    const oldLevel = user.level;
    this.completedMilestones.add(key);

    // Award authoritative XP
    const xpRes = this.addXp(userId, ms.xpReward);
    const leveledUp = xpRes.level > oldLevel;

    return {
      success: true,
      milestone: { ...ms, completed: true, completedAt: new Date().toISOString() },
      xpAwarded: ms.xpReward,
      oldLevel,
      newLevel: xpRes.level,
      leveledUp
    };
  }
}

export const db = new Database();
