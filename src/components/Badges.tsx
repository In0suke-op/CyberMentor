import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  GraduationCap,
  Network,
  Library,
  Flag,
  Terminal,
  KeyRound,
  Trophy,
  AlertTriangle,
  ShieldAlert,
  Radio,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  ChevronRight,
  ExternalLink,
  X,
  Search,
  Filter,
  Target,
  TrendingUp,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Badge, UserBadgesSummary, BadgeRarity, User } from '../types';

export interface CertRankTier {
  id: string;
  tierNumber: number;
  code: string;
  name: string;
  title: string;
  issuer: string;
  badgeIcon: string;
  colorScheme: {
    badgeBg: string;
    border: string;
    text: string;
    glow: string;
    accentBar: string;
    badgePillBg: string;
  };
  reqXp: number;
  reqCourses: number;
  reqLabs: number;
  reqScenarios: number;
  description: string;
  skillsUnlocked: string[];
}

export const CERT_RANK_TIERS: CertRankTier[] = [
  {
    id: 'rank-tier-1',
    tierNumber: 1,
    code: 'Security+',
    name: 'CompTIA Security+ (SY0-701)',
    title: 'Security Fundamentals Cadet',
    issuer: 'CompTIA',
    badgeIcon: 'ShieldCheck',
    colorScheme: {
      badgeBg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      accentBar: 'bg-emerald-500',
      badgePillBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
    },
    reqXp: 500,
    reqCourses: 2,
    reqLabs: 2,
    reqScenarios: 1,
    description: 'First-line cybersecurity operator level. Validates packet inspection, TCP/IP fundamentals, and basic firewall rules.',
    skillsUnlocked: ['Packet Inspection (Wireshark)', 'Layer 2/3 Defense', 'Basic Firewall Configuration']
  },
  {
    id: 'rank-tier-2',
    tierNumber: 2,
    code: 'CySA+',
    name: 'CompTIA Cybersecurity Analyst (CS0-003)',
    title: 'SOC Analyst Practitioner',
    issuer: 'CompTIA',
    badgeIcon: 'Radio',
    colorScheme: {
      badgeBg: 'bg-cyan-500/15',
      border: 'border-cyan-500/30',
      text: 'text-cyan-300',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      accentBar: 'bg-cyan-400',
      badgePillBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
    },
    reqXp: 1500,
    reqCourses: 4,
    reqLabs: 4,
    reqScenarios: 2,
    description: 'Intermediate threat analytics credential. Proactively analyzes network telemetry, detects malicious anomalies, and triages vulnerabilities.',
    skillsUnlocked: ['Log Analysis & SIEM', 'Vulnerability Scanning', 'SOC Incident Triage']
  },
  {
    id: 'rank-tier-3',
    tierNumber: 3,
    code: 'CEH v12',
    name: 'Certified Ethical Hacker v12',
    title: 'Offensive Red Team Specialist',
    issuer: 'EC-Council',
    badgeIcon: 'Terminal',
    colorScheme: {
      badgeBg: 'bg-purple-500/15',
      border: 'border-purple-500/30',
      text: 'text-purple-300',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      accentBar: 'bg-purple-400',
      badgePillBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30'
    },
    reqXp: 3000,
    reqCourses: 6,
    reqLabs: 6,
    reqScenarios: 3,
    description: 'Advanced offensive operator level. Employs ethical penetration testing tactics, privilege escalation, web application exploitation, and evasive recon.',
    skillsUnlocked: ['Ethical Hacking & Recon', 'Web Exploitation (SQLi/XSS)', 'Privilege Escalation']
  },
  {
    id: 'rank-tier-4',
    tierNumber: 4,
    code: 'OSCP',
    name: 'Offensive Security Certified Professional',
    title: 'Advanced Hands-On PenTester',
    issuer: 'OffSec',
    badgeIcon: 'Trophy',
    colorScheme: {
      badgeBg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      accentBar: 'bg-amber-400',
      badgePillBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
    },
    reqXp: 5000,
    reqCourses: 8,
    reqLabs: 8,
    reqScenarios: 4,
    description: 'Gold-standard practical penetration testing certification. Master Active Directory lateral movement, Kerberoasting, and automated CTF exploitation.',
    skillsUnlocked: ['Active Directory Attacks', 'Buffer Overflow Exploitation', 'Multi-Host Pivoting']
  },
  {
    id: 'rank-tier-5',
    tierNumber: 5,
    code: 'CISSP',
    name: 'Certified Information Systems Security Professional',
    title: 'Chief Enterprise Security Architect',
    issuer: '(ISC)²',
    badgeIcon: 'GraduationCap',
    colorScheme: {
      badgeBg: 'bg-rose-500/15',
      border: 'border-rose-500/30',
      text: 'text-rose-300',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]',
      accentBar: 'bg-rose-400',
      badgePillBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30'
    },
    reqXp: 8000,
    reqCourses: 10,
    reqLabs: 10,
    reqScenarios: 5,
    description: 'Premier executive security leader tier. Architect Zero Trust frameworks, govern enterprise IAM policies, and lead major incident response debriefs.',
    skillsUnlocked: ['Zero Trust Architecture', 'Enterprise Risk Governance', 'Executive Incident Management']
  }
];

