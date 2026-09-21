import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudyRoadmapView } from './components/StudyRoadmapView';
import { CoursesView } from './components/CoursesView';
import { LessonView } from './components/LessonView';
import { QuizModal } from './components/QuizModal';
import { LabsView } from './components/LabsView';
import { LabWorkspaceModal } from './components/LabWorkspaceModal';
import { ScenariosView } from './components/ScenariosView';
import { ScenarioWorkspaceModal } from './components/ScenarioWorkspaceModal';
import { CertificationsView } from './components/CertificationsView';
import { VideosView } from './components/VideosView';
import { AboutProjectView } from './components/AboutProjectView';
import { AiMentorView } from './components/AiMentorView';
import { NotesView } from './components/NotesView';
import { PrivacyView } from './components/PrivacyView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { DiagnosticModal } from './components/DiagnosticModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Badges } from './components/Badges';

import {
  User,
  StudentDashboardSummary,
  Course,
  Lesson,
  Lab,
  IncidentScenario,
  Certification,
  StudentNote,
  DiagnosticResult
} from './types';

import {
  getCurrentUser,
  getDashboardSummary,
  getCourses,
  getLessonById,
  getLabs,
  getScenarios,
  getCertifications,
  getNotes,
  login,
  logout,
  getStoredToken,
  clearStoredToken,
  ensureAuthenticatedSession
} from './services/api';
import { auth, onAuthStateChanged, syncUserToFirestore } from './lib/firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<StudentDashboardSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [scenarios, setScenarios] = useState<IncidentScenario[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [notes, setNotes] = useState<StudentNote[]>([]);

  // Active modal / subview state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize Session & Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userProfile = await syncUserToFirestore(fbUser);
          setUser(userProfile);
          await refreshAllData();
        } catch (err) {
          console.error('Error syncing Firebase user profile:', err);
        }
      } else {
        // Fallback to local session check
        try {
          const currentUser = await ensureAuthenticatedSession();
          setUser(currentUser);
        } catch (err) {
          console.warn('Session recovery triggered after token check:', err);
          clearStoredToken();
          try {
            const authData = await login('cadet@cybermentor.io', 'CyberCadet2026!');
            setUser(authData.user);
          } catch (recoveryErr) {
            console.error('Failed to establish session fallback:', recoveryErr);
          }
        } finally {
          await refreshAllData();
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Global keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const refreshAllData = async () => {
    try {
      setLoadingSummary(true);
      let sumData = await getDashboardSummary().catch(() => null);
      // If summary fetch failed due to stale token, auto-reauthenticate and retry once
      if (!sumData) {
        await ensureAuthenticatedSession().catch(() => null);
        sumData = await getDashboardSummary().catch(() => null);
      }

      const [courseData, labData, scData, certData] = await Promise.all([
        getCourses().catch(() => []),
        getLabs().catch(() => []),
        getScenarios().catch(() => []),
        getCertifications().catch(() => [])
      ]);

      if (sumData) {
        setSummary(sumData);
        setUser(sumData.user);
      }
      setCourses(courseData);
      setLabs(labData);
      setScenarios(scData);
      setCertifications(certData);

      const notesData = await getNotes().catch(() => []);
      setNotes(notesData);
    } catch (err) {
      console.error('Error refreshing platform data:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleOpenLesson = async (lessonId: string) => {
    try {
      const lesson = await getLessonById(lessonId);
      setActiveLesson(lesson);
    } catch (err: any) {
      alert(err.message || 'Failed to open lesson');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setSummary(null);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    refreshAllData();
  };

  const handleDiagnosticCompleted = (result: DiagnosticResult) => {
    refreshAllData();
  };

  const handleNavigateFromSearch = (targetView: string, targetId: string) => {
    if (targetView === 'lesson') {
      handleOpenLesson(targetId);
    } else if (targetView === 'labs') {
      setCurrentTab('labs');
      setActiveLabId(targetId);
    } else if (targetView === 'scenarios') {
      setCurrentTab('scenarios');
      setActiveScenarioId(targetId);
    } else if (targetView === 'courses') {
      setCurrentTab('courses');
    } else if (targetView === 'certifications') {
      setCurrentTab('certifications');
    } else if (targetView === 'badges') {
      setCurrentTab('badges');
    } else if (targetView === 'notes') {
      setCurrentTab('notes');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans overflow-x-hidden">
      {/* Liquid Glass Dynamic Ambient Light Refraction Orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute top-1/4 -right-24 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-[150px]" />
        <div className="absolute top-2/3 -left-20 h-[28rem] w-[28rem] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      {/* 1. TOP NAVBAR */}
      <Navbar
        user={user}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 2. COMMAND CENTER WORKSPACE */}
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setActiveLesson(null);
          }}
        />

        {/* Main Central Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-64px)]">
          {activeLesson ? (
            <LessonView
              lesson={activeLesson}
              onBack={() => setActiveLesson(null)}
              onOpenQuiz={(quizId) => setActiveQuizId(quizId)}
              onOpenLab={(labId) => setActiveLabId(labId)}
              onLessonCompleted={() => refreshAllData()}
            />
          ) : currentTab === 'dashboard' ? (
            <DashboardView
              summary={summary}
              loading={loadingSummary}
              onNavigateTab={(tab, targetId) => {
                setCurrentTab(tab);
              }}
              onSelectCourse={(courseId) => setCurrentTab('courses')}
              onOpenLesson={handleOpenLesson}
              onOpenLab={(labId) => setActiveLabId(labId)}
              onOpenScenario={(scenarioId) => setActiveScenarioId(scenarioId)}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onRefreshData={refreshAllData}
            />
          ) : currentTab === 'roadmap' ? (
            <StudyRoadmapView
              onOpenLesson={handleOpenLesson}
              onOpenLab={(labId) => setActiveLabId(labId)}
              onOpenScenario={(scenarioId) => setActiveScenarioId(scenarioId)}
              onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              onOpenQuiz={(quizId) => setActiveQuizId(quizId)}
            />
          ) : currentTab === 'courses' ? (
            <CoursesView
              courses={courses}
              onOpenLesson={handleOpenLesson}
              onNavigateRoadmap={() => setCurrentTab('roadmap')}
            />
          ) : currentTab === 'videos' ? (
            <VideosView
              onOpenLesson={handleOpenLesson}
            />
          ) : currentTab === 'about' ? (
            <AboutProjectView
              onSelectTab={(tab) => setCurrentTab(tab)}
            />
          ) : currentTab === 'labs' ? (
            <LabsView
              labs={labs}
              onOpenLab={(labId) => setActiveLabId(labId)}
            />
          ) : currentTab === 'scenarios' ? (
            <ScenariosView
              scenarios={scenarios}
              onOpenScenario={(scId) => setActiveScenarioId(scId)}
            />
          ) : currentTab === 'badges' ? (
            <Badges
              summary={summary?.badgesSummary || null}
              user={user}
              certificationsSummary={summary?.certificationsSummary}
              onNavigateTab={(tab, targetId) => {
                setCurrentTab(tab);
              }}
              onOpenLesson={handleOpenLesson}
              onOpenLab={(labId) => setActiveLabId(labId)}
              onOpenScenario={(scenarioId) => setActiveScenarioId(scenarioId)}
            />
          ) : currentTab === 'certifications' ? (
            <CertificationsView
              certifications={certifications}
              onCertCompleted={() => refreshAllData()}
            />
          ) : currentTab === 'ai-mentor' ? (
            <AiMentorView
              user={user}
              courses={courses}
              summary={summary}
              activeLesson={activeLesson}
            />
          ) : currentTab === 'notes' ? (
            <NotesView
              notes={notes}
              onNotesUpdated={() => refreshAllData()}
            />
          ) : currentTab === 'privacy' ? (
            <PrivacyView
              onAccountDeleted={() => {
                setUser(null);
                setSummary(null);
                setIsAuthOpen(true);
              }}
            />
          ) : null}
        </main>
      </div>

      {/* 3. MODALS & DRAWERS */}
      {isProfileOpen && (
        <UserProfileModal
          user={user}
          summary={summary}
          onClose={() => setIsProfileOpen(false)}
          onNavigateTab={(tab, targetId) => {
            setCurrentTab(tab);
          }}
          onOpenLesson={handleOpenLesson}
          onOpenLab={(labId) => setActiveLabId(labId)}
          onOpenScenario={(scenarioId) => setActiveScenarioId(scenarioId)}
        />
      )}

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToResult={handleNavigateFromSearch}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onAssessmentCompleted={handleDiagnosticCompleted}
      />

      <QuizModal
        quizId={activeQuizId}
        onClose={() => setActiveQuizId(null)}
        onQuizCompleted={() => refreshAllData()}
      />

      <LabWorkspaceModal
        labId={activeLabId}
        onClose={() => setActiveLabId(null)}
        onLabPwned={() => refreshAllData()}
      />

      <ScenarioWorkspaceModal
        scenario={scenarios.find((s) => s.id === activeScenarioId) || null}
        onClose={() => setActiveScenarioId(null)}
        onScenarioResolved={() => refreshAllData()}
      />

      {/* Floating Bottom-Right AI Mentor Launcher */}
      <button
        onClick={() => {
          setCurrentTab('ai-mentor');
          setActiveLesson(null);
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/90 px-4 py-3 text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400 transition-all group"
        title="Socratic AI Mentor"
      >
        <Bot className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Socratic AI Mentor</span>
        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-400/30">
          Neural
        </span>
      </button>
    </div>
  );
}
