import React, { useState, useMemo } from 'react';
import {
  Youtube,
  Search,
  Play,
  CheckCircle2,
  ExternalLink,
  Clock,
  Shield,
  Sparkles,
  Tv,
  Filter,
  Check
} from 'lucide-react';
import {
  ALL_CURATED_VIDEOS,
  CuratedVideo,
  CuratedTrackId
} from '../data/curatedVideoData';
import { VideoPlayerModal } from './VideoPlayerModal';

interface VideosViewProps {
  onOpenLesson?: (lessonId: string) => void;
}

export const VideosView: React.FC<VideosViewProps> = () => {
  const [selectedTrack, setSelectedTrack] = useState<CuratedTrackId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<CuratedVideo | null>(null);

  const [watchedVideos, setWatchedVideos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybermentor_watched_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWatched = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchedVideos((prev) => {
      const next = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      try {
        localStorage.setItem('cybermentor_watched_videos', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const tracksList: { id: CuratedTrackId | 'all'; label: string; count: number }[] = useMemo(() => {
    const counts: Record<string, number> = { all: ALL_CURATED_VIDEOS.length };
    ALL_CURATED_VIDEOS.forEach((v) => {
      counts[v.trackId] = (counts[v.trackId] || 0) + 1;
    });

    return [
      { id: 'all', label: 'All Domains', count: counts['all'] },
      { id: 'soc-analyst', label: 'SOC Analyst', count: counts['soc-analyst'] || 0 },
      { id: 'penetration-tester', label: 'Ethical Hacking', count: counts['penetration-tester'] || 0 },
      { id: 'threat-hunter', label: 'Threat Hunting', count: counts['threat-hunter'] || 0 },
      { id: 'threat-intel', label: 'Threat Intelligence', count: counts['threat-intel'] || 0 },
      { id: 'malware-analyst', label: 'Malware Analysis', count: counts['malware-analyst'] || 0 },
      { id: 'security-engineer', label: 'Security Engineering', count: counts['security-engineer'] || 0 },
      { id: 'network-security-engineer', label: 'Network Security', count: counts['network-security-engineer'] || 0 },
      { id: 'cloud-security-engineer', label: 'Cloud Security', count: counts['cloud-security-engineer'] || 0 }
    ];
  }, []);

  const filteredVideos = useMemo(() => {
    return ALL_CURATED_VIDEOS.filter((video) => {
      const matchesTrack = selectedTrack === 'all' || video.trackId === selectedTrack;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTrack;

      const matchesQuery =
        video.topicName.toLowerCase().includes(q) ||
        video.videoTitle.toLowerCase().includes(q) ||
        video.channel.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        video.keyTakeaways.some((k) => k.toLowerCase().includes(q));

      return matchesTrack && matchesQuery;
    });
  }, [selectedTrack, searchQuery]);

  const totalXP = watchedVideos.length * 50;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-slate-900/90 to-red-950/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-400/30 px-3 py-1 text-xs font-bold text-red-300">
                <Youtube className="h-4 w-4 text-red-400 fill-red-400/20" />
                Curated YouTube Academy
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                100+ Videos
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Relevant Cybersecurity YouTube Videos
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hand-picked video lectures, technical breakdowns, and lab walkthroughs from top industry educators including <strong className="text-white">NetworkChuck, PowerCert, TCM Security, John Hammond</strong> and more. Watch embedded directly in CyberMentor!
            </p>
          </div>

          {/* Stats Widget */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center min-w-[100px]">
              <div className="text-xl font-black text-emerald-400">{watchedVideos.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mt-0.5">Watched</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center min-w-[100px]">
              <div className="text-xl font-black text-cyan-400">+{totalXP} XP</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mt-0.5">Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, keyword, channel, or payload..."
            className="w-full rounded-xl border border-white/15 bg-slate-900/80 pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Track Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {tracksList.map((tr) => (
            <button
              key={tr.id}
              onClick={() => setSelectedTrack(tr.id)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedTrack === tr.id
                  ? 'bg-red-500 text-white font-bold shadow-lg shadow-red-950/40'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span>{tr.label}</span>
              <span className={`rounded-md px-1.5 py-0.2 text-[10px] font-mono ${
                selectedTrack === tr.id ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                {tr.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400">
          <Tv className="h-12 w-12 mx-auto mb-3 opacity-30 text-red-400" />
          <h3 className="text-base font-bold text-slate-200">No Relevant Videos Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching to another domain track above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const isWatched = watchedVideos.includes(video.id);
            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md overflow-hidden hover:border-red-500/40 hover:bg-slate-900 transition-all cursor-pointer shadow-lg hover:shadow-red-950/20"
              >
                {/* Video Card Header / Thumbnail Mockup */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.videoTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                      // Fallback image if youtube thumbnail fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl shadow-red-950/60 group-hover:scale-110 group-hover:bg-red-500 transition-all">
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.durationApprox && (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-slate-200 border border-white/10">
                      <Clock className="h-3 w-3 text-red-400" />
                      <span>{video.durationApprox}</span>
                    </div>
                  )}

                  {/* Track Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-md bg-black/70 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-red-300 border border-red-500/30">
                      {video.trackTitle}
                    </span>
                  </div>

                  {/* Watched Badge */}
                  {isWatched && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                      <Check className="h-3 w-3" />
                      <span>Watched</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-red-400">{video.channel}</span>
                      <span className="text-slate-500">Topic #{video.topicNumber}</span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-red-300 transition-colors line-clamp-2">
                      {video.topicName}: {video.videoTitle}
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Key Takeaways snippet */}
                  {video.keyTakeaways && video.keyTakeaways.length > 0 && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        Key Takeaway
                      </div>
                      <p className="text-slate-400 line-clamp-1 italic">
                        "{video.keyTakeaways[0]}"
                      </p>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => toggleWatched(video.id, e)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                        isWatched
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`h-3.5 w-3.5 ${isWatched ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{isWatched ? 'Watched' : 'Mark Watched'}</span>
                    </button>

                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Open directly on YouTube"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          playlist={filteredVideos}
          onClose={() => setActiveVideo(null)}
          onSelectVideo={(v) => setActiveVideo(v)}
        />
      )}
    </div>
  );
};