export interface RankProgressItem {
  tier: CertRankTier;
  xpPercent: number;
  coursePercent: number;
  labPercent: number;
  scenarioPercent: number;
  overallPercent: number;
  isUnlocked: boolean;
  xpRemaining: number;
  coursesRemaining: number;
  labsRemaining: number;
  scenariosRemaining: number;
}

export function calculateRankProgress(
  user: User | null | undefined,
  summary: UserBadgesSummary | null
) {
  const currentXp =
    user?.xp ??
    (summary
      ? summary.totalXpFromBadges +
        summary.lessonsCompletedCount * 50 +
        summary.labsCompletedCount * 100 +
        summary.scenariosCompletedCount * 150
      : 0);
  const lessonsCount = summary?.lessonsCompletedCount || 0;
  const currentCourses = Math.max(Math.floor(lessonsCount / 3), lessonsCount > 0 ? 1 : 0);
  const currentLabs = summary?.labsCompletedCount || 0;
  const currentScenarios = summary?.scenariosCompletedCount || 0;

  const tierProgresses: RankProgressItem[] = CERT_RANK_TIERS.map((tier) => {
    const xpPercent = Math.min(100, Math.round((currentXp / tier.reqXp) * 100));
    const coursePercent = Math.min(100, Math.round((currentCourses / tier.reqCourses) * 100));
    const labPercent = Math.min(100, Math.round((currentLabs / tier.reqLabs) * 100));
    const scenarioPercent = Math.min(100, Math.round((currentScenarios / tier.reqScenarios) * 100));

    const overallPercent = Math.min(
      100,
      Math.round((xpPercent + coursePercent + labPercent + scenarioPercent) / 4)
    );
    const isUnlocked =
      currentXp >= tier.reqXp &&
      currentCourses >= tier.reqCourses &&
      currentLabs >= tier.reqLabs &&
      currentScenarios >= tier.reqScenarios;

    const xpRemaining = Math.max(0, tier.reqXp - currentXp);
    const coursesRemaining = Math.max(0, tier.reqCourses - currentCourses);
    const labsRemaining = Math.max(0, tier.reqLabs - currentLabs);
    const scenariosRemaining = Math.max(0, tier.reqScenarios - currentScenarios);

    return {
      tier,
      xpPercent,
      coursePercent,
      labPercent,
      scenarioPercent,
      overallPercent,
      isUnlocked,
      xpRemaining,
      coursesRemaining,
      labsRemaining,
      scenariosRemaining
    };
  });

  const unlockedCount = tierProgresses.filter((t) => t.isUnlocked).length;
  const currentActiveTier = unlockedCount > 0 ? tierProgresses[unlockedCount - 1] : null;
  const nextTargetTier = tierProgresses.find((t) => !t.isUnlocked) || null;

  return {
    currentXp,
    currentCourses,
    currentLabs,
    currentScenarios,
    tierProgresses,
    unlockedCount,
    currentActiveTier,
    nextTargetTier
  };
}

interface BadgesProps {
  summary: UserBadgesSummary | null;
  user?: User | null;
  certificationsSummary?: { code: string; name: string; readinessScore: number }[] | null;
  onNavigateTab?: (tab: any, targetId?: string) => void;
  onOpenLesson?: (lessonId: string) => void;
  onOpenLab?: (labId: string) => void;
  onOpenScenario?: (scenarioId: string) => void;
  compact?: boolean;
  onViewAll?: () => void;
  className?: string;
}

