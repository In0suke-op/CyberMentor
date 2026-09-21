import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  BookOpen,
  CheckCircle2,
  Circle,
  Terminal,
  AlertTriangle,
  Award,
  Bot,
  Layers,
  ChevronRight,
  X,
  Copy,
  Check,
  Download,
  Calendar,
  Wrench,
  Sparkles,
  ArrowRight,
  Filter,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
  Bookmark,
  Play,
  Youtube,
  Video,
  Clock
} from 'lucide-react';
import { STUDY_ROADMAP_DATA, ROADMAP_PILLARS, StudyTopic } from '../data/studyRoadmapData';
import {
  ALL_CURATED_VIDEOS,
  SOC_ANALYST_VIDEOS,
  PENTESTING_VIDEOS,
  THREAT_HUNTER_VIDEOS,
  CuratedVideo
} from '../data/curatedVideoData';
import {
  CYBER_CURRICULUM,
  CYBERSECURITY_CURRICULUM,
  CURRICULUM_BY_ROLE,
  SOC_ANALYST_CURRICULUM,
  PENETRATION_TESTER_CURRICULUM,
  THREAT_HUNTER_CURRICULUM,
  MALWARE_ANALYST_CURRICULUM,
  CLOUD_SECURITY_ENGINEER_CURRICULUM
} from '@data/curriculum';
import { VideoPlayerModal } from './VideoPlayerModal';
import { generateAIQuiz } from '../services/api';
import { SkillDependencyGraph } from './SkillDependencyGraph';

