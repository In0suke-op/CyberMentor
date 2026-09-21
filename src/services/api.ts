import {
  AuthResponse,
  User,
  Course,
  Lesson,
  QuizClient,
  QuizResult,
  Lab,
  LabSubmissionResult,
  IncidentScenario,
  ScenarioEvaluation,
  Certification,
  StudentNote,
  DiagnosticResult,
  SearchResultItem,
  StudentDashboardSummary,
  UserBadgesSummary,
  Badge,
  ProgressAnalyticsSummary,
  MajorMilestone,
  EphemeralContainerSession,
  WeeklyRecap
} from '../types';
import {
  auth,
  fetchNotesFromFirestore,
  saveNoteToFirestore,
  deleteNoteFromFirestore
} from '../lib/firebase';

const TOKEN_KEY = 'cybermentor_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.error) errorMsg = errJson.error;
      if (errJson.message) errorMsg += `: ${errJson.message}`;
    } catch {
      // ignore
    }

    // If an invalid or expired token is detected on authenticated routes, clear it automatically
    if (res.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/register')) {
      clearStoredToken();
    }

    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}

// ---------------- AUTH API ----------------
export async function register(data: { email: string; username: string; password: string; fullName?: string }): Promise<AuthResponse> {
  const res = await fetchWithAuth<AuthResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  setStoredToken(res.token);
  return res;
}

export async function login(identifier: string, password: string): Promise<AuthResponse> {
  const res = await fetchWithAuth<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
  setStoredToken(res.token);
  return res;
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetchWithAuth<{ user: User }>('/api/v1/auth/me');
  return res.user;
}

export async function ensureAuthenticatedSession(): Promise<User> {
  const token = getStoredToken();
  if (token) {
    try {
      const user = await getCurrentUser();
      return user;
    } catch {
      clearStoredToken();
    }
  }

  // Fallback / initial demo cadet auto-login
  const auth = await login('cadet@cybermentor.io', 'CyberCadet2026!');
  return auth.user;
}

export async function logout(): Promise<void> {
  clearStoredToken();
  try {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
  } catch {
    // ignore
  }
}