// Icon mapping helper
const renderBadgeIcon = (iconName: string, className: string = 'h-5 w-5') => {
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'Library':
      return <Library className={className} />;
    case 'Flag':
      return <Flag className={className} />;
    case 'Terminal':
      return <Terminal className={className} />;
    case 'KeyRound':
      return <KeyRound className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    default:
      return <Award className={className} />;
  }
};

const getRarityConfig = (rarity: BadgeRarity) => {
  switch (rarity) {
    case 'common':
      return {
        label: 'Common',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
        badgeBg: 'bg-emerald-500/20',
        accentBar: 'bg-emerald-500'
      };
    case 'rare':
      return {
        label: 'Rare',
        border: 'border-cyan-500/30',
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-300',
        glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]',
        badgeBg: 'bg-cyan-500/20',
        accentBar: 'bg-cyan-400'
      };
    case 'epic':
      return {
        label: 'Epic',
        border: 'border-purple-500/30',
        bg: 'bg-purple-500/10',
        text: 'text-purple-300',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
        badgeBg: 'bg-purple-500/20',
        accentBar: 'bg-purple-400'
      };
    case 'legendary':
      return {
        label: 'Legendary',
        border: 'border-amber-500/40',
        bg: 'bg-amber-500/10',
        text: 'text-amber-300',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        badgeBg: 'bg-amber-500/20',
        accentBar: 'bg-amber-400'
      };
  }
};

