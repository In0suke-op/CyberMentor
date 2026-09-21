import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Compass,
  CheckCircle2,
  Lock,
  Zap,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  X,
  Layers,
  Award
} from 'lucide-react';
import { STUDY_ROADMAP_DATA, StudyTopic } from '../data/studyRoadmapData';

export interface SkillNodeData extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  pillar: 'foundations' | 'career-paths' | 'specialized-domains';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  prerequisites: string[];
  recommendedCerts: string[];
  toolsAndTech: string[];
  estimatedWeeks: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SkillLinkData extends d3.SimulationLinkDatum<SkillNodeData> {
  source: string | SkillNodeData;
  target: string | SkillNodeData;
}

const SKILL_NODES_CONFIG: Omit<SkillNodeData, 'x' | 'y'>[] = [
  {
    id: 'computer-fundamentals',
    title: 'Computer Fundamentals',
    pillar: 'foundations',
    difficulty: 'Beginner',
    summary: 'Hardware architecture, CPU registers, stack vs heap memory, UEFI, and storage primitives.',
    prerequisites: [],
    recommendedCerts: ['CompTIA A+'],
    toolsAndTech: ['GDB', 'Process Hacker', 'HxD', 'VirtualBox'],
    estimatedWeeks: 3
  },
  {
    id: 'networking',
    title: 'Networking & Protocols',
    pillar: 'foundations',
    difficulty: 'Beginner',
    summary: 'OSI model, TCP/IP handshake, DNS routing, TLS 1.3, and packet analysis with Wireshark.',
    prerequisites: ['computer-fundamentals'],
    recommendedCerts: ['CompTIA Network+'],
    toolsAndTech: ['Wireshark', 'tcpdump', 'Nmap', 'Dig'],
    estimatedWeeks: 4
  },
  {
    id: 'linux-security',
    title: 'Linux Administration & Hardening',
    pillar: 'foundations',
    difficulty: 'Beginner',
    summary: 'Linux permissions, PAM, systemd, SSH hardening, kernel parameters, and auditd.',
    prerequisites: ['computer-fundamentals'],
    recommendedCerts: ['Linux Professional Institute'],
    toolsAndTech: ['Bash', 'auditd', 'SSH', 'fail2ban'],
    estimatedWeeks: 3
  },
  {
    id: 'windows-security',
    title: 'Windows Architecture & Active Directory',
    pillar: 'foundations',
    difficulty: 'Beginner',
    summary: 'Windows kernel, PE header structure, SAM, NT hashes, Kerberos, and Sysmon telemetry.',
    prerequisites: ['computer-fundamentals'],
    recommendedCerts: ['CompTIA Security+'],
    toolsAndTech: ['Sysinternals', 'PowerShell', 'Sysmon'],
    estimatedWeeks: 3
  },
  {
    id: 'python-automation',
    title: 'Python for Cyber Automation',
    pillar: 'foundations',
    difficulty: 'Beginner',
    summary: 'Socket programming, web scraping, custom exploit payloads, and automated log parsers.',
    prerequisites: ['computer-fundamentals'],
    recommendedCerts: ['Python Institute PCEP'],
    toolsAndTech: ['Python 3', 'Scapy', 'Requests', 'pwntools'],
    estimatedWeeks: 3
  },
  {
    id: 'security-fundamentals',
    title: 'Security Fundamentals & Defense',
    pillar: 'foundations',
    difficulty: 'Beginner',
    summary: 'CIA triad, threat modeling, MITRE ATT&CK framework, CIA controls, and security posture.',
    prerequisites: ['computer-fundamentals', 'networking'],
    recommendedCerts: ['CompTIA Security+', 'GIAC GSEC'],
    toolsAndTech: ['MITRE ATT&CK', 'CVSS Calculator', 'OpenVAS'],
    estimatedWeeks: 4
  },
  {
    id: 'web-security',
    title: 'Web Application Exploitation & Defense',
    pillar: 'specialized-domains',
    difficulty: 'Intermediate',
    summary: 'OWASP Top 10, SQLi, XSS, CSRF, IDOR, OAuth 2.0 security, and WAF protection.',
    prerequisites: ['security-fundamentals', 'python-automation'],
    recommendedCerts: ['PortSwigger BSCP', 'eJPT'],
    toolsAndTech: ['Burp Suite', 'sqlmap', 'OWASP ZAP', 'ffuf'],
    estimatedWeeks: 5
  },
  {
    id: 'soc-analyst',
    title: 'SOC Analyst & Telemetry Analysis',
    pillar: 'career-paths',
    difficulty: 'Intermediate',
    summary: 'SIEM query crafting, log parsing, triage procedures, PCAP analysis, and alert validation.',
    prerequisites: ['security-fundamentals', 'networking', 'windows-security', 'linux-security'],
    recommendedCerts: ['CompTIA CySA+', 'BTL1'],
    toolsAndTech: ['Splunk', 'Elastic SIEM', 'Wireshark', 'Suricata'],
    estimatedWeeks: 6
  },
  {
    id: 'penetration-tester',
    title: 'Penetration Testing & Red Teaming',
    pillar: 'career-paths',
    difficulty: 'Intermediate',
    summary: 'Reconnaissance, privilege escalation, lateral movement, pivoting, and C2 orchestration.',
    prerequisites: ['web-security', 'linux-security', 'python-automation'],
    recommendedCerts: ['OSCP', 'eCPPT'],
    toolsAndTech: ['Metasploit', 'Cobalt Strike', 'BloodHound', 'Mimikatz'],
    estimatedWeeks: 8
  },
  {
    id: 'incident-responder',
    title: 'Incident Response & Digital Forensics',
    pillar: 'career-paths',
    difficulty: 'Advanced',
    summary: 'Memory acquisition, volatile RAM analysis, disk forensics, malware triage, and root cause analysis.',
    prerequisites: ['soc-analyst', 'windows-security'],
    recommendedCerts: ['GCIH', 'GCFA'],
    toolsAndTech: ['Volatility', 'Autopsy', 'Velociraptor', 'FTK Imager'],
    estimatedWeeks: 6
  },
  {
    id: 'threat-hunter',
    title: 'Threat Hunting & Hypotheses',
    pillar: 'career-paths',
    difficulty: 'Advanced',
    summary: 'Proactive adversary discovery, YARA rules, Sigma rules, behavioral analytics, and anomaly detection.',
    prerequisites: ['soc-analyst', 'incident-responder'],
    recommendedCerts: ['GCDA', 'BTL2'],
    toolsAndTech: ['Sigma', 'YARA', 'Elasticsearch', 'CyberChef'],
    estimatedWeeks: 5
  },
  {
    id: 'cloud-security',
    title: 'Cloud & IAM Security (AWS / GCP / Azure)',
    pillar: 'specialized-domains',
    difficulty: 'Intermediate',
    summary: 'Cloud IAM policies, VPC security groups, S3 bucket posture, Kubernetes RBAC, and Terraform SAST.',
    prerequisites: ['security-fundamentals', 'networking'],
    recommendedCerts: ['AWS Certified Security Specialty', 'CCSP'],
    toolsAndTech: ['Prowler', 'ScoutSuite', 'Checkov', 'AWS GuardDuty'],
    estimatedWeeks: 4
  },
  {
    id: 'malware-analyst',
    title: 'Reverse Engineering & Malware Analysis',
    pillar: 'career-paths',
    difficulty: 'Advanced',
    summary: 'Static & dynamic malware analysis, Ghidra disassembly, x64dbg debugging, and unpackers.',
    prerequisites: ['windows-security', 'computer-fundamentals'],
    recommendedCerts: ['GREM'],
    toolsAndTech: ['Ghidra', 'x64dbg', 'IDA Free', 'PEStudio'],
    estimatedWeeks: 7
  },
  {
    id: 'api-security',
    title: 'API Security & Microservices',
    pillar: 'specialized-domains',
    difficulty: 'Intermediate',
    summary: 'REST/GraphQL security, JWT forgery attacks, API rate-limiting, and BOLA vulnerability testing.',
    prerequisites: ['web-security'],
    recommendedCerts: ['API Sec Certified'],
    toolsAndTech: ['Postman', 'Burp Suite', 'K6', 'KONG'],
    estimatedWeeks: 3
  },
  {
    id: 'ai-security',
    title: 'AI & LLM Security Engineering',
    pillar: 'specialized-domains',
    difficulty: 'Advanced',
    summary: 'Prompt injection defense, RAG context poisoning, indirect injection, and model weight extraction.',
    prerequisites: ['python-automation', 'security-fundamentals'],
    recommendedCerts: ['OWASP AI Top 10 Specialist'],
    toolsAndTech: ['Garak', 'Rebuff', 'LangChain Guardrails', 'Promptfoo'],
    estimatedWeeks: 4
  },
  {
    id: 'cryptography',
    title: 'Applied Cryptography & PKI',
    pillar: 'specialized-domains',
    difficulty: 'Advanced',
    summary: 'AES-GCM, RSA, ECC, digital signatures, X.509 certificates, PFS, and quantum-resistant algorithms.',
    prerequisites: ['computer-fundamentals', 'security-fundamentals'],
    recommendedCerts: ['GIAC GSEC'],
    toolsAndTech: ['OpenSSL', 'Cryptopals', 'CyberChef'],
    estimatedWeeks: 4
  },
  {
    id: 'devsecops',
    title: 'DevSecOps & CI/CD Pipeline Security',
    pillar: 'career-paths',
    difficulty: 'Intermediate',
    summary: 'SAST/DAST automation, container scanning, secret detection, and policy as code.',
    prerequisites: ['python-automation', 'linux-security', 'cloud-security'],
    recommendedCerts: ['Certified DevSecOps Professional'],
    toolsAndTech: ['Trivy', 'SonarQube', 'Snyk', 'GitHub Actions'],
    estimatedWeeks: 4
  },
  {
    id: 'security-architect',
    title: 'Enterprise Security Architecture & Zero Trust',
    pillar: 'career-paths',
    difficulty: 'Advanced',
    summary: 'Zero Trust Network Architecture (ZTNA), SASE, enterprise threat modeling, and defense-in-depth design.',
    prerequisites: ['threat-hunter', 'devsecops', 'cloud-security'],
    recommendedCerts: ['CISSP', 'SABSA'],
    toolsAndTech: ['Draw.io', 'Threat Dragon', 'Lucidchart'],
    estimatedWeeks: 8
  }
];

