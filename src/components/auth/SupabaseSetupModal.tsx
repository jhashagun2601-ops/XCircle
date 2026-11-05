import React, { useState } from 'react';
import { saveSupabaseCredentials } from '../../lib/supabase';
import { Database, KeyRound, ExternalLink, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (!cleanUrl || !cleanKey) {
      setError('Please provide both your Supabase Project URL and Public Anon Key.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setError('Project URL must start with https://');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveSupabaseCredentials(cleanUrl, cleanKey);
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#142238] border border-[#242831] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-lg hover:bg-[#1B1E24] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#344B6B]/20 border border-[#344B6B]/40 flex items-center justify-center text-[#F5F6F8]">
            <Database className="w-5 h-5 text-[#344B6B]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#F5F6F8] font-display">
              Connect Supabase
            </h3>
            <p className="text-xs text-[#A7AFBC]">
              Enter your live project credentials to activate real authentication
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-semibold text-[#F5F6F8]">Credentials Saved!</h4>
            <p className="text-xs text-[#A7AFBC]">
              Reloading XCircle with live Supabase authentication...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                Supabase Project URL
              </label>
              <div className="relative">
                <Database className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>
              <p className="text-[11px] text-[#A7AFBC]/70 mt-1">
                Found in Supabase Dashboard → Project Settings → API → Project URL
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                Publishable / Anon Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>
              <p className="text-[11px] text-[#A7AFBC]/70 mt-1">
                Found in Supabase Dashboard → Project Settings → API → Project API Keys (anon / public)
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8] transition-colors"
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save & Connect</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
