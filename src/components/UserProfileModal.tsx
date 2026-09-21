import React, { useState } from 'react';
import {
  X,
  Shield,
  Award,
  Zap,
  Flame,
  Calendar,
  BookOpen,
  Terminal,
  AlertTriangle,
  Mail,
  User as UserIcon,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Sparkles
} from 'lucide-react';
import { User, StudentDashboardSummary } from '../types';
import { Badges } from './Badges';

interface UserProfileModalProps {
  user: User | null;
  summary: StudentDashboardSummary | null;
  onClose: () => void;
  onNavigateTab: (tab: any, targetId?: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenLab: (labId: string) => void;
  onOpenScenario: (scenarioId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  summary,
  onClose,
  onNavigateTab,
  onOpenLesson,
  onOpenLab,
  onOpenScenario
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'badges' | 'telemetry'>('badges');

  if (!user) return null;

  const nextLevelXp = user.level * user.level * 100;
  const prevLevelXp = (user.level - 1) * (user.level - 1) * 100;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((user.xp - prevLevelXp) / (nextLevelXp - prevLevelXp || 1)) * 100))
  );

  const badgesSummary = summary?.badgesSummary || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="h-4 w-4" />
            </span>
            <span className="font-mono text-xs font-bold text-slate-200">
              OPERATOR DOSSIER // {user.id.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Operator Profile Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Avatar with Status Ring */}
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-emerald-400 font-mono text-xl font-bold border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border border-emerald-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-100">{user.fullName || user.username}</h2>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase">
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      {user.email}
                    </span>
                    <span>•</span>
                    <span className="capitalize text-cyan-400 font-semibold">{user.skillTier} Tier</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges / Honors Badge */}
              {badgesSummary && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Achievements</div>
                    <div className="text-sm font-mono font-bold text-amber-300">
                      {badgesSummary.unlockedCount} / {badgesSummary.totalBadges} Badges
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Level & Progression Bar */}
            <div className="mt-6 border-t border-slate-800/80 pt-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono font-bold text-emerald-400 text-xs">
                    LEVEL {user.level}
                  </span>
                  <span className="font-mono text-slate-300 font-semibold">{user.xp} Total XP</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {nextLevelXp - user.xp} XP to Level {user.level + 1}
                </span>
              </div>

              <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Daily Streak</span>
                <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="mt-1 text-lg font-mono font-bold text-amber-300">
                {user.dailyStreak} Days
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {user.freezeShields} shields available
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Daily XP Cap</span>
                <Zap className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="mt-1 text-lg font-mono font-bold text-cyan-300">
                {user.dailyXpEarned} / 1500
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Resets daily at 00:00 UTC
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Lessons Completed</span>
                <BookOpen className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-1 text-lg font-mono font-bold text-emerald-400">
                {badgesSummary?.lessonsCompletedCount || 0}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Across 4 Tracks
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>CTF Flags Captured</span>
                <Terminal className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-1 text-lg font-mono font-bold text-purple-300">
                {badgesSummary?.labsCompletedCount || 0}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Verified flags
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Badges vs Topic Mastery */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveSubTab('badges')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                activeSubTab === 'badges'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Operator Badges & Achievements</span>
              {badgesSummary && (
                <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                  {badgesSummary.unlockedCount}/{badgesSummary.totalBadges}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('telemetry')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                activeSubTab === 'telemetry'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Knowledge Telemetry (EMA)</span>
            </button>
          </div>

          {/* View Content */}
          {activeSubTab === 'badges' ? (
            <Badges
              summary={badgesSummary}
              onNavigateTab={(tab, targetId) => {
                onClose();
                onNavigateTab(tab, targetId);
              }}
              onOpenLesson={(lessonId) => {
                onClose();
                onOpenLesson(lessonId);
              }}
              onOpenLab={(labId) => {
                onClose();
                onOpenLab(labId);
              }}
              onOpenScenario={(scenarioId) => {
                onClose();
                onOpenScenario(scenarioId);
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Algorithmic Topic Knowledge Index
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Scores calculated via Exponential Moving Average (EMA: 40% historical + 60% latest trial).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(summary?.topicMasteries || []).map((t) => (
                    <div
                      key={t.topicId}
                      className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{t.topicName}</span>
                        <span
                          className={`font-mono font-bold ${
                            t.masteryScore >= 75
                              ? 'text-emerald-400'
                              : t.masteryScore >= 50
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {t.masteryScore}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            t.masteryScore >= 75
                              ? 'bg-emerald-400'
                              : t.masteryScore >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${t.masteryScore}%` }}
                        ></div>
                      </div>
                      <div className="mt-1.5 flex justify-between text-[10px] font-mono text-slate-500">
                        <span>Domain: {t.domain}</span>
                        <span>{t.attemptsCount} assessments</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
