import React, { useState } from 'react';
import { Lock, Download, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { deleteAccountPermanently, getStoredToken } from '../services/api';

interface PrivacyViewProps {
  onAccountDeleted: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onAccountDeleted }) => {
  const [downloading, setDownloading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExportData = async () => {
    try {
      setDownloading(true);
      const token = getStoredToken();
      const res = await fetch('/api/v1/privacy/export', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cybermentor-gdpr-telemetry-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message || 'Failed to download GDPR export');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteAccountPermanently();
      alert('Your account and all associated telemetry records have been purged.');
      onAccountDeleted();
    } catch (err: any) {
      alert(err.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">GDPR Compliance & Security Architecture</h2>
        <p className="text-xs text-slate-400">
          Operator privacy rights, cryptographic integrity, and data sovereignty controls.
        </p>
      </div>

      {/* Security Architecture Guarantees */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Cryptographic Security Standards</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <h4 className="font-mono font-semibold text-emerald-400">PBKDF2 Password Hashing</h4>
            <p className="mt-1 text-slate-400 leading-relaxed">
              Passwords undergo 600,000 iterations of SHA-256 with unique cryptographically random salts per OWASP guidelines.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <h4 className="font-mono font-semibold text-cyan-400">Constant-Time Verification</h4>
            <p className="mt-1 text-slate-400 leading-relaxed">
              Lab flags and session tokens use timingSafeEqual to eliminate side-channel timing attack vectors.
            </p>
          </div>
        </div>
      </div>

      {/* GDPR Data Export (Article 20) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-100">
            Export Telemetry Data (GDPR Article 20)
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Download your comprehensive, machine-readable JSON data archive including lesson completions, topic masteries, quiz attempts, and private notes.
          </p>
        </div>
        <button
          disabled={downloading}
          onClick={handleExportData}
          className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors shadow-md"
        >
          <Download className="h-4 w-4" />
          <span>{downloading ? 'Compiling Archive...' : 'Download JSON Export'}</span>
        </button>
      </div>

      {/* Right to Erasure (Article 17) */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Permanent Account Erasure (GDPR Article 17)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Invoking your Right to Erasure cascades through all database tables to immediately purge your credentials, streak telemetry, lab solutions, and private notes. This action is irreversible.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            Request Irreversible Data Erasure
          </button>
        ) : (
          <div className="rounded-xl border border-rose-500/40 bg-slate-950 p-4 space-y-3">
            <p className="text-xs font-semibold text-rose-400">
              ⚠️ Are you absolutely sure? All cryptographic progress, level badges, and RAG notes will be permanently destroyed.
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="rounded-lg bg-rose-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-rose-400 transition-colors"
              >
                {deleting ? 'Purging Telemetry...' : 'Yes, Delete Everything'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
