import React, { useState } from 'react';
import { Terminal, Shield, Zap, CheckCircle2, ChevronRight, AlertCircle, ExternalLink, Server, Globe } from 'lucide-react';
import { Lab } from '../types';

interface LabsViewProps {
  labs: Lab[];
  onOpenLab: (labId: string) => void;
}

export const LabsView: React.FC<LabsViewProps> = ({ labs, onOpenLab }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredLabs = selectedDifficulty === 'All'
    ? labs
    : labs.filter((l) => l.difficulty === selectedDifficulty);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">CTF Security Sandbox Labs</h2>
          <p className="text-xs text-slate-400">
            Isolated attack targets. Test web injection, IDOR exfiltration, XSS filter evasion, and Linux SUID privilege escalation.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-1 shadow-sm">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLabs.map((lab) => {
          const difficultyColors = {
            Easy: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/30',
            Medium: 'text-amber-300 bg-amber-500/15 border-amber-400/30',
            Hard: 'text-rose-300 bg-rose-500/15 border-rose-400/30',
            Insane: 'text-purple-300 bg-purple-500/15 border-purple-400/30'
          };

          return (
            <div
              key={lab.id}
              className={`group flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${
                lab.completed
                  ? 'border-emerald-400/40 bg-emerald-500/10 hover:border-emerald-400/60 hover:bg-emerald-500/15'
                  : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Terminal className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-mono uppercase text-slate-300">
                      {lab.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold border ${
                        difficultyColors[lab.difficulty] || 'text-slate-400'
                      }`}
                    >
                      {lab.difficulty}
                    </span>
                    {lab.completed && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        PWNED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  {lab.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {lab.description}
                </p>

                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-3 space-y-1 text-[11px] font-mono text-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target System:</span>
                    <span className="text-cyan-400 font-semibold">{lab.targetSystem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flag Format:</span>
                    <span className="text-slate-300">FLAG&#123;...&#125;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Available Hints:</span>
                    <span className="text-slate-300">{lab.hints.length} Progressive Hints</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                <div className="flex items-center gap-1 font-mono text-xs text-emerald-400">
                  <Zap className="h-3.5 w-3.5" />
                  <span>+{lab.totalXpReward} Max XP</span>
                </div>

                <button
                  onClick={() => onOpenLab(lab.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-sm"
                >
                  <span>{lab.completed ? 'Re-engage Sandbox' : 'Spawn Lab Terminal'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Hacking Machines & External Lab Redirects Banner */}
      <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <Server className="h-4 w-4" />
              <span>REAL-WORLD TARGET PRACTICE & EXTERNAL PLATFORMS</span>
            </div>
            <h3 className="text-base font-bold text-white">Practice on Iconic Real Hacking Machines</h3>
            <p className="text-xs text-slate-300">
              Ready to take your skills beyond our sandbox? Practice on live virtual machines on Hack The Box, TryHackMe, and PortSwigger Web Academy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <a
            href="https://app.hackthebox.com/machines/Blue"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
              <span>HTB: Blue (MS17-010)</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">EternalBlue Windows SMB exploitation benchmark.</p>
          </a>

          <a
            href="https://portswigger.net/web-security"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
              <span>PortSwigger Web Academy</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Free hands-on SQLi, XSS, SSRF & IDOR labs.</p>
          </a>

          <a
            href="https://tryhackme.com/path/outline/jrpen-tester"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
              <span>TryHackMe: Jr Pentester</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Guided browser-based vulnerable rooms path.</p>
          </a>

          <a
            href="https://www.offsec.com/labs/"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
              <span>OffSec Proving Grounds</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Official Offensive Security OSCP preparation labs.</p>
          </a>
        </div>
      </div>
    </div>
  );
};
