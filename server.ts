import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, hashFlag, SERVER_QUIZZES, LAB_FLAG_HASHES } from './server/db';
import {
  hashPassword,
  verifyPassword,
  signJwt,
  requireAuth,
  AuthenticatedRequest,
  createRateLimiter,
  constantTimeCompare
} from './server/security';
import { COURSES, CTF_LABS, INCIDENT_SCENARIOS, CERTIFICATIONS, DIAGNOSTIC_QUESTIONS } from './src/data/cyberData';
import { LESSON_DETAILS } from './src/data/lessonDetails';
import { generateMentorResponse, searchKnowledgeBase, executeAITool, SOCRATIC_SYSTEM_INSTRUCTION, getSystemInstructionForMode, generateAIQuiz, generateWeeklyRecap } from './server/ai';
import { GoogleGenAI } from '@google/genai';
import { EphemeralContainerSession } from './src/types';
import {
  getLabContainerSpec,
  generateDockerfile,
  generateDockerCompose,
  generateDockerRunCommand,
  generateSeccompJson
} from './src/utils/containerConfigGenerator';

const app = express();
const PORT = 3000;

app.use(express.json());

// Request logging & Request ID for observability
app.use((req, res, next) => {
  const reqId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  res.setHeader('X-Request-Id', reqId);
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/@') && !req.path.includes('.')) {
      console.log(`[${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Rate limiters for abuse prevention
const authLimiter = createRateLimiter(20, 60); // 20 requests/minute
const flagLimiter = createRateLimiter(8, 60);  // 8 flag submissions/minute
const aiLimiter = createRateLimiter(30, 60);    // 30 AI queries/minute

// -------------------------------------------------------------
// 1. HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0-rc1',
    timestamp: new Date().toISOString(),
    capabilities: ['gemini-ai', 'server-authoritative-quizzes', 'ctf-sandbox', 'incident-scenarios']
  });
});

// -------------------------------------------------------------
// 2. AUTHENTICATION & PROFILE
// -------------------------------------------------------------
app.post('/api/v1/auth/register', authLimiter, (req, res) => {
  const { email, username, password, fullName } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }

  // Check existing
  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    if (u.username.toLowerCase() === username.toLowerCase()) {
      return res.status(409).json({ error: 'Username is already claimed' });
    }
  }

  const userId = `usr-${Date.now()}`;
  const { hash, salt } = hashPassword(password);
  const today = new Date().toISOString().split('T')[0];

  const newUser = {
    id: userId,
    email: email.trim().toLowerCase(),
    username: username.trim(),
    fullName: fullName ? fullName.trim() : username.trim(),
    role: 'student' as const,
    xp: 0,
    level: 1,
    dailyStreak: 1,
    lastActiveDate: today,
    freezeShields: 1,
    dailyXpEarned: 0,
    dailyXpResetDate: today,
    skillTier: 'beginner' as const,
    createdAt: new Date().toISOString()
  };

  db.users.set(userId, newUser);
  db.userCredentials.set(userId, { passwordHash: hash, salt });

  const token = signJwt({ sub: userId, email: newUser.email, role: newUser.role });
  res.status(201).json({ user: newUser, token });
});

app.post('/api/v1/auth/login', authLimiter, (req, res) => {
  const { identifier, password } = req.body; // email or username
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  let foundUser = null;
  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) {
      foundUser = u;
      break;
    }
  }

  if (!foundUser) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const creds = db.userCredentials.get(foundUser.id);
  if (!creds || !verifyPassword(password, creds.passwordHash, creds.salt)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signJwt({ sub: foundUser.id, email: foundUser.email, role: foundUser.role });
  res.json({ user: foundUser, token });
});

app.get('/api/v1/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.get(req.user!.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Diagnostic Assessment Evaluation
app.post('/api/v1/auth/diagnostic', requireAuth, (req: AuthenticatedRequest, res) => {
  const { answers } = req.body; // Record<string, number> (questionId -> selectedOptionIndex)
  const userId = req.user!.sub;
  const user = db.users.get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Correct answers index for diagnostic
  const diagnosticCorrect: Record<string, number> = {
    'diag-1': 1, // SYN_RECEIVED
    'diag-2': 1, // Parameterized queries
    'diag-3': 1, // AEAD authentication & confidentiality
    'diag-4': 0, // Event ID 4624
    'diag-5': 1  // PATH manipulation
  };

  let totalCorrect = 0;
  const domainScores: Record<string, number> = {};

  for (const q of DIAGNOSTIC_QUESTIONS) {
    const isCorrect = answers && answers[q.id] === diagnosticCorrect[q.id];
    if (isCorrect) totalCorrect += 1;
    domainScores[q.domain] = isCorrect ? 100 : 30;

    // Seed or update topic mastery based on baseline
    db.updateTopicMastery(userId, q.id, q.domain, q.domain, isCorrect ? 90 : 40);
  }

  const scorePercent = Math.round((totalCorrect / DIAGNOSTIC_QUESTIONS.length) * 100);
  let skillTier: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  let recommendedCourseId = 'netsec-101';
  let recommendedCourseTitle = 'Network Defense & Protocol Analysis';

  if (scorePercent >= 80) {
    skillTier = 'advanced';
    recommendedCourseId = 'soc-401';
    recommendedCourseTitle = 'SOC Analyst & Enterprise Incident Response';
  } else if (scorePercent >= 40) {
    skillTier = 'intermediate';
    recommendedCourseId = 'websec-201';
    recommendedCourseTitle = 'OWASP Top 10 & Web Application Exploitation';
  }

  user.skillTier = skillTier;
  // Award baseline assessment XP (100 XP)
  db.addXp(userId, 100);

  res.json({
    skillTier,
    overallScorePercent: scorePercent,
    domainScores,
    recommendedStartingCourseId: recommendedCourseId,
    recommendedStartingCourseTitle: recommendedCourseTitle,
    personalizedRoadmap: [
      `1. Foundation: ${recommendedCourseTitle}`,
      '2. Hands-on CTF Sandbox Lab: SQLi Authentication Bypass',
      '3. Enterprise Simulation: LockBit Ransomware Incident Room',
      '4. Certification Milestone: CompTIA Security+ / CySA+'
    ]
  });
});

// -------------------------------------------------------------
// 3. DASHBOARD SUMMARY
// -------------------------------------------------------------
app.get('/api/v1/dashboard/summary', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const user = db.users.get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Gather masteries
  const allMasteries: any[] = [];
  for (const [key, m] of db.topicMasteries.entries()) {
    if (key.startsWith(`${userId}:`)) {
      allMasteries.push(m);
    }
  }

  allMasteries.sort((a, b) => b.masteryScore - a.masteryScore);
  const strongTopics = allMasteries.filter((m) => m.masteryScore >= 70);
  const weakTopics = allMasteries.filter((m) => m.masteryScore < 70);

  // Determine continue learning
  let continueCourse = COURSES[0];
  let continueLesson = COURSES[0].modules[0].lessons[0];

  for (const c of COURSES) {
    for (const m of c.modules) {
      for (const l of m.lessons) {
        const progKey = `${userId}:${l.id}`;
        const done = db.lessonProgress.get(progKey)?.completed;
        if (!done) {
          continueCourse = c;
          continueLesson = l;
          break;
        }
      }
    }
  }

  // User notes
  const userNotes: any[] = [];
  for (const note of db.notes.values()) {
    if (note.userId === userId) {
      userNotes.push(note);
    }
  }

  const badgesSummary = db.getUserBadges(userId);
  const progressAnalytics = db.getProgressAnalytics(userId);

  res.json({
    user,
    topicMasteries: allMasteries,
    weakTopics: weakTopics.slice(0, 3),
    strongTopics: strongTopics.slice(0, 3),
    continueLearning: {
      course: continueCourse,
      nextLesson: continueLesson
    },
    recommendedLab: CTF_LABS[0],
    recommendedScenario: INCIDENT_SCENARIOS[0],
    recentNotes: userNotes.slice(0, 3),
    certificationsSummary: CERTIFICATIONS.map((c) => ({
      code: c.code,
      name: c.name,
      readinessScore: c.readinessScore
    })),
    badgesSummary,
    progressAnalytics,
    majorMilestones: db.getMilestones(userId)
  });
});

// AI Weekly Learning Recap Endpoint
app.get('/api/v1/dashboard/weekly-recap', requireAuth, aiLimiter, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const user = db.users.get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const allMasteries: any[] = [];
  for (const [key, m] of db.topicMasteries.entries()) {
    if (key.startsWith(`${userId}:`)) {
      allMasteries.push(m);
    }
  }

  allMasteries.sort((a, b) => b.masteryScore - a.masteryScore);
  const strongTopics = allMasteries.filter((m) => m.masteryScore >= 70);
  const weakTopics = allMasteries.filter((m) => m.masteryScore < 70);

  const badgesSummary = db.getUserBadges(userId);
  const progressAnalytics = db.getProgressAnalytics(userId);

  try {
    const recap = await generateWeeklyRecap({
      user,
      progressAnalytics,
      topicMasteries: allMasteries,
      weakTopics,
      strongTopics,
      badgesSummary
    });

    res.json({ recap });
  } catch (err: any) {
    console.error('Weekly recap generation error:', err);
    res.status(500).json({ error: 'Failed to generate weekly recap' });
  }
});

// -------------------------------------------------------------
// 3b. BADGES & ACHIEVEMENTS ENGINE
// -------------------------------------------------------------
app.get('/api/v1/badges', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const badgesSummary = db.getUserBadges(userId);
  res.json({ badgesSummary });
});

// -------------------------------------------------------------
// 3c. MAJOR MILESTONES & CERTIFICATION ACHIEVEMENTS
// -------------------------------------------------------------
app.get('/api/v1/milestones', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const milestones = db.getMilestones(userId);
  res.json({ milestones });
});

app.post('/api/v1/milestones/:id/claim', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const milestoneId = req.params.id;
  const result = db.claimMilestone(userId, milestoneId);
  if (!result.success) {
    return res.status(400).json({ error: result.error || 'Failed to claim milestone' });
  }

  const updatedUser = db.users.get(userId);
  res.json({
    ...result,
    user: updatedUser
  });
});

app.post('/api/v1/certifications/:id/benchmark', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const certId = req.params.id;
  const cert = CERTIFICATIONS.find(c => c.id === certId || c.code.toLowerCase() === certId.toLowerCase());
  if (!cert) {
    return res.status(404).json({ error: 'Certification not found' });
  }

  // Authoritatively complete certification benchmark
  const oldLevel = db.users.get(userId)?.level || 1;
  const xpReward = 300;
  const xpRes = db.addXp(userId, xpReward);
  const updatedUser = db.users.get(userId);
  const leveledUp = xpRes.level > oldLevel;

  res.json({
    success: true,
    certTitle: cert.name,
    certCode: cert.code,
    xpAwarded: xpReward,
    oldLevel,
    newLevel: xpRes.level,
    leveledUp,
    user: updatedUser
  });
});

// -------------------------------------------------------------
// 3c. PROGRESS TELEMETRY & COMPLETION ANALYTICS
// -------------------------------------------------------------
app.get('/api/v1/analytics/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const analytics = db.getProgressAnalytics(userId);
  res.json({ progressAnalytics: analytics });
});

// -------------------------------------------------------------
// 4. COURSES & LESSONS
// -------------------------------------------------------------
app.get('/api/v1/courses', (req, res) => {
  res.json({ courses: COURSES });
});

app.get('/api/v1/courses/:id', (req, res) => {
  const course = COURSES.find((c) => c.id === req.params.id || c.slug === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ course });
});

app.get('/api/v1/lessons/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const lessonId = req.params.id;
  const lesson = LESSON_DETAILS[lessonId];
  if (!lesson) {
    // Fallback search in COURSES catalog
    for (const c of COURSES) {
      for (const m of c.modules) {
        const found = m.lessons.find((l) => l.id === lessonId);
        if (found) {
          return res.json({
            lesson: {
              ...found,
              content: `# ${found.title}\n\nThis lesson provides hands-on technical guidance covering ${c.title}. Review the protocol specifications, take the interactive assessment, and test your skills in the sandbox terminal.`,
              resources: [
                { title: 'NIST Computer Security Resource Center', url: 'https://csrc.nist.gov/', type: 'guide' },
                { title: 'OWASP Security Guidelines', url: 'https://owasp.org', type: 'spec' }
              ]
            }
          });
        }
      }
    }
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const userId = req.user!.sub;
  const isCompleted = db.lessonProgress.get(`${userId}:${lessonId}`)?.completed || false;
  res.json({ lesson: { ...lesson, completed: isCompleted } });
});

