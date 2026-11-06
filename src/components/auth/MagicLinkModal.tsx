import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, X, Sparkles, Clock } from 'lucide-react';

interface MagicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const MagicLinkModal: React.FC<MagicLinkModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { signInWithMagicLink, enterDevPreview, isSupabaseConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [testLink, setTestLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSentMessage(null);
    setTestLink(null);

    const clean = email.trim();
    if (!clean || !clean.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signInWithMagicLink(clean);
      setSentMessage(res.message);
      if (res.testLink) {
        setTestLink(res.testLink);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send magic link. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateClick = () => {
    enterDevPreview(email || 'magiclink.user@alumni.edu', undefined, 'DPS Noida', 'Batch 2019');
    onClose();
    onNavigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-lg border border-[#242831] bg-[#1B1E24] transition-colors"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#344B6B]/20 text-[#A7AFBC] text-[11px] font-mono uppercase tracking-wider mb-2 border border-[#344B6B]/30">
            <Mail className="w-3 h-3 text-[#344B6B]" />
            Passwordless Authentication
          </div>
          <h2 className="text-xl font-bold font-display text-[#F5F6F8]">
            Sign in with Magic Link
          </h2>
          <p className="text-xs text-[#A7AFBC] mt-1 leading-relaxed">
            Enter your email address and we'll send a secure, one-time login link directly to your inbox.
          </p>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Success / Sent notice */}
        {sentMessage ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-[#F5F6F8] font-display">
                Check Your Inbox
              </h3>
              <p className="text-xs text-[#A7AFBC] leading-relaxed">
                {sentMessage}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#A7AFBC] pt-1">
                <Clock className="w-3.5 h-3.5 text-[#344B6B]" />
                <span>Link expires in 15 minutes</span>
              </div>
            </div>

            {/* Test Simulation Button in dev / preview mode */}
            {(!isSupabaseConfigured || testLink) && (
              <div className="p-3.5 rounded-lg bg-[#1B1E24] border border-[#242831] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#F5F6F8]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#344B6B]" />
                    <span>Instant Link Simulator</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#344B6B]/20 text-[#A7AFBC]">
                    DEV PREVIEW
                  </span>
                </div>
                <p className="text-[11px] text-[#A7AFBC] leading-relaxed">
                  In this preview environment, you can test the magic-link authentication callback directly without opening an email client.
                </p>
                <button
                  type="button"
                  onClick={handleSimulateClick}
                  className="w-full py-2 px-3 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Simulate Magic Link Click & Enter XCircle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setSentMessage(null);
                setTestLink(null);
              }}
              className="w-full py-2 text-xs text-[#A7AFBC] hover:text-[#F5F6F8] underline text-center"
            >
              Use a different email address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@alumni.edu"
                  required
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-50 text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Sending link...' : 'Send Magic Login Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
