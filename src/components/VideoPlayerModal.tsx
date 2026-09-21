import React, { useEffect, useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  Info,
  Youtube
} from 'lucide-react';
import { CuratedVideo } from '../data/curatedVideoData';

interface VideoPlayerModalProps {
  video: CuratedVideo | null;
  playlist?: CuratedVideo[];
  onClose: () => void;
  onSelectVideo?: (video: CuratedVideo) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  playlist = [],
  onClose,
  onSelectVideo
}) => {
  const [watchedVideos, setWatchedVideos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybermentor_watched_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hasEmbedError, setHasEmbedError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setHasEmbedError(false);
  }, [video?.id]);

  if (!video) return null;

  const isWatched = watchedVideos.includes(video.id);

  const toggleWatched = () => {
    setWatchedVideos((prev) => {
      const next = prev.includes(video.id)
        ? prev.filter((id) => id !== video.id)
        : [...prev, video.id];
      try {
        localStorage.setItem('cybermentor_watched_videos', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const currentIndex = playlist.findIndex((v) => v.id === video.id);
  const prevVideo = currentIndex > 0 ? playlist[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-3.5 bg-slate-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                video.trackId === 'soc-analyst'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              <Shield className="h-3 w-3" />
              <span>{video.trackTitle}</span>
              <span className="opacity-60">• #{video.topicNumber}</span>
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {video.topicName}: {video.videoTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-all"
              title="Open video directly on YouTube"
            >
              <Youtube className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">Open YouTube</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title="Close modal (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Video Player Container */}
          <div className="relative w-full bg-black aspect-video flex items-center justify-center">
            {!hasEmbedError ? (
              <iframe
                key={video.id}
                src={video.embedUrl}
                title={video.videoTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onError={() => setHasEmbedError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                <Youtube className="h-16 w-16 text-red-500 mb-3" />
                <h4 className="text-lg font-bold text-white mb-1">Direct YouTube Playback</h4>
                <p className="text-xs text-slate-400 mb-4">
                  This video can be watched directly on YouTube with all native features and captions.
                </p>
                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-950/50"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Launch on YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Details & Actions Section */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Top Bar: Title, Channel, Duration & Watched Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>Channel: <strong className="text-slate-200">{video.channel}</strong></span>
                  {video.durationApprox && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {video.durationApprox}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Verified Active Link</span>
                </div>
                <h2 className="text-base sm:text-xl font-extrabold text-white">
                  {video.videoTitle}
                </h2>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={toggleWatched}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all shadow-sm ${
                    isWatched
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${isWatched ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{isWatched ? 'Completed / Watched' : 'Mark as Watched (+50 XP)'}</span>
                </button>
              </div>
            </div>

            {/* Description & Key Takeaways Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    <Info className="h-3.5 w-3.5" />
                    Lecture Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Core Tactical Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {video.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar Playlist or Navigation */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-200">
                    {video.trackTitle} Series
                  </h5>
                  <span className="text-[11px] font-medium text-slate-400">
                    {currentIndex + 1} of {playlist.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={!prevVideo}
                    onClick={() => prevVideo && onSelectVideo && onSelectVideo(prevVideo)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    disabled={!nextVideo}
                    onClick={() => nextVideo && onSelectVideo && onSelectVideo(nextVideo)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Mini Playlist List */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {playlist.map((item, idx) => {
                    const isItemActive = item.id === video.id;
                    const isItemWatched = watchedVideos.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectVideo && onSelectVideo(item)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                          isItemActive
                            ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-semibold'
                            : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-[10px] w-4 text-center shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="truncate flex-1">
                          {item.topicName}
                        </span>
                        {isItemWatched && (
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
