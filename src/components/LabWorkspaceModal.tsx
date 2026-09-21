import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Terminal,
  Shield,
  Send,
  Copy,
  Check,
  RotateCcw,
  Cpu,
  Layers,
  Activity,
  Box,
  FileCode,
  Sliders,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { Lab, LabSubmissionResult, EphemeralContainerSession } from '../types';
import {
  getLabById,
  unlockLabHint,
  submitLabFlag,
  execLabTerminal,
  startLabContainer,
  stopLabContainer,
  getLabContainerStatus,
  execLabContainer
} from '../services/api';
import {
  BrowserVirtualContainer,
  getLabContainerSpec,
  generateDockerfile,
  generateDockerCompose,
  generateDockerRunCommand,
  generateSeccompJson
} from '../utils/containerConfigGenerator';
import { triggerLabConfetti } from '../utils/confetti';

interface LabWorkspaceModalProps {
  labId: string | null;
  onClose: () => void;
  onLabPwned: (xpEarned: number) => void;
}

interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'system' | 'kernel';
  text: string;
}

export const LabWorkspaceModal: React.FC<LabWorkspaceModalProps> = ({
  labId,
  onClose,
  onLabPwned
}) => {
  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'terminal' | 'docker-config' | 'telemetry' | 'security'>('terminal');
  const [runtimeMode, setRuntimeMode] = useState<'browser-ephemeral' | 'backend-orchestrated'>('browser-ephemeral');
  const [containerSession, setContainerSession] = useState<EphemeralContainerSession | null>(null);
  const [configArtifactTab, setConfigArtifactTab] = useState<'compose' | 'dockerfile' | 'run' | 'seccomp'>('compose');
  const [copiedArtifact, setCopiedArtifact] = useState<string | null>(null);

  // Terminal & Command State
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);

  // Flag & Hint State
  const [flagInput, setFlagInput] = useState('');
  const [submittingFlag, setSubmittingFlag] = useState(false);
  const [flagResult, setFlagResult] = useState<LabSubmissionResult | null>(null);
  const [unlockedHints, setUnlockedHints] = useState<Record<string, any>>({});
  const [unlockingHintId, setUnlockingHintId] = useState<string | null>(null);

  // TTL & Health
  const [ttlSeconds, setTtlSeconds] = useState<number>(1800);
  const browserContainerRef = useRef<BrowserVirtualContainer | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Lab & Container Environment
  useEffect(() => {
    if (!labId) return;
    setLoading(true);
    setFlagResult(null);
    setFlagInput('');
    setCommandInput('');
    setTtlSeconds(1800);

    getLabById(labId)
      .then((data) => {
        setLab(data);

        // Instantiate in-browser ephemeral virtual container
        const vContainer = new BrowserVirtualContainer(data, 'browser-ephemeral');
        browserContainerRef.current = vContainer;
        setContainerSession(vContainer.session);

        setTerminalLogs([
          {
            id: 'init-1',
            type: 'kernel',
            text: `[CONTAINER KERNEL] Booting sandbox: ${vContainer.session.containerName} (${vContainer.session.image})`
          },
          {
            id: 'init-2',
            type: 'system',
            text: `[SECCOMP/CGROUP] Enforcement: read_only=true, cpus=0.5, mem_limit=256M, pids_limit=64, cap_drop=[ALL]`
          },
          {
            id: 'init-3',
            type: 'system',
            text: `[NETWORK] Isolated veth pair active: ${vContainer.session.ipAddress} -> 127.0.0.1:${Object.values(vContainer.session.ports)[0] || 8080}`
          },
          {
            id: 'init-4',
            type: 'system',
            text: `[OBJECTIVE] ${data.description}`
          },
          {
            id: 'init-5',
            type: 'system',
            text: `[+] Type 'help' or inspect Docker artifacts to examine sandbox isolation architecture.`
          }
        ]);
      })
      .catch((err) => {
        alert(err.message || 'Failed to load lab workspace');
      })
      .finally(() => setLoading(false));
  }, [labId]);

  // TTL Countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTtlSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      if (browserContainerRef.current && runtimeMode === 'browser-ephemeral') {
        const s = browserContainerRef.current.session;
        s.uptimeSeconds = browserContainerRef.current.getUptimeSeconds();
        s.ttlSecondsRemaining = ttlSeconds;
        setContainerSession({ ...s });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [ttlSeconds, runtimeMode]);

  // Polling for backend orchestrated container status
  useEffect(() => {
    if (runtimeMode !== 'backend-orchestrated' || !labId) return;

    const poller = setInterval(async () => {
      try {
        const res = await getLabContainerStatus(labId);
        if (res.session) {
          setContainerSession(res.session);
          setTtlSeconds(res.session.ttlSecondsRemaining);
        }
      } catch {
        // quiet fallback
      }
    }, 5000);

    return () => clearInterval(poller);
  }, [runtimeMode, labId]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  if (!labId || !lab) return null;

  const spec = getLabContainerSpec(lab);

  // Switch between In-Browser Ephemeral Container and Backend Orchestrator
  const handleToggleRuntimeMode = async (targetMode: 'browser-ephemeral' | 'backend-orchestrated') => {
    if (targetMode === runtimeMode) return;
    setRuntimeMode(targetMode);

    if (targetMode === 'backend-orchestrated') {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `mode-${Date.now()}`,
          type: 'kernel',
          text: `[*] Handing off session to Backend Docker Orchestrator API (/api/v1/labs/${lab.id}/container/start)...`
        }
      ]);
      try {
        const res = await startLabContainer(lab.id);
        setContainerSession(res.session);
        setTtlSeconds(res.session.ttlSecondsRemaining);
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: `orch-${Date.now()}`,
            type: 'system',
            text: `[+] Backend Container active: ID ${res.session.id} | Host: ${res.session.ipAddress} | Status: ${res.session.status}`
          }
        ]);
      } catch (err: any) {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            type: 'system',
            text: `[-] Backend orchestration error: ${err.message}. Reverting to In-Browser Ephemeral Sandbox.`
          }
        ]);
        setRuntimeMode('browser-ephemeral');
      }
    } else {
      // Revert to browser sandbox
      const vContainer = new BrowserVirtualContainer(lab, 'browser-ephemeral');
      browserContainerRef.current = vContainer;
      setContainerSession(vContainer.session);
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `mode-${Date.now()}`,
          type: 'kernel',
          text: `[+] Switched to zero-latency In-Browser Ephemeral Container (Wasm/In-Memory Isolated Runtime).`
        }
      ]);
    }
  };

  const handleRestartContainer = async () => {
    if (runtimeMode === 'backend-orchestrated') {
      try {
        await stopLabContainer(lab.id);
        const res = await startLabContainer(lab.id);
        setContainerSession(res.session);
        setTtlSeconds(1800);
        setTerminalLogs([
          {
            id: `reboot-${Date.now()}`,
            type: 'kernel',
            text: `[+] Backend container recycled. Fresh ephemeral instance: ${res.session.id}`
          }
        ]);
      } catch (err: any) {
        alert('Failed to restart backend container: ' + err.message);
      }
    } else {
      const vContainer = new BrowserVirtualContainer(lab, 'browser-ephemeral');
      browserContainerRef.current = vContainer;
      setContainerSession(vContainer.session);
      setTtlSeconds(1800);
      setTerminalLogs([
        {
          id: `reboot-${Date.now()}`,
          type: 'kernel',
          text: `[+] Ephemeral in-memory container state purged and reset to pristine baseline.`
        }
      ]);
    }
  };

  const handleExecuteCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setTerminalLogs((prev) => [
      ...prev,
      { id: `cmd-${Date.now()}`, type: 'input', text: `analyst@${containerSession?.containerName || 'sandbox'}:~$ ${cmd}` }
    ]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setCommandInput('');

    if (cmd.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      return;
    }

    try {
      if (runtimeMode === 'browser-ephemeral' && browserContainerRef.current) {
        const res = browserContainerRef.current.execute(cmd);
        setTerminalLogs((prev) => [
          ...prev,
          { id: `out-${Date.now()}`, type: 'output', text: res.output }
        ]);
      } else {
        const res = await execLabContainer(lab.id, cmd);
        setTerminalLogs((prev) => [
          ...prev,
          { id: `out-${Date.now()}`, type: 'output', text: res.output }
        ]);
      }
    } catch (err: any) {
      setTerminalLogs((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, type: 'output', text: `[-] Error: ${err.message}` }
      ]);
    }
  };

  const handleUnlockHint = async (hintId: string) => {
    try {
      setUnlockingHintId(hintId);
      const hint = await unlockLabHint(lab.id, hintId);
      setUnlockedHints((prev) => ({ ...prev, [hintId]: hint }));
    } catch (err: any) {
      alert(err.message || 'Failed to unlock hint');
    } finally {
      setUnlockingHintId(null);
    }
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    try {
      setSubmittingFlag(true);
      const res = await submitLabFlag(lab.id, flagInput.trim());
      setFlagResult(res);
      if (res.success) {
        triggerLabConfetti();
        onLabPwned(res.xpAwarded);
      }
    } catch (err: any) {
      setFlagResult({ success: false, message: err.message || 'Failed to verify flag', xpAwarded: 0 });
    } finally {
      setSubmittingFlag(false);
    }
  };

  const insertQuickCommand = (cmd: string) => {
    setCommandInput(cmd);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifact(label);
    setTimeout(() => setCopiedArtifact(null), 2000);
  };

  const formatTtl = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dockerfileCode = generateDockerfile(lab);
  const composeCode = generateDockerCompose(lab);
  const runCliCode = generateDockerRunCommand(lab);
  const seccompCode = generateSeccompJson();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-2 sm:p-4 overflow-y-auto">
      <div className="relative flex h-[92vh] w-full max-w-7xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Top Docker Container Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 sm:px-6 py-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-slate-100">{lab.title}</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-300 font-semibold border border-emerald-500/30">
                  {lab.difficulty}
                </span>
                <span className="flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300 border border-cyan-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>CONTAINER ACTIVE</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
                <span>Target: <span className="text-slate-200">{spec.targetIp}:{spec.exposedPort}</span></span>
                <span>•</span>
                <span className="hidden md:inline">Image: <span className="text-slate-300">{spec.image}</span></span>
              </div>
            </div>
          </div>

          {/* Right Controls: Mode Toggle, TTL Clock, Actions */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Runtime Mode Selector */}
            <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-0.5 text-[11px] font-mono">
              <button
                onClick={() => handleToggleRuntimeMode('browser-ephemeral')}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  runtimeMode === 'browser-ephemeral'
                    ? 'bg-cyan-500/30 text-cyan-200 font-semibold border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Zero-latency virtual container sandbox running directly in client memory"
              >
                In-Browser Wasm Sandbox
              </button>
              <button
                onClick={() => handleToggleRuntimeMode('backend-orchestrated')}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  runtimeMode === 'backend-orchestrated'
                    ? 'bg-indigo-500/30 text-indigo-200 font-semibold border border-indigo-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Orchestrated ephemeral Docker container via backend daemon"
              >
                Backend Docker Engine
              </button>
            </div>

            {/* TTL Countdown */}
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono text-amber-300">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>{formatTtl(ttlSeconds)}</span>
            </div>

            {/* Reboot Container */}
            <button
              onClick={handleRestartContainer}
              title="Reset ephemeral container state"
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-slate-600 hover:text-white transition-all"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/40 px-6 py-2 text-xs font-mono">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'terminal'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Interactive Terminal</span>
            </button>
            <button
              onClick={() => setActiveTab('docker-config')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'docker-config'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Docker & Orchestration Artifacts</span>
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Container Telemetry & Cgroups</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'security'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Security Profile</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          {containerSession && (
            <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-cyan-400" />
                <span>CPU: {containerSession.resourceUsage.cpuPercent}%</span>
              </span>
              <span>•</span>
              <span>MEM: {containerSession.resourceUsage.memoryMb}MiB / {containerSession.resourceUsage.memoryLimitMb}MiB</span>
              <span>•</span>
              <span>PIDs: {containerSession.resourceUsage.pidCount}/{containerSession.securityProfile.pidsLimit}</span>
            </div>
          )}
        </div>

        {/* Workspace Body: Main Viewport + Right Side Drawer */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
            {/* TAB 1: INTERACTIVE TERMINAL */}
            {activeTab === 'terminal' && (
              <div className="flex flex-1 flex-col p-4 font-mono text-xs overflow-hidden">
                {/* Scrollable Output */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {terminalLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`leading-relaxed whitespace-pre-wrap ${
                        log.type === 'kernel'
                          ? 'text-purple-400 font-semibold'
                          : log.type === 'system'
                          ? 'text-cyan-400/90'
                          : log.type === 'input'
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>

                {/* Quick Command Suggestions */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-900 pt-2 text-[10px]">
                  <span className="text-slate-500">Fast Injections:</span>
                  <button
                    type="button"
                    onClick={() => insertQuickCommand('help')}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 hover:text-emerald-400"
                  >
                    help
                  </button>
                  <button
                    type="button"
                    onClick={() => insertQuickCommand('id')}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 hover:text-emerald-400"
                  >
                    id
                  </button>
                  <button
                    type="button"
                    onClick={() => insertQuickCommand('docker stats')}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-cyan-300 hover:text-cyan-200"
                  >
                    docker stats
                  </button>
                  <button
                    type="button"
                    onClick={() => insertQuickCommand(`nmap -sV -p ${spec.defaultPort} ${spec.targetIp}`)}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 hover:text-emerald-400"
                  >
                    nmap scan
                  </button>
                  {lab.id === 'lab-sqli-01' && (
                    <button
                      type="button"
                      onClick={() => insertQuickCommand(`curl -X POST http://${spec.targetIp}:${spec.defaultPort}/api/login -d '{"username":"admin\\" OR \\"1\\"=\\"1"}'`)}
                      className="rounded bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 text-rose-300 hover:text-rose-200 truncate max-w-xs"
                    >
                      SQLi Tautology Auth Bypass
                    </button>
                  )}
                  {lab.id === 'lab-idor-02' && (
                    <button
                      type="button"
                      onClick={() => insertQuickCommand(`curl http://${spec.targetIp}:${spec.defaultPort}/api/v1/patients/1001`)}
                      className="rounded bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 text-rose-300 hover:text-rose-200"
                    >
                      IDOR VIP Query (1001)
                    </button>
                  )}
                  {lab.id === 'lab-xss-03' && (
                    <button
                      type="button"
                      onClick={() => insertQuickCommand(`curl -X POST http://${spec.targetIp}:${spec.defaultPort}/guestbook -d 'msg=<scr<script>ipt>alert(1)</script>'`)}
                      className="rounded bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 text-rose-300 hover:text-rose-200 truncate max-w-xs"
                    >
                      Nested XSS Filter Bypass
                    </button>
                  )}
                  {lab.id === 'lab-privesc-04' && (
                    <button
                      type="button"
                      onClick={() => insertQuickCommand('find / -perm -4000 2>/dev/null')}
                      className="rounded bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 text-rose-300 hover:text-rose-200"
                    >
                      Find SUID Binaries
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => insertQuickCommand(':(){ :|:& };:')}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-400 hover:text-amber-400"
                    title="Test cgroup pids_limit fork-bomb immunity"
                  >
                    Test Fork Bomb Protection
                  </button>
                </div>

                {/* Interactive Command Input Line */}
                <form onSubmit={handleExecuteCommand} className="mt-2 flex items-center gap-2 border-t border-slate-800 pt-3">
                  <span className="text-emerald-400 font-bold">analyst@{containerSession?.containerName || 'sandbox'}:~$</span>
                  <input
                    type="text"
                    autoFocus
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono"
                    placeholder="Type command and press Enter..."
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-emerald-300 hover:bg-emerald-500/30 font-bold"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: DOCKER & ORCHESTRATION ARTIFACTS */}
            {activeTab === 'docker-config' && (
              <div className="flex flex-1 flex-col p-6 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Box className="h-4 w-4 text-cyan-400" />
                      <span>Hardened Container Orchestration Specification</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Production-ready configurations implementing immutable rootfs, cgroups v2 caps, and restricted namespaces.
                    </p>
                  </div>

                  {/* Artifact Sub-tabs */}
                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1 text-xs font-mono">
                    <button
                      onClick={() => setConfigArtifactTab('compose')}
                      className={`rounded-lg px-2.5 py-1 transition-all ${
                        configArtifactTab === 'compose'
                          ? 'bg-cyan-500/30 text-cyan-200 font-semibold border border-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      docker-compose.yml
                    </button>
                    <button
                      onClick={() => setConfigArtifactTab('dockerfile')}
                      className={`rounded-lg px-2.5 py-1 transition-all ${
                        configArtifactTab === 'dockerfile'
                          ? 'bg-cyan-500/30 text-cyan-200 font-semibold border border-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Dockerfile
                    </button>
                    <button
                      onClick={() => setConfigArtifactTab('run')}
                      className={`rounded-lg px-2.5 py-1 transition-all ${
                        configArtifactTab === 'run'
                          ? 'bg-cyan-500/30 text-cyan-200 font-semibold border border-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      CLI Run Command
                    </button>
                    <button
                      onClick={() => setConfigArtifactTab('seccomp')}
                      className={`rounded-lg px-2.5 py-1 transition-all ${
                        configArtifactTab === 'seccomp'
                          ? 'bg-cyan-500/30 text-cyan-200 font-semibold border border-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      seccomp.json
                    </button>
                  </div>
                </div>

                {/* Code Viewer */}
                <div className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-4 font-mono text-xs text-slate-300">
                  <div className="absolute right-3 top-3">
                    <button
                      onClick={() => {
                        const code =
                          configArtifactTab === 'compose'
                            ? composeCode
                            : configArtifactTab === 'dockerfile'
                            ? dockerfileCode
                            : configArtifactTab === 'run'
                            ? runCliCode
                            : seccompCode;
                        copyToClipboard(code, configArtifactTab);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-all shadow-md"
                    >
                      {copiedArtifact === configArtifactTab ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Spec</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="overflow-x-auto custom-scrollbar max-h-[460px] pt-6 leading-relaxed">
                    {configArtifactTab === 'compose' && composeCode}
                    {configArtifactTab === 'dockerfile' && dockerfileCode}
                    {configArtifactTab === 'run' && runCliCode}
                    {configArtifactTab === 'seccomp' && seccompCode}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: CONTAINER TELEMETRY & CGROUPS */}
            {activeTab === 'telemetry' && (
              <div className="flex flex-1 flex-col p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-400" />
                    <span>Live Ephemeral Container Telemetry & Daemon Logs</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time resource utilization, kernel cgroups v2 quotas, and security event streams.
                  </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>CPU Utilization</span>
                      <Cpu className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">
                      {containerSession?.resourceUsage.cpuPercent}%
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 font-mono">
                      Quota: {spec.securityProfile.cpuQuota} cores
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>RAM Allocation</span>
                      <Box className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono text-indigo-300">
                      {containerSession?.resourceUsage.memoryMb} MiB
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 font-mono">
                      Ceiling: {spec.securityProfile.memoryLimit}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Process Threads</span>
                      <Sliders className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">
                      {containerSession?.resourceUsage.pidCount} / {spec.securityProfile.pidsLimit}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 font-mono">
                      Fork Bomb Shield Active
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Session Time-To-Live</span>
                      <Clock className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
                      {formatTtl(ttlSeconds)}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 font-mono">
                      Auto-purging on expiration
                    </div>
                  </div>
                </div>

                {/* Container Daemon Log Stream */}
                <div className="rounded-xl border border-slate-800 bg-black/60 p-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="text-slate-400 font-bold uppercase text-[11px]">Daemon Event Log</span>
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      STREAMING
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1 text-slate-300">
                    {containerSession?.logs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">
                        <span className="text-slate-500 text-[10px] mr-2">[{new Date().toLocaleTimeString()}]</span>
                        <span className={log.includes('[SECCOMP') ? 'text-amber-400' : log.includes('[KERNEL') ? 'text-cyan-400' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY PROFILE & AUDIT */}
            {activeTab === 'security' && (
              <div className="flex flex-1 flex-col p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-rose-400" />
                    <span>Container Sandbox Hardening & Security Audit</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every ephemeral environment adheres to defense-in-depth containerization benchmarks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Read-Only Root Filesystem (read_only: true)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Prevents adversaries or exploits from tampering with binaries in /bin, /usr, or /etc. Write operations are restricted strictly to mounted in-memory tmpfs scratch directories.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Capability Dropping (cap_drop: [ALL])</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      All POSIX capabilities (such as CAP_SYS_ADMIN, CAP_NET_ADMIN, CAP_DAC_OVERRIDE) are stripped, neutralizing kernel container breakout exploits.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>PID & Resource Limits (cgroups v2)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Hard limit of {spec.securityProfile.pidsLimit} processes and {spec.securityProfile.memoryLimit} memory prevents local denial of service, thread exhaustion, or runaway fork bombs.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Seccomp Syscall Filtering</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Blocks dangerous kernel syscalls including ptrace, bpf, kexec_load, and reboot to ensure isolation between container userland and the host kernel.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Inspector Drawer: Hints + Flag Submission */}
          <div className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-slate-950/80 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Objective Summary */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center justify-between">
                  <span>Target Briefing</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{spec.vulnerabilities.type}</span>
                </h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {lab.description}
                </p>
                <div className="mt-2 rounded-lg bg-black/40 border border-white/5 p-2.5 text-[11px] font-mono text-slate-300 space-y-1">
                  <div><span className="text-slate-500">Container IP:</span> {spec.targetIp}</div>
                  <div><span className="text-slate-500">Target Port:</span> {spec.defaultPort}</div>
                  <div><span className="text-slate-500">Service:</span> {spec.containerName}</div>
                </div>
              </div>

              {/* Progressive Hints */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                    Socratic Hints ({lab.hints.length})
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono">Deducts from max XP</span>
                </div>

                <div className="mt-3 space-y-2">
                  {lab.hints.map((hint, idx) => {
                    const isUnlocked = !!unlockedHints[hint.id];
                    return (
                      <div
                        key={hint.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">
                            Hint {idx + 1}: {hint.title}
                          </span>
                          {!isUnlocked ? (
                            <button
                              disabled={unlockingHintId === hint.id}
                              onClick={() => handleUnlockHint(hint.id)}
                              className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono text-amber-300 hover:bg-amber-500/30"
                            >
                              {unlockingHintId === hint.id ? 'Unlocking...' : `Unlock (-${hint.xpCost} XP)`}
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-400">UNLOCKED</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <p className="mt-2 text-slate-300 text-[11px] leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            {hint.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Flag Submission Box */}
            <div className="mt-6 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Submit Salted Flag</span>
              </h4>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Verified using constant-time salted HMAC-SHA256 comparison.
              </p>

              <form onSubmit={handleSubmitFlag} className="mt-3 space-y-2">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="FLAG{...}"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submittingFlag || !flagInput.trim()}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md"
                >
                  {submittingFlag ? 'Verifying on Server...' : 'Submit Flag'}
                </button>
              </form>

              {flagResult && (
                <div
                  className={`mt-3 rounded-xl border p-3 text-xs ${
                    flagResult.success
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  <p className="font-semibold">{flagResult.message}</p>
                  {flagResult.success && flagResult.xpAwarded > 0 && (
                    <p className="mt-1 font-mono text-emerald-400 font-bold">
                      +{flagResult.xpAwarded} Verified XP Awarded!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
