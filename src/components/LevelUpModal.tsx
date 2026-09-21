import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerLevelUpConfetti } from '../utils/confetti';
import {
  Shield,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Lock,
  Flame,
  X,
  Target
} from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  oldLevel?: number;
  milestoneTitle?: string;
  xpBonusAwarded?: number;
}

const getRankTitle = (level: number): { title: string; tier: string; color: string } => {
  if (level <= 1) return { title: 'Operator Cadet', tier: 'Tier 1 Ingress', color: 'from-slate-400 to-slate-200' };
  if (level === 2) return { title: 'Junior Security Analyst', tier: 'Tier 2 Tier-One Defender', color: 'from-emerald-400 to-teal-300' };
  if (level === 3) return { title: 'SOC Cyber Sentinel', tier: 'Tier 3 Active Hunter', color: 'from-cyan-400 to-blue-300' };
  if (level === 4) return { title: 'Incident Response Specialist', tier: 'Tier 4 Crisis Commander', color: 'from-purple-400 to-indigo-300' };
  return { title: 'Elite Cyber Commander', tier: 'Tier 5 Master Principal', color: 'from-amber-400 to-yellow-200' };
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  oldLevel = newLevel - 1,
  milestoneTitle,
  xpBonusAwarded = 250
}) => {
  useEffect(() => {
    if (isOpen) {
      triggerLevelUpConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rank = getRankTitle(newLevel);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        {/* Animated modal box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-slate-950 p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(16,185,129,0.35)]"
        >
          {/* Holographic background rays */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Glowing Badge Emblem */}
          <div className="relative mx-auto mt-2 flex h-24 w-24 items-center justify-center">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-emerald-400/40" style={{ animationDuration: '12s' }} />
            {/* Pulse aura */}
            <div className="absolute inset-1 animate-ping rounded-full bg-emerald-500/10" style={{ animationDuration: '3s' }} />
            
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <ShieldCheck className="h-10 w-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="absolute -bottom-2 rounded-full bg-emerald-500 px-2 py-0.5 font-mono text-[10px] font-extrabold text-slate-950 shadow-md">
                LVL {newLevel}
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mt-5 space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              AUTHORITATIVE LEVEL PROMOTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 mt-2">
              Level {newLevel}: <span className={`bg-gradient-to-r ${rank.color} bg-clip-text text-transparent`}>{rank.title}</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Promoted from Level {oldLevel} • Security Operations Center Clearance Elevated
            </p>
          </div>

          {/* Milestone Origin Card if specified */}
          {milestoneTitle && (
            <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-left">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-purple-300 font-semibold">
                <Target className="h-3.5 w-3.5 text-purple-400" />
                Triggering Major Milestone Cleared
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-100">
                {milestoneTitle}
              </p>
            </div>
          )}

          {/* Unlocked Capabilities Grid */}
          <div className="mt-5 space-y-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-left text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-emerald-400" />
              Promotion Benefits & Perks
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-[11px]">Advanced CTF Sandbox Clearance</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 text-[11px]">Enterprise Incident Rooms</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 text-[11px]">+{xpBonusAwarded} Milestone Bonus XP</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                <span className="text-slate-300 text-[11px]">DoD 8570 Exam Prep Blueprints</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-sm font-extrabold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>Accept Rank & Resume Duty</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
