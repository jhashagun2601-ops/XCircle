import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle2, RefreshCw } from 'lucide-react';

export const EmailVerificationBanner: React.FC = () => {
  const { user, sendVerificationEmail, refreshUserProfile, isDevPreview } = useAuth();
  const [resending, setResending] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);
  const [checking, setChecking] = useState(false);

  // If user is not logged in or is already verified or is in dev preview, do not display
  if (!user || user.emailVerified || isDevPreview) return null;

  const handleResend = async () => {
    setResending(true);
    try {
      await sendVerificationEmail();
      setSentNotice(true);
      setTimeout(() => setSentNotice(false), 5000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = async () => {
    setChecking(true);
    try {
      await refreshUserProfile();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-[#142238] border-b border-[#242831] px-4 py-2 text-xs text-[#F5F6F8]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Mail className="w-3.5 h-3.5 text-[#344B6B] shrink-0" />
          <span className="text-[#A7AFBC]">
            Please verify your email (<span className="text-[#F5F6F8] font-medium">{user.email}</span>) to unlock circle privileges.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {sentNotice ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sent to inbox!
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="px-2.5 py-1 bg-[#1B1E24] hover:bg-[#242831] border border-[#242831] rounded-md font-medium text-[11px] text-[#F5F6F8] transition-colors"
            >
              {resending ? 'Sending...' : 'Resend Verification'}
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={checking}
            className="px-2.5 py-1 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-md font-medium text-[11px] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};
