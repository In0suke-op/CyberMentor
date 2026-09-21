import React from 'react';
import { AlertTriangle, Shield, Clock, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { IncidentScenario } from '../types';

interface ScenariosViewProps {
  scenarios: IncidentScenario[];
  onOpenScenario: (scenarioId: string) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({ scenarios, onOpenScenario }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Enterprise Incident Crisis Rooms</h2>
        <p className="text-xs text-slate-400">
          Simulated SOC high-severity outbreaks. Make time-critical containment, forensic preservation, and eradication decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => {
          return (
            <div
              key={scenario.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${
                scenario.completed
                  ? 'border-emerald-400/40 bg-emerald-500/10 hover:border-emerald-400/60 hover:bg-emerald-500/15'
                  : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-mono uppercase text-slate-300">
                      INCIDENT SIMULATION
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-400">
                      {scenario.severity}
                    </span>
                    {scenario.completed && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        RESOLVED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-100">
                  {scenario.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {scenario.summary}
                </p>

                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-3 space-y-1.5 text-[11px] font-mono text-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Containment Stages:</span>
                    <span className="text-slate-200">{scenario.stages.length} Strategic Decision Gates</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Regulatory Impact:</span>
                    <span className="text-amber-400">Critical Infrastructure / HIPAA</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                <div className="flex items-center gap-1 font-mono text-xs text-rose-400">
                  <Zap className="h-3.5 w-3.5" />
                  <span>+{scenario.totalXpReward} Max XP</span>
                </div>

                <button
                  onClick={() => onOpenScenario(scenario.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-all shadow-sm"
                >
                  <span>{scenario.completed ? 'Re-examine Debrief' : 'Enter Incident Room'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
