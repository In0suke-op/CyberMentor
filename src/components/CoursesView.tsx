import React, { useState } from 'react';
import { BookOpen, Clock, Zap, ChevronRight, Lock, CheckCircle2, Compass } from 'lucide-react';
import { Course } from '../types';

interface CoursesViewProps {
  courses: Course[];
  onOpenLesson: (lessonId: string) => void;
  onNavigateRoadmap?: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ courses, onOpenLesson, onNavigateRoadmap }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);

  const categories = ['All', 'Fundamentals', 'Offensive', 'Incident Response'];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Cybersecurity Curriculum Tracks</h2>
          <p className="text-xs text-slate-400">
            Structured defensive and offensive modules referencing OWASP, NIST, RFCs, and MITRE ATT&CK.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-1 shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Tier Study Roadmap Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              Cybersecurity Study Methodology: Foundations • 17 Career Paths • 9 Domains
            </h4>
            <p className="text-xs text-slate-300">
              Explore the complete 32-discipline master syllabus with week-by-week milestones and 4-stage practical study loops.
            </p>
          </div>
        </div>
        {onNavigateRoadmap && (
          <button
            onClick={onNavigateRoadmap}
            className="flex items-center gap-1.5 shrink-0 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all"
          >
            <span>View Roadmap</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Courses Accordion / List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => {
          const isExpanded = expandedCourseId === course.id;
          const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

          return (
            <div
              key={course.id}
              className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            >
              {/* Course Banner */}
              <div
                onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                className="flex cursor-pointer flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 border border-emerald-400/30">
                      {course.category}
                    </span>
                    <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-200">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{course.title}</h3>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-300 shrink-0">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{course.estimatedMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Zap className="h-3.5 w-3.5" />
                    <span>+{course.totalXp} XP</span>
                  </div>
                  <div className="text-slate-400">
                    {totalLessons} lessons
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {/* Modules & Lessons Dropdown */}
              {isExpanded && (
                <div className="border-t border-white/15 bg-white/5 backdrop-blur-md p-6 space-y-6">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {mod.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {mod.lessons.length} lessons
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => onOpenLesson(lesson.id)}
                            className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm p-3.5 hover:border-emerald-400/40 hover:bg-white/15 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono text-xs group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
                                {lesson.type === 'video' ? '▶' : lesson.type === 'interactive' ? '⚡' : '📄'}
                              </span>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                                  {lesson.title}
                                </h4>
                                <div className="mt-0.5 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                  <span>{lesson.durationMinutes} mins</span>
                                  <span>•</span>
                                  <span className="text-emerald-400">+{lesson.xpReward} XP</span>
                                </div>
                              </div>
                            </div>

                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
