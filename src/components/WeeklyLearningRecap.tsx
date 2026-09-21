import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Flame,
  CheckCircle2,
  Award,
  ArrowRight,
  Brain,
  RefreshCw,
  Lightbulb,
  Target,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { WeeklyRecap, WeeklyRecapFocusArea } from '../types';
import { getWeeklyRecap } from '../services/api';

interface WeeklyLearningRecapProps {
  onNavigateTab: (tab: any, targetId?: string) => void;
  onOpenLab?: (labId: string) => void;
  onOpenScenario?: (scenarioId: string) => void;
  onOpenLesson?: (lessonId: string) => void;
}

export const WeeklyLearningRecap: React.FC<WeeklyLearningRecapProps> = ({
  onNavigateTab,
  onOpenLab,
  onOpenScenario,
  onOpenLesson
}) => {
  const [recap, setRecap] = useState<WeeklyRecap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecapData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await getWeeklyRecap();
      setRecap(data);
    } catch (err: any) {
      console.error('Error fetching weekly recap:', err);
      setError(err.message || 'Failed to generate weekly learning recap');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecapData();
  }, []);

  const handleActionClick = (area: WeeklyRecapFocusArea) => {
    if (area.targetView === 'labs' && area.targetId && onOpenLab) {
      onOpenLab(area.targetId);
    } else if (area.targetView === 'scenarios' && area.targetId && onOpenScenario) {
      onOpenScenario(area.targetId);
    } else if (area.targetView === 'courses' && area.targetId && onOpenLesson) {
      onOpenLesson(area.targetId);
    } else if (area.targetView) {
      onNavigateTab(area.targetView, area.targetId);
    } else {
      onNavigateTab('roadmap');
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100">Weekly Learning Recap</h3>
              <p className="text-xs text-slate-400">Synthesizing telemetry data with Gemini AI...</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center py-8 gap-3 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-400 border-t-transparent"></div>
          <p className="font-mono text-xs text-purple-300">Generating AI Progress Briefing & Focus Areas...</p>
        </div>
      </div>
    );
  }

  if (error || !recap) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Brain className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-slate-100">Weekly Learning Recap</h3>
          </div>
          <button
            onClick={() => fetchRecapData(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Unable to generate AI briefing at this moment. You can retry or continue with your study roadmap.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-slate-900/60 to-slate-950/80 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="h-5 w-5 text-purple-300" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">Weekly Learning Recap</h3>
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30">
                AI TELEMETRY BRIEFING
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized performance summary & actionable focus recommendations generated by CyberMentor AI
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchRecapData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Analyzing...' : 'Regenerate Analysis'}</span>
        </button>
      </div>

      {/* OVERVIEW HEADLINE BANNER */}
      <div className="mt-5 rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-base font-bold text-purple-200 leading-snug">{recap.headline}</h4>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{recap.overviewSummary}</p>
          </div>
        </div>
      </div>

      {/* STATS SUMMARY GRID */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/15 bg-white/5 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>XP Earned This Week</span>
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-amber-300">
            +{recap.statsSummary.xpEarnedThisWeek} <span className="text-xs font-normal text-slate-400">XP</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/5 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Completed Activities</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-emerald-300">
            {recap.statsSummary.completedActivitiesCount} <span className="text-xs font-normal text-slate-400">Units</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/5 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current Streak</span>
            <Flame className="h-4 w-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-orange-300">
            {recap.statsSummary.currentStreak} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/5 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Top Domain Mastery</span>
            <Award className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-sm font-semibold text-cyan-200 truncate" title={recap.statsSummary.topMasteryTopic}>
            {recap.statsSummary.topMasteryTopic}
          </div>
        </div>
      </div>

      {/* KEY HIGHLIGHTS & SUGGESTED FOCUS AREAS */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Highlights */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Key Accomplishments This Week</span>
            </h4>
            <ul className="mt-3 space-y-2.5">
              {recap.keyHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Focus Areas */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <span>AI Suggested Focus Areas for Next Week</span>
          </h4>

          <div className="mt-3 space-y-3">
            {recap.suggestedFocusAreas.map((area, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-white/10 bg-slate-900/60 p-3 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{area.topic}</span>
                    <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                      TARGET AREA
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">{area.reason}</p>
                  <p className="mt-1 text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-amber-400 flex-shrink-0" />
                    <span>{area.actionableStep}</span>
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleActionClick(area)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    <span>Practice & Take Action</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOCRATIC MENTOR NOTE */}
      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider">
              CYBERMENTOR SOCRATIC ADVICE
            </span>
            <p className="mt-1 text-xs italic text-amber-100 leading-relaxed">
              "{recap.mentorSocraticNote}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
