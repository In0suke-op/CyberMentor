import React from 'react';
import { Shield, Flame, Search, User as UserIcon, LogOut, Terminal, Award, Sun, Moon } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  user: User | null;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDiagnostic: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenSearch,
  onOpenAuth,
  onLogout,
  onOpenDiagnostic,
  onOpenProfile
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-wider text-slate-100">
                CYBER<span className="text-emerald-400">MENTOR</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-white/20 bg-emerald-500/15 backdrop-blur-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SOC LIVE
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">Server-Authoritative Cyber Defense & AI Mentor</p>
          </div>
        </div>

        {/* Global Search Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-xs text-slate-300 hover:border-white/30 hover:bg-white/15 transition-all shadow-sm"
          >
            <Search className="h-3.5 w-3.5 text-slate-300" />
            <span className="hidden md:inline">Search courses, labs, certs...</span>
            <kbd className="hidden md:inline rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-white/20">
              ⌘K
            </kbd>
          </button>

          {/* Diagnostic Assessment Button */}
          <button
            onClick={onOpenDiagnostic}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/20 bg-cyan-500/10 backdrop-blur-md px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all shadow-sm"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Skill Diagnostic</span>
          </button>

          {/* Global Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={theme === 'dark' ? 'Switch to Focus Light Theme' : 'Switch to High-Contrast Cyber Dark Theme'}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/20 hover:border-white/30 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="font-mono text-[11px] font-semibold text-amber-300">Focus Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-purple-400" />
                <span className="font-mono text-[11px] font-semibold text-purple-300">Cyber Dark</span>
              </>
            )}
          </button>

          {/* User Telemetry or Login */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Daily Streak & Freeze Shields */}
              <div className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-amber-500/10 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-amber-400 shadow-sm">
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-bounce" />
                <span>{user.dailyStreak}d</span>
                {user.freezeShields > 0 && (
                  <span className="text-[10px] text-amber-300/80" title={`${user.freezeShields} streak freeze shields available`}>
                    🛡️{user.freezeShields}
                  </span>
                )}
              </div>

              {/* XP & Level Badge */}
              <button
                onClick={onOpenProfile}
                title="View Operator Profile & Achievements"
                className="hidden md:flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-xs hover:border-white/30 hover:bg-white/15 transition-all cursor-pointer shadow-sm"
              >
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono font-bold text-emerald-400 border border-emerald-400/30">
                  LVL {user.level}
                </span>
                <span className="font-mono text-slate-200">{user.xp} XP</span>
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                <button
                  onClick={onOpenProfile}
                  title="View Operator Profile & Badges"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-emerald-400 font-mono text-xs font-bold border border-white/25 hover:border-emerald-400/60 hover:scale-105 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/15 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Cadet Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
