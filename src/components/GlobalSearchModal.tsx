import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Terminal, AlertTriangle, Award, FileText, ChevronRight } from 'lucide-react';
import { SearchResultItem } from '../types';
import { searchGlobal } from '../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResult: (targetView: string, targetId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToResult
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchGlobal(query.trim());
        setResults(res);
        setSelectedIndex(0);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  // Key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        if (results[selectedIndex]) {
          const r = results[selectedIndex];
          onNavigateToResult(r.targetView, r.targetId);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onNavigateToResult, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
      case 'lesson':
        return <BookOpen className="h-4 w-4 text-emerald-400" />;
      case 'lab':
        return <Terminal className="h-4 w-4 text-cyan-400" />;
      case 'scenario':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'cert':
        return <Award className="h-4 w-4 text-purple-400" />;
      case 'badge':
        return <Award className="h-4 w-4 text-amber-400" />;
      case 'note':
        return <FileText className="h-4 w-4 text-amber-400" />;
      default:
        return <Search className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-backdrop p-4 pt-20">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across courses, CTF labs, scenarios, RFCs, and notes..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-2 rounded p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              Querying SOC Index...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((r, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={`${r.type}-${r.id}`}
                    onClick={() => {
                      onNavigateToResult(r.targetView, r.targetId);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-slate-100 border border-slate-700'
                        : 'text-slate-300 border border-transparent hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                        {getTypeIcon(r.type)}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-100">{r.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{r.snippet}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                        {r.tag || r.type}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Type keywords to search (e.g. "TCP", "SQLi", "Ransomware", "CISSP", "Kerberos")
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