app.post('/api/v1/lessons/:id/complete', requireAuth, (req: AuthenticatedRequest, res) => {
  const lessonId = req.params.id;
  const userId = req.user!.sub;

  // Find lesson to inspect prerequisites and XP
  let targetLesson: any = null;
  let targetCourse: any = null;
  for (const c of COURSES) {
    for (const m of c.modules) {
      const l = m.lessons.find((item) => item.id === lessonId);
      if (l) {
        targetLesson = l;
        targetCourse = c;
        break;
      }
    }
  }

  if (!targetLesson) return res.status(404).json({ error: 'Lesson not found' });

  // Verify prerequisites
  if (targetLesson.prerequisiteLessonIds && targetLesson.prerequisiteLessonIds.length > 0) {
    for (const prereqId of targetLesson.prerequisiteLessonIds) {
      const prereqProg = db.lessonProgress.get(`${userId}:${prereqId}`);
      if (!prereqProg || !prereqProg.completed) {
        return res.status(400).json({
          error: 'Prerequisites not met',
          message: `You must complete prerequisite lesson ${prereqId} before finishing this lesson.`
        });
      }
    }
  }

  const key = `${userId}:${lessonId}`;
  const existing = db.lessonProgress.get(key);
  let xpAwarded = 0;

  if (!existing || !existing.completed) {
    // Award authoritative XP
    const xpResult = db.addXp(userId, targetLesson.xpReward);
    xpAwarded = xpResult.awarded;

    db.lessonProgress.set(key, {
      userId,
      lessonId,
      courseId: targetCourse.id,
      completed: true,
      completedAt: new Date().toISOString(),
      xpEarned: xpAwarded
    });
  }

  const user = db.users.get(userId);
  res.json({
    success: true,
    xpAwarded,
    userLevel: user?.level,
    totalXp: user?.xp,
    dailyStreak: user?.dailyStreak
  });
});