interface SkillDependencyGraphProps {
  completedTopicIds: string[];
  onToggleCompletion: (id: string) => void;
  onSelectTopicForDetail?: (topic: StudyTopic) => void;
}

export const SkillDependencyGraph: React.FC<SkillDependencyGraphProps> = ({
  completedTopicIds,
  onToggleCompletion,
  onSelectTopicForDetail
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('security-fundamentals');
  const [filterPillar, setFilterPillar] = useState<'all' | 'foundations' | 'career-paths' | 'specialized-domains'>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Compute unlock status helper
  const isUnlocked = (node: typeof SKILL_NODES_CONFIG[0]) => {
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every((prereqId) => completedTopicIds.includes(prereqId));
  };

  const isCompleted = (nodeId: string) => completedTopicIds.includes(nodeId);

  // Selected node object
  const selectedNode = SKILL_NODES_CONFIG.find((n) => n.id === selectedNodeId) || SKILL_NODES_CONFIG[0];
  const selectedNodeUnlocked = isUnlocked(selectedNode);
  const selectedNodeCompleted = isCompleted(selectedNode.id);

  // Filtered nodes
  const filteredNodesConfig = SKILL_NODES_CONFIG.filter(
    (n) => filterPillar === 'all' || n.pillar === filterPillar
  );

  const filteredNodeIds = new Set(filteredNodesConfig.map((n) => n.id));

  // Build links array from prerequisites
  const linksData: SkillLinkData[] = [];
  SKILL_NODES_CONFIG.forEach((node) => {
    node.prerequisites.forEach((prereqId) => {
      if (filteredNodeIds.has(node.id) && filteredNodeIds.has(prereqId)) {
        linksData.push({
          source: prereqId,
          target: node.id
        });
      }
    });
  });

  // Setup D3 Simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = 520;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Deep copy nodes and links for simulation
    const nodes: SkillNodeData[] = filteredNodesConfig.map((d) => ({ ...d }));
    const links: SkillLinkData[] = linksData.map((d) => ({ ...d }));

    // Container Group for Zooming
    const g = svg.append('g').attr('class', 'graph-container');

    // Define Arrow Marker for Links
    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#475569');

    defs
      .append('marker')
      .attr('id', 'arrow-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#10b981');

    // Zoom setup
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior as any);

    // D3 Force Simulation
    const simulation = d3
      .forceSimulation<SkillNodeData>(nodes)
      .force(
        'link',
        d3
          .forceLink<SkillNodeData, SkillLinkData>(links)
          .id((d) => d.id)
          .distance(120)
      )
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    // Render Links
    const linkGroup = g
      .append('g')
      .attr('stroke-opacity', 0.6)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('class', 'link-line')
      .attr('stroke', '#334155')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow)');

    // Render Nodes Group
    const nodeGroup = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNodeId(d.id);
      })
      .on('mouseenter', (event, d) => {
        setHoveredNodeId(d.id);
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
      });

    // Node Outer Glow / Circles
    nodeGroup
      .append('circle')
      .attr('r', 22)
      .attr('fill', (d) => {
        if (completedTopicIds.includes(d.id)) return '#022c22';
        if (isUnlocked(d)) return '#083344';
        return '#0f172a';
      })
      .attr('stroke', (d) => {
        if (completedTopicIds.includes(d.id)) return '#10b981';
        if (isUnlocked(d)) return '#06b6d4';
        return '#334155';
      })
      .attr('stroke-width', (d) => (d.id === selectedNodeId ? 3.5 : 2))
      .attr('filter', (d) => {
        if (completedTopicIds.includes(d.id)) return 'drop-shadow(0 0 8px rgba(16,185,129,0.5))';
        if (isUnlocked(d)) return 'drop-shadow(0 0 6px rgba(6,182,212,0.4))';
        return 'none';
      });

    // Node Icons / Badges
    nodeGroup.each(function (d) {
      const el = d3.select(this);
      if (completedTopicIds.includes(d.id)) {
        // Checkmark Icon
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#34d399')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .text('✓');
      } else if (isUnlocked(d)) {
        // Zap / Ready Icon
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#22d3ee')
          .attr('font-size', '13px')
          .text('⚡');
      } else {
        // Lock Icon
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#64748b')
          .attr('font-size', '12px')
          .text('🔒');
      }
    });

    // Node Labels
    nodeGroup
      .append('text')
      .text((d) => (d.title.length > 20 ? d.title.substring(0, 18) + '...' : d.title))
      .attr('x', 0)
      .attr('y', 36)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.id === selectedNodeId ? '#f8fafc' : '#cbd5e1'))
      .attr('font-size', '11px')
      .attr('font-weight', (d) => (d.id === selectedNodeId ? 'bold' : '500'))
      .attr('class', 'font-sans select-none pointer-events-none');

    // Drag behavior
    const drag = d3
      .drag<SVGGElement, SkillNodeData>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeGroup.call(drag as any);

    // Simulation Tick Updates
    simulation.on('tick', () => {
      linkGroup.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Reset zoom helper function attached to window/ref
    (containerRef.current as any).resetZoom = () => {
      svg.transition().duration(500).call(zoomBehavior.transform, d3.zoomIdentity);
    };

    return () => {
      simulation.stop();
    };
  }, [completedTopicIds, filterPillar, selectedNodeId]);

  const handleResetZoom = () => {
    if (containerRef.current && (containerRef.current as any).resetZoom) {
      (containerRef.current as any).resetZoom();
    }
  };

  // Find corresponding full topic object from STUDY_ROADMAP_DATA if present
  const fullTopicMatch = STUDY_ROADMAP_DATA.find(
    (t) => t.id === selectedNode.id || t.title.toLowerCase() === selectedNode.title.toLowerCase()
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Compass className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Interactive Skill Dependency Graph
            </h3>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
              D3.js Network
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual topology of cybersecurity skill pathways. Complete prerequisite nodes to unlock advanced specialization tracks.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500 text-[9px] text-emerald-400 font-bold">✓</span>
            <span className="text-slate-300 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400 text-[9px] text-cyan-300">⚡</span>
            <span className="text-slate-300 font-medium">Unlocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-[9px] text-slate-500">🔒</span>
            <span className="text-slate-400">Locked</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Zoom Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setFilterPillar('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterPillar === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            All Tracks ({SKILL_NODES_CONFIG.length})
          </button>
          <button
            onClick={() => setFilterPillar('foundations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterPillar === 'foundations'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Foundations
          </button>
          <button
            onClick={() => setFilterPillar('career-paths')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterPillar === 'career-paths'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Career Roles
          </button>
          <button
            onClick={() => setFilterPillar('specialized-domains')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterPillar === 'specialized-domains'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Specializations
          </button>
        </div>

        <button
          onClick={handleResetZoom}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset Zoom</span>
        </button>
      </div>

      {/* Main Canvas & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* D3 Simulation Interactive Area */}
        <div
          ref={containerRef}
          className="lg:col-span-2 relative min-h-[520px] rounded-2xl border border-slate-800/80 bg-slate-950/80 overflow-hidden shadow-inner flex items-center justify-center"
        >
          {/* Canvas Background Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#00f2fe 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px'
            }}
          />

          <svg
            ref={svgRef}
            className="w-full h-[520px] cursor-grab active:cursor-grabbing"
          />

          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-400">
            💡 Drag nodes to reposition • Scroll to zoom canvas • Click node to inspect details
          </div>
        </div>

        {/* Selected Skill Inspector Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            {/* Top Badge & Title */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                    selectedNode.pillar === 'foundations'
                      ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                      : selectedNode.pillar === 'career-paths'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  {selectedNode.pillar.replace('-', ' ')}
                </span>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    selectedNode.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : selectedNode.difficulty === 'Intermediate'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {selectedNode.difficulty} • {selectedNode.estimatedWeeks}w
                </span>
              </div>

              <h4 className="mt-2 text-base font-bold text-slate-100 flex items-center gap-2">
                {selectedNode.title}
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {selectedNode.summary}
              </p>
            </div>

            {/* Unlock Status Indicator */}
            <div
              className={`rounded-xl border p-3 flex items-center gap-3 ${
                selectedNodeCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : selectedNodeUnlocked
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              {selectedNodeCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : selectedNodeUnlocked ? (
                <Zap className="h-5 w-5 text-cyan-400 shrink-0" />
              ) : (
                <Lock className="h-5 w-5 text-slate-500 shrink-0" />
              )}

              <div className="text-xs">
                <div className="font-bold">
                  {selectedNodeCompleted
                    ? 'Skill Mastered & Verified'
                    : selectedNodeUnlocked
                    ? 'Prerequisites Met — Unlocked & Ready'
                    : 'Prerequisite Required'}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {selectedNodeCompleted
                    ? 'All concepts and lab challenges recorded.'
                    : selectedNodeUnlocked
                    ? 'You have satisfied all upstream skill requirements.'
                    : 'Complete missing prerequisite nodes below to unlock.'}
                </div>
              </div>
            </div>

            {/* Prerequisites List */}
            <div>
              <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Prerequisite Skills ({selectedNode.prerequisites.length})
              </div>
              {selectedNode.prerequisites.length === 0 ? (
                <p className="text-xs text-slate-500 italic">None — Entry-level foundation skill.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.prerequisites.map((reqId) => {
                    const reqNode = SKILL_NODES_CONFIG.find((n) => n.id === reqId);
                    const reqSatisfied = completedTopicIds.includes(reqId);
                    return (
                      <button
                        key={reqId}
                        onClick={() => setSelectedNodeId(reqId)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all ${
                          reqSatisfied
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {reqSatisfied ? '✓' : '🔒'}
                        <span>{reqNode?.title || reqId}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recommended Tools & Certs */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Tools & Tech Stack
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedNode.toolsAndTech.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {selectedNode.recommendedCerts.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>Mapped Certifications</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.recommendedCerts.map((cert) => (
                    <span
                      key={cert}
                      className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => onToggleCompletion(selectedNode.id)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all shadow-md ${
                selectedNodeCompleted
                  ? 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {selectedNodeCompleted ? 'Mark as Incomplete' : 'Mark Skill as Mastered'}
              </span>
            </button>

            {fullTopicMatch && onSelectTopicForDetail && (
              <button
                onClick={() => onSelectTopicForDetail(fullTopicMatch)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
              >
                <BookOpen className="h-4 w-4" />
                <span>Jump to Comprehensive Guide</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