interface StudyRoadmapViewProps {
  onOpenLesson?: (lessonId: string) => void;
  onOpenLab?: (labId: string) => void;
  onOpenScenario?: (scenarioId: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenQuiz?: (quizId: string) => void;
}

export const StudyRoadmapView: React.FC<StudyRoadmapViewProps> = ({
  onOpenLesson,
  onOpenLab,
  onOpenScenario,
  onNavigateTab,
  onOpenQuiz
}) => {
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<'all' | 'foundations' | 'career-paths' | 'specialized-domains' | 'curriculum-tracks' | 'videos'>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<StudyTopic | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CuratedVideo | null>(null);
  const [videoPlaylist, setVideoPlaylist] = useState<CuratedVideo[]>(ALL_CURATED_VIDEOS);
  const [videoTrackFilter, setVideoTrackFilter] = useState<'all' | 'soc-analyst' | 'pentesting' | 'threat-hunter'>('all');
  const [pentestSectionFilter, setPentestSectionFilter] = useState<number | 'all'>('all');
  const [threatHunterTopicFilter, setThreatHunterTopicFilter] = useState<number | 'all'>('all');
  const [modalVideoSearch, setModalVideoSearch] = useState('');
  const [modalSectionFilter, setModalSectionFilter] = useState<number | 'all'>('all');
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybermentor_completed_topics');
      return saved ? JSON.parse(saved) : ['computer-fundamentals'];
    } catch {
      return ['computer-fundamentals'];
    }
  });
  const [viewMode, setViewMode] = useState<'graph' | 'grid' | 'tree'>('graph');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTree, setCopiedTree] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('cybermentor_completed_topics', JSON.stringify(completedTopicIds));
    } catch {
      // ignore
    }
  }, [completedTopicIds]);

  const toggleTopicCompletion = (id: string) => {
    setCompletedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const searchQ = searchQuery.toLowerCase().trim();

  // Real-time search matches calculation across disciplines, roles, and videos
  const matchingRoadmapCount = STUDY_ROADMAP_DATA.filter((topic) => {
    if (!searchQ) return true;
    return (
      topic.title.toLowerCase().includes(searchQ) ||
      topic.summary.toLowerCase().includes(searchQ) ||
      topic.toolsAndTech.some((t) => t.toLowerCase().includes(searchQ)) ||
      topic.coreConcepts.some((c) => c.toLowerCase().includes(searchQ)) ||
      topic.recommendedCerts.some((cert) => cert.toLowerCase().includes(searchQ))
    );
  }).length;

  const matchingRolesCount = CYBER_CURRICULUM.filter((role) => {
    if (!searchQ) return true;
    return (
      role.roleTitle.toLowerCase().includes(searchQ) ||
      role.badge.toLowerCase().includes(searchQ) ||
      role.description.toLowerCase().includes(searchQ) ||
      role.topics.some(
        (t) =>
          t.topicName.toLowerCase().includes(searchQ) ||
          t.videoTitle.toLowerCase().includes(searchQ) ||
          t.keyTakeaways.some((k) => k.toLowerCase().includes(searchQ))
      )
    );
  }).length;

  const matchingVideosCount = ALL_CURATED_VIDEOS.filter((vid) => {
    if (!searchQ) return true;
    return (
      vid.videoTitle.toLowerCase().includes(searchQ) ||
      vid.topicName.toLowerCase().includes(searchQ) ||
      (vid.sectionTitle && vid.sectionTitle.toLowerCase().includes(searchQ)) ||
      vid.channel.toLowerCase().includes(searchQ) ||
      vid.description.toLowerCase().includes(searchQ) ||
      vid.keyTakeaways.some((t) => t.toLowerCase().includes(searchQ))
    );
  }).length;

  const filteredTopics = STUDY_ROADMAP_DATA.filter((topic) => {
    const matchesPillar = selectedPillar === 'all' || topic.pillar === selectedPillar;
    const matchesDiff = difficultyFilter === 'all' || topic.difficulty === difficultyFilter;
    const matchesSearch =
      !searchQ ||
      topic.title.toLowerCase().includes(searchQ) ||
      topic.summary.toLowerCase().includes(searchQ) ||
      topic.toolsAndTech.some((t) => t.toLowerCase().includes(searchQ)) ||
      topic.coreConcepts.some((c) => c.toLowerCase().includes(searchQ)) ||
      topic.recommendedCerts.some((cert) => cert.toLowerCase().includes(searchQ));

    return matchesPillar && matchesDiff && matchesSearch;
  });

  const asciiTree = `Cybersecurity Study Architecture
│
├── Foundations (6 Core Disciplines)
│   ├── Computer Fundamentals
│   ├── Networking
│   ├── Linux
│   ├── Windows
│   ├── Python
│   └── Security Fundamentals
│
├── Career Paths (17 Role Tracks)
│   ├── SOC Analyst
│   ├── Penetration Tester
│   ├── Cybersecurity Analyst
│   ├── VAPT Analyst
│   ├── Bug Bounty Hunter
│   ├── Incident Responder
│   ├── Threat Hunter
│   ├── Digital Forensics Analyst
│   ├── Malware Analyst
│   ├── Security Engineer
│   ├── Cloud Security Engineer
│   ├── AppSec Engineer
│   ├── DevSecOps Engineer
│   ├── GRC Analyst
│   ├── Security Auditor
│   ├── IAM Analyst
│   └── Security Architect
│
└── Specialized Domains (9 Deep-Dive Fields)
    ├── Web Security
    ├── API Security
    ├── Cloud Security
    ├── Mobile Security
    ├── AI Security
    ├── IoT Security
    ├── OT/ICS Security
    ├── Cryptography
    └── Security Automation`;

  const copyTreeToClipboard = () => {
    navigator.clipboard.writeText(asciiTree);
    setCopiedTree(true);
    setTimeout(() => setCopiedTree(false), 2000);
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const exportStudyPlanMarkdown = () => {
    let md = `# Cybersecurity Complete Study Method & Roadmap\n\n`;
    md += `> Generated from CyberMentor - 4-Stage Progressive Learning Framework\n\n`;
    md += `## Structure Overview\n\`\`\`text\n${asciiTree}\n\`\`\`\n\n`;

    ROADMAP_PILLARS.forEach((pillar) => {
      md += `## ${pillar.title} (${pillar.badge})\n`;
      md += `${pillar.description}\n\n`;

      const pillarTopics = STUDY_ROADMAP_DATA.filter((t) => t.pillar === pillar.id);
      pillarTopics.forEach((topic) => {
        const isDone = completedTopicIds.includes(topic.id) ? '[x]' : '[ ]';
        md += `### ${isDone} ${topic.title} (${topic.difficulty} • ~${topic.estimatedWeeks} Weeks)\n`;
        md += `**Summary**: ${topic.summary}\n\n`;
        md += `**Core Concepts**:\n`;
        topic.coreConcepts.forEach((c) => (md += `- ${c}\n`));
        md += `\n**Toolstack**: ${topic.toolsAndTech.join(', ')}\n\n`;
        md += `**Study Method**:\n`;
        md += `- **Stage 1 (Theory 30%)**: ${topic.studyMethodology.stage1Theory}\n`;
        md += `- **Stage 2 (Hands-On 40%)**: ${topic.studyMethodology.stage2HandsOn}\n`;
        md += `- **Stage 3 (Simulation 20%)**: ${topic.studyMethodology.stage3Simulation}\n`;
        md += `- **Stage 4 (Validation 10%)**: ${topic.studyMethodology.stage4Validation}\n\n`;
        md += `**Certifications**: ${topic.recommendedCerts.join(', ')}\n\n`;
        md += `---\n\n`;
      });
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cybersecurity-Complete-Study-Roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalTopicsCount = STUDY_ROADMAP_DATA.length;
  const completedCount = completedTopicIds.length;
  const progressPercent = Math.round((completedCount / totalTopicsCount) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Header & Mastery Framework Banner */}
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-mono font-medium text-emerald-300">
              <Compass className="h-3.5 w-3.5" />
              <span>3-Tier Progressive Cybersecurity Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Cybersecurity Study Methodology
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Master the exact 3-tier hierarchy: build unshakeable <span className="text-emerald-400 font-semibold">Foundations</span>, specialize in one of 17 <span className="text-cyan-400 font-semibold">Career Paths</span>, and expand into 9 cutting-edge <span className="text-purple-400 font-semibold">Specialized Domains</span> using the 4-Stage Learning Loop.
            </p>
          </div>

          {/* Quick Progress Indicator & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="rounded-xl border border-white/15 bg-white/5 p-3.5 text-right w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-slate-400">Roadmap Progress:</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {completedCount} / {totalTopicsCount} ({progressPercent}%)
                </span>
              </div>
              <div className="mt-2 h-2 w-full sm:w-48 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyTreeToClipboard}
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-400/40 hover:bg-white/20 transition-all"
                title="Copy ASCII hierarchy tree"
              >
                {copiedTree ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedTree ? 'Copied Tree!' : 'Copy Tree'}</span>
              </button>

              <button
                onClick={exportStudyPlanMarkdown}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all"
                title="Export complete study plan to Markdown"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Markdown</span>
              </button>
            </div>
          </div>
        </div>

        {/* The 4-Stage Mastery Loop Visual */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <BookOpen className="h-4 w-4" />
                <span>1. Theory (30%)</span>
              </span>
              <span className="text-[10px] text-slate-400">Mental Models</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
              Read RFCs, NIST guidelines, and architectural blueprints before touching code.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Terminal className="h-4 w-4" />
                <span>2. Terminal Labs (40%)</span>
              </span>
              <span className="text-[10px] text-slate-400">Hands-on Craft</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
              Execute attacks & defenses in sandboxes, capture packet pcaps, and audit logs.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="h-4 w-4" />
                <span>3. Simulations (20%)</span>
              </span>
              <span className="text-[10px] text-slate-400">Crisis Response</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
              Step into high-stakes war rooms to handle active ransomware, APTs, and data leaks.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Bot className="h-4 w-4" />
                <span>4. Socratic AI (10%)</span>
              </span>
              <span className="text-[10px] text-slate-400">Knowledge Proof</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
              Defend your logic against the AI Mentor and validate retention with quizzes.
            </p>
          </div>
        </div>
      </div>

      {/* REAL-TIME CURRICULUM SEARCH & FILTER BAR */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-cyan-950/30 to-slate-900/90 backdrop-blur-md p-4 sm:p-5 shadow-xl space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Search 17 career roles, 50+ topics, tools (Wireshark, Metasploit, Nmap, Python), certs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/30 bg-white/10 backdrop-blur-md pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:bg-slate-950/80 focus:outline-none shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Clear Search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Real-Time Match Counter Badge */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
              <span className="rounded-lg bg-cyan-500/20 border border-cyan-400/40 px-3 py-1.5 text-cyan-200 font-semibold shadow-sm flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Found: {matchingRoadmapCount} Roadmap Topics • {matchingRolesCount} Role Tracks • {matchingVideosCount} Videos</span>
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-slate-400 hover:text-cyan-300 underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Quick Search Tag Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 custom-scrollbar text-xs">
          <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-semibold shrink-0 flex items-center gap-1">
            <Filter className="h-3 w-3 text-cyan-400" />
            <span>Quick Filter:</span>
          </span>
          {[
            'SOC Analyst',
            'Penetration Tester',
            'Threat Hunter',
            'Active Directory',
            'Wireshark',
            'Metasploit',
            'Linux',
            'Python',
            'Incident Response',
            'Malware'
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(searchQuery.toLowerCase() === tag.toLowerCase() ? '' : tag)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-all whitespace-nowrap ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-bold shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400/40 hover:bg-white/15 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Controls, Search, and Category Selectors */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Pillar Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-1 shadow-sm">
          <button
            onClick={() => setSelectedPillar('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              selectedPillar === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Disciplines ({STUDY_ROADMAP_DATA.length})
          </button>
          {ROADMAP_PILLARS.map((p) => {
            const isActive = selectedPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{p.title}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.2 text-[10px] font-mono">
                  {p.topics.length}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setSelectedPillar('curriculum-tracks')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedPillar === 'curriculum-tracks'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Role Curricula</span>
            <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 text-[10px] font-mono">
              {CYBER_CURRICULUM.length} Tracks
            </span>
          </button>
          <button
            onClick={() => setSelectedPillar('videos')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedPillar === 'videos'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-400/40 shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Youtube className="h-3.5 w-3.5 text-rose-400" />
            <span>Video Masterclasses</span>
            <span className="rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 text-[10px] font-mono">
              {ALL_CURATED_VIDEOS.length}
            </span>
          </button>
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, tools, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-1 text-xs">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
                viewMode === 'graph'
                  ? 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              <span>D3 Skill Graph</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                viewMode === 'tree'
                  ? 'bg-white/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tree Hierarchy
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive D3 Skill Graph Mode */}
      {viewMode === 'graph' && (
        <SkillDependencyGraph
          completedTopicIds={completedTopicIds}
          onToggleCompletion={toggleTopicCompletion}
          onSelectTopicForDetail={(topic) => {
            setActiveTopic(topic);
            setViewMode('grid');
          }}
        />
      )}

      {/* 3. Tree Hierarchy Mode */}
      {viewMode === 'tree' && (
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-mono font-bold text-slate-100">
                Interactive Cybersecurity Hierarchy Tree
              </h3>
            </div>
            <button
              onClick={copyTreeToClipboard}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedTree ? 'Copied to Clipboard' : 'Copy ASCII Tree'}</span>
            </button>
          </div>

          <div className="space-y-6 font-mono text-xs">
            {ROADMAP_PILLARS.map((pillar) => {
              const topicsInPillar = pillar.topics.filter((t) =>
                filteredTopics.some((ft) => ft.id === t.id)
              );
              if (topicsInPillar.length === 0) return null;

              return (
                <div key={pillar.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                    <span className="text-emerald-400">├──</span>
                    <span>{pillar.title}</span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="ml-6 pl-4 border-l border-white/15 space-y-2">
                    {topicsInPillar.map((topic) => {
                      const isDone = completedTopicIds.includes(topic.id);
                      return (
                        <div
                          key={topic.id}
                          onClick={() => setActiveTopic(topic)}
                          className="group flex cursor-pointer items-center justify-between rounded-lg border border-transparent hover:border-white/15 hover:bg-white/10 p-2 transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTopicCompletion(topic.id);
                              }}
                              className="text-slate-400 hover:text-emerald-400"
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>
                            <span className={isDone ? 'line-through text-slate-400' : 'text-slate-200 group-hover:text-emerald-300 font-semibold'}>
                              {topic.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="hidden sm:inline-block truncate max-w-xs">{topic.toolsAndTech.slice(0, 3).join(', ')}</span>
                            <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px]">
                              ~{topic.estimatedWeeks}w
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Grid Card Mode */}
      {viewMode === 'grid' && selectedPillar !== 'videos' && (
        <div className="space-y-8">
          {ROADMAP_PILLARS.map((pillar) => {
            if (selectedPillar !== 'all' && selectedPillar !== pillar.id) return null;

            const topicsInPillar = pillar.topics.filter((t) =>
              filteredTopics.some((ft) => ft.id === t.id)
            );
            if (topicsInPillar.length === 0) return null;

            return (
              <div key={pillar.id} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-slate-100">{pillar.title}</h2>
                    <span className="rounded bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                      {pillar.badge}
                    </span>
                  </div>
                  <p className="hidden md:block text-xs text-slate-400 max-w-xl text-right">
                    {pillar.description}
                  </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topicsInPillar.map((topic) => {
                    const isDone = completedTopicIds.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => setActiveTopic(topic)}
                        className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer backdrop-blur-md transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${
                          isDone
                            ? 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400/50'
                            : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15'
                        }`}
                      >
                        {/* Card Top */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold border ${
                                topic.difficulty === 'Beginner'
                                  ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
                                  : topic.difficulty === 'Intermediate'
                                  ? 'border-cyan-400/30 bg-cyan-500/15 text-cyan-300'
                                  : 'border-amber-400/30 bg-amber-500/15 text-amber-300'
                              }`}
                            >
                              {topic.difficulty} • ~{topic.estimatedWeeks} wks
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTopicCompletion(topic.id);
                              }}
                              className="text-slate-400 hover:text-emerald-400 p-1"
                              title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {topic.curatedVideos && topic.curatedVideos.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/15 text-rose-300 font-semibold">
                                <Play className="h-2.5 w-2.5 fill-rose-300" />
                                <span>{topic.curatedVideos.length} Videos</span>
                              </span>
                            )}
                            {topic.externalLabsAndCTFs && topic.externalLabsAndCTFs.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-semibold">
                                <Terminal className="h-2.5 w-2.5 text-cyan-300" />
                                <span>{topic.externalLabsAndCTFs.length} CTFs / Labs</span>
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                            {topic.title}
                          </h3>

                          <p className="mt-1.5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                            {topic.summary}
                          </p>
                        </div>

                        {/* Card Bottom: Tech Pills & Action CTA */}
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {topic.toolsAndTech.slice(0, 3).map((tool) => (
                              <span
                                key={tool}
                                className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-300"
                              >
                                {tool}
                              </span>
                            ))}
                            {topic.toolsAndTech.length > 3 && (
                              <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                                +{topic.toolsAndTech.length - 3}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                            <span>Inspect Study Blueprint</span>
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4.2 Structured Role Curricula (CYBER_CURRICULUM) Mode */}
      {selectedPillar === 'curriculum-tracks' && (
        <div className="space-y-6">
          {/* Header & Role Selector */}
          <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 shadow-md">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Structured Cybersecurity Role Pathways</span>
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {CYBER_CURRICULUM.length} Professional Tracks
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Industry-aligned curricula with verified YouTube lectures, key takeaways, and instant AI quizzes.
                  </p>
                </div>
              </div>

              {/* Role Filter Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/15 bg-white/5 p-1 text-xs shrink-0 max-w-full">
                <button
                  onClick={() => setSelectedRoleFilter('all')}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all whitespace-nowrap ${
                    selectedRoleFilter === 'all'
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Roles ({CYBER_CURRICULUM.length})
                </button>
                {CYBER_CURRICULUM.map((role) => (
                  <button
                    key={role.roleId}
                    onClick={() => setSelectedRoleFilter(role.roleId)}
                    className={`rounded-lg px-3 py-1.5 font-medium transition-all whitespace-nowrap ${
                      selectedRoleFilter === role.roleId
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {role.roleTitle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role Tracks Grid */}
          <div className="space-y-8">
            {CYBER_CURRICULUM.filter((role) => {
              const matchesRole = selectedRoleFilter === 'all' || role.roleId === selectedRoleFilter;
              const q = searchQuery.toLowerCase().trim();
              const matchesSearch =
                !q ||
                role.roleTitle.toLowerCase().includes(q) ||
                role.badge.toLowerCase().includes(q) ||
                role.description.toLowerCase().includes(q) ||
                role.topics.some(
                  (t) =>
                    t.topicName.toLowerCase().includes(q) ||
                    t.videoTitle.toLowerCase().includes(q) ||
                    t.keyTakeaways.some((k) => k.toLowerCase().includes(q))
                );
              return matchesRole && matchesSearch;
            }).map((role) => (
              <div
                key={role.roleId}
                className="rounded-2xl border border-white/20 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl space-y-6"
              >
                {/* Role Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded bg-cyan-500/15 border border-cyan-400/30 px-2.5 py-0.5 font-mono text-xs font-semibold text-cyan-300">
                        {role.badge}
                      </span>
                      <span className="rounded bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                        Level: {role.level}
                      </span>
                      <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 font-mono text-[11px] text-slate-300 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>Est: {role.estimatedHours}</span>
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-white flex items-center gap-2">
                      <span>{role.roleTitle}</span>
                      <span className="text-xs font-normal text-slate-400 font-mono">
                        ({role.topics.length} Core Modules)
                      </span>
                    </h3>
                    <p className="mt-1 text-xs text-slate-300 max-w-3xl leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>

                {/* Topics Grid for this Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {role.topics.filter((topic) => {
                    const q = searchQuery.toLowerCase().trim();
                    if (!q) return true;
                    if (role.roleTitle.toLowerCase().includes(q) || role.badge.toLowerCase().includes(q)) return true;
                    return (
                      topic.topicName.toLowerCase().includes(q) ||
                      topic.videoTitle.toLowerCase().includes(q) ||
                      topic.description.toLowerCase().includes(q) ||
                      topic.keyTakeaways.some((k) => k.toLowerCase().includes(q))
                    );
                  }).map((topic) => (
                    <div
                      key={topic.topicNumber}
                      className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-4.5 hover:border-cyan-400/40 hover:bg-white/10 transition-all shadow-md"
                    >
                      <div>
                        {/* Topic Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold">
                            Module #{topic.topicNumber}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {topic.durationApprox || '15m'}
                          </span>
                        </div>

                        <h4 className="mt-2 text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {topic.topicName}
                        </h4>

                        <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {topic.description}
                        </p>

                        {/* Video Metadata badge */}
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 bg-black/30 p-2 rounded-lg border border-white/5">
                          <Youtube className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                          <span className="truncate text-slate-200 font-medium">{topic.videoTitle}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">({topic.channel})</span>
                        </div>

                        {/* Key Takeaways */}
                        {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                              Key Takeaways:
                            </span>
                            <ul className="space-y-1 text-[11px] text-slate-300">
                              {topic.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-cyan-400 shrink-0">•</span>
                                  <span className="line-clamp-1">{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          disabled={generatingQuiz}
                          onClick={async () => {
                            try {
                              setGeneratingQuiz(true);
                              const quiz = await generateAIQuiz(topic.topicName, role.roleTitle, role.level);
                              if (onOpenQuiz) {
                                onOpenQuiz(quiz.id);
                              }
                            } catch (err: any) {
                              alert(err.message || 'Failed to generate quiz');
                            } finally {
                              setGeneratingQuiz(false);
                            }
                          }}
                          className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
                        >
                          <Sparkles className="h-3 w-3 text-cyan-300" />
                          <span>AI Quiz</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedVideo({
                              id: `vid-${role.roleId}-${topic.topicNumber}`,
                              trackId: role.roleId as any,
                              trackTitle: role.roleTitle as any,
                              topicNumber: topic.topicNumber,
                              topicName: topic.topicName,
                              videoTitle: topic.videoTitle,
                              youtubeUrl: topic.youtubeUrl,
                              directVideoUrl: topic.directVideoUrl,
                              embedUrl: topic.embedUrl,
                              videoId: topic.videoId,
                              channel: topic.channel,
                              durationApprox: topic.durationApprox,
                              description: topic.description,
                              keyTakeaways: topic.keyTakeaways
                            });
                          }}
                          className="text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-1.5 px-3 py-1 rounded-lg border border-rose-500/40 shadow-sm transition-all"
                        >
                          <Play className="h-3 w-3 fill-white" />
                          <span>Watch Lecture</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4.5 Dedicated Curated Videos Masterclasses Mode */}
      {selectedPillar === 'videos' && (
        <div className="space-y-6">
          {/* Header & Track Selector */}
          <div className="flex flex-col gap-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-md p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-400 shadow-md">
                  <Youtube className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Curated YouTube Video Masterclasses</span>
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {ALL_CURATED_VIDEOS.length} Curated Lectures
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    High-yield video lessons directly aligned to the SOC Analyst, Threat Hunter, and Penetration Tester roadmaps.
                  </p>
                </div>
              </div>

              {/* Track Filter */}
              <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 p-1 text-xs shrink-0 flex-wrap">
                <button
                  onClick={() => {
                    setVideoTrackFilter('all');
                    setPentestSectionFilter('all');
                  }}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    videoTrackFilter === 'all'
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Tracks ({ALL_CURATED_VIDEOS.length})
                </button>
                <button
                  onClick={() => {
                    setVideoTrackFilter('soc-analyst');
                    setPentestSectionFilter('all');
                  }}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    videoTrackFilter === 'soc-analyst'
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SOC Analyst ({SOC_ANALYST_VIDEOS.length})
                </button>
                <button
                  onClick={() => {
                    setVideoTrackFilter('pentesting');
                    setPentestSectionFilter('all');
                    setThreatHunterTopicFilter('all');
                  }}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    videoTrackFilter === 'pentesting'
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Penetration Tester ({PENTESTING_VIDEOS.length})
                </button>
                <button
                  onClick={() => {
                    setVideoTrackFilter('threat-hunter');
                    setPentestSectionFilter('all');
                    setThreatHunterTopicFilter('all');
                  }}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    videoTrackFilter === 'threat-hunter'
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Threat Hunter ({THREAT_HUNTER_VIDEOS.length})
                </button>
              </div>
            </div>

            {/* Pentest 10-Section Navigation Bar */}
            {(videoTrackFilter === 'pentesting' || videoTrackFilter === 'all') && (
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
                    <Filter className="h-3 w-3" />
                    <span>Penetration Tester Sections (10 Modules):</span>
                  </span>
                  {pentestSectionFilter !== 'all' && (
                    <button
                      onClick={() => setPentestSectionFilter('all')}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      Clear Section Filter
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
                  <button
                    onClick={() => setPentestSectionFilter('all')}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                      pentestSectionFilter === 'all'
                        ? 'bg-white/20 text-white font-bold border border-white/30'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
                    }`}
                  >
                    All Sections
                  </button>
                  {[
                    { num: 1, label: '1. Fundamentals (#1-5)' },
                    { num: 2, label: '2. Recon & OSINT (#6-12)' },
                    { num: 3, label: '3. Port Scan & Nmap (#13-20)' },
                    { num: 4, label: '4. Enumeration (#21-28)' },
                    { num: 5, label: '5. Vuln Assessment (#29-35)' },
                    { num: 6, label: '6. Web App Pentest (#36-44)' },
                    { num: 7, label: '7. Metasploit (#45-52)' },
                    { num: 8, label: '8. PrivEsc (#53-60)' },
                    { num: 9, label: '9. Active Directory (#61-67)' },
                    { num: 10, label: '10. Reporting (#68-72)' }
                  ].map((sec) => (
                    <button
                      key={sec.num}
                      onClick={() => {
                        setPentestSectionFilter(sec.num);
                        if (videoTrackFilter !== 'pentesting') setVideoTrackFilter('pentesting');
                      }}
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-mono transition-all whitespace-nowrap ${
                        pentestSectionFilter === sec.num
                          ? 'bg-rose-500/30 text-rose-200 font-bold border border-rose-400/50'
                          : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Threat Hunter 15-Topic Navigation Bar */}
            {videoTrackFilter === 'threat-hunter' && (
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Filter className="h-3 w-3" />
                    <span>Threat Hunter Curriculum (15 Topics):</span>
                  </span>
                  {threatHunterTopicFilter !== 'all' && (
                    <button
                      onClick={() => setThreatHunterTopicFilter('all')}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      Clear Topic Filter
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
                  <button
                    onClick={() => setThreatHunterTopicFilter('all')}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                      threatHunterTopicFilter === 'all'
                        ? 'bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-400/50'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
                    }`}
                  >
                    All 15 Topics
                  </button>
                  {THREAT_HUNTER_VIDEOS.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setThreatHunterTopicFilter(th.topicNumber)}
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-mono transition-all whitespace-nowrap ${
                        threatHunterTopicFilter === th.topicNumber
                          ? 'bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-400/50'
                          : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
                      }`}
                    >
                      #{th.topicNumber} {th.topicName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_CURATED_VIDEOS.filter((vid) => {
              const matchesTrack = videoTrackFilter === 'all' || vid.trackId === videoTrackFilter;
              const matchesSection =
                pentestSectionFilter === 'all' ||
                (vid.trackId === 'penetration-tester' && vid.sectionNumber === pentestSectionFilter);
              const matchesThreatTopic =
                threatHunterTopicFilter === 'all' ||
                vid.trackId !== 'threat-hunter' ||
                vid.topicNumber === threatHunterTopicFilter;
              const q = searchQuery.toLowerCase().trim();
              const matchesSearch =
                !q ||
                vid.videoTitle.toLowerCase().includes(q) ||
                vid.topicName.toLowerCase().includes(q) ||
                (vid.sectionTitle && vid.sectionTitle.toLowerCase().includes(q)) ||
                vid.channel.toLowerCase().includes(q) ||
                vid.description.toLowerCase().includes(q) ||
                vid.keyTakeaways.some((t) => t.toLowerCase().includes(q));
              return matchesTrack && matchesSection && matchesThreatTopic && matchesSearch;
            }).map((vid) => {
              const isSoc = vid.trackId === 'soc-analyst';
              const isThreat = vid.trackId === 'threat-hunter';
              return (
                <div
                  key={vid.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5 hover:border-white/30 hover:bg-white/10 transition-all shadow-md"
                >
                  <div>
                    {/* Top Row: Track & Topic # */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                          isSoc
                            ? 'border-cyan-400/30 bg-cyan-500/15 text-cyan-300'
                            : isThreat
                            ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
                            : 'border-rose-400/30 bg-rose-500/15 text-rose-300'
                        }`}
                      >
                        {vid.trackTitle} • #{vid.topicNumber}
                      </span>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <Clock className="h-3 w-3" />
                        <span>{vid.durationApprox || '20m'}</span>
                      </div>
                    </div>

                    {/* Topic Name & Video Title */}
                    <h4 className="mt-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      {vid.topicName}
                    </h4>
                    <h3 className={`mt-0.5 text-base font-bold text-white transition-colors ${
                      isThreat ? 'group-hover:text-emerald-300' : 'group-hover:text-rose-300'
                    }`}>
                      {vid.videoTitle}
                    </h3>

                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>

                    {/* Key Takeaways Preview */}
                    <div className="mt-3 space-y-1">
                      {vid.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                          <span className={`mt-1 h-1 w-1 rounded-full shrink-0 ${
                            isThreat ? 'bg-emerald-400' : 'bg-rose-400'
                          }`} />
                          <span className="line-clamp-1">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400">
                      Channel: <strong className="text-slate-200">{vid.channel}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Open on YouTube"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          setSelectedVideo(vid);
                          setVideoPlaylist(
                            vid.trackId === 'soc-analyst'
                              ? SOC_ANALYST_VIDEOS
                              : vid.trackId === 'threat-hunter'
                              ? THREAT_HUNTER_VIDEOS
                              : PENTESTING_VIDEOS
                          );
                        }}
                        className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold text-white transition-all shadow-md ${
                          isThreat
                            ? 'border-emerald-500/40 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/30'
                            : 'border-rose-500/40 bg-rose-600 hover:bg-rose-500 shadow-rose-950/30'
                        }`}
                      >
                        <Play className="h-3.5 w-3.5 fill-white" />
                        <span>Play</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TOPIC DETAIL INSPECTOR MODAL */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-950/95 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setActiveTopic(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                  {activeTopic.pillarLabel}
                </span>
                <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                  {activeTopic.difficulty}
                </span>
                <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                  ~{activeTopic.estimatedWeeks} Weeks Commitment
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                  {activeTopic.title}
                </h2>
                <button
                  onClick={() => toggleTopicCompletion(activeTopic.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold border transition-all ${
                    completedTopicIds.includes(activeTopic.id)
                      ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/20 bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {completedTopicIds.includes(activeTopic.id) ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-3.5 w-3.5" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeTopic.summary}
              </p>
            </div>

            {/* Practical 4-Stage Study Method */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5" />
                <span>4-Stage Practical Study Methodology</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Stage 1: Theory (30%)</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {activeTopic.studyMethodology.stage1Theory}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Stage 2: Hands-on (40%)</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {activeTopic.studyMethodology.stage2HandsOn}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <div className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Stage 3: Simulation (20%)</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {activeTopic.studyMethodology.stage3Simulation}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" />
                    <span>Stage 4: Validation (10%)</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {activeTopic.studyMethodology.stage4Validation}
                  </p>
                </div>
              </div>
            </div>

            {/* Week-by-Week Syllabus */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Week-by-Week Syllabus & Milestones</span>
              </h3>

              <div className="space-y-2">
                {activeTopic.weeklySchedule.map((item) => (
                  <div
                    key={item.week}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-400/30 font-mono text-xs font-bold text-cyan-300">
                      W{item.week}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        {item.focus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Video Masterclasses for Topic */}
            {activeTopic.curatedVideos && activeTopic.curatedVideos.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Youtube className="h-4 w-4 text-rose-500" />
                    <span>Curated Video Masterclasses ({activeTopic.curatedVideos.length} YouTube Lectures)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Click Play to stream directly in CyberMentor
                  </span>
                </div>

                {/* Search & Section Filter for large course syllabi like Penetration Tester */}
                {activeTopic.curatedVideos.length > 12 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={modalVideoSearch}
                          onChange={(e) => setModalVideoSearch(e.target.value)}
                          placeholder="Search lectures, topics, tools (e.g. Nmap, Metasploit, Active Directory)..."
                          className="w-full rounded-lg border border-white/10 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
                        />
                        {modalVideoSearch && (
                          <button
                            onClick={() => setModalVideoSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      {modalSectionFilter !== 'all' && (
                        <button
                          onClick={() => setModalSectionFilter('all')}
                          className="text-[11px] text-rose-300 hover:text-rose-200 underline shrink-0"
                        >
                          Show All
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
                      <button
                        onClick={() => setModalSectionFilter('all')}
                        className={`rounded px-2 py-0.5 shrink-0 font-mono transition-colors ${
                          modalSectionFilter === 'all'
                            ? 'bg-rose-500/30 text-rose-200 font-bold border border-rose-400/40'
                            : 'bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        All ({activeTopic.curatedVideos.length})
                      </button>
                      {[
                        { num: 1, name: '1. Fundamentals (#1-5)' },
                        { num: 2, name: '2. Recon & OSINT (#6-12)' },
                        { num: 3, name: '3. Nmap (#13-20)' },
                        { num: 4, name: '4. Enumeration (#21-28)' },
                        { num: 5, name: '5. Vuln Assess (#29-35)' },
                        { num: 6, name: '6. Web App (#36-44)' },
                        { num: 7, name: '7. Metasploit (#45-52)' },
                        { num: 8, name: '8. PrivEsc (#53-60)' },
                        { num: 9, name: '9. Active Directory (#61-67)' },
                        { num: 10, name: '10. Reporting (#68-72)' }
                      ].map((s) => (
                        <button
                          key={s.num}
                          onClick={() => setModalSectionFilter(s.num)}
                          className={`rounded px-2 py-0.5 shrink-0 font-mono whitespace-nowrap transition-colors ${
                            modalSectionFilter === s.num
                              ? 'bg-rose-500/30 text-rose-200 font-bold border border-rose-400/40'
                              : 'bg-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {activeTopic.curatedVideos
                    .filter((vid) => {
                      const matchesSection =
                        modalSectionFilter === 'all' || vid.sectionNumber === modalSectionFilter;
                      const q = modalVideoSearch.toLowerCase().trim();
                      const matchesQuery =
                        !q ||
                        vid.topicName.toLowerCase().includes(q) ||
                        vid.videoTitle.toLowerCase().includes(q) ||
                        (vid.sectionTitle && vid.sectionTitle.toLowerCase().includes(q)) ||
                        vid.channel.toLowerCase().includes(q) ||
                        vid.description.toLowerCase().includes(q) ||
                        vid.keyTakeaways.some((k) => k.toLowerCase().includes(q));
                      return matchesSection && matchesQuery;
                    })
                    .map((vid) => (
                    <div
                      key={vid.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-500/20 bg-rose-950/10 p-3.5 hover:border-rose-500/40 hover:bg-rose-950/20 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 border border-rose-500/40 font-mono text-xs font-bold text-rose-300">
                          #{vid.topicNumber}
                        </div>
                        <div>
                          {vid.sectionTitle && (
                            <div className="text-[10px] font-mono font-semibold text-rose-400/80 mb-0.5">
                              {vid.sectionTitle}
                            </div>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-100">{vid.topicName}</span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs text-rose-300 font-semibold">{vid.videoTitle}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>Channel: <strong className="text-slate-300">{vid.channel}</strong></span>
                            {vid.durationApprox && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {vid.durationApprox}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setSelectedVideo(vid);
                            setVideoPlaylist(activeTopic.curatedVideos || ALL_CURATED_VIDEOS);
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/30 transition-all shadow-sm"
                        >
                          <Play className="h-3.5 w-3.5 fill-rose-200" />
                          <span>Play Video</span>
                        </button>
                        <a
                          href={vid.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Open directly on YouTube"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical CTFs & Interactive Labs */}
            {activeTopic.externalLabsAndCTFs && activeTopic.externalLabsAndCTFs.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    <span>Practical Labs & CTFs ({activeTopic.externalLabsAndCTFs.length} External Platforms)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Hands-on practice from top platforms
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeTopic.externalLabsAndCTFs.map((lab, idx) => (
                    <a
                      key={idx}
                      href={lab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between rounded-xl border border-cyan-500/20 bg-cyan-950/15 p-3.5 hover:border-cyan-400/50 hover:bg-cyan-950/30 transition-all shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                            {lab.platform}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {lab.difficulty && (
                              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                                lab.difficulty === 'Beginner'
                                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                                  : lab.difficulty === 'Intermediate'
                                  ? 'border-amber-400/30 bg-amber-500/10 text-amber-300'
                                  : 'border-rose-400/30 bg-rose-500/10 text-rose-300'
                              }`}>
                                {lab.difficulty}
                              </span>
                            )}
                            <span className="rounded bg-emerald-500/15 border border-emerald-400/30 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300 font-semibold">
                              {lab.free ? 'Free' : 'Freemium'}
                            </span>
                          </div>
                        </div>

                        <h4 className="mt-2 text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center justify-between gap-1">
                          <span>{lab.title}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 shrink-0" />
                        </h4>

                        {lab.description && (
                          <p className="mt-1 text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                            {lab.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cyan-400 group-hover:text-cyan-300">
                        <span className="font-semibold">Launch {lab.type}</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Core Concepts & Toolstack */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Essential Concepts</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeTopic.coreConcepts.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Industry Toolstack</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeTopic.toolsAndTech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-400" />
                    <span>Target Certifications</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeTopic.recommendedCerts.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-md border border-purple-400/30 bg-purple-500/15 px-2 py-0.5 font-mono text-[11px] text-purple-300 font-semibold"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Socratic Prompt & In-App Actions */}
            <div className="mt-6 pt-6 border-t border-white/15 space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                    <Bot className="h-4 w-4" />
                    <span>Socratic AI Mentor Discussion Prompt</span>
                  </div>
                  <button
                    onClick={() => handleCopyPrompt(activeTopic.aiMentorPrompt)}
                    className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                  >
                    {copiedPrompt ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p className="mt-2 text-xs font-mono text-slate-200 bg-black/40 p-2.5 rounded-lg border border-emerald-500/20">
                  "{activeTopic.aiMentorPrompt}"
                </p>
                <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] text-slate-400">
                    Paste this into the AI Mentor tab for guided Socratic questioning.
                  </span>
                  <div className="flex items-center gap-2">
                    {onOpenQuiz && (
                      <button
                        disabled={generatingQuiz}
                        onClick={async () => {
                          try {
                            setGeneratingQuiz(true);
                            const quiz = await generateAIQuiz(activeTopic.title, activeTopic.pillarLabel, activeTopic.difficulty);
                            setActiveTopic(null);
                            onOpenQuiz(quiz.id);
                          } catch (err: any) {
                            alert(err.message || 'Failed to generate quiz');
                          } finally {
                            setGeneratingQuiz(false);
                          }
                        }}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 hover:bg-cyan-500/20 transition-all"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                        <span>{generatingQuiz ? 'Generating Quiz...' : 'Take AI Topic Quiz'}</span>
                      </button>
                    )}
                    {onNavigateTab && (
                      <button
                        onClick={() => {
                          setActiveTopic(null);
                          onNavigateTab('ai-mentor');
                        }}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <span>Open AI Mentor</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* In-App Direct Sandbox / Course Link */}
              {activeTopic.mappedAppAction && (
                <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-center gap-2.5">
                    {activeTopic.mappedAppAction.type === 'lab' ? (
                      <Terminal className="h-5 w-5 text-cyan-400" />
                    ) : activeTopic.mappedAppAction.type === 'scenario' ? (
                      <AlertTriangle className="h-5 w-5 text-rose-400" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-emerald-400" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">
                        Interactive CyberMentor Lab Available
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {activeTopic.mappedAppAction.label}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const action = activeTopic.mappedAppAction;
                      setActiveTopic(null);
                      if (action?.type === 'lab' && onOpenLab && action.id) {
                        onOpenLab(action.id);
                      } else if (action?.type === 'scenario' && onOpenScenario && action.id) {
                        onOpenScenario(action.id);
                      } else if (onNavigateTab) {
                        onNavigateTab('courses');
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-sm"
                  >
                    <span>Launch Activity</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 6. IN-APP YOUTUBE VIDEO THEATER MODAL */}
      <VideoPlayerModal
        video={selectedVideo}
        playlist={videoPlaylist}
        onClose={() => setSelectedVideo(null)}
        onSelectVideo={(vid) => setSelectedVideo(vid)}
      />
    </div>
  );
};