export const Badges: React.FC<BadgesProps> = ({
  summary,
  user,
  certificationsSummary,
  onNavigateTab,
  onOpenLesson,
  onOpenLab,
  onOpenScenario,
  compact = false,
  onViewAll,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'ranks' | 'lessons' | 'labs' | 'scenarios' | 'mastery'
  >('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedRankModal, setSelectedRankModal] = useState<RankProgressItem | null>(null);

  if (!summary) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <span>Loading operator achievements...</span>
        </div>
      </div>
    );
  }

  const {
    totalBadges,
    unlockedCount,
    totalXpFromBadges,
    completionPercentage,
    lessonsCompletedCount,
    labsCompletedCount,
    scenariosCompletedCount,
    badges
  } = summary;

  // Compute Rank Progression
  const rankData = calculateRankProgress(user, summary);

  // Filtered badges list
  const filteredBadges = badges.filter((badge) => {
    if (activeCategory !== 'all' && activeCategory !== 'ranks' && badge.category !== activeCategory) {
      return false;
    }
    if (statusFilter === 'unlocked' && !badge.unlocked) {
      return false;
    }
    if (statusFilter === 'locked' && badge.unlocked) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        badge.title.toLowerCase().includes(q) ||
        badge.description.toLowerCase().includes(q) ||
        badge.criteriaLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleActionClick = (badge: Badge) => {
    if (!badge.actionHint) return;
    const { type, targetId } = badge.actionHint;

    if (type === 'course' && onNavigateTab) {
      onNavigateTab('courses', targetId);
    } else if (type === 'lesson' && targetId && onOpenLesson) {
      onOpenLesson(targetId);
    } else if (type === 'lab' && targetId && onOpenLab) {
      onOpenLab(targetId);
    } else if (type === 'scenario' && targetId && onOpenScenario) {
      onOpenScenario(targetId);
    }
    setSelectedBadge(null);
  };

  // Compact mode for quick preview
  if (compact) {
    const previewBadges = badges.slice(0, 6);
    const nextRank = rankData.nextTargetTier;

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Award className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Operator Achievements & Badges</h3>
              <p className="text-[11px] text-slate-400">
                {unlockedCount} of {totalBadges} unlocked ({completionPercentage}%) • +{totalXpFromBadges} XP earned
              </p>
            </div>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-slate-800 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Compact Certification Rank Progress Widget */}
        {nextRank && (
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm p-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="font-semibold text-slate-200">Next Certification Rank:</span>
                <span className="font-mono font-bold text-purple-300">
                  Tier {nextRank.tier.tierNumber}: {nextRank.tier.code} ({nextRank.tier.title})
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-purple-400">
                {nextRank.overallPercent}%
              </span>
            </div>

            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden border border-purple-500/20">
              <div
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${nextRank.overallPercent}%` }}
              ></div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-300">
              <span className="text-slate-400">Gap Needed:</span>
              {nextRank.xpRemaining > 0 && (
                <span className="rounded bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 text-amber-300 font-semibold">
                  +{nextRank.xpRemaining} Points/XP
                </span>
              )}
              {nextRank.coursesRemaining > 0 && (
                <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 text-emerald-300 font-semibold">
                  {nextRank.coursesRemaining} Course Completion{nextRank.coursesRemaining > 1 ? 's' : ''}
                </span>
              )}
              {nextRank.labsRemaining > 0 && (
                <span className="rounded bg-cyan-500/20 border border-cyan-500/30 px-1.5 py-0.5 text-cyan-300 font-semibold">
                  {nextRank.labsRemaining} Lab Pwn{nextRank.labsRemaining > 1 ? 's' : ''}
                </span>
              )}
              {nextRank.scenariosRemaining > 0 && (
                <span className="rounded bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.5 text-rose-300 font-semibold">
                  {nextRank.scenariosRemaining} Scenario Triage{nextRank.scenariosRemaining > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {previewBadges.map((badge) => {
            const rarityStyle = getRarityConfig(badge.rarity);
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`group relative flex flex-col items-center rounded-xl p-3 text-center transition-all border backdrop-blur-md ${
                  badge.unlocked
                    ? `${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.glow} hover:scale-[1.02]`
                    : 'bg-white/10 border-white/20 opacity-60 hover:opacity-90'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border mb-2 transition-transform group-hover:scale-110 ${
                    badge.unlocked
                      ? `${rarityStyle.badgeBg} ${rarityStyle.border} ${rarityStyle.text}`
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {badge.unlocked ? (
                    renderBadgeIcon(badge.icon, 'h-5 w-5')
                  ) : (
                    <Lock className="h-4 w-4 text-slate-500" />
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {badge.title}
                </div>

                <div className="mt-1 flex items-center gap-1">
                  <span className={`text-[10px] font-mono uppercase font-semibold ${rarityStyle.text}`}>
                    {badge.rarity}
                  </span>
                </div>

                {/* Progress bar for locked badges */}
                {!badge.unlocked && (
                  <div className="mt-2 w-full">
                    <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-slate-600 rounded-full"
                        style={{ width: `${badge.progress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-0.5 text-[9px] font-mono text-slate-500">
                      {badge.progress.current}/{badge.progress.target}
                    </div>
                  </div>
                )}

                {badge.unlocked && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>+{badge.xpReward} XP</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Badge Inspector Modal */}
        {selectedBadge && renderBadgeDetailModal(selectedBadge, () => setSelectedBadge(null), handleActionClick)}
      </div>
    );
  }

  // Full interactive mode
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header & Summary Stats */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Award className="h-5 w-5" />
              </span>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                AUTHORITATIVE ACHIEVEMENTS & CERTIFICATION RANKS
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">
              Operator Badges & Certification Rank Tiers
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Track achievements unlocked through completed curriculum lessons, hands-on CTF lab pwns, and enterprise incident scenarios — plus live progress toward your next certification rank tier.
            </p>
          </div>

          {/* Progress Overview Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-slate-300 uppercase">Badges Unlocked</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-mono font-bold text-emerald-400">{unlockedCount}</span>
                <span className="text-xs text-slate-300">/ {totalBadges} Badges</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-white/15"></div>

            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-slate-300 uppercase">Cert Tier Rank</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <Trophy className="h-4 w-4 text-purple-400" />
                <span className="text-2xl font-mono font-bold text-purple-300">
                  {rankData.currentActiveTier ? `Tier ${rankData.currentActiveTier.tier.tierNumber}` : 'Cadet'}
                </span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-white/15"></div>

            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-slate-300 uppercase">Total XP Earned</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-mono font-bold text-amber-300">
                  {rankData.currentXp}
                </span>
                <span className="text-xs text-slate-300">XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Category Progress Metrics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/15 pt-6">
          <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Curriculum Lessons</div>
                <div className="text-[10px] font-mono text-slate-400">Theory & Packet Inspections</div>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {lessonsCompletedCount} Done
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Flag className="h-4 w-4 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">CTF Sandbox Flags</div>
                <div className="text-[10px] font-mono text-slate-400">Penetration & Exploitation</div>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-cyan-300">
              {labsCompletedCount} Pwned
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Crisis Simulations</div>
                <div className="text-[10px] font-mono text-slate-400">Live SOC Incident Triage</div>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-rose-400">
              {scenariosCompletedCount} Resolved
            </span>
          </div>
        </div>
      </div>

      {/* 2. UPCOMING CERTIFICATION RANK PROGRESSION HERO BANNER */}
      {rankData.nextTargetTier && (
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/50 via-slate-900/60 to-slate-950/80 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  <Target className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wide">
                  Upcoming Certification Rank Target
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <h3 className="text-xl font-bold text-slate-100">
                  Tier {rankData.nextTargetTier.tier.tierNumber}: {rankData.nextTargetTier.tier.code} ({rankData.nextTargetTier.tier.name})
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {rankData.nextTargetTier.tier.description}
              </p>
            </div>

            {/* Overall Gauge & Exact Gaps */}
            <div className="flex flex-col space-y-3 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-300">Rank Progress</span>
                <span className="text-lg font-mono font-bold text-purple-300">
                  {rankData.nextTargetTier.overallPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden border border-purple-500/30">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${rankData.nextTargetTier.overallPercent}%` }}
                ></div>
              </div>

              {/* Exact Gaps Pill Breakdown */}
              <div className="pt-1">
                <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Requirements Gap Breakdown:</span>
                  <span className="text-slate-300 font-semibold">Current / Target</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" /> Points:
                    </span>
                    <span className={rankData.nextTargetTier.xpRemaining > 0 ? 'text-amber-300 font-bold' : 'text-emerald-400 font-bold'}>
                      {rankData.currentXp} / {rankData.nextTargetTier.tier.reqXp}
                      {rankData.nextTargetTier.xpRemaining > 0 ? ` (+${rankData.nextTargetTier.xpRemaining})` : ' ✓'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-emerald-400" /> Courses:
                    </span>
                    <span className={rankData.nextTargetTier.coursesRemaining > 0 ? 'text-cyan-300 font-bold' : 'text-emerald-400 font-bold'}>
                      {rankData.currentCourses} / {rankData.nextTargetTier.tier.reqCourses}
                      {rankData.nextTargetTier.coursesRemaining > 0 ? ` (${rankData.nextTargetTier.coursesRemaining} left)` : ' ✓'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Flag className="h-3 w-3 text-cyan-400" /> CTF Labs:
                    </span>
                    <span className={rankData.nextTargetTier.labsRemaining > 0 ? 'text-cyan-300 font-bold' : 'text-emerald-400 font-bold'}>
                      {rankData.currentLabs} / {rankData.nextTargetTier.tier.reqLabs}
                      {rankData.nextTargetTier.labsRemaining > 0 ? ` (${rankData.nextTargetTier.labsRemaining} left)` : ' ✓'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-rose-400" /> Scenarios:
                    </span>
                    <span className={rankData.nextTargetTier.scenariosRemaining > 0 ? 'text-rose-300 font-bold' : 'text-emerald-400 font-bold'}>
                      {rankData.currentScenarios} / {rankData.nextTargetTier.tier.reqScenarios}
                      {rankData.nextTargetTier.scenariosRemaining > 0 ? ` (${rankData.nextTargetTier.scenariosRemaining} left)` : ' ✓'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-1 shadow-sm">
          {[
            { id: 'all', label: 'All Badges', count: badges.length },
            { id: 'ranks', label: 'Cert Ranks', count: CERT_RANK_TIERS.length },
            { id: 'lessons', label: 'Lessons', count: badges.filter((b) => b.category === 'lessons').length },
            { id: 'labs', label: 'CTF Labs', count: badges.filter((b) => b.category === 'labs').length },
            { id: 'scenarios', label: 'Scenarios', count: badges.filter((b) => b.category === 'scenarios').length },
            { id: 'mastery', label: 'Mastery', count: badges.filter((b) => b.category === 'mastery').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Status Filter & Search Input */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/60 p-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'unlocked' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'locked' ? 'bg-slate-800 text-slate-300' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Locked ({totalBadges - unlockedCount})
            </button>
          </div>

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search badges or rank tiers..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. CERTIFICATION RANK PROGRESSION ROADMAP (Visible on 'ranks' or 'all') */}
      {(activeCategory === 'ranks' || activeCategory === 'all') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">
                Certification Rank Progression Tiers
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              5 Authoritative Career Ranks • {rankData.unlockedCount} of 5 Attained
            </span>
          </div>

          {/* Rank Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankData.tierProgresses.map((item) => {
              const {
                tier,
                overallPercent,
                isUnlocked,
                xpRemaining,
                coursesRemaining,
                labsRemaining,
                scenariosRemaining
              } = item;
              const isNextTarget = rankData.nextTargetTier?.tier.id === tier.id;

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedRankModal(item)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer backdrop-blur-md transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${
                    isUnlocked
                      ? `${tier.colorScheme.badgeBg} ${tier.colorScheme.border} ${tier.colorScheme.glow} hover:border-white/40`
                      : isNextTarget
                      ? 'bg-purple-950/40 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:border-purple-400'
                      : 'bg-white/10 border-white/20 opacity-80 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <div>
                    {/* Header: Tier Pill + Code + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                            isUnlocked
                              ? `${tier.colorScheme.badgePillBg} ${tier.colorScheme.border} ${tier.colorScheme.text}`
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {renderBadgeIcon(tier.badgeIcon, 'h-5 w-5')}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                            TIER {tier.tierNumber} • {tier.issuer}
                          </span>
                          <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                            {tier.code}
                          </h4>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div>
                        {isUnlocked ? (
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            UNLOCKED
                          </span>
                        ) : isNextTarget ? (
                          <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-purple-300 animate-pulse flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            NEXT TARGET
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-900 border border-slate-800 px-2.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            LOCKED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rank Title & Description */}
                    <div className="mt-3">
                      <div className="text-xs font-bold text-emerald-400">{tier.title}</div>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {tier.description}
                      </p>
                    </div>

                    {/* Overall Progress Gauge */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Tier Completion</span>
                        <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-200 font-bold'}>
                          {overallPercent}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUnlocked ? tier.colorScheme.accentBar : 'bg-purple-500'
                          }`}
                          style={{ width: `${overallPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Requirement Metrics Matrix */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                        <div className="text-[10px] text-slate-400">Points / XP</div>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {rankData.currentXp} / {tier.reqXp}
                        </div>
                        {xpRemaining > 0 && (
                          <div className="text-[9px] text-amber-400 mt-0.5 font-semibold">
                            +{xpRemaining} XP needed
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                        <div className="text-[10px] text-slate-400">Courses</div>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {rankData.currentCourses} / {tier.reqCourses}
                        </div>
                        {coursesRemaining > 0 && (
                          <div className="text-[9px] text-cyan-300 mt-0.5 font-semibold">
                            {coursesRemaining} course{coursesRemaining > 1 ? 's' : ''} needed
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                        <div className="text-[10px] text-slate-400">CTF Labs</div>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {rankData.currentLabs} / {tier.reqLabs}
                        </div>
                        {labsRemaining > 0 && (
                          <div className="text-[9px] text-cyan-300 mt-0.5 font-semibold">
                            {labsRemaining} lab{labsRemaining > 1 ? 's' : ''} needed
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                        <div className="text-[10px] text-slate-400">Scenarios</div>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {rankData.currentScenarios} / {tier.reqScenarios}
                        </div>
                        {scenariosRemaining > 0 && (
                          <div className="text-[9px] text-rose-300 mt-0.5 font-semibold">
                            {scenariosRemaining} scenario{scenariosRemaining > 1 ? 's' : ''} needed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      {isUnlocked
                        ? 'All Requirements Met'
                        : `${xpRemaining > 0 ? `+${xpRemaining} XP` : ''} ${coursesRemaining > 0 ? `• ${coursesRemaining} Course` : ''}`}
                    </span>

                    <div className="flex items-center gap-2">
                      {onNavigateTab && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab('courses');
                          }}
                          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5"
                        >
                          <span>Courses</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                      {onNavigateTab && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab('labs');
                          }}
                          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                        >
                          <span>Labs</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Standard Badges Grid (Visible when activeCategory !== 'ranks') */}
      {activeCategory !== 'ranks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">
                Specific Achievement Badges
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {filteredBadges.length} Badge{filteredBadges.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredBadges.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-12 text-center">
              <Award className="h-10 w-10 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-300">No badges match your criteria</h4>
              <p className="mt-1 text-xs text-slate-500">
                Try adjusting your category tabs, status filters, or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map((badge) => {
                const rarity = getRarityConfig(badge.rarity);
                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer backdrop-blur-md transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${
                      badge.unlocked
                        ? `${rarity.bg} ${rarity.border} ${rarity.glow} hover:border-white/40`
                        : 'bg-white/10 border-white/20 opacity-75 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    {/* Top Row: Icon + Rarity & XP */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${
                            badge.unlocked
                              ? `${rarity.badgeBg} ${rarity.border} ${rarity.text}`
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {badge.unlocked ? (
                            renderBadgeIcon(badge.icon, 'h-6 w-6')
                          ) : (
                            <Lock className="h-5 w-5 text-slate-500" />
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-bold border ${rarity.border} ${rarity.badgeBg} ${rarity.text}`}
                            >
                              {badge.rarity}
                            </span>
                            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                              <Zap className="h-3 w-3 fill-amber-400" />+{badge.xpReward} XP
                            </span>
                          </div>
                          {badge.unlocked && badge.unlockedAt && (
                            <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              Unlocked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="mt-4">
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {badge.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Criteria & Progress */}
                    <div className="mt-5 border-t border-slate-800/80 pt-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Requirement:</span>
                        <span className="font-mono text-slate-300">{badge.criteriaLabel}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Status</span>
                          <span className={badge.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                            {badge.unlocked ? 'Complete (100%)' : `${badge.progress.current} / ${badge.progress.target} (${badge.progress.percentage}%)`}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              badge.unlocked ? rarity.accentBar : 'bg-slate-600'
                            }`}
                            style={{ width: `${badge.progress.percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Hint Action Button */}
                      {badge.actionHint && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(badge);
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <span>{badge.actionHint.label}</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Badge Inspector Modal */}
      {selectedBadge && renderBadgeDetailModal(selectedBadge, () => setSelectedBadge(null), handleActionClick)}

      {/* Selected Rank Tier Detail Modal */}
      {selectedRankModal && (
        <RankTierDetailModal
          rankItem={selectedRankModal}
          currentXp={rankData.currentXp}
          currentCourses={rankData.currentCourses}
          currentLabs={rankData.currentLabs}
          currentScenarios={rankData.currentScenarios}
          onClose={() => setSelectedRankModal(null)}
          onNavigateTab={onNavigateTab}
        />
      )}
    </div>
  );
};

// Sub-component: Badge Detail Inspection Modal
function renderBadgeDetailModal(
  badge: Badge,
  onClose: () => void,
  onActionClick: (badge: Badge) => void
) {
  const rarity = getRarityConfig(badge.rarity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl border mb-4 ${
              badge.unlocked
                ? `${rarity.badgeBg} ${rarity.border} ${rarity.text} ${rarity.glow}`
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {badge.unlocked ? renderBadgeIcon(badge.icon, 'h-10 w-10') : <Lock className="h-8 w-8 text-slate-500" />}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-bold border ${rarity.border} ${rarity.badgeBg} ${rarity.text}`}
            >
              {badge.rarity}
            </span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
              <Zap className="h-3 w-3 fill-amber-400" />+{badge.xpReward} XP
            </span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400 capitalize">
              {badge.category}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-bold text-slate-100">{badge.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{badge.description}</p>
        </div>

        {/* Details Checklist */}
        <div className="mt-6 space-y-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Unlock Requirement:</span>
            <span className="font-mono font-semibold text-slate-200 text-right">{badge.criteriaLabel}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Authoritative Status:</span>
            <span
              className={`font-mono font-bold flex items-center gap-1 ${
                badge.unlocked ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {badge.unlocked ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Unlocked
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Locked ({badge.progress.current}/{badge.progress.target})
                </>
              )}
            </span>
          </div>

          {/* Progress bar */}
          <div className="pt-1">
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${badge.unlocked ? rarity.accentBar : 'bg-slate-600'}`}
                style={{ width: `${badge.progress.percentage}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-mono text-slate-500">
              <span>Progress: {badge.progress.percentage}%</span>
              <span>
                {badge.progress.current} / {badge.progress.target}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex gap-3">
          {badge.actionHint ? (
            <button
              onClick={() => onActionClick(badge)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <span>{badge.actionHint.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component: Certification Rank Tier Inspection Modal
interface RankTierDetailModalProps {
  rankItem: RankProgressItem;
  currentXp: number;
  currentCourses: number;
  currentLabs: number;
  currentScenarios: number;
  onClose: () => void;
  onNavigateTab?: (tab: any, targetId?: string) => void;
}

function RankTierDetailModal({
  rankItem,
  currentXp,
  currentCourses,
  currentLabs,
  currentScenarios,
  onClose,
  onNavigateTab
}: RankTierDetailModalProps) {
  const {
    tier,
    overallPercent,
    isUnlocked,
    xpRemaining,
    coursesRemaining,
    labsRemaining,
    scenariosRemaining
  } = rankItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
              isUnlocked
                ? `${tier.colorScheme.badgePillBg} ${tier.colorScheme.border} ${tier.colorScheme.text}`
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {renderBadgeIcon(tier.badgeIcon, 'h-8 w-8')}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                TIER {tier.tierNumber} • {tier.issuer}
              </span>
              {isUnlocked ? (
                <span className="rounded bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                  UNLOCKED
                </span>
              ) : (
                <span className="rounded bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300">
                  LOCKED
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-100">{tier.code} ({tier.name})</h3>
            <div className="text-xs font-semibold text-emerald-400">{tier.title}</div>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5">
          {tier.description}
        </p>

        {/* Unlocked Operator Capabilities */}
        <div>
          <div className="text-xs font-mono text-slate-400 mb-2">Capabilities Unlocked at Rank Tier:</div>
          <div className="flex flex-wrap gap-1.5">
            {tier.skillsUnlocked.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-mono text-emerald-300"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Tier Completion Gauge</span>
            <span className="font-mono font-bold text-purple-300">{overallPercent}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                isUnlocked ? tier.colorScheme.accentBar : 'bg-purple-500'
              }`}
              style={{ width: `${overallPercent}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Points / XP Needed</div>
              <div className="text-slate-200 font-bold mt-0.5">
                {currentXp} / {tier.reqXp}
              </div>
              <div className={xpRemaining > 0 ? 'text-amber-400 text-[10px]' : 'text-emerald-400 text-[10px]'}>
                {xpRemaining > 0 ? `Need +${xpRemaining} XP` : 'Requirement Met ✓'}
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Course Completions</div>
              <div className="text-slate-200 font-bold mt-0.5">
                {currentCourses} / {tier.reqCourses}
              </div>
              <div className={coursesRemaining > 0 ? 'text-cyan-300 text-[10px]' : 'text-emerald-400 text-[10px]'}>
                {coursesRemaining > 0 ? `Need ${coursesRemaining} Course${coursesRemaining > 1 ? 's' : ''}` : 'Requirement Met ✓'}
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">CTF Lab Pwns</div>
              <div className="text-slate-200 font-bold mt-0.5">
                {currentLabs} / {tier.reqLabs}
              </div>
              <div className={labsRemaining > 0 ? 'text-cyan-300 text-[10px]' : 'text-emerald-400 text-[10px]'}>
                {labsRemaining > 0 ? `Need ${labsRemaining} Lab${labsRemaining > 1 ? 's' : ''}` : 'Requirement Met ✓'}
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Scenario Triumphs</div>
              <div className="text-slate-200 font-bold mt-0.5">
                {currentScenarios} / {tier.reqScenarios}
              </div>
              <div className={scenariosRemaining > 0 ? 'text-rose-300 text-[10px]' : 'text-emerald-400 text-[10px]'}>
                {scenariosRemaining > 0 ? `Need ${scenariosRemaining} Scenario${scenariosRemaining > 1 ? 's' : ''}` : 'Requirement Met ✓'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2 pt-2">
          {onNavigateTab && (
            <button
              onClick={() => {
                onClose();
                onNavigateTab('courses');
              }}
              className="flex-1 rounded-xl border border-emerald-500/40 bg-emerald-500/20 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all"
            >
              Start Courses
            </button>
          )}

          {onNavigateTab && (
            <button
              onClick={() => {
                onClose();
                onNavigateTab('labs');
              }}
              className="flex-1 rounded-xl border border-cyan-500/40 bg-cyan-500/20 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
            >
              Launch CTF Labs
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
