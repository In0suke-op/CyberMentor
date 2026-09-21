import React, { useState } from 'react';
import { X, Award, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS } from '../data/cyberData';
import { submitDiagnostic } from '../services/api';
import { DiagnosticResult } from '../types';
import { triggerQuizConfetti } from '../utils/confetti';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentCompleted: (result: DiagnosticResult) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onAssessmentCompleted
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const isAllAnswered = DIAGNOSTIC_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await submitDiagnostic(selectedAnswers);
      setResult(res);
      triggerQuizConfetti();
      onAssessmentCompleted(res);
    } catch (err: any) {
      alert(err.message || 'Failed to submit diagnostic assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {!result ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Cybersecurity Skill Diagnostic</h2>
                <p className="text-xs text-slate-400">5-domain baseline test to calculate your initial skill tier and personalized roadmap.</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {DIAGNOSTIC_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400">
                      Domain {idx + 1}/5: {q.domain}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">1 Question</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-200">{q.text}</p>

                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`w-full text-left rounded-lg p-3 text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-medium'
                              : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-xs text-slate-400 font-mono">
                {Object.keys(selectedAnswers).length} of {DIAGNOSTIC_QUESTIONS.length} answered
              </span>
              <button
                disabled={!isAllAnswered || loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {loading ? 'Evaluating...' : 'Submit Diagnostic Evaluation'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-100">Diagnostic Complete!</h2>
              <p className="mt-1 text-xs text-slate-400">Your cybersecurity operator profile has been initialized with verified telemetry.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <span className="text-xs text-slate-400">Assigned Skill Tier</span>
                <div className="mt-1 text-xl font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {result.skillTier}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <span className="text-xs text-slate-400">Overall Baseline Score</span>
                <div className="mt-1 text-xl font-mono font-bold text-emerald-400">
                  {result.overallScorePercent}%
                </div>
              </div>
            </div>

            {/* Personalized Roadmap */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Personalized Adaptive Learning Roadmap</span>
              </div>
              <div className="mt-3 space-y-2">
                {result.personalizedRoadmap.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Continue to SOC Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