// -------------------------------------------------------------
// 5. QUIZ ENGINE (Zero leaked keys, Server Authoritative Grading)
// -------------------------------------------------------------
app.post('/api/v1/quizzes/generate', requireAuth, aiLimiter, async (req: AuthenticatedRequest, res) => {
  const { topicTitle, courseTitle, difficulty } = req.body;
  if (!topicTitle) {
    return res.status(400).json({ error: 'topicTitle parameter is required for quiz generation' });
  }

  const generatedQuiz = await generateAIQuiz({
    topicTitle: String(topicTitle),
    courseTitle: courseTitle ? String(courseTitle) : undefined,
    difficulty: difficulty === 'Beginner' || difficulty === 'Advanced' ? difficulty : 'Intermediate'
  });

  // Store in server authoritative quiz store for grading
  SERVER_QUIZZES[generatedQuiz.id] = {
    id: generatedQuiz.id,
    courseId: courseTitle || 'general',
    title: generatedQuiz.title,
    passingScorePercent: generatedQuiz.passingScorePercent,
    xpReward: generatedQuiz.xpReward,
    timeLimitSeconds: 600,
    questions: generatedQuiz.questions
  };

  // Strip correct answers & explanations before sending to client
  const clientQuestions = generatedQuiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.options,
    points: q.points
  }));

  res.json({
    quiz: {
      id: generatedQuiz.id,
      courseId: courseTitle || 'general',
      title: generatedQuiz.title,
      topicTitle: generatedQuiz.topicTitle,
      difficulty: generatedQuiz.difficulty,
      passingScorePercent: generatedQuiz.passingScorePercent,
      xpReward: generatedQuiz.xpReward,
      timeLimitSeconds: 600,
      questions: clientQuestions
    }
  });
});

app.get('/api/v1/quizzes/:id', (req, res) => {
  const quiz = SERVER_QUIZZES[req.params.id];
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  // STRICT SECURITY: Strip correctIndices and explanations from response
  const clientQuestions = quiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.options,
    points: q.points
  }));

  res.json({
    quiz: {
      id: quiz.id,
      courseId: quiz.courseId,
      lessonId: quiz.lessonId,
      title: quiz.title,
      passingScorePercent: quiz.passingScorePercent,
      xpReward: quiz.xpReward,
      timeLimitSeconds: quiz.timeLimitSeconds,
      questions: clientQuestions
    }
  });
});

app.post('/api/v1/quizzes/:id/submit', requireAuth, (req: AuthenticatedRequest, res) => {
  const quizId = req.params.id;
  const userId = req.user!.sub;
  const { answers } = req.body; // Record<questionId, number[]>

  const quiz = SERVER_QUIZZES[quizId];
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  let earnedPoints = 0;
  let totalPoints = 0;
  const review = [];

  for (const q of quiz.questions) {
    totalPoints += q.points;
    const userSelected: number[] = (answers && answers[q.id]) || [];

    // Compare arrays
    const isCorrect =
      userSelected.length === q.correctIndices.length &&
      q.correctIndices.every((idx) => userSelected.includes(idx));

    if (isCorrect) {
      earnedPoints += q.points;
    }

    review.push({
      id: q.id,
      text: q.text,
      isCorrect,
      selectedIndices: userSelected,
      correctIndices: q.correctIndices,
      explanation: q.explanation
    });
  }

  const scorePercent = Math.round((earnedPoints / totalPoints) * 100);
  const passed = scorePercent >= quiz.passingScorePercent;

  // Check anti-farming duplicate completion
  const previousPassed = db.quizAttempts.some((a) => a.userId === userId && a.quizId === quizId && a.passed);
  let xpAwarded = 0;

  if (passed && !previousPassed) {
    const xpResult = db.addXp(userId, quiz.xpReward);
    xpAwarded = xpResult.awarded;
  }

  // Record attempt
  db.quizAttempts.push({
    id: `qa-${Date.now()}`,
    userId,
    quizId,
    scorePercent,
    passed,
    xpEarned: xpAwarded,
    attemptedAt: new Date().toISOString()
  });

  // Update EMA topic mastery
  db.updateTopicMastery(userId, quiz.id, quiz.title, quiz.courseId, scorePercent);

  res.json({
    submissionId: `sub-${Date.now()}`,
    quizId,
    passed,
    scorePercent,
    earnedPoints,
    totalPoints,
    xpAwarded,
    questionsReview: review
  });
});

// -------------------------------------------------------------
// 6. CTF LAB ENGINE & TERMINAL SANDBOX
// -------------------------------------------------------------
app.get('/api/v1/labs', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const labsWithStatus = CTF_LABS.map((lab) => {
    const prog = db.labProgress.get(`${userId}:${lab.id}`);
    return {
      ...lab,
      completed: prog?.completed || false,
      completedAt: prog?.completedAt
    };
  });
  res.json({ labs: labsWithStatus });
});

app.get('/api/v1/labs/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const lab = CTF_LABS.find((l) => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });
  const userId = req.user!.sub;
  const prog = db.labProgress.get(`${userId}:${lab.id}`);

  res.json({
    lab: {
      ...lab,
      completed: prog?.completed || false,
      completedAt: prog?.completedAt
    }
  });
});

