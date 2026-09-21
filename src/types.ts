export type UserRole = 'student' | 'instructor' | 'admin';
export type SkillTier = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  xp: number;
  level: number;
  dailyStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  freezeShields: number;
  dailyXpEarned: number;
  dailyXpResetDate: string;
  skillTier: SkillTier;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TopicMastery {
  topicId: string;
  topicName: string;
  domain: string;
  masteryScore: number; // 0 to 100
  attemptsCount: number;
  lastTestedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Fundamentals' | 'Defensive' | 'Offensive' | 'Incident Response' | 'Cloud & IAM';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  totalXp: number;
  prerequisiteCourseIds: string[];
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: LessonSummary[];
}

export interface LessonSummary {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  slug: string;
  type: 'video' | 'article' | 'interactive';
  durationMinutes: number;
  xpReward: number;
  order: number;
  prerequisiteLessonIds: string[];
  completed?: boolean;
}

export interface LessonResource {
  title: string;
  url: string;
  type: 'spec' | 'guide' | 'cheatsheet' | 'mitre';
}

export interface Lesson extends LessonSummary {
  content: string;
  videoUrl?: string;
  resources: LessonResource[];
  associatedQuizId?: string;
  associatedLabId?: string;
}

export interface QuizQuestionClient {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'boolean';
  options: string[];
  points: number;
}

export interface QuizClient {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  passingScorePercent: number;
  xpReward: number;
  timeLimitSeconds: number;
  questions: QuizQuestionClient[];
}

export interface QuizQuestionReview {
  id: string;
  text: string;
  isCorrect: boolean;
  selectedIndices: number[];
  correctIndices: number[];
  explanation: string;
}

export interface QuizResult {
  submissionId: string;
  quizId: string;
  passed: boolean;
  scorePercent: number;
  earnedPoints: number;
  totalPoints: number;
  xpAwarded: number;
  questionsReview: QuizQuestionReview[];
}

export interface LabHint {
  id: string;
  title: string;
  xpCost: number;
  unlocked: boolean;
  text?: string;
}

export interface Lab {
  id: string;
  title: string;
  slug: string;
  category: 'Web Exploitation' | 'Network Defense' | 'Cryptography' | 'Privilege Escalation' | 'Forensics';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  description: string;
  scenario: string;
  targetSystem: string;
  terminalPrompt: string;
  initialCommands: string[];
  objectives: string[];
  hints: LabHint[];
  totalXpReward: number;
  completed?: boolean;
  completedAt?: string;
}

export interface ContainerSecurityProfile {
  readOnlyRootfs: boolean;
  dropCapabilities: string[];
  addCapabilities: string[];
  noNewPrivileges: boolean;
  seccompProfile: 'default' | 'strict' | 'custom';
  user: string;
  pidsLimit: number;
  cpuQuota: string;
  memoryLimit: string;
  networkMode: 'none' | 'isolated-bridge' | 'host';
}

export interface EphemeralContainerSession {
  id: string;
  labId: string;
  containerName: string;
  image: string;
  status: 'provisioning' | 'running' | 'paused' | 'terminated';
  mode: 'browser-ephemeral' | 'backend-orchestrated';
  ipAddress: string;
  ports: Record<string, number>;
  uptimeSeconds: number;
  ttlSecondsRemaining: number;
  securityProfile: ContainerSecurityProfile;
  resourceUsage: {
    cpuPercent: number;
    memoryMb: number;
    memoryLimitMb: number;
    pidCount: number;
    networkRxKb: number;
    networkTxKb: number;
  };
  logs: string[];
}

export interface LabSubmissionResult {
  success: boolean;
  message: string;
  xpAwarded: number;
  flagRevealed?: boolean;
}

export interface ScenarioChoice {
  id: string;
  label: string;
  actionDescription: string;
  isOptimal: boolean;
  scoreDelta: number;
  feedback: string;
}

export interface ScenarioStage {
  id: string;
  stageNumber: number;
  title: string;
  telemetryLogs: string[];
  description: string;
  question: string;
  choices: ScenarioChoice[];
}

export interface IncidentScenario {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  mitreTactics: string[];
  summary: string;
  stages: ScenarioStage[];
  totalXpReward: number;
  completed?: boolean;
}

export interface ScenarioEvaluation {
  scenarioId: string;
  passed: boolean;
  finalScore: number;
  maxScore: number;
  xpAwarded: number;
  stageEvaluations: {
    stageId: string;
    choiceId: string;
    label: string;
    scoreDelta: number;
    feedback: string;
    isOptimal: boolean;
  }[];
  debriefSummary: string;
}

export interface CertDomain {
  name: string;
  weightPercent: number;
  topics: string[];
}

export interface CertResource {
  title: string;
  type: 'official_site' | 'practice_exam' | 'blueprint' | 'roadmap';
  url: string;
}

