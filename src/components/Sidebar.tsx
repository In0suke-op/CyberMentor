import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Terminal,
  AlertTriangle,
  Award,
  Bot,
  FileText,
  Lock,
  Cpu,
  Trophy,
  Compass,
  Youtube,
  Github
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'roadmap'
  | 'courses'
  | 'videos'
  | 'labs'
  | 'scenarios'
  | 'certifications'
  | 'badges'
  | 'ai-mentor'
  | 'notes'
  | 'privacy'
  | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'SOC Dashboard', icon: LayoutDashboard, badge: 'Overview' },
    { id: 'roadmap' as NavTab, label: 'Study Roadmap', icon: Compass, badge: '3-Tier' },
    { id: 'videos' as NavTab, label: 'YouTube Video Hub', icon: Youtube, badge: '100+ Vids' },
    { id: 'about' as NavTab, label: 'GitHub & Project Genesis', icon: Github, badge: 'Mission' },
    { id: 'labs' as NavTab, label: 'CTF Sandbox Labs', icon: Terminal, badge: 'Hands-on' },
    { id: 'scenarios' as NavTab, label: 'Incident Crisis Rooms', icon: AlertTriangle, badge: 'Live SIM' },
    { id: 'badges' as NavTab, label: 'Operator Badges', icon: Trophy, badge: 'Honors' },
    { id: 'certifications' as NavTab, label: 'Certification Hub', icon: Award, badge: '5 Certs' },
    { id: 'notes' as NavTab, label: 'Notes & RAG Vault', icon: FileText, badge: 'Personal' },
    { id: 'privacy' as NavTab, label: 'GDPR & Security', icon: Lock, badge: 'Privacy' },
    { id: 'ai-mentor' as NavTab, label: 'Socratic AI Mentor', icon: Bot, badge: 'Neural' }
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]">
      {/* Platform Navigation */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          Command Center
        </div>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.025, ease: 'easeOut' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTab(item.id)}
              className={`relative group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-emerald-300 border border-white/30 shadow-[0_0_16px_rgba(16,185,129,0.2)] font-semibold backdrop-blur-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/15 backdrop-blur-sm'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-400/30 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono border ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-white/10 text-slate-300 border-white/10 group-hover:bg-white/15 group-hover:text-white'
                }`}
              >
                {item.badge}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Defensive Specs Notice */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="mt-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3.5 shadow-sm"
      >
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-200">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span>Defensible Architecture</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
          Server-authoritative engine enforcing constant-time flag hashes, PBKDF2 cryptography, and multi-tenant RAG isolation.
        </p>
      </motion.div>
    </aside>
  );
};