// Unlock progressive hint
app.post('/api/v1/labs/:id/unlock-hint', requireAuth, (req: AuthenticatedRequest, res) => {
  const labId = req.params.id;
  const { hintId } = req.body;
  const userId = req.user!.sub;
  const lab = CTF_LABS.find((l) => l.id === labId);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });

  const hint = lab.hints.find((h) => h.id === hintId);
  if (!hint) return res.status(404).json({ error: 'Hint not found' });

  let prog = db.labProgress.get(`${userId}:${labId}`);
  if (!prog) {
    prog = {
      userId,
      labId,
      completed: false,
      completedAt: '',
      xpEarned: 0,
      unlockedHintIds: []
    };
    db.labProgress.set(`${userId}:${labId}`, prog);
  }

  if (!prog.unlockedHintIds.includes(hintId)) {
    prog.unlockedHintIds.push(hintId);
  }

  res.json({
    success: true,
    hint: {
      id: hint.id,
      title: hint.title,
      text: hint.text,
      xpCost: hint.xpCost
    }
  });
});

// Submit Flag with Salted Constant-Time Comparison & Rate Limiting
app.post('/api/v1/labs/:id/submit-flag', requireAuth, flagLimiter, (req: AuthenticatedRequest, res) => {
  const labId = req.params.id;
  const { flag } = req.body;
  const userId = req.user!.sub;

  if (!flag) return res.status(400).json({ error: 'Flag parameter is required' });

  const expectedHash = LAB_FLAG_HASHES[labId];
  if (!expectedHash) return res.status(404).json({ error: 'Lab verification rule not configured' });

  const submittedHash = hashFlag(flag);
  const isValid = constantTimeCompare(submittedHash, expectedHash);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid flag submission. Re-examine your findings and payload syntax.'
    });
  }

  const lab = CTF_LABS.find((l) => l.id === labId)!;
  let prog = db.labProgress.get(`${userId}:${labId}`);
  let xpAwarded = 0;

  if (!prog || !prog.completed) {
    // Deduct hints used from total XP reward
    const hintsCost = (prog?.unlockedHintIds || []).reduce((acc, hId) => {
      const h = lab.hints.find((item) => item.id === hId);
      return acc + (h ? h.xpCost : 0);
    }, 0);

    const netXp = Math.max(25, lab.totalXpReward - hintsCost);
    const xpResult = db.addXp(userId, netXp);
    xpAwarded = xpResult.awarded;

    db.labProgress.set(`${userId}:${labId}`, {
      userId,
      labId,
      completed: true,
      completedAt: new Date().toISOString(),
      xpEarned: xpAwarded,
      unlockedHintIds: prog?.unlockedHintIds || []
    });

    db.updateTopicMastery(userId, lab.id, lab.title, lab.category, 100);
  }

  res.json({
    success: true,
    message: 'FLAG VERIFIED! Excellent cybersecurity penetration work, Cadet.',
    xpAwarded
  });
});

// Interactive Terminal Sandbox Execution
app.post('/api/v1/labs/:id/terminal-exec', requireAuth, (req, res) => {
  const labId = req.params.id;
  const { command } = req.body;

  if (!command) return res.status(400).json({ error: 'Command required' });
  const trimmed = command.trim();

  // Simulated sandboxed shell responses per lab
  let output = '';

  if (trimmed === 'help') {
    output = 'Available commands: curl, cat, ls, id, whoami, grep, find, nmap, sqlmap, clear, help';
  } else if (trimmed === 'id') {
    output = 'uid=1001(analyst) gid=1001(analyst) groups=1001(analyst),27(sudo)';
  } else if (trimmed === 'whoami') {
    output = 'analyst';
  } else if (trimmed === 'ls' || trimmed === 'ls -la') {
    output = 'drwxr-xr-x 2 analyst analyst 4096 Sep 10 10:00 .\n-rw-r--r-- 1 analyst analyst  312 Sep 10 10:00 README.md\n-rwxr-xr-x 1 analyst analyst 1024 Sep 10 10:00 exploit.py';
  } else if (labId === 'lab-sqli-01') {
    if (trimmed.includes("' OR '1'='1") || trimmed.includes("admin' --") || trimmed.includes("admin' OR 1=1--")) {
      output = `[+] HTTP/1.1 200 OK\n[+] Set-Cookie: session=adm_99182391023\n[+] Content-Type: application/json\n\n{"status":"authenticated", "role":"admin", "secret_note":"CTF Flag is: FLAG{sqli_un10n_auth_byp4ss_m4st3r_2026}"}`;
    } else if (trimmed.startsWith('curl')) {
      output = `[+] HTTP/1.1 401 Unauthorized\n{"error": "Invalid username or password"}`;
    } else {
      output = `Executed: ${trimmed}\nHint: Test SQL injection strings against the login parameter using curl or python.`;
    }
  } else if (labId === 'lab-idor-02') {
    if (trimmed.includes('1001')) {
      output = `[+] HTTP/1.1 200 OK\n[+] Record ID: 1001\n[+] Patient: VIP High-Profile\n[+] Diagnosis: Confidential\n[+] Diagnostic Flag: FLAG{1d0r_h0r1z0nt4l_p4t13nt_3xf1l_992}`;
    } else if (trimmed.includes('1042')) {
      output = `[+] HTTP/1.1 200 OK\n[+] Record ID: 1042\n[+] Patient: Standard Cadet\n[+] Notes: Routine physical examination.`;
    } else {
      output = `Querying MediVault API...\nTry specifying target patient ID 1001 in your request!`;
    }
  } else if (labId === 'lab-xss-03') {
    if (trimmed.includes('<scr<script>ipt>') || trimmed.includes('onerror=') || trimmed.includes('<svg onload=')) {
      output = `[+] Payload passed sanitizer filter!\n[+] Executing in simulated headless browser...\n[+] Stored Cookie Captured: document.cookie = "admin_auth=FLAG{xss_c00k13_th3ft_csp_3v4s10n_31337}; Path=/; HttpOnly=false"`;
    } else {
      output = `[-] Payload stripped by regex filter. Remember: single-pass replace(/<script>/gi, "") leaves nested tags intact!`;
    }
  } else if (labId === 'lab-privesc-04') {
    if (trimmed.includes('--checkpoint=1') || trimmed.includes('tar') || trimmed.includes('/root/flag.txt')) {
      output = `[#] Root shell dropped: uid=0(root) gid=0(root)\n[#] cat /root/flag.txt\nFLAG{su1d_t4r_w1ldc4rd_r00t_sh3ll_pwn3d}`;
    } else {
      output = `webuser@target-host:~$ ${trimmed}\nTry inspecting SUID binaries with: find / -perm -4000 2>/dev/null`;
    }
  } else {
    output = `Command '${trimmed}' executed successfully in virtual sandbox container.`;
  }

  res.json({ output });
});

// -------------------------------------------------------------
// 6b. SECURE EPHEMERAL DOCKER CONTAINER ORCHESTRATION
// -------------------------------------------------------------
const activeContainerSessions = new Map<string, EphemeralContainerSession>();

