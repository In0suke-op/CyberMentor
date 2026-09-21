import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Award, CheckCircle2, X, ArrowUpRight, Sparkles } from 'lucide-react';

export interface XpToastNotification {
  id: string;
  title: string;
  subtitle: string;
  xpAwarded: number;
  isLevelUp?: boolean;
  newLevel?: number;
  type?: 'milestone' | 'certification' | 'lab' | 'scenario';
}

interface XpToastProps {
  toasts: XpToastNotification[];
  onDismiss: (id: string) => void;
  onViewLevelUp?: (level: number) => void;
}

export const XpToast: React.FC<XpToastProps> = ({ toasts, onDismiss, onViewLevelUp }) => {
  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <XpToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => onDismiss(toast.id)}
            onViewLevelUp={onViewLevelUp}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const XpToastItem: React.FC<{
  toast: XpToastNotification;
  onDismiss: () => void;
  onViewLevelUp?: (level: number) => void;
}> = ({ toast, onDismiss, onViewLevelUp }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 40 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="pointer-events-auto relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-950/95 p-4 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)] backdrop-blur-xl"
    >
      {/* Top accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Animated Icon */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Zap className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-cyan-300" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-300 shadow-sm">
                <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                +{toast.xpAwarded} XP
              </span>

              {toast.isLevelUp && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 font-mono text-[11px] font-bold text-purple-300 animate-pulse">
                  <ArrowUpRight className="h-3 w-3" />
                  LEVEL UP!
                </span>
              )}

              {toast.type === 'certification' && (
                <span className="rounded bg-purple-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase font-semibold text-purple-300">
                  Certification
                </span>
              )}
            </div>

            <h4 className="mt-1.5 text-sm font-bold text-slate-100 leading-snug">
              {toast.title}
            </h4>
            <p className="mt-0.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
              {toast.subtitle}
            </p>

            {toast.isLevelUp && toast.newLevel && onViewLevelUp && (
              <button
                onClick={() => onViewLevelUp(toast.newLevel!)}
                className="mt-2 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
              >
                <span>View Level {toast.newLevel} Rank Dossier</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="mt-3 h-1 w-full rounded-full bg-slate-800/80 overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
        />
      </div>
    </motion.div>
  );
};
