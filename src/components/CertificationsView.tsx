import React, { useState } from 'react';
import { Award, CheckCircle2, ExternalLink, Clock, BookOpen, ShieldCheck, Sparkles, X, ChevronRight, Zap } from 'lucide-react';
import { Certification } from '../types';
import { triggerCertConfetti } from '../utils/confetti';

interface CertificationsViewProps {
  certifications: Certification[];
  onCertCompleted?: (xpEarned: number) => void;
}

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CERT_PRACTICE_QUESTIONS: Record<string, PracticeQuestion[]> = {
  secplus: [
    {
      id: 'sec-1',
      question: 'Which authentication control uses a combination of something you know, something you have, and something you are?',
      options: ['Multi-Factor Authentication (MFA)', 'Single Sign-On (SSO)', 'Role-Based Access Control (RBAC)', 'Federated Identity'],
      correctIndex: 0,
      explanation: 'MFA requires two or more distinct factor types (Knowledge, Possession, Inherence).'
    },
    {
      id: 'sec-2',
      question: 'An attacker intercepts traffic between a client and a web server without altering packets. What type of attack is this?',
      options: ['Man-in-the-Middle (Eavesdropping)', 'Buffer Overflow', 'SQL Injection', 'Cross-Site Scripting (XSS)'],
      correctIndex: 0,
      explanation: 'Passive wiretapping or active MitM intercepts communication in transit.'
    },
    {
      id: 'sec-3',
      question: 'Which cryptographic algorithm provides asymmetric encryption for digital signatures and key exchange?',
      options: ['RSA', 'AES-256', 'HMAC-SHA256', 'Blowfish'],
      correctIndex: 0,
      explanation: 'RSA is a widely used public-key asymmetric algorithm.'
    }
  ],
  cysa: [
    {
      id: 'cysa-1',
      question: 'During SIEM log investigation, an analyst notices 10,000 failed SSH logins from single IP followed by a successful login. What event is this?',
      options: ['SSH Brute Force / Password Spray Attack', 'DDoS Amplification Attack', 'Zero-Day Exploit', 'BGP Hijacking'],
      correctIndex: 0,
      explanation: 'High frequency failed authentications preceding success indicates automated brute force.'
    },
    {
      id: 'cysa-2',
      question: 'Which tool is best suited for network traffic packet capture and deep dissection?',
      options: ['Wireshark / tshark', 'Nmap', 'Autopsy', 'Burp Suite'],
      correctIndex: 0,
      explanation: 'Wireshark is the standard packet analyzer for pcap investigation.'
    }
  ]
};

export const CertificationsView: React.FC<CertificationsViewProps> = ({
  certifications,
  onCertCompleted
}) => {
  const [activeCertForExam, setActiveCertForExam] = useState<Certification | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [passedCerts, setPassedCerts] = useState<Record<string, boolean>>({});

  const handleStartExam = (cert: Certification) => {
    setActiveCertForExam(cert);
    setSelectedAnswers({});
    setExamSubmitted(false);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitExam = () => {
    if (!activeCertForExam) return;
    const questions = CERT_PRACTICE_QUESTIONS[activeCertForExam.id] || CERT_PRACTICE_QUESTIONS['secplus'];
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    setExamSubmitted(true);

    if (scorePercent >= 60) {
      setPassedCerts((prev) => ({ ...prev, [activeCertForExam.id]: true }));
      triggerCertConfetti();
      if (onCertCompleted) {
        onCertCompleted(500);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Industry Certification Hub</h2>
        <p className="text-xs text-slate-400">
          Curriculum alignment with DoD 8570 / 8140 approved baseline certifications, exam blueprints, and readiness simulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => {
          const isCertified = passedCerts[cert.id];

          return (
            <div
              key={cert.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${
                isCertified
                  ? 'border-purple-500/50 bg-purple-950/20 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                  : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300">
                    {cert.code}
                  </span>
                  {isCertified ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                      <ShieldCheck className="h-3 w-3" /> VERIFIED CERTIFIED
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-slate-300">{cert.issuer}</span>
                  )}
                </div>

                <h3 className="mt-3 text-base font-bold text-slate-100">{cert.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-2">
                  {cert.description}
                </p>

                {/* Readiness Meter */}
                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Cadet Exam Readiness</span>
                    <span className="font-mono font-bold text-purple-400">
                      {isCertified ? '100%' : `${cert.readinessScore}%`}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-400 transition-all duration-500"
                      style={{ width: isCertified ? '100%' : `${cert.readinessScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Exam Details Specs */}
                <div className="mt-4 space-y-1.5 text-[11px] font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format:</span>
                    <span className="text-slate-200">{cert.examFormat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-slate-200">{cert.durationMinutes} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Passing Score:</span>
                    <span className="text-slate-200">{cert.passingScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voucher Cost:</span>
                    <span className="text-emerald-400 font-semibold">{cert.priceUsd}</span>
                  </div>
                </div>

                {/* Domain Weights Breakdown */}
                <div className="mt-4 pt-3 border-t border-white/15">
                  <span className="text-[10px] font-mono uppercase text-slate-300 font-semibold">
                    Blueprint Domains
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {cert.domains.map((dom, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 truncate max-w-[170px]">{dom.name}</span>
                        <span className="font-mono text-purple-300 font-bold">{dom.weightPercent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 space-y-2">
                <button
                  onClick={() => handleStartExam(cert)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/20 py-2 text-xs font-bold text-purple-200 hover:bg-purple-500/30 hover:border-purple-400 transition-all shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>{isCertified ? 'Re-take Certification Exam' : 'Launch Practice Exam Simulation'}</span>
                </button>

                <a
                  href={cert.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2 text-xs font-semibold text-slate-200 hover:bg-white/20 hover:text-purple-300 transition-colors shadow-sm"
                >
                  <span>Official Exam Blueprint</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Practice Exam Simulator Modal */}
      {activeCertForExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-purple-500/40 bg-slate-950 p-6 shadow-2xl my-8">
            <button
              onClick={() => setActiveCertForExam(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">{activeCertForExam.name} ({activeCertForExam.code})</h3>
                <p className="text-xs text-slate-400">Certification Assessment Blueprint Simulation</p>
              </div>
            </div>

            {!examSubmitted ? (
              <div className="mt-6 space-y-6">
                {(CERT_PRACTICE_QUESTIONS[activeCertForExam.id] || CERT_PRACTICE_QUESTIONS['secplus']).map((q, idx) => (
                  <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                    <p className="text-xs font-mono text-purple-400 mb-1">Question {idx + 1}</p>
                    <p className="text-sm font-semibold text-slate-200">{q.question}</p>
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[q.id] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(q.id, oIdx)}
                            className={`w-full text-left rounded-lg p-3 text-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border border-purple-500/50 bg-purple-500/10 text-purple-300 font-medium'
                                : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <span>{opt}</span>
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-purple-400 bg-purple-400' : 'border-slate-700'
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

                <button
                  onClick={handleSubmitExam}
                  className="w-full rounded-xl bg-purple-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  Submit Certification Exam Simulation
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-6 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Certification Assessment Passed!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Congratulations! You have demonstrated mastery over the {activeCertForExam.code} blueprint domains. Your operator badge and +500 XP bonus have been awarded.
                </p>

                <button
                  onClick={() => setActiveCertForExam(null)}
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg"
                >
                  Return to Certification Hub
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
