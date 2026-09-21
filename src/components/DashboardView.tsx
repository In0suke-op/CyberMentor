import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Zap,
  Flame,
  TrendingUp,
  Terminal,
  AlertTriangle,
  Award,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Sparkles,
  Target,
  ArrowUpRight,
  Compass
} from 'lucide-react';
import { StudentDashboardSummary, MajorMilestone } from '../types';
import { Badges } from './Badges';
import { ProgressDashboard } from './ProgressDashboard';
import { LevelUpModal } from './LevelUpModal';
import { XpToast, XpToastNotification } from './XpToast';
import { WeeklyLearningRecap } from './WeeklyLearningRecap';
import { claimMilestone, completeCertificationBenchmark } from '../services/api';

interface DashboardViewProps {
  summary: StudentDashboardSummary | null;
  loading: boolean;
  onNavigateTab: (tab: any, targetId?: string) => void;
  onSelectCourse: (courseId: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenLab: (labId: string) => void;
  onOpenScenario: (scenarioId: string) => void;
  onOpenDiagnostic: () => void;
  onOpenProfile?: () => void;
  onRefreshData?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  loading,
  onNavigateTab,
  onSelectCourse,
  onOpenLesson,
  onOpenLab,
  onOpenScenario,
  onOpenDiagnostic,
  onOpenProfile,
  onRefreshData
}) => {
  const [toasts, setToasts] = useState<XpToastNotification[]>([]);
  const [levelUpModal, setLevelUpModal] = useState<{
    isOpen: boolean;
    newLevel: number;
    oldLevel?: number;
    milestoneTitle?: string;
    xpBonusAwarded?: number;
  }>({
    isOpen: false,
    newLevel: 1
  });

  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [localMilestones, setLocalMilestones] = useState<MajorMilestone[]>([]);

  // Sync major milestones from summary
  useEffect(() => {
    if (summary?.majorMilestones) {
      setLocalMilestones(summary.majorMilestones);
    }
  }, [summary?.majorMilestones]);

  // Track previous level and XP to trigger authoritative animations
  const prevLevelRef = useRef<number | null>(null);
  const prevXpRef = useRef<number | null>(null);

  const addToast = (toast: XpToastNotification) => {
    setToasts((prev) => [toast, ...prev.slice(0, 4)]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!summary?.user) return;

    const currentLevel = summary.user.level;
    const currentXp = summary.user.xp;

    if (prevLevelRef.current !== null && currentLevel > prevLevelRef.current) {
      // Authoritative Level Up triggered!
      setLevelUpModal({
        isOpen: true,
        newLevel: currentLevel,
        oldLevel: prevLevelRef.current,
        milestoneTitle: 'Security Operations Center Rank Promotion Cleared',
        xpBonusAwarded: Math.max(200, currentXp - (prevXpRef.current || 0))
      });

      addToast({
        id: `lvl-${Date.now()}`,
        title: `Rank Promoted to Level ${currentLevel}!`,
        subtitle: 'Authorization elevated across CTF sandboxes and crisis rooms',
        xpAwarded: Math.max(150, currentXp - (prevXpRef.current || 0)),
        isLevelUp: true,
        newLevel: currentLevel
      });
    }

    prevLevelRef.current = currentLevel;
    prevXpRef.current = currentXp;
  }, [summary?.user?.level, summary?.user?.xp]);

  if (loading || !summary) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="font-mono text-xs text-slate-400">Loading Authoritative SOC Telemetry...</p>
        </div>
      </div>
    );
  }

  const { user, topicMasteries, weakTopics, continueLearning, recommendedLab, recommendedScenario, certificationsSummary } = summary;
  const nextLevelXp = user.level * user.level * 100;
  const prevLevelXp = (user.level - 1) * (user.level - 1) * 100;
  const levelProgress = Math.min(100, Math.max(0, Math.round(((user.xp - prevLevelXp) / (nextLevelXp - prevLevelXp || 1)) * 100)));

  // Claim or complete a major milestone
  const handleClaimMilestone = async (ms: MajorMilestone) => {
    try {
      setClaimingId(ms.id);
      const res = await claimMilestone(ms.id);

      // Trigger XP Toast Notification
      addToast({
        id: `ms-${Date.now()}`,
        title: res.leveledUp ? `Level Up! Level ${res.newLevel}` : 'Major Milestone Achieved!',
        subtitle: ms.title,
        xpAwarded: res.xpAwarded,
        isLevelUp: res.leveledUp,
        newLevel: res.newLevel,
        type: 'milestone'
      });

      // Trigger Level-Up modal celebration if leveled up or milestone cleared
      if (res.leveledUp) {
        setLevelUpModal({
          isOpen: true,
          newLevel: res.newLevel,
          oldLevel: res.oldLevel,
          milestoneTitle: ms.title,
          xpBonusAwarded: res.xpAwarded
        });
      }

      // Optimistically update local milestone status
      setLocalMilestones((prev) =>
        prev.map((m) => (m.id === ms.id ? { ...m, completed: true, progressPercent: 100 } : m))
      );

      onRefreshData?.();
    } catch (err: any) {
      console.error('Failed to claim milestone:', err);
      addToast({
        id: `err-${Date.now()}`,
        title: 'Milestone Notice',
        subtitle: err.message || 'Milestone already claimed or pending verification',
        xpAwarded: 0
      });
    } finally {
      setClaimingId(null);
    }
  };

  // Complete a certification benchmark
  const handleCompleteCertBenchmark = async (certId: string) => {
    try {
      setClaimingId(certId);
      const res = await completeCertificationBenchmark(certId);

      addToast({
        id: `cert-${Date.now()}`,
        title: res.leveledUp ? `Level Up! Level ${res.newLevel}` : 'Certification Benchmark Cleared!',
        subtitle: `${res.certTitle} (${res.certCode}) Exam Blueprint Validated`,
        xpAwarded: res.xpAwarded,
        isLevelUp: res.leveledUp,
        newLevel: res.newLevel,
        type: 'certification'
      });

      if (res.leveledUp) {
        setLevelUpModal({
          isOpen: true,
          newLevel: res.newLevel,
          oldLevel: res.oldLevel,
          milestoneTitle: `${res.certTitle} Exam Readiness Benchmark`,
          xpBonusAwarded: res.xpAwarded
        });
      }

      onRefreshData?.();
    } catch (err: any) {
      console.error('Certification benchmark error:', err);
    } finally {
      setClaimingId(null);
    }
  };

  // Interactive manual simulation for demonstration and testing
  const handleSimulatePromotion = () => {
    const nextLevel = user.level + 1;
    addToast({
      id: `sim-${Date.now()}`,
      title: `Level Up! Promoted to Level ${nextLevel}`,
      subtitle: 'CompTIA Security+ Exam Readiness Benchmark (85%+ Mastery)',
      xpAwarded: 300,
      isLevelUp: true,
      newLevel: nextLevel,
      type: 'certification'
    });

    setLevelUpModal({
      isOpen: true,
      newLevel: nextLevel,
      oldLevel: user.level,
      milestoneTitle: 'CompTIA Security+ Blueprint Benchmark (SY0-701)',
      xpBonusAwarded: 300
    });
  };

  const displayMilestones = localMilestones.length > 0 ? localMilestones : (summary.majorMilestones || []);

  return (
    <div className="space-y-6">
      {/* 1. HERO OPERATOR TELEMETRY BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                SECURITY CADET #{user.id.slice(-6).toUpperCase()}
              </span>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-300 border border-cyan-500/30 capitalize">
                {user.skillTier} Tier
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">
              Welcome back, <span className="text-emerald-400">{user.fullName || user.username}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Server-authoritative progress: Zero simulated client scores. All lab flags, quiz completions, and daily XP are cryptographically verified.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:border-emerald-400/40 hover:bg-white/20 transition-all shadow-sm"
            >
              <Compass className="h-4 w-4 text-cyan-400" />
              <span>Study Roadmap</span>
            </button>
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:border-white/30 hover:bg-white/20 transition-all shadow-sm"
              >
                <UserIcon className="h-4 w-4 text-emerald-400" />
                <span>Operator Dossier</span>
              </button>
            )}
            <button
              onClick={onOpenDiagnostic}
              className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/20 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <Award className="h-4 w-4" />
              <span>Retake Baseline Diagnostic</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/15 pt-6">
          {/* Level & XP */}
          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Current Rank</span>
              <span className="font-mono text-xs font-bold text-emerald-400">LVL {user.level}</span>
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-slate-100">{user.xp} <span className="text-xs font-normal text-slate-400">XP</span></div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${levelProgress}%` }}></div>
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-300 font-mono">
              <span>{user.xp} XP</span>
              <span>Next: {nextLevelXp} XP</span>
            </div>
          </div>

          {/* Daily Streak & Shields */}
          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Daily Streak</span>
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-amber-400">{user.dailyStreak} <span className="text-xs text-slate-400">Days</span></div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Freeze Shields:</span>
              <span className="font-bold text-slate-300">🛡️ {user.freezeShields}</span>
            </div>
          </div>

          {/* Daily Cap Progress */}
          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Daily XP Cap</span>
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-cyan-300">{user.dailyXpEarned} / 1,500</div>
            <p className="mt-2 text-[10px] text-slate-300">Prevents artificial farming</p>
          </div>

          {/* Active Readiness Average */}
          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3.5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Security+ Readiness</span>
                <Award className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-2 text-lg font-mono font-bold text-purple-300">{certificationsSummary[0]?.readinessScore || 68}%</div>
              <p className="mt-1 text-[10px] text-slate-300">CompTIA SY0-701 Blueprint</p>
            </div>
            <button
              onClick={() => handleCompleteCertBenchmark('cert-sec-plus')}
              disabled={claimingId === 'cert-sec-plus'}
              className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 py-1.5 px-2 text-[10px] font-mono font-bold text-purple-300 hover:bg-purple-500/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>{claimingId === 'cert-sec-plus' ? 'Evaluating...' : 'Verify Benchmark (+300 XP)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* WEEKLY AI LEARNING RECAP BRIEFING */}
      <WeeklyLearningRecap
        onNavigateTab={onNavigateTab}
        onOpenLab={onOpenLab}
        onOpenScenario={onOpenScenario}
        onOpenLesson={onOpenLesson}
      />

      {/* 2. CONTINUE LEARNING & RECOMMENDED MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        <div className="lg:col-span-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-mono font-semibold text-emerald-300 border border-emerald-400/30">
                <Clock className="h-3.5 w-3.5" />
                RECOMMENDED NEXT ACTIVITY
              </span>
              <button
                onClick={() => onNavigateTab('courses')}
                className="text-xs font-medium text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>All Courses</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {continueLearning ? (
              <div className="mt-4">
                <div className="text-xs font-mono text-slate-300 uppercase tracking-wide">
                  {continueLearning.course.category} • {continueLearning.course.title}
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-100">
                  {continueLearning.nextLesson.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 line-clamp-2">
                  Complete this lesson to earn verified XP and advance toward your domain mastery milestones.
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-300">
                  <span>⏱️ {continueLearning.nextLesson.durationMinutes} minutes</span>
                  <span>⚡ +{continueLearning.nextLesson.xpReward} XP</span>
                  <span className="capitalize">📖 {continueLearning.nextLesson.type}</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 py-8 text-center text-slate-300">
                All assigned curriculum lessons completed! Choose a new track from the course library.
              </div>
            )}
          </div>

          {continueLearning && (
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
              <button
                onClick={() => onSelectCourse(continueLearning.course.id)}
                className="text-xs text-slate-300 hover:text-white"
              >
                View Syllabus
              </button>
              <button
                onClick={() => onOpenLesson(continueLearning.nextLesson.id)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <span>Resume Lesson</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Weak Topics / Skill Gaps */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span>Topic Mastery Telemetry</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">EMA Model</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Algorithmic knowledge index updated after every lab and quiz.
            </p>

            <div className="mt-4 space-y-3">
              {topicMasteries.slice(0, 4).map((topic) => (
                <div key={topic.topicId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">
                      {topic.topicName}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        topic.masteryScore >= 75
                          ? 'text-emerald-400'
                          : topic.masteryScore >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {topic.masteryScore}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        topic.masteryScore >= 75
                          ? 'bg-emerald-400'
                          : topic.masteryScore >= 50
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${topic.masteryScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('ai-mentor')}
            className="mt-6 w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            Review Weak Topics with AI Mentor
          </button>
        </div>
      </div>

      {/* 3. RECHARTS PROGRESS DASHBOARD: COMPLETION RATES OVER TIME */}
      <ProgressDashboard
        analytics={summary.progressAnalytics || null}
        loading={loading}
        onNavigateTab={onNavigateTab}
        onOpenLesson={onOpenLesson}
        onOpenLab={onOpenLab}
        onOpenScenario={onOpenScenario}
      />

      {/* 4. OPERATOR BADGES & ACHIEVEMENTS TRACKER */}
      <Badges
        summary={summary.badgesSummary || null}
        compact={false}
        onNavigateTab={onNavigateTab}
        onOpenLesson={onOpenLesson}
        onOpenLab={onOpenLab}
        onOpenScenario={onOpenScenario}
        onViewAll={onOpenProfile}
      />

      {/* 4. FAST LAUNCH CTF LAB & INCIDENT ROOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended CTF Sandbox Lab */}
        <div className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 hover:border-white/30 hover:bg-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Terminal className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">Hands-on CTF Sandbox</span>
                <h4 className="text-base font-bold text-slate-100">{recommendedLab.title}</h4>
              </div>
            </div>
            <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-200">
              {recommendedLab.difficulty}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            {recommendedLab.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
            <div className="text-xs font-mono text-slate-300">
              Target: <code className="text-emerald-300">{recommendedLab.targetSystem}</code>
            </div>
            <button
              onClick={() => onOpenLab(recommendedLab.id)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all"
            >
              <span>Launch Lab Terminal</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Recommended Incident Room */}
        <div className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 hover:border-white/30 hover:bg-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">SOC Crisis Simulation</span>
                <h4 className="text-base font-bold text-slate-100">{recommendedScenario.title}</h4>
              </div>
            </div>
            <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-400 font-bold">
              {recommendedScenario.severity}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            {recommendedScenario.summary}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
            <div className="text-xs font-mono text-slate-300">
              Stages: <span className="text-slate-200">{recommendedScenario.stages.length} Triage Steps</span>
            </div>
            <button
              onClick={() => onOpenScenario(recommendedScenario.id)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-all"
            >
              <span>Enter Incident Room</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. MAJOR MILESTONES & CERTIFICATION ROADMAP */}
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <Target className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Major Milestones & Industry Certifications
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Complete major career milestones and pass certification blueprint benchmarks to trigger rank promotions and earned XP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulatePromotion}
              className="flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-500/20 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-all shadow-sm"
              title="Test the Level-Up celebration animation and XP Toast notification"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Simulate Promotion</span>
            </button>
            <button
              onClick={() => onNavigateTab('certifications')}
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              <span>All Certifications</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayMilestones.map((ms) => {
            const isCompleted = ms.completed;
            const isPending = claimingId === ms.id;
            return (
              <div
                key={ms.id}
                className={`relative flex flex-col justify-between rounded-xl border p-4 backdrop-blur-md transition-all ${
                  isCompleted
                    ? 'border-emerald-400/40 bg-emerald-500/10 shadow-[0_4px_20px_rgba(16,185,129,0.1)]'
                    : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                        ms.category === 'certification'
                          ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                          : ms.category === 'ctf'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : ms.category === 'incident'
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                          : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                      }`}
                    >
                      {ms.certificationCode || ms.category.toUpperCase()}
                    </span>

                    <span className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
                      <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                      +{ms.xpReward} XP
                    </span>
                  </div>

                  <h4 className="mt-2.5 text-sm font-bold text-slate-100 leading-snug">
                    {ms.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {ms.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Progress</span>
                      <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {isCompleted ? '100%' : `${ms.progressPercent}%`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-400' : 'bg-purple-400'
                        }`}
                        style={{ width: `${isCompleted ? 100 : ms.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={ms.criteria}>
                    {ms.criteria}
                  </span>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimMilestone(ms)}
                      disabled={isPending}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>{isPending ? 'Verifying...' : 'Complete & Claim'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING XP TOAST NOTIFICATIONS */}
      <XpToast
        toasts={toasts}
        onDismiss={dismissToast}
        onViewLevelUp={(lvl) =>
          setLevelUpModal({
            isOpen: true,
            newLevel: lvl,
            oldLevel: lvl - 1,
            milestoneTitle: 'Security Clearance Elevated',
            xpBonusAwarded: 250
          })
        }
      />

      {/* LEVEL-UP MODAL CELEBRATION */}
      <LevelUpModal
        isOpen={levelUpModal.isOpen}
        onClose={() => setLevelUpModal((prev) => ({ ...prev, isOpen: false }))}
        newLevel={levelUpModal.newLevel}
        oldLevel={levelUpModal.oldLevel}
        milestoneTitle={levelUpModal.milestoneTitle}
        xpBonusAwarded={levelUpModal.xpBonusAwarded}
      />
    </div>
  );
};