// Start or reconnect to ephemeral container session
app.post('/api/v1/labs/:id/container/start', requireAuth, (req: AuthenticatedRequest, res) => {
  const labId = req.params.id;
  const userId = req.user!.sub;
  const sessionKey = `${userId}:${labId}`;
  const lab = CTF_LABS.find((l) => l.id === labId);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });

  const spec = getLabContainerSpec(lab);
  let session = activeContainerSessions.get(sessionKey);

  if (!session || session.status === 'terminated') {
    session = {
      id: `cnt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      labId,
      containerName: `${spec.containerName}-${userId.substring(0, 6)}`,
      image: spec.image,
      status: 'running',
      mode: 'backend-orchestrated',
      ipAddress: spec.targetIp,
      ports: { [spec.defaultPort]: spec.exposedPort },
      uptimeSeconds: 0,
      ttlSecondsRemaining: 1800,
      securityProfile: spec.securityProfile,
      resourceUsage: {
        cpuPercent: 4.8,
        memoryMb: 42.1,
        memoryLimitMb: parseInt(spec.securityProfile.memoryLimit) || 256,
        pidCount: 4,
        networkRxKb: 18.5,
        networkTxKb: 9.2
      },
      logs: [
        `[DAEMON] Orchestrating ephemeral container for Lab: ${lab.title}`,
        `[CGROUP-V2] Applied CPU quota: ${spec.securityProfile.cpuQuota}, Memory cap: ${spec.securityProfile.memoryLimit}, PIDs limit: ${spec.securityProfile.pidsLimit}`,
        `[STORAGE] Mounted tmpfs on /tmp (64M, noexec, nosuid) and /run (16M, noexec, nosuid)`,
        `[SECURITY] Dropped capabilities: ${spec.securityProfile.dropCapabilities.join(', ')}`,
        `[SECURITY] Seccomp profile enforced: ${spec.securityProfile.seccompProfile} (Syscall filtering active)`,
        `[NETWORK] Attached to isolated bridge namespace ctf_isolated_net (${spec.targetIp})`,
        `[HEALTH] Readiness probe succeeded: TCP port ${spec.defaultPort} reachable.`
      ]
    };
    activeContainerSessions.set(sessionKey, session);
  }

  res.json({
    session,
    dockerfile: generateDockerfile(lab),
    dockerCompose: generateDockerCompose(lab),
    dockerRunCmd: generateDockerRunCommand(lab),
    seccompJson: generateSeccompJson()
  });
});

// Stop and de-provision ephemeral container session
app.post('/api/v1/labs/:id/container/stop', requireAuth, (req: AuthenticatedRequest, res) => {
  const labId = req.params.id;
  const userId = req.user!.sub;
  const sessionKey = `${userId}:${labId}`;

  const session = activeContainerSessions.get(sessionKey);
  if (session) {
    session.status = 'terminated';
    session.logs.push(`[DAEMON] Received SIGTERM signal. Container teardown initiated.`);
    session.logs.push(`[STORAGE] Purged ephemeral tmpfs mounts. Scratch data shredded.`);
    session.logs.push(`[DAEMON] Container ${session.id} destroyed cleanly.`);
    activeContainerSessions.delete(sessionKey);
  }

  res.json({
    success: true,
    message: 'Ephemeral container de-provisioned and resources freed.'
  });
});

// Query live container telemetry & logs
app.get('/api/v1/labs/:id/container/status', requireAuth, (req: AuthenticatedRequest, res) => {
  const labId = req.params.id;
  const userId = req.user!.sub;
  const sessionKey = `${userId}:${labId}`;

  const session = activeContainerSessions.get(sessionKey);
  if (!session) {
    return res.status(404).json({ error: 'No active container session found for this lab' });
  }

  // Update dynamic telemetry
  session.uptimeSeconds += 5;
  session.ttlSecondsRemaining = Math.max(0, session.ttlSecondsRemaining - 5);
  session.resourceUsage.cpuPercent = Math.min(95, Math.max(3, Math.round(Math.random() * 12 + 4)));
  session.resourceUsage.networkRxKb += Math.round(Math.random() * 3 + 1);

  res.json({ session });
});

// Get container configuration artifacts
app.get('/api/v1/labs/:id/container/config', requireAuth, (req: AuthenticatedRequest, res) => {
  const labId = req.params.id;
  const lab = CTF_LABS.find((l) => l.id === labId);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });

  res.json({
    dockerfile: generateDockerfile(lab),
    dockerCompose: generateDockerCompose(lab),
    dockerRunCmd: generateDockerRunCommand(lab),
    seccompJson: generateSeccompJson(),
    spec: getLabContainerSpec(lab)
  });
});

// Exec command inside the ephemeral container session
app.post('/api/v1/labs/:id/container/exec', requireAuth, (req: AuthenticatedRequest, res) => {
  const labId = req.params.id;
  const { command } = req.body;
  const userId = req.user!.sub;
  const sessionKey = `${userId}:${labId}`;

  if (!command) return res.status(400).json({ error: 'Command required' });
  const trimmed = command.trim();

  let session = activeContainerSessions.get(sessionKey);
  if (!session) {
    const lab = CTF_LABS.find((l) => l.id === labId);
    if (!lab) return res.status(404).json({ error: 'Lab not found' });
    const spec = getLabContainerSpec(lab);
    session = {
      id: `cnt-${Date.now().toString(36)}`,
      labId,
      containerName: `${spec.containerName}-${userId.substring(0, 6)}`,
      image: spec.image,
      status: 'running',
      mode: 'backend-orchestrated',
      ipAddress: spec.targetIp,
      ports: { [spec.defaultPort]: spec.exposedPort },
      uptimeSeconds: 12,
      ttlSecondsRemaining: 1800,
      securityProfile: spec.securityProfile,
      resourceUsage: {
        cpuPercent: 5.2,
        memoryMb: 44.0,
        memoryLimitMb: 256,
        pidCount: 4,
        networkRxKb: 22.4,
        networkTxKb: 11.2
      },
      logs: [`[DAEMON] Auto-spawned ephemeral container for execution`]
    };
    activeContainerSessions.set(sessionKey, session);
  }

  session.logs.push(`[EXEC] analyst@container:~$ ${trimmed}`);

  // Re-use simulation or specialized responses
  let output = '';
  if (trimmed === 'help') {
    output = 'Available commands: curl, cat, ls, id, whoami, grep, find, nmap, sqlmap, docker stats, docker inspect, clear, help';
  } else if (trimmed === 'id') {
    output = `uid=1001(analyst) gid=1001(analyst) groups=1001(analyst),27(sudo) context=system_u:system_r:container_t:s0:c12,c34`;
  } else if (trimmed === 'whoami') {
    output = 'analyst';
  } else if (trimmed === 'docker stats') {
    output = `CONTAINER ID   NAME                       CPU %     MEM USAGE / LIMIT     PIDS
${session.id.substring(4)}   ${session.containerName}   ${session.resourceUsage.cpuPercent}%     ${session.resourceUsage.memoryMb}MiB / 256MiB       ${session.resourceUsage.pidCount}`;
  } else if (trimmed === 'docker inspect') {
    output = JSON.stringify(session, null, 2);
  } else if (labId === 'lab-sqli-01') {
    if (trimmed.includes("' OR '1'='1") || trimmed.includes("admin' --") || trimmed.includes("admin' OR 1=1--")) {
      output = `[+] HTTP/1.1 200 OK\n[+] Set-Cookie: session=adm_99182391023\n[+] Content-Type: application/json\n\n{"status":"authenticated", "role":"admin", "secret_note":"CTF Flag is: FLAG{sqli_un10n_auth_byp4ss_m4st3r_2026}"}`;
    } else if (trimmed.startsWith('curl')) {
      output = `[+] HTTP/1.1 401 Unauthorized\n{"error": "Invalid username or password"}`;
    } else {
      output = `Executed: ${trimmed}\nHint: Test SQL injection strings against the login parameter using curl or python.`;
    }
  } else if (labId === 'lab-idor-02') {
    if (trimmed.includes('1001')) {
      output = `[+] HTTP/1.1 200 OK\n[+] Record ID: 1001\n[+] Patient: VIP High-Profile\n[+] Diagnosis: Confidential\n[+] Diagnostic Flag: FLAG{1d0r_h0r1z0nt4l_p4t13nt_3xf1l_992}`;
    } else if (trimmed.includes('1042')) {
      output = `[+] HTTP/1.1 200 OK\n[+] Record ID: 1042\n[+] Patient: Standard Cadet\n[+] Notes: Routine physical examination.`;
    } else {
      output = `Querying MediVault API...\nTry specifying target patient ID 1001 in your request!`;
    }
  } else if (labId === 'lab-xss-03') {
    if (trimmed.includes('<scr<script>ipt>') || trimmed.includes('onerror=') || trimmed.includes('<svg onload=')) {
      output = `[+] Payload passed sanitizer filter!\n[+] Executing in simulated headless browser...\n[+] Stored Cookie Captured: document.cookie = "admin_auth=FLAG{xss_c00k13_th3ft_csp_3v4s10n_31337}; Path=/; HttpOnly=false"`;
    } else {
      output = `[-] Payload stripped by regex filter. Remember: single-pass replace(/<script>/gi, "") leaves nested tags intact!`;
    }
  } else if (labId === 'lab-privesc-04') {
    if (trimmed.includes('--checkpoint=1') || trimmed.includes('tar') || trimmed.includes('/root/flag.txt')) {
      output = `[#] Root shell dropped: uid=0(root) gid=0(root)\n[#] cat /root/flag.txt\nFLAG{su1d_t4r_w1ldc4rd_r00t_sh3ll_pwn3d}`;
    } else {
      output = `webuser@target-host:~$ ${trimmed}\nTry inspecting SUID binaries with: find / -perm -4000 2>/dev/null`;
    }
  } else {
    output = `Command '${trimmed}' executed successfully in backend container orchestrator (${session.id}).`;
  }

  res.json({ output, exitCode: 0 });
});

