import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Award,
  Terminal,
  ExternalLink,
  Edit3,
  Save,
  Check,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Youtube,
  Clock
} from 'lucide-react';
import { Lesson } from '../types';
import { completeLesson, createNote } from '../services/api';
import { triggerLessonConfetti } from '../utils/confetti';
import { ALL_CURATED_VIDEOS, CuratedVideo } from '../data/curatedVideoData';
import { VideoPlayerModal } from './VideoPlayerModal';

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenLab: (labId: string) => void;
  onLessonCompleted: (xpAwarded: number) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  onBack,
  onOpenQuiz,
  onOpenLab,
  onLessonCompleted
}) => {
  const [completed, setCompleted] = useState<boolean>(lesson.completed || false);
  const [completing, setCompleting] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [noteTitle, setNoteTitle] = useState(`${lesson.title} - Notes`);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleComplete = async () => {
    try {
      setCompleting(true);
      const res = await completeLesson(lesson.id);
      if (res.success) {
        setCompleted(true);
        if (res.xpAwarded > 0) {
          triggerLessonConfetti();
        }
        onLessonCompleted(res.xpAwarded);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to complete lesson');
    } finally {
      setCompleting(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;
    try {
      setSavingNote(true);
      await createNote({
        title: noteTitle,
        content: noteContent,
        courseId: lesson.courseId,
        courseTitle: lesson.title,
        tags: ['lesson-notes', lesson.slug]
      });
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showNotesDrawer
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>9:16 Smart Note Pad</span>
          </button>

          <button
            disabled={completed || completing}
            onClick={handleComplete}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all shadow-md ${
              completed
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{completed ? 'Lesson Completed' : completing ? 'Verifying...' : 'Mark as Complete (+XP)'}</span>
          </button>
        </div>
      </div>

      {/* 16:9 Presentation / Video Viewport */}
      {lesson.videoUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
          <img
            src={lesson.videoUrl}
            alt={lesson.title}
            className="h-full w-full object-cover opacity-60 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Presentation HUD Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="rounded bg-black/60 backdrop-blur px-2.5 py-1 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
                CYBERNET STREAM 1080p // {lesson.slug.toUpperCase()}
              </span>
              <span className="rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-slate-300 border border-slate-800">
                1.0x SPEED • CLOSED CAPTIONS ON
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-100 drop-shadow">{lesson.title}</h2>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                  <span>⏱️ Duration: {lesson.durationMinutes} min</span>
                  <span>⚡ Reward: +{lesson.xpReward} XP</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-slate-950" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Content Body & Interactive Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-code:text-emerald-400 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
              <div className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {lesson.content}
              </div>
            </div>
          </div>

          {/* Authoritative Specifications and Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
                Standards, RFCs & Attack Specs
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-300 hover:border-slate-700 hover:text-emerald-400 transition-colors"
                  >
                    <span className="font-medium truncate mr-2">{res.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Sidebar: Quizzes, CTF Labs */}
        <div className="space-y-4">
          {/* Associated Quiz Card */}
          {lesson.associatedQuizId && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                <Award className="h-4 w-4" />
                <span>KNOWLEDGE ASSESSMENT</span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-slate-100">
                Validate Your Understanding
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Take the server-graded assessment. Answer keys are strictly protected and mastery updates dynamically.
              </p>
              <button
                onClick={() => onOpenQuiz(lesson.associatedQuizId!)}
                className="mt-4 w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all"
              >
                Launch Knowledge Quiz
              </button>
            </div>
          )}

          {/* Associated CTF Lab Card */}
          {lesson.associatedLabId && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <Terminal className="h-4 w-4" />
                <span>HANDS-ON SANDBOX LAB</span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-slate-100">
                Apply Exploits in Sandbox
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Launch an isolated virtual terminal to execute payloads, bypass filters, and capture the salted flag.
              </p>
              <button
                onClick={() => onOpenLab(lesson.associatedLabId!)}
                className="mt-4 w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all"
              >
                Launch Sandbox Lab
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 9:16 Slide-over Smart Note Drawer */}
      {showNotesDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-800 bg-slate-950 p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">Personal RAG Notes</span>
              </div>
              <button
                onClick={() => setShowNotesDrawer(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Notes saved here are indexed into your private multi-tenant vector RAG memory. CyberMentor will cite these during AI chat!
            </p>

            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100 focus:border-cyan-500 focus:outline-none"
              placeholder="Note Title..."
            />

            <textarea
              rows={16}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none leading-relaxed"
              placeholder="Record commands, payload notes, or remediation checklists in Markdown..."
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              disabled={savingNote || !noteContent.trim()}
              onClick={handleSaveNote}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-md"
            >
              {noteSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Indexed to Personal RAG!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{savingNote ? 'Saving & Vectorizing...' : 'Save & Index to RAG'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
