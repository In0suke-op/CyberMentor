import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  ChevronRight,
  Zap
} from 'lucide-react';
import { IncidentScenario, ScenarioEvaluation } from '../types';
import { evaluateScenario } from '../services/api';
import { triggerScenarioConfetti } from '../utils/confetti';

interface ScenarioWorkspaceModalProps {
  scenario: IncidentScenario | null;
  onClose: () => void;
  onScenarioResolved: (xpEarned: number) => void;
}

export const ScenarioWorkspaceModal: React.FC<ScenarioWorkspaceModalProps> = ({
  scenario,
  onClose,
  onScenarioResolved
}) => {
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<ScenarioEvaluation | null>(null);

  if (!scenario) return null;

  const handleSelectChoice = (stageId: string, choiceId: string) => {
    setSelectedDecisions((prev) => ({ ...prev, [stageId]: choiceId }));
  };

  const isAllStagesDecided = scenario.stages.every((s) => selectedDecisions[s.id]);

  const handleEvaluate = async () => {
    try {
      setEvaluating(true);
      const res = await evaluateScenario(scenario.id, selectedDecisions);
      setResult(res);
      if (res.passed && res.xpAwarded > 0) {
        triggerScenarioConfetti();
        onScenarioResolved(res.xpAwarded);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to evaluate incident scenario');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-rose-500/30 bg-slate-950 p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Crisis Room Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">{scenario.title}</h3>
              <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-400">
                {scenario.severity} PRIORITY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{scenario.summary}</p>
          </div>
        </div>

        {/* Live SOC Telemetry Logs Stream */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3 font-mono text-[11px] text-slate-300">
          <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              LIVE SOC SIEM STREAM (EVENT ID 4624 / 4688)
            </span>
            <span>TIME: 03:14:22 UTC</span>
          </div>
          <div className="space-y-1 text-slate-400">
            <p className="text-rose-400/90">[!] ALERT: Host PC-FIN-04 executing powershell.exe -Enc QQB1AHQAbwByAHUAbg... (Shadow copy deletion)</p>
            <p className="text-amber-400/90">[!] SMB Lateral sweep detected from 10.100.4.15 targeting domain controller 10.100.1.10:445</p>
            <p className="text-cyan-400/90">[+] EDR Sensor isolation pending network triage confirmation.</p>
          </div>
        </div>

        {!result ? (
          /* Strategic Decision Stages */
          <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {scenario.stages.map((stage, idx) => (
              <div key={stage.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">
                    STAGE {idx + 1}: {stage.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Strategic Gate</span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-300">{stage.description || (stage as any).briefing}</p>

                <div className="mt-4 space-y-2">
                  {stage.choices.map((choice) => {
                    const isSelected = selectedDecisions[stage.id] === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleSelectChoice(stage.id, choice.id)}
                        className={`w-full text-left rounded-lg p-3 text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border border-rose-500/50 bg-rose-500/10 text-rose-300 font-medium'
                            : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="leading-relaxed">{choice.label}</span>
                        <span
                          className={`h-4 w-4 shrink-0 ml-3 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-rose-400 bg-rose-400' : 'border-slate-700'
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

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-xs font-mono text-slate-400">
                {Object.keys(selectedDecisions).length} of {scenario.stages.length} gates decided
              </span>
              <button
                disabled={!isAllStagesDecided || evaluating}
                onClick={handleEvaluate}
                className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-rose-400 disabled:opacity-50 transition-all shadow-lg"
              >
                {evaluating ? 'Analyzing Forensic Outcomes...' : 'Execute Containment Protocol'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Post-Incident Forensic Debrief */
          <div className="mt-6 space-y-6">
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
                {result.passed ? 'Outbreak Contained Successfully!' : 'Containment Failed: Critical Forensic Breach'}
              </h3>
              <p className="mt-1 text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {result.debriefSummary}
              </p>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono">
                <span className="text-slate-400">
                  Incident Score: <strong className="text-slate-100">{result.finalScore} / {result.maxScore}</strong>
                </span>
                {result.xpAwarded > 0 && (
                  <span className="text-emerald-400 font-bold">
                    +{result.xpAwarded} Verified XP Awarded!
                  </span>
                )}
              </div>
            </div>

            {/* Stage-by-Stage Forensic Review */}
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
              {result.stageEvaluations.map((evalItem, idx) => (
                <div
                  key={evalItem.stageId}
                  className={`rounded-xl border p-4 text-xs ${
                    evalItem.isOptimal
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-rose-500/30 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className={evalItem.isOptimal ? 'text-emerald-400' : 'text-rose-400'}>
                      Gate {idx + 1}: {evalItem.label}
                    </span>
                    <span className="font-bold">
                      {evalItem.scoreDelta > 0 ? `+${evalItem.scoreDelta} pts` : `${evalItem.scoreDelta} pts`}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-slate-100">Forensic Analysis: </strong>
                    {evalItem.feedback}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Close Crisis Room Debrief
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