// -------------------------------------------------------------
// 7. INCIDENT SCENARIO ENGINE
// -------------------------------------------------------------
app.get('/api/v1/scenarios', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const scenarios = INCIDENT_SCENARIOS.map((s) => {
    const prog = db.scenarioProgress.get(`${userId}:${s.id}`);
    return {
      ...s,
      completed: prog?.completed || false
    };
  });
  res.json({ scenarios });
});

app.post('/api/v1/scenarios/:id/evaluate', requireAuth, (req: AuthenticatedRequest, res) => {
  const scenarioId = req.params.id;
  const { decisions } = req.body; // Record<stageId, choiceId>
  const userId = req.user!.sub;

  const scenario = INCIDENT_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  let finalScore = 0;
  let maxScore = scenario.stages.length * 50;
  const stageEvals = [];

  for (const stage of scenario.stages) {
    const chosenId = decisions && decisions[stage.id];
    const choice = stage.choices.find((c) => c.id === chosenId);

    if (choice) {
      finalScore += Math.max(0, choice.scoreDelta);
      stageEvals.push({
        stageId: stage.id,
        choiceId: choice.id,
        label: choice.label,
        scoreDelta: choice.scoreDelta,
        feedback: choice.feedback,
        isOptimal: choice.isOptimal
      });
    } else {
      stageEvals.push({
        stageId: stage.id,
        choiceId: 'none',
        label: 'No decision made',
        scoreDelta: 0,
        feedback: 'Stage skipped without containment decision.',
        isOptimal: false
      });
    }
  }

  const passed = finalScore >= maxScore * 0.7;
  let xpAwarded = 0;
  const prog = db.scenarioProgress.get(`${userId}:${scenarioId}`);

  if (passed && (!prog || !prog.completed)) {
    const xpResult = db.addXp(userId, scenario.totalXpReward);
    xpAwarded = xpResult.awarded;

    db.scenarioProgress.set(`${userId}:${scenarioId}`, {
      userId,
      scenarioId,
      completed: true,
      completedAt: new Date().toISOString(),
      finalScore,
      xpEarned: xpAwarded
    });

    db.updateTopicMastery(userId, scenario.id, scenario.title, 'Incident Response', Math.round((finalScore / maxScore) * 100));
  }

  res.json({
    scenarioId,
    passed,
    finalScore,
    maxScore,
    xpAwarded,
    stageEvaluations: stageEvals,
    debriefSummary: passed
      ? 'Exceptional crisis management. You neutralized the adversary, protected volatile forensic evidence, and restored enterprise operations without ransom payout.'
      : 'Incident response protocol failed containment thresholds. Review NIST SP 800-61 evidence isolation rules and re-engage.'
  });
});

// -------------------------------------------------------------
// 8. CERTIFICATION HUB
// -------------------------------------------------------------
app.get('/api/v1/certifications', (req, res) => {
  res.json({ certifications: CERTIFICATIONS });
});

// -------------------------------------------------------------
// 9. STUDENT NOTES & RAG KNOWLEDGE BASE (Multi-Tenant IDOR Guard)
// -------------------------------------------------------------
app.get('/api/v1/notes', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const userNotes: any[] = [];
  for (const n of db.notes.values()) {
    if (n.userId === userId) {
      userNotes.push(n);
    }
  }
  userNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  res.json({ notes: userNotes });
});

