import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  BookOpen,
  Terminal,
  AlertTriangle,
  Zap,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  Activity,
  CheckCircle2,
  Info
} from 'lucide-react';
import { ProgressAnalyticsSummary, ProgressDataPoint } from '../types';

interface ProgressDashboardProps {
  analytics: ProgressAnalyticsSummary | null;
  loading?: boolean;
  onNavigateTab?: (tab: any, targetId?: string) => void;
  onOpenLesson?: (lessonId: string) => void;
  onOpenLab?: (labId: string) => void;
  onOpenScenario?: (scenarioId: string) => void;
}

type ChartViewType = 'rate' | 'count' | 'velocity';
type TimeRangeType = '7d' | '14d' | 'all';

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  analytics,
  loading = false,
  onNavigateTab,
  onOpenLesson,
  onOpenLab,
  onOpenScenario
}) => {
  const [chartView, setChartView] = useState<ChartViewType>('rate');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('14d');
  const [visibleSeries, setVisibleSeries] = useState<{
    courses: boolean;
    labs: boolean;
    scenarios: boolean;
    overall: boolean;
  }>({
    courses: true,
    labs: true,
    scenarios: true,
    overall: true
  });

  // Filter timeline based on time range
  const filteredTimeline = useMemo(() => {
    if (!analytics?.timeline) return [];
    if (timeRange === '7d') {
      return analytics.timeline.slice(-7);
    }
    return analytics.timeline;
  }, [analytics, timeRange]);

  if (loading || !analytics) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="font-mono text-xs text-slate-400">Synthesizing completion telemetry...</p>
        </div>
      </div>
    );
  }

  const {
    totalCourses,
    completedCourses,
    coursesRate,
    totalLessons,
    completedLessons,
    totalLabs,
    completedLabs,
    labsRate,
    totalScenarios,
    completedScenarios,
    scenariosRate,
    overallCompletionRate,
    weeklyVelocity,
    domainBreakdown
  } = analytics;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as ProgressDataPoint;
      return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-md text-xs font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              {label} ({dataPoint?.date})
            </span>
            {dataPoint?.xpEarned !== undefined && (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {dataPoint.xpEarned} XP
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {chartView === 'rate' ? (
              <>
                <div className="flex items-center justify-between gap-4 text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    Courses Rate:
                  </span>
                  <span className="font-bold">{dataPoint?.coursesRate}%</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    CTF Labs Rate:
                  </span>
                  <span className="font-bold">{dataPoint?.labsRate}%</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                    Scenarios Rate:
                  </span>
                  <span className="font-bold">{dataPoint?.scenariosRate}%</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-purple-400 border-t border-slate-800/80 pt-1 mt-1 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                    Composite Rate:
                  </span>
                  <span>{dataPoint?.overallRate}%</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    Lessons Done:
                  </span>
                  <span className="font-bold">{dataPoint?.lessonsCompleted} / {totalLessons}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    Labs Pwned:
                  </span>
                  <span className="font-bold">{dataPoint?.labsCompleted} / {totalLabs}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                    Crisis Resolved:
                  </span>
                  <span className="font-bold">{dataPoint?.scenariosCompleted} / {totalScenarios}</span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-white/15 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Progress Telemetry & Completion Velocity
                </h3>
                <span className="rounded bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-[10px] text-slate-200">
                  Recharts Engine
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Authoritative completion rates for courses, CTF labs, and crisis rooms over time.
              </p>
            </div>
          </div>
        </div>

        {/* View Controls & Time Range Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart View Modes */}
          <div className="flex items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-1 text-xs shadow-sm">
            <button
              onClick={() => setChartView('rate')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                chartView === 'rate'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Rate (%)
            </button>
            <button
              onClick={() => setChartView('count')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                chartView === 'count'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Units Count
            </button>
            <button
              onClick={() => setChartView('velocity')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                chartView === 'velocity'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Weekly Velocity
            </button>
          </div>

          {/* Time Range */}
          {chartView !== 'velocity' && (
            <div className="flex items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-1 text-xs shadow-sm">
              <button
                onClick={() => setTimeRange('7d')}
                className={`rounded-lg px-2 py-1 font-semibold transition-colors ${
                  timeRange === '7d'
                    ? 'bg-white/20 text-emerald-300'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setTimeRange('14d')}
                className={`rounded-lg px-2 py-1 font-semibold transition-colors ${
                  timeRange === '14d'
                    ? 'bg-white/20 text-emerald-300'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                14D
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Core Completion KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Completion */}
        <div className="rounded-xl border border-purple-400/30 bg-purple-500/10 backdrop-blur-sm p-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-purple-300 uppercase tracking-wider text-[10px]">
              Composite Completion
            </span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-slate-100">
              {overallCompletionRate}%
            </span>
            <span className="text-xs text-slate-300 font-mono">
              ({completedLessons + completedLabs + completedScenarios}/{totalLessons + totalLabs + totalScenarios} total)
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${overallCompletionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Courses & Lessons */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('courses')}
          className="group cursor-pointer rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 hover:border-emerald-400/40 hover:bg-white/15 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Curriculum Courses
            </span>
            <span className="font-mono font-bold text-emerald-400">{coursesRate}%</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-slate-100">
              {completedLessons} <span className="text-xs font-normal text-slate-300">/ {totalLessons} lessons</span>
            </span>
            <span className="text-[10px] font-mono text-slate-300">
              {completedCourses} / {totalCourses} tracks
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${coursesRate}%` }}
            ></div>
          </div>
        </div>

        {/* CTF Sandbox Labs */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('labs')}
          className="group cursor-pointer rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 hover:border-cyan-400/40 hover:bg-white/15 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Terminal className="h-3 w-3" />
              CTF Sandbox Labs
            </span>
            <span className="font-mono font-bold text-cyan-400">{labsRate}%</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-slate-100">
              {completedLabs} <span className="text-xs font-normal text-slate-300">/ {totalLabs} flags</span>
            </span>
            <span className="text-[10px] font-mono text-slate-300">
              {totalLabs - completedLabs} remaining
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${labsRate}%` }}
            ></div>
          </div>
        </div>

        {/* Incident Crisis Rooms */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('scenarios')}
          className="group cursor-pointer rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 hover:border-rose-400/40 hover:bg-white/15 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Crisis Simulations
            </span>
            <span className="font-mono font-bold text-rose-400">{scenariosRate}%</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-slate-100">
              {completedScenarios} <span className="text-xs font-normal text-slate-300">/ {totalScenarios} incidents</span>
            </span>
            <span className="text-[10px] font-mono text-slate-300">
              {totalScenarios - completedScenarios} triage rooms
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-rose-400 transition-all duration-500"
              style={{ width: `${scenariosRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Series Filter Toggles (for Time-Series Views) */}
      {chartView !== 'velocity' && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Filter Series:</span>
          <button
            onClick={() => toggleSeries('courses')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono transition-all ${
              visibleSeries.courses
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Courses ({coursesRate}%)</span>
          </button>

          <button
            onClick={() => toggleSeries('labs')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono transition-all ${
              visibleSeries.labs
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span>CTF Labs ({labsRate}%)</span>
          </button>

          <button
            onClick={() => toggleSeries('scenarios')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono transition-all ${
              visibleSeries.scenarios
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-400"></span>
            <span>Scenarios ({scenariosRate}%)</span>
          </button>

          <button
            onClick={() => toggleSeries('overall')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono transition-all ${
              visibleSeries.overall
                ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-purple-400"></span>
            <span>Overall ({overallCompletionRate}%)</span>
          </button>
        </div>
      )}

      {/* 4. The Main Recharts Visualization Canvas */}
      <div className="relative rounded-xl border border-slate-800/80 bg-slate-950/80 p-4">
        {chartView === 'rate' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCourses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradLabs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradScenarios" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={100} stroke="#334155" strokeDasharray="3 3" />

                {visibleSeries.courses && (
                  <Area
                    type="monotone"
                    dataKey="coursesRate"
                    name="Courses Rate"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradCourses)"
                  />
                )}
                {visibleSeries.labs && (
                  <Area
                    type="monotone"
                    dataKey="labsRate"
                    name="CTF Labs Rate"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradLabs)"
                  />
                )}
                {visibleSeries.scenarios && (
                  <Area
                    type="monotone"
                    dataKey="scenariosRate"
                    name="Scenarios Rate"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradScenarios)"
                  />
                )}
                {visibleSeries.overall && (
                  <Area
                    type="monotone"
                    dataKey="overallRate"
                    name="Overall Rate"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#gradOverall)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartView === 'count' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-300 font-mono">{value}</span>}
                />

                {visibleSeries.courses && (
                  <Line
                    type="stepAfter"
                    dataKey="lessonsCompleted"
                    name="Lessons Completed"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {visibleSeries.labs && (
                  <Line
                    type="stepAfter"
                    dataKey="labsCompleted"
                    name="CTF Labs Pwned"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ fill: '#06b6d4', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {visibleSeries.scenarios && (
                  <Line
                    type="stepAfter"
                    dataKey="scenariosCompleted"
                    name="Crisis Resolved"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ fill: '#f43f5e', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartView === 'velocity' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="week"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    `${value} completed`,
                    name === 'lessons'
                      ? 'Lessons'
                      : name === 'labs'
                      ? 'CTF Labs'
                      : 'Incident Scenarios'
                  ]}
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-slate-300 font-mono capitalize">{value}</span>
                  )}
                />
                <Bar dataKey="lessons" name="Lessons" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="labs" name="CTF Labs" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scenarios" name="Scenarios" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 5. Domain Completion Multi-Bar Breakdown */}
      <div className="border-t border-slate-800/80 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-semibold text-slate-200">
              Domain Competency Completion Matrix
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Cross-Disciplinary Coverage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {domainBreakdown.map((domain) => {
            const compositeDomainRate = Math.round(
              (domain.coursesRate * 0.5) + (domain.labsRate * 0.3) + (domain.scenariosRate * 0.2)
            );

            return (
              <div
                key={domain.domain}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 truncate" title={domain.domain}>
                    {domain.domain}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      compositeDomainRate > 50
                        ? 'text-emerald-400'
                        : compositeDomainRate > 20
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {compositeDomainRate}%
                  </span>
                </div>

                {/* Sub-bars for courses, labs, and scenarios */}
                <div className="space-y-1.5 text-[10px] font-mono">
                  {/* Courses */}
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span className="text-emerald-400">Lessons</span>
                      <span>{domain.coursesRate}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden mt-0.5">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${domain.coursesRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Labs */}
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span className="text-cyan-400">CTF Labs</span>
                      <span>{domain.labsRate}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden mt-0.5">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${domain.labsRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Scenarios */}
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span className="text-rose-400">Scenarios</span>
                      <span>{domain.scenariosRate}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden mt-0.5">
                      <div
                        className="h-full rounded-full bg-rose-400"
                        style={{ width: `${domain.scenariosRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                  <span>Units: {domain.completedUnits} / {domain.totalUnits}</span>
                  {compositeDomainRate >= 100 ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Mastered
                    </span>
                  ) : (
                    <span className="text-slate-400">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
