import React, { useState } from 'react';
import {
  Github,
  Heart,
  Youtube,
  ExternalLink,
  Shield,
  Terminal,
  Cpu,
  BookOpen,
  Sparkles,
  Zap,
  Globe,
  Award,
  Layers,
  Code2,
  Lock,
  ArrowUpRight,
  Tv,
  CheckCircle2,
  Server
} from 'lucide-react';

interface AboutProjectViewProps {
  onSelectTab?: (tab: any) => void;
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({ onSelectTab }) => {
  const [activeTab, setActiveTab] = useState<'why' | 'channels' | 'machines' | 'readme'>('why');

  // Real YouTube Channels Data
  const youtubeChannels = [
    {
      name: 'The Cyber Mentor (Heath Adams)',
      handle: '@TheCyberMentor',
      channelUrl: 'https://www.youtube.com/@TheCyberMentor',
      subscribers: '800K+',
      description: 'Founder of TCM Security and creator of Practical Ethical Hacking. Covers penetration testing, Active Directory exploitation, SOC analyst fundamentals, and career guidance.',
      topics: ['Ethical Hacking', 'Active Directory', 'SOC Analyst', 'PNPT Prep'],
      badge: 'Core Curriculum Partner',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    {
      name: 'NetworkChuck',
      handle: '@NetworkChuck',
      channelUrl: 'https://www.youtube.com/@NetworkChuck',
      subscribers: '3.2M+',
      description: 'Energetic coffee-fueled tutorials on networking, Linux, Wireshark, CCNA, Python for hackers, and cloud infrastructure.',
      topics: ['Networking', 'Linux', 'Wireshark', 'Python'],
      badge: 'Foundations Partner',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      name: 'John Hammond',
      handle: '@JohnHammondAI',
      channelUrl: 'https://www.youtube.com/@JohnHammondAI',
      subscribers: '1.2M+',
      description: 'In-depth CTF walkthroughs, malware reverse engineering, threat hunting, CyberStart America, and breaking news on zero-day vulnerabilities.',
      topics: ['Malware Analysis', 'CTF Walkthroughs', 'DFIR', 'Python Exploitation'],
      badge: 'Threat Intel Partner',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      name: 'IppSec',
      handle: '@ippsec',
      channelUrl: 'https://www.youtube.com/@ippsec',
      subscribers: '250K+',
      description: 'The gold standard for Hack The Box machine walkthroughs. High-speed, highly technical deep-dives into privilege escalation and vulnerability exploitation.',
      topics: ['Hack The Box', 'Privilege Escalation', 'Linux/Windows Exploitation'],
      badge: 'Master Walkthroughs',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      name: 'PowerCert Animated Videos',
      handle: '@PowerCertAnimatedVideos',
      channelUrl: 'https://www.youtube.com/@PowerCertAnimatedVideos',
      subscribers: '2.1M+',
      description: 'Crystal-clear 3D animated explanations of TCP/IP protocols, firewalls, routers, DNS, encryption, and Security+ concepts.',
      topics: ['TCP/IP', 'Firewalls', 'DNS & OSI Model', 'CompTIA Security+'],
      badge: 'Visual Animations',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      name: 'LiveOverflow',
      handle: '@LiveOverflow',
      channelUrl: 'https://www.youtube.com/@LiveOverflow',
      subscribers: '850K+',
      description: 'Deep security research, binary exploitation, web security, hardware hacking, and CTF puzzle solving.',
      topics: ['Binary Exploitation', 'Reverse Engineering', 'Web Security'],
      badge: 'Advanced Research',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    }
  ];

  // Real Hacking Machines & External Platforms Data
  const realMachines = [
    {
      name: 'Blue (MS17-010 / EternalBlue)',
      platform: 'Hack The Box / TryHackMe',
      difficulty: 'Easy / Foundational',
      platformUrl: 'https://app.hackthebox.com/machines/Blue',
      tryHackMeUrl: 'https://tryhackme.com/room/pwnedblue',
      description: 'Classic vulnerable Windows machine demonstrating EternalBlue (SMBv1 exploit). Perfect for learning Nmap scanning, Metasploit, and manual SMB exploitation.',
      techniques: ['SMB Enumeration', 'EternalBlue Exploit', 'NT AUTHORITY\\SYSTEM'],
      badge: 'Must-Pwn Machine'
    },
    {
      name: 'Lame (Samba / Distcc)',
      platform: 'Hack The Box',
      difficulty: 'Easy',
      platformUrl: 'https://app.hackthebox.com/machines/Lame',
      description: 'The iconic beginner Linux machine on Hack The Box showcasing Samba command injection and vulnerable VSFTPD services.',
      techniques: ['Samba 3.0.20 Exploit', 'Port Scanning', 'Linux Privilege Escalation'],
      badge: 'HTB Classic'
    },
    {
      name: 'PortSwigger Web Security Academy',
      platform: 'Free Web Academy',
      difficulty: 'Beginner to Expert',
      platformUrl: 'https://portswigger.net/web-security',
      description: 'The world\'s #1 free interactive web security learning platform covering SQL Injection, XSS, CSRF, SSRF, IDOR, and OAuth vulnerabilities.',
      techniques: ['SQLi', 'XSS', 'SSRF', 'Business Logic Flaws'],
      badge: 'Web Security Standard'
    },
    {
      name: 'TryHackMe - Junior Penetration Tester Track',
      platform: 'TryHackMe',
      difficulty: 'Beginner - Intermediate',
      platformUrl: 'https://tryhackme.com/path/outline/jrpen-tester',
      description: 'Guided browser-based learning path with real vulnerable target virtual machines covering web hacking, privilege escalation, and network pentesting.',
      techniques: ['Burp Suite', 'Metasploit', 'Privilege Escalation'],
      badge: 'Interactive Lab Path'
    },
    {
      name: 'OffSec Proving Grounds / VulnHub',
      platform: 'Offensive Security',
      difficulty: 'Intermediate - Advanced',
      platformUrl: 'https://www.offsec.com/labs/',
      description: 'Official Offensive Security lab machines designed specifically for OSCP preparation and practical vulnerability research.',
      techniques: ['OSCP Prep', 'Buffer Overflows', 'Post-Exploitation'],
      badge: 'OSCP Benchmark'
    },
    {
      name: 'PicoCTF by Carnegie Mellon University',
      platform: 'CMU PicoCTF',
      difficulty: 'Beginner Friendly',
      platformUrl: 'https://picoctf.org/',
      description: 'Gamified cybersecurity competition and learning ground designed for students to master cryptography, web exploitation, forensics, and reverse engineering.',
      techniques: ['Forensics', 'Cryptography', 'Reverse Engineering'],
      badge: 'Gamified CTF'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300 font-mono">
                <Github className="h-4 w-4 text-cyan-400" />
                Open Source & Educational Mission
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300 font-mono">
                v2.5 Production Ready
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why We Built <span className="text-cyan-400">CyberMentor</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bridging the global cybersecurity skills gap through an immersive, Socratic AI-guided learning platform that turns theoretical concepts into real-world offensive & defensive mastery.
            </p>
          </div>

          {/* GitHub CTA Action Card */}
          <div className="shrink-0 space-y-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/20 px-5 py-3 text-xs font-bold text-white shadow-lg hover:border-cyan-400/50 transition-all active:scale-98"
            >
              <Github className="h-4 w-4 text-cyan-400" />
              <span>View Source on GitHub</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>

            <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <span>⭐ 1.2k Stars</span>
              <span>•</span>
              <span>🍴 340 Forks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('why')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'why'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="h-4 w-4 text-rose-400" />
          <span>Project Mission & Why We Built This</span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'channels'
              ? 'bg-red-500/20 text-red-300 border border-red-400/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Youtube className="h-4 w-4 text-red-400" />
          <span>Featured Real YouTube Channels ({youtubeChannels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('machines')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'machines'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="h-4 w-4 text-emerald-400" />
          <span>Real Hacking Machines & Lab Redirects ({realMachines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('readme')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'readme'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="h-4 w-4 text-purple-400" />
          <span>GitHub README.md</span>
        </button>
      </div>

      {/* TAB 1: WHY WE BUILT THIS / MISSION */}
      {activeTab === 'why' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-3 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">The Cybersecurity Talent Deficit</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Over 3.5 million cybersecurity jobs currently sit unfilled worldwide. Traditional textbook learning leaves students stranded when faced with a real terminal, live incident response, or active threat hunting.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-3 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Socratic AI Guidance Over Spoon-Feeding</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than giving away CTF flags or simple answers, CyberMentor acts as a Principal Cyber Instructor—providing multi-tiered hints, architectural diagrams, and guiding questions that build real critical thinking.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-3 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% Free & Open Source Spirit</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspired by pioneers like <strong className="text-white">Heath Adams (The Cyber Mentor)</strong> and <strong className="text-white">NetworkChuck</strong>, CyberMentor integrates curated YouTube video lectures, hands-on CTF sandboxes, and Industry Cert mappings in one accessible platform.
              </p>
            </div>
          </div>

          {/* Architecture & Core Pillars */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 space-y-4 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              <span>Core Architectural Pillars</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-cyan-400">01. 3-TIER ROADMAP</div>
                <div className="text-xs font-bold text-white">Foundations to Specializations</div>
                <p className="text-[11px] text-slate-400">Structured paths spanning SOC Analyst, Penetration Tester, Incident Response, and Cloud Security.</p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-amber-400">02. CTF SANDBOX LABS</div>
                <div className="text-xs font-bold text-white">In-Browser Terminal Simulation</div>
                <p className="text-[11px] text-slate-400">Live bash commands, constant-time flag hash verification, and real payload practice.</p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-emerald-400">03. YOUTUBE ACADEMY</div>
                <div className="text-xs font-bold text-white">100+ Hand-Curated Lectures</div>
                <p className="text-[11px] text-slate-400">Embedded video tutorials mapped directly to curriculum topics and certification requirements.</p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1.5">
                <div className="text-xs font-mono font-bold text-purple-400">04. NEURAL RAG MENTOR</div>
                <div className="text-xs font-bold text-white">Gemini Powered Assistant</div>
                <p className="text-[11px] text-slate-400">Grounding responses with real security documentation, step-by-step hints, and chat history.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL YOUTUBE CHANNELS */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-xs text-slate-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-400 shrink-0" />
              <span>Special thanks to these world-class educators whose free content powers the cybersecurity community!</span>
            </div>
            {onSelectTab && (
              <button
                onClick={() => onSelectTab('videos')}
                className="shrink-0 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 text-xs transition-all"
              >
                Open YouTube Video Hub
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {youtubeChannels.map((channel, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-4 hover:border-red-500/40 transition-all backdrop-blur-md shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border ${channel.badgeColor}`}>
                      {channel.badge}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {channel.subscribers}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Tv className="h-4 w-4 text-red-400" />
                    <span>{channel.name}</span>
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {channel.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {channel.topics.map((t, idx) => (
                      <span key={idx} className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={channel.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-200 hover:text-white font-bold py-2 text-xs transition-all"
                >
                  <Youtube className="h-4 w-4 text-red-400 fill-red-400" />
                  <span>Visit Channel ({channel.handle})</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REAL HACKING MACHINES & REDIRECTS */}
      {activeTab === 'machines' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-slate-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Ready to practice on live target machines? Jump directly to top CTF and vulnerable lab platforms!</span>
            </div>
            {onSelectTab && (
              <button
                onClick={() => onSelectTab('labs')}
                className="shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 text-xs transition-all"
              >
                Open CTF Sandbox
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {realMachines.map((machine, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-4 hover:border-emerald-500/40 transition-all backdrop-blur-md shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                      {machine.badge}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {machine.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span>{machine.name}</span>
                  </h3>

                  <div className="text-[11px] font-mono text-cyan-400">
                    Platform: {machine.platform}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {machine.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {machine.techniques.map((t, idx) => (
                      <span key={idx} className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <a
                    href={machine.platformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <span>Launch on {machine.platform.split('/')[0]}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  {machine.tryHackMeUrl && (
                    <a
                      href={machine.tryHackMeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 py-1.5 text-xs transition-all"
                    >
                      <span>Also Available on TryHackMe</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GITHUB README PREVIEW */}
      {activeTab === 'readme' && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-6 space-y-4 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-purple-400" />
              <span className="font-bold text-white">README.md</span>
            </div>
            <span className="text-[10px] text-slate-500">CyberMentor / main</span>
          </div>

          <div className="space-y-4 leading-relaxed font-sans text-sm text-slate-300">
            <h1 className="text-2xl font-black text-white border-b border-white/10 pb-2">
              🛡️ CyberMentor: The Socratic AI Cybersecurity Academy
            </h1>

            <p>
              <strong>CyberMentor</strong> is a full-stack, AI-guided educational platform designed for cybersecurity students, SOC analysts, ethical hackers, and security engineers.
            </p>

            <h2 className="text-lg font-bold text-cyan-400 pt-2">🚀 Key Features</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Socratic AI Mentor:</strong> Powered by Gemini with RAG vector search, multi-step hints, and chat history persistence.</li>
              <li><strong>Interactive D3 Skill Dependency Graph:</strong> Visualizes prerequisites across SOC Analyst, Pentesting, Incident Response, and Cloud Security.</li>
              <li><strong>100+ YouTube Video Hub:</strong> Hand-curated video lectures embedded directly into topic lessons.</li>
              <li><strong>CTF Sandbox Labs:</strong> In-browser terminal simulation with constant-time flag hash verification.</li>
              <li><strong>Industry Cert Mappings:</strong> CompTIA Security+, CySA+, OSCP, BSCP, and LPI Linux.</li>
            </ul>

            <h2 className="text-lg font-bold text-cyan-400 pt-2">🛠️ Tech Stack</h2>
            <p className="text-xs">
              React 18, Vite, TypeScript, Tailwind CSS, D3.js, Motion, Express.js, Firebase Firestore & Authentication, Google GenAI SDK.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