export async function submitDiagnostic(answers: Record<string, number>): Promise<DiagnosticResult> {
  return fetchWithAuth<DiagnosticResult>('/api/v1/auth/diagnostic', {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
}

// ---------------- DASHBOARD & CURRICULUM ----------------
export async function getDashboardSummary(): Promise<StudentDashboardSummary> {
  return fetchWithAuth<StudentDashboardSummary>('/api/v1/dashboard/summary');
}

export async function getWeeklyRecap(): Promise<WeeklyRecap> {
  const res = await fetchWithAuth<{ recap: WeeklyRecap }>('/api/v1/dashboard/weekly-recap');
  return res.recap;
}

export async function getBadges(): Promise<UserBadgesSummary> {
  const res = await fetchWithAuth<{ badgesSummary: UserBadgesSummary }>('/api/v1/badges');
  return res.badgesSummary;
}

export async function getProgressAnalytics(): Promise<ProgressAnalyticsSummary> {
  const res = await fetchWithAuth<{ progressAnalytics: ProgressAnalyticsSummary }>('/api/v1/analytics/progress');
  return res.progressAnalytics;
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetchWithAuth<{ courses: Course[] }>('/api/v1/courses');
  return res.courses;
}

export async function getCourseById(id: string): Promise<Course> {
  const res = await fetchWithAuth<{ course: Course }>(`/api/v1/courses/${id}`);
  return res.course;
}

export async function getLessonById(id: string): Promise<Lesson> {
  const res = await fetchWithAuth<{ lesson: Lesson }>(`/api/v1/lessons/${id}`);
  return res.lesson;
}

export async function completeLesson(id: string): Promise<{ success: boolean; xpAwarded: number; userLevel: number; totalXp: number }> {
  return fetchWithAuth<{ success: boolean; xpAwarded: number; userLevel: number; totalXp: number }>(`/api/v1/lessons/${id}/complete`, {
    method: 'POST'
  });
}

// ---------------- QUIZ ENGINE ----------------
export async function getQuizById(id: string): Promise<QuizClient> {
  const res = await fetchWithAuth<{ quiz: QuizClient }>(`/api/v1/quizzes/${id}`);
  return res.quiz;
}

export async function generateAIQuiz(topicTitle: string, courseTitle?: string, difficulty?: string): Promise<QuizClient> {
  const res = await fetchWithAuth<{ quiz: QuizClient }>('/api/v1/quizzes/generate', {
    method: 'POST',
    body: JSON.stringify({ topicTitle, courseTitle, difficulty })
  });
  return res.quiz;
}

export async function submitQuiz(id: string, answers: Record<string, number[]>): Promise<QuizResult> {
  return fetchWithAuth<QuizResult>(`/api/v1/quizzes/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
}

// ---------------- CTF LABS ----------------
export async function getLabs(): Promise<Lab[]> {
  const res = await fetchWithAuth<{ labs: Lab[] }>('/api/v1/labs');
  return res.labs;
}

export async function getLabById(id: string): Promise<Lab> {
  const res = await fetchWithAuth<{ lab: Lab }>(`/api/v1/labs/${id}`);
  return res.lab;
}

export async function unlockLabHint(labId: string, hintId: string): Promise<{ id: string; title: string; text: string; xpCost: number }> {
  const res = await fetchWithAuth<{ success: boolean; hint: any }>(`/api/v1/labs/${labId}/unlock-hint`, {
    method: 'POST',
    body: JSON.stringify({ hintId })
  });
  return res.hint;
}

export async function submitLabFlag(labId: string, flag: string): Promise<LabSubmissionResult> {
  return fetchWithAuth<LabSubmissionResult>(`/api/v1/labs/${labId}/submit-flag`, {
    method: 'POST',
    body: JSON.stringify({ flag })
  });
}

export async function execLabTerminal(labId: string, command: string): Promise<{ output: string }> {
  return fetchWithAuth<{ output: string }>(`/api/v1/labs/${labId}/terminal-exec`, {
    method: 'POST',
    body: JSON.stringify({ command })
  });
}

export async function startLabContainer(
  labId: string
): Promise<{
  session: EphemeralContainerSession;
  dockerfile: string;
  dockerCompose: string;
  dockerRunCmd: string;
  seccompJson: string;
}> {
  return fetchWithAuth<{
    session: EphemeralContainerSession;
    dockerfile: string;
    dockerCompose: string;
    dockerRunCmd: string;
    seccompJson: string;
  }>(`/api/v1/labs/${labId}/container/start`, {
    method: 'POST'
  });
}

export async function stopLabContainer(labId: string): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth<{ success: boolean; message: string }>(`/api/v1/labs/${labId}/container/stop`, {
    method: 'POST'
  });
}

export async function getLabContainerStatus(labId: string): Promise<{ session: EphemeralContainerSession }> {
  return fetchWithAuth<{ session: EphemeralContainerSession }>(`/api/v1/labs/${labId}/container/status`);
}

export async function getLabContainerConfig(labId: string): Promise<{
  dockerfile: string;
  dockerCompose: string;
  dockerRunCmd: string;
  seccompJson: string;
  spec: any;
}> {
  return fetchWithAuth<{
    dockerfile: string;
    dockerCompose: string;
    dockerRunCmd: string;
    seccompJson: string;
    spec: any;
  }>(`/api/v1/labs/${labId}/container/config`);
}

export async function execLabContainer(labId: string, command: string): Promise<{ output: string; exitCode: number }> {
  return fetchWithAuth<{ output: string; exitCode: number }>(`/api/v1/labs/${labId}/container/exec`, {
    method: 'POST',
    body: JSON.stringify({ command })
  });
}

// ---------------- SCENARIOS ----------------
export async function getScenarios(): Promise<IncidentScenario[]> {
  const res = await fetchWithAuth<{ scenarios: IncidentScenario[] }>('/api/v1/scenarios');
  return res.scenarios;
}

export async function evaluateScenario(scenarioId: string, decisions: Record<string, string>): Promise<ScenarioEvaluation> {
  return fetchWithAuth<ScenarioEvaluation>(`/api/v1/scenarios/${scenarioId}/evaluate`, {
    method: 'POST',
    body: JSON.stringify({ decisions })
  });
}

// ---------------- CERTIFICATIONS ----------------
export async function getCertifications(): Promise<Certification[]> {
  const res = await fetchWithAuth<{ certifications: Certification[] }>('/api/v1/certifications');
  return res.certifications;
}

// ---------------- NOTES ----------------
export async function getNotes(): Promise<StudentNote[]> {
  const currentFbUser = auth.currentUser;
  if (currentFbUser) {
    const fsNotes = await fetchNotesFromFirestore(currentFbUser.uid);
    if (fsNotes.length > 0) return fsNotes;
  }

  try {
    const res = await fetchWithAuth<{ notes: StudentNote[] }>('/api/v1/notes');
    return res.notes;
  } catch (err) {
    if (currentFbUser) {
      return await fetchNotesFromFirestore(currentFbUser.uid);
    }
    return [];
  }
}

export async function createNote(data: { title: string; content: string; courseId?: string; courseTitle?: string; tags?: string[] }): Promise<StudentNote> {
  const currentFbUser = auth.currentUser;
  if (currentFbUser) {
    return await saveNoteToFirestore(currentFbUser.uid, data);
  }

  const res = await fetchWithAuth<{ note: StudentNote }>('/api/v1/notes', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.note;
}

export async function updateNote(id: string, data: { title: string; content: string; tags?: string[] }): Promise<StudentNote> {
  const currentFbUser = auth.currentUser;
  if (currentFbUser) {
    return await saveNoteToFirestore(currentFbUser.uid, { id, ...data });
  }

  const res = await fetchWithAuth<{ note: StudentNote }>(`/api/v1/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return res.note;
}

export async function deleteNote(id: string): Promise<void> {
  const currentFbUser = auth.currentUser;
  if (currentFbUser) {
    await deleteNoteFromFirestore(id);
    return;
  }

  await fetchWithAuth(`/api/v1/notes/${id}`, { method: 'DELETE' });
}

// ---------------- SEARCH ----------------
export async function searchGlobal(q: string): Promise<SearchResultItem[]> {
  const res = await fetchWithAuth<{ results: SearchResultItem[] }>(`/api/v1/search?q=${encodeURIComponent(q)}`);
  return res.results;
}

// ---------------- AI MENTOR ----------------
export async function sendMentorMessage(
  message: string,
  studentContext?: string,
  history?: Array<{ role: 'user' | 'model'; content: string }>,
  mentorMode?: string
): Promise<{ text: string; citations: any[] }> {
  return fetchWithAuth<{ text: string; citations: any[] }>('/api/v1/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, studentContext, history, mentorMode })
  });
}

// AI SSE Streaming Client
export function streamMentorMessage(
  message: string,
  studentContext: string,
  onChunk: (text: string) => void,
  onCitations: (citations: any[]) => void,
  onDone: () => void,
  onError: (err: string) => void,
  history?: Array<{ role: 'user' | 'model'; content: string }>,
  mentorMode?: string
) {
  const token = getStoredToken();
  fetch('/api/v1/ai/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ message, studentContext, history, mentorMode })
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Stream connection failed: ${response.statusText}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;
          const eventMatch = block.match(/event:\s*(.+)/);
          const dataMatch = block.match(/data:\s*(.+)/);
          const eventType = eventMatch ? eventMatch[1].trim() : 'message';
          const dataStr = dataMatch ? dataMatch[1].trim() : '{}';

          try {
            const data = JSON.parse(dataStr);
            if (eventType === 'citations') {
              onCitations(data);
            } else if (eventType === 'chunk') {
              onChunk(data.text);
            } else if (eventType === 'done') {
              onDone();
            } else if (eventType === 'error') {
              onError(data.error);
            }
          } catch {
            // raw text fallback
            if (eventType === 'chunk') onChunk(dataStr);
          }
        }
      }
      onDone();
    })
    .catch((err) => {
      onError(err.message || 'Stream error');
    });
}

// ---------------- PRIVACY ----------------
export async function deleteAccountPermanently(): Promise<void> {
  await fetchWithAuth('/api/v1/privacy/account', { method: 'DELETE' });
  clearStoredToken();
}

// ---------------- MILESTONES & CERTIFICATION ACHIEVEMENTS ----------------
export async function getMilestones(): Promise<MajorMilestone[]> {
  const res = await fetchWithAuth<{ milestones: MajorMilestone[] }>('/api/v1/milestones');
  return res.milestones;
}

export async function claimMilestone(milestoneId: string): Promise<{
  success: boolean;
  milestone: MajorMilestone;
  xpAwarded: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
  user: User;
}> {
  return await fetchWithAuth('/api/v1/milestones/' + milestoneId + '/claim', {
    method: 'POST'
  });
}

export async function completeCertificationBenchmark(certId: string): Promise<{
  success: boolean;
  certTitle: string;
  certCode: string;
  xpAwarded: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
  user: User;
}> {
  return await fetchWithAuth('/api/v1/certifications/' + certId + '/benchmark', {
    method: 'POST'
  });
}