export interface Certification {
  id: string;
  code: string;
  name: string;
  issuer: string;
  examCode: string;
  durationMinutes: number;
  passingScore: string;
  questionsCount: string;
  cost: string;
  priceUsd?: number;
  examFormat?: string;
  officialUrl?: string;
  description: string;
  domains: CertDomain[];
  resources: CertResource[];
  readinessScore: number; // 0 to 100 based on completed topics
}

export interface StudentNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  courseId?: string;
  courseTitle?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticQuestion {
  id: string;
  domain: string;
  text: string;
  options: string[];
}

export interface DiagnosticResult {
  skillTier: SkillTier;
  overallScorePercent: number;
  domainScores: Record<string, number>;
  recommendedStartingCourseId: string;
  recommendedStartingCourseTitle: string;
  personalizedRoadmap: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: {
    toolName: string;
    args: Record<string, any>;
    result?: any;
  }[];
  citations?: {
    title: string;
    source: string;
    snippet: string;
  }[];
}

export interface MentorChatSession {
  id: string;
  title: string;
  mode: 'socratic' | 'architecture' | 'code' | 'incident' | 'hint-guided';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'mentor';
    text: string;
    citations?: { title: string; source: string; snippet: string }[];
    hintStep?: number;
    savedToNotes?: boolean;
    streaming?: boolean;
  }[];
}

export interface SearchResultItem {
  id: string;
  type: 'course' | 'lesson' | 'lab' | 'scenario' | 'cert' | 'note';
  title: string;
  snippet: string;
  tag: string;
  targetView: string;
  targetId?: string;
}

export interface ProgressDataPoint {
  date: string;
  label: string;
  coursesRate: number; // 0 - 100%
  labsRate: number; // 0 - 100%
  scenariosRate: number; // 0 - 100%
  overallRate: number; // 0 - 100%
  lessonsCompleted: number;
  labsCompleted: number;
  scenariosCompleted: number;
  xpEarned: number;
}

export interface ProgressAnalyticsSummary {
  totalCourses: number;
  completedCourses: number;
  coursesRate: number;
  totalLessons: number;
  completedLessons: number;
  lessonsRate: number;
  totalLabs: number;
  completedLabs: number;
  labsRate: number;
  totalScenarios: number;
  completedScenarios: number;
  scenariosRate: number;
  overallCompletionRate: number;
  timeline: ProgressDataPoint[];
  weeklyVelocity: {
    week: string;
    lessons: number;
    labs: number;
    scenarios: number;
    xp: number;
  }[];
  domainBreakdown: {
    domain: string;
    coursesRate: number;
    labsRate: number;
    scenariosRate: number;
    totalUnits: number;
    completedUnits: number;
  }[];
}

export interface MajorMilestone {
  id: string;
  title: string;
  category: 'certification' | 'curriculum' | 'ctf' | 'incident' | 'streak';
  description: string;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  progressPercent: number;
  criteria: string;
  certificationCode?: string;
}

export interface WeeklyRecapFocusArea {
  topic: string;
  reason: string;
  actionableStep: string;
  targetView?: 'courses' | 'labs' | 'scenarios' | 'ai-mentor' | 'certifications';
  targetId?: string;
}

export interface WeeklyRecap {
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
  suggestedFocusAreas: WeeklyRecapFocusArea[];
  mentorSocraticNote: string;
}

export interface StudentDashboardSummary {
  user: User;
  topicMasteries: TopicMastery[];
  weakTopics: TopicMastery[];
  strongTopics: TopicMastery[];
  continueLearning: {
    course: Course;
    nextLesson: LessonSummary;
  } | null;
  recommendedLab: Lab;
  recommendedScenario: IncidentScenario;
  recentNotes: StudentNote[];
  certificationsSummary: {
    code: string;
    name: string;
    readinessScore: number;
  }[];
  badgesSummary?: UserBadgesSummary;
  progressAnalytics?: ProgressAnalyticsSummary;
  majorMilestones?: MajorMilestone[];
}

export type BadgeCategory = 'all' | 'lessons' | 'labs' | 'scenarios' | 'mastery';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeProgress {
  current: number;
  target: number;
  percentage: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'lessons' | 'labs' | 'scenarios' | 'mastery';
  rarity: BadgeRarity;
  icon: string;
  xpReward: number;
  criteriaLabel: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: BadgeProgress;
  actionHint?: {
    type: 'course' | 'lesson' | 'lab' | 'scenario';
    targetId?: string;
    label: string;
  };
}

export interface UserBadgesSummary {
  totalBadges: number;
  unlockedCount: number;
  totalXpFromBadges: number;
  completionPercentage: number;
  lessonsCompletedCount: number;
  labsCompletedCount: number;
  scenariosCompletedCount: number;
  badges: Badge[];
}