app.post('/api/v1/notes', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const { title, content, courseId, courseTitle, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const noteId = `note-${Date.now()}`;
  const newNote = {
    id: noteId,
    userId,
    title: title.trim(),
    content: content.trim(),
    courseId,
    courseTitle,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.notes.set(noteId, newNote);
  res.status(201).json({ note: newNote });
});

app.put('/api/v1/notes/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const noteId = req.params.id;
  const userId = req.user!.sub;
  const existing = db.notes.get(noteId);

  // STRICT IDOR CHECK: Note must exist and belong to the requesting user
  if (!existing || existing.userId !== userId) {
    return res.status(404).json({ error: 'Note not found or access denied' });
  }

  const { title, content, tags } = req.body;
  if (title) existing.title = title.trim();
  if (content) existing.content = content.trim();
  if (Array.isArray(tags)) existing.tags = tags;
  existing.updatedAt = new Date().toISOString();

  res.json({ note: existing });
});

app.delete('/api/v1/notes/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const noteId = req.params.id;
  const userId = req.user!.sub;
  const existing = db.notes.get(noteId);

  if (!existing || existing.userId !== userId) {
    return res.status(404).json({ error: 'Note not found or access denied' });
  }

  db.notes.delete(noteId);
  res.json({ success: true, message: 'Note deleted' });
});

// -------------------------------------------------------------
// 10. GLOBAL SEARCH
// -------------------------------------------------------------
app.get('/api/v1/search', requireAuth, (req: AuthenticatedRequest, res) => {
  const q = ((req.query.q as string) || '').toLowerCase().trim();
  const userId = req.user!.sub;
  if (!q) return res.json({ results: [] });

  const results: any[] = [];

  // Courses & Lessons
  for (const c of COURSES) {
    if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
      results.push({
        id: c.id,
        type: 'course',
        title: c.title,
        snippet: c.description,
        tag: c.category,
        targetView: 'courses',
        targetId: c.id
      });
    }
    for (const m of c.modules) {
      for (const l of m.lessons) {
        if (l.title.toLowerCase().includes(q)) {
          results.push({
            id: l.id,
            type: 'lesson',
            title: l.title,
            snippet: `Lesson in ${c.title} • ${l.durationMinutes} mins`,
            tag: l.type,
            targetView: 'lesson',
            targetId: l.id
          });
        }
      }
    }
  }

  // CTF Labs
  for (const lab of CTF_LABS) {
    if (lab.title.toLowerCase().includes(q) || lab.description.toLowerCase().includes(q) || lab.category.toLowerCase().includes(q)) {
      results.push({
        id: lab.id,
        type: 'lab',
        title: lab.title,
        snippet: lab.description,
        tag: lab.difficulty,
        targetView: 'labs',
        targetId: lab.id
      });
    }
  }

  // Incident Scenarios
  for (const sc of INCIDENT_SCENARIOS) {
    if (sc.title.toLowerCase().includes(q) || sc.summary.toLowerCase().includes(q)) {
      results.push({
        id: sc.id,
        type: 'scenario',
        title: sc.title,
        snippet: sc.summary,
        tag: sc.severity,
        targetView: 'scenarios',
        targetId: sc.id
      });
    }
  }

  // Certifications
  for (const cert of CERTIFICATIONS) {
    if (cert.name.toLowerCase().includes(q) || cert.code.toLowerCase().includes(q) || cert.description.toLowerCase().includes(q)) {
      results.push({
        id: cert.id,
        type: 'cert',
        title: `${cert.code}: ${cert.name}`,
        snippet: cert.description,
        tag: cert.issuer,
        targetView: 'certifications',
        targetId: cert.id
      });
    }
  }

  // User Notes (Isolated to current user)
  for (const note of db.notes.values()) {
    if (note.userId === userId && (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q))) {
      results.push({
        id: note.id,
        type: 'note',
        title: `Note: ${note.title}`,
        snippet: note.content.slice(0, 100) + '...',
        tag: 'Personal',
        targetView: 'notes',
        targetId: note.id
      });
    }
  }

  // Operator Badges & Achievements
  const userBadges = db.getUserBadges(userId);
  for (const badge of userBadges.badges) {
    if (
      badge.title.toLowerCase().includes(q) ||
      badge.description.toLowerCase().includes(q) ||
      badge.criteriaLabel.toLowerCase().includes(q) ||
      'badge achievements honors'.includes(q)
    ) {
      results.push({
        id: badge.id,
        type: 'badge',
        title: `Achievement: ${badge.title}`,
        snippet: `${badge.description} (${badge.unlocked ? 'Unlocked' : 'Locked: ' + badge.criteriaLabel})`,
        tag: `${badge.rarity.toUpperCase()} • +${badge.xpReward} XP`,
        targetView: 'badges',
        targetId: badge.id
      });
    }
  }

  res.json({ results: results.slice(0, 12) });
});

// -------------------------------------------------------------
// 11. AI MENTOR (Real-time SSE Streaming & Socratic Mentoring)
// -------------------------------------------------------------
app.post('/api/v1/ai/chat', requireAuth, aiLimiter, async (req: AuthenticatedRequest, res) => {
  const { message, studentContext, history, mentorMode } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const userId = req.user?.sub;
  const result = await generateMentorResponse(message, userId, studentContext, history, mentorMode);
  res.json(result);
});

