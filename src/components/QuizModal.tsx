import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, XCircle, Clock, ChevronRight, Zap } from 'lucide-react';
import { QuizClient, QuizResult } from '../types';
import { getQuizById, submitQuiz } from '../services/api';
import { triggerQuizConfetti } from '../utils/confetti';

interface QuizModalProps {
  quizId: string | null;
  onClose: () => void;
  onQuizCompleted: (xpEarned: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quizId,
  onClose,
  onQuizCompleted
}) => {
  const [quiz, setQuiz] = useState<QuizClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedAnswers({});

    getQuizById(quizId)
      .then((data) => setQuiz(data))
      .catch((err) => setError(err.message || 'Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [quizId]);

  if (!quizId) return null;

  const handleSelectOption = (questionId: string, optionIdx: number, type: 'single' | 'multiple' | 'boolean') => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (type === 'single' || type === 'boolean') {
        return { ...prev, [questionId]: [optionIdx] };
      } else {
        const exists = current.includes(optionIdx);
        const updated = exists ? current.filter((i) => i !== optionIdx) : [...current, optionIdx];
        return { ...prev, [questionId]: updated };
      }
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      setSubmitting(true);
      const res = await submitQuiz(quiz.id, selectedAnswers);
      setResult(res);
      if (res.passed && res.xpAwarded > 0) {
        triggerQuizConfetti();
        onQuizCompleted(res.xpAwarded);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="py-16 text-center">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
            <p className="mt-3 font-mono text-xs text-slate-400">Loading Server-Protected Assessment...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-rose-400">
            <p>{error}</p>
            <button onClick={onClose} className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-200">
              Close
            </button>
          </div>
        ) : quiz && !result ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">{quiz.title}</h3>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                  <span>Passing Score: {quiz.passingScorePercent}%</span>
                  <span>•</span>
                  <span className="text-emerald-400">+{quiz.xpReward} XP Reward</span>
                  <span>•</span>
                  <span>{quiz.questions.length} Questions</span>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {quiz.questions.map((q, qIdx) => {
                const selected = selectedAnswers[q.id] || [];
                return (
                  <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400">
                        Question {qIdx + 1} of {quiz.questions.length}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                        {q.points} pt{q.points > 1 ? 's' : ''}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-200">{q.text}</p>
                    <p className="mt-0.5 text-[10px] font-mono text-slate-400">
                      {q.type === 'single' ? 'Select single best answer' : 'Select all that apply (multi-choice)'}
                    </p>

                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selected.includes(oIdx);
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, oIdx, q.type)}
                            className={`w-full text-left rounded-lg p-3 text-xs transition-all flex items-center justify-between ${
                              isChosen
                                ? 'border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-medium'
                                : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <span>{opt}</span>
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                isChosen ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                              }`}
                            >
                              {isChosen && <span className="h-1.5 w-1.5 rounded-full bg-slate-950"></span>}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Action */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-xs font-mono text-slate-400">
                Answer keys verified server-side with zero client leaks
              </span>
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {submitting ? 'Verifying on Server...' : 'Submit Assessment for Grading'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : result ? (
          /* Result Review */
          <div className="space-y-6">
            <div className="text-center">
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border ${
                  result.passed
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {result.passed ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
              </div>

              <h3 className="mt-3 text-2xl font-bold text-slate-100">
                {result.passed ? 'Assessment Passed!' : 'Threshold Not Met'}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {result.passed
                  ? `Congratulations! You scored ${result.scorePercent}%. Your topic mastery has been updated.`
                  : `You scored ${result.scorePercent}%. Passing requirement is 75%. Review the explanations below.`}
              </p>

              {result.xpAwarded > 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  <Zap className="h-3.5 w-3.5" />
                  <span>+{result.xpAwarded} XP Awarded</span>
                </div>
              )}
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {result.questionsReview.map((rev, idx) => (
                <div
                  key={rev.id}
                  className={`rounded-xl border p-4 ${
                    rev.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-rose-500/30 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={rev.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                      Question {idx + 1}: {rev.isCorrect ? 'Correct (+1 pt)' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{rev.text}</p>
                  <div className="mt-2 text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-100">Explanation: </strong>
                    {rev.explanation}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Close Assessment
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
