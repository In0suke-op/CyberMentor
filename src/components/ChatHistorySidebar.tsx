import React, { useState } from 'react';
import {
  History,
  Plus,
  Trash2,
  MessageSquare,
  Search,
  X,
  Brain,
  Lightbulb,
  Shield,
  Code,
  Terminal,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { MentorChatSession } from '../types';

interface ChatHistorySidebarProps {
  sessions: MentorChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getModeBadge = (mode: MentorChatSession['mode']) => {
    switch (mode) {
      case 'socratic':
        return (
          <span className="flex items-center gap-1 rounded bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300">
            <Brain className="h-2.5 w-2.5" />
            Socratic
          </span>
        );
      case 'hint-guided':
        return (
          <span className="flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
            <Lightbulb className="h-2.5 w-2.5" />
            Hints
          </span>
        );
      case 'architecture':
        return (
          <span className="flex items-center gap-1 rounded bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
            <Shield className="h-2.5 w-2.5" />
            Arch
          </span>
        );
      case 'code':
        return (
          <span className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
            <Code className="h-2.5 w-2.5" />
            Code
          </span>
        );
      case 'incident':
        return (
          <span className="flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 text-[10px] font-medium text-purple-300">
            <Terminal className="h-2.5 w-2.5" />
            Incident
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 shrink-0 border-r border-white/15 bg-slate-950/90 backdrop-blur-xl flex flex-col h-full transition-all z-20">
      {/* Top Action Bar */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Chat History
          </h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
            {sessions.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          title="Close History Sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* New Session Button */}
      <div className="p-3 border-b border-white/10">
        <button
          onClick={onNewSession}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-4 text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span>New Mentor Session</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past questions..."
            className="w-full rounded-lg bg-slate-900 border border-white/10 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      {/* Session History List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {filteredSessions.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="font-semibold text-slate-400">No Chat History Found</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Ask CyberMentor a question or request guided hints to save session threads!
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const formattedDate = new Date(session.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group relative flex flex-col rounded-xl p-3 text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-slate-100 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-xs text-slate-100 line-clamp-2 leading-snug">
                    {session.title || 'Untitled Session'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all shrink-0"
                    title="Delete Session"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    {getModeBadge(session.mode)}
                    <span>• {session.messages.length} msg</span>
                  </div>

                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="h-2.5 w-2.5" />
                    {formattedDate}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