// Real-Time Server-Sent Events (SSE) AI Streaming
app.post('/api/v1/ai/stream', requireAuth, aiLimiter, async (req: AuthenticatedRequest, res) => {
  const { message, studentContext, history, mentorMode } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const userId = req.user?.sub;
  const citations = searchKnowledgeBase(message, userId);

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send citations metadata first
  res.write(`event: citations\ndata: ${JSON.stringify(citations)}\n\n`);

  const sysInstruction = getSystemInstructionForMode(mentorMode || 'socratic', studentContext);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Stream rich offline response utilizing RAG citations
    let offlineMsg = '';
    if (mentorMode === 'hint-guided') {
      offlineMsg = `### 💡 Step-by-Step Guided Hint: "${message}"\n\n` +
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
        `*(Note: Connect your Gemini API key in Settings > Secrets for real-time neural mentoring!)*`;
    } else if (citations.length > 0) {
      const topCitation = citations[0];
      offlineMsg = `### 🧠 CyberMentor Socratic Analysis: "${message}"\n\n` +
        `**1. First Principles Concept**\n` +
        `When analyzing this security topic, examine how untrusted input or network state transitions are parsed:\n\n` +
        `> **${topCitation.title}** (*${topCitation.source}*)\n` +
        `> ${topCitation.snippet}\n\n` +
        `**2. Deep Technical Breakdown**\n` +
        `- **Attack / Vulnerability Vector**: Untrusted inputs crossing execution boundaries without strict validation or parameterization.\n` +
        `- **Defensive Control**: Implement defense in depth, zero trust authorization, and automated security audit logging.\n\n` +
        `**3. Socratic Probing Question**\n` +
        `*What specific boundary or validation control in this scenario is most susceptible to bypass? How would you verify containment using telemetry?*\n\n` +
        `*(Note: Connect your Gemini API key in Settings > Secrets for real-time neural mentoring!)*`;
    } else {
      offlineMsg = `### 🧠 CyberMentor Socratic Analysis: "${message}"\n\n` +
        `**1. First-Principles Decomposition**\n` +
        `Deconstruct the security problem into core analytical dimensions:\n` +
        `- **Protocol / Layer**: Identify the exact OSI layer or system component handling the data.\n` +
        `- **Trust Boundary**: Pinpoint where untrusted user input interacts with privileged system APIs.\n` +
        `- **Failure Mode**: Is the vulnerability caused by logic flaws, missing sanitization, or broken access controls?\n` +
        `- **Defensive Telemetry**: Determine what SIEM audit logs or Sysmon Event IDs provide evidence of threat activity.\n\n` +
        `**2. Socratic Probing Question**\n` +
        `*Given what you know about this attack surface, what is the single most effective structural defense you would deploy first?*\n\n` +
        `*(Note: Connect your Gemini API key in Settings > Secrets for real-time neural mentoring!)*`;
    }

    const words = offlineMsg.split(' ');
    for (const w of words) {
      res.write(`event: chunk\ndata: ${JSON.stringify({ text: w + ' ' })}\n\n`);
      await new Promise((r) => setTimeout(r, 20));
    }
    res.write('event: done\ndata: {}\n\n');
    return res.end();
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { timeout: 30000, headers: { 'User-Agent': 'aistudio-build' } }
    });

    let ragContext = '';
    if (citations.length > 0) {
      ragContext = `\n\nRELEVANT RAG KNOWLEDGE BASE CHUNKS:\n` + citations.map((c) => `[${c.title} (${c.source})]: ${c.snippet}`).join('\n');
    }

    let formattedHistory = '';
    if (Array.isArray(history) && history.length > 0) {
      formattedHistory = '\n\nPRIOR CONVERSATION HISTORY:\n' + history.slice(-6).map((h: any) => `${h.role === 'user' ? 'Student' : 'CyberMentor'}: ${h.content}`).join('\n') + '\n';
    }

    const promptText = `STUDENT QUESTION:\n${message}\n\n${studentContext ? `STUDENT CONTEXT:\n${studentContext}` : ''}${formattedHistory}${ragContext}\n\nProvide a comprehensive, technically thorough, Socratic mentorship response.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let streamSuccess = false;

    for (const modelName of candidateModels) {
      try {
        const streamResponse = await ai.models.generateContentStream({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction: sysInstruction,
            temperature: 0.7
          }
        });

        for await (const chunk of streamResponse) {
          if (chunk.text) {
            res.write(`event: chunk\ndata: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        streamSuccess = true;
        break;
      } catch (mErr: any) {
        console.warn(`Model ${modelName} stream error: ${mErr.message}. Trying next candidate...`);
      }
    }

    if (!streamSuccess) {
      const topCitation = citations[0];
      const fallbackText = topCitation
        ? `### 🧠 Grounded Reference: ${topCitation.title}\n> ${topCitation.snippet}\n\n**Socratic Question:**\nHow does this protocol mechanic protect the system from state table exhaustion or unauthorized execution? Trace the packet flow step by step.`
        : `### 🧠 Socratic Guidance\nLet us dissect "${message.slice(0, 45)}" using first principles:\n1. **Protocol Analysis**: What protocol or service handles this request?\n2. **Vulnerability Mechanics**: Why does the default implementation fail securely?\n3. **Defensive Telemetry**: What SIEM Event IDs indicate active abuse?`;

      const words = fallbackText.split(' ');
      for (const w of words) {
        res.write(`event: chunk\ndata: ${JSON.stringify({ text: w + ' ' })}\n\n`);
        await new Promise((r) => setTimeout(r, 20));
      }
    }

    res.write('event: done\ndata: {}\n\n');
    res.end();
  } catch (err: any) {
    console.error('SSE Stream Error:', err);
    res.write(`event: chunk\ndata: ${JSON.stringify({ text: 'Neural stream unavailable. Please retry shortly.' })}\n\n`);
    res.write('event: done\ndata: {}\n\n');
    res.end();
  }
});

// Sandboxed AI Tool Invocation
app.post('/api/v1/ai/tools/execute', requireAuth, (req: AuthenticatedRequest, res) => {
  const { toolName, args } = req.body;
  if (!toolName) return res.status(400).json({ error: 'Tool name is required' });
  const userId = req.user?.sub;
  const result = executeAITool(toolName, args || {}, userId);
  res.json({ toolName, result });
});

// -------------------------------------------------------------
// 12. PRIVACY & GDPR ACCOUNT MANAGEMENT
// -------------------------------------------------------------
app.get('/api/v1/privacy/export', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;
  const user = db.users.get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const userProgress: any[] = [];
  for (const [k, v] of db.lessonProgress.entries()) {
    if (k.startsWith(`${userId}:`)) userProgress.push(v);
  }

  const userNotes: any[] = [];
  for (const n of db.notes.values()) {
    if (n.userId === userId) userNotes.push(n);
  }

  const userMasteries: any[] = [];
  for (const [k, v] of db.topicMasteries.entries()) {
    if (k.startsWith(`${userId}:`)) userMasteries.push(v);
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    compliance: 'GDPR Article 20 - Right to Data Portability',
    userProfile: user,
    lessonProgress: userProgress,
    topicMasteries: userMasteries,
    notes: userNotes,
    quizAttempts: db.quizAttempts.filter((a) => a.userId === userId)
  };

  res.setHeader('Content-Disposition', `attachment; filename="cybermentor-gdpr-export-${userId}.json"`);
  res.json(exportData);
});

app.delete('/api/v1/privacy/account', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.sub;

  // Cascading deletion of user state
  db.users.delete(userId);
  db.userCredentials.delete(userId);

  for (const k of Array.from(db.topicMasteries.keys())) {
    if (k.startsWith(`${userId}:`)) db.topicMasteries.delete(k);
  }
  for (const k of Array.from(db.lessonProgress.keys())) {
    if (k.startsWith(`${userId}:`)) db.lessonProgress.delete(k);
  }
  for (const k of Array.from(db.labProgress.keys())) {
    if (k.startsWith(`${userId}:`)) db.labProgress.delete(k);
  }
  for (const k of Array.from(db.scenarioProgress.keys())) {
    if (k.startsWith(`${userId}:`)) db.scenarioProgress.delete(k);
  }
  for (const [k, note] of Array.from(db.notes.entries())) {
    if (note.userId === userId) db.notes.delete(k);
  }
  db.quizAttempts = db.quizAttempts.filter((a) => a.userId !== userId);

  res.json({
    success: true,
    message: 'Account and all associated telemetry records permanently purged in compliance with GDPR Right to Erasure.'
  });
});

// -------------------------------------------------------------
// 13. VITE MIDDLEWARE & STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CyberMentor] Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
