import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Logo } from '../common/Logo';
import { CheckCircle2, AlertCircle, ArrowRight, Lock, Loader2 } from 'lucide-react';

interface AuthCallbackScreenProps {
  onNavigate: (route: string) => void;
}

export const AuthCallbackScreen: React.FC<AuthCallbackScreenProps> = ({ onNavigate }) => {
  const { confirmPasswordResetCode, refreshUserProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New password state for recovery mode
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

        const errorDesc = searchParams.get('error_description') || hashParams.get('error_description');
        if (errorDesc) {
          setErrorMessage(decodeURIComponent(errorDesc));
          setLoading(false);
          return;
        }

        const type = searchParams.get('type') || hashParams.get('type');
        if (type === 'recovery') {
          setIsRecovery(true);
          setLoading(false);
          return;
        }

        // Supabase v2 PKCE Code Exchange
        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('PKCE exchange notice:', exchangeError);
          }
        }

        await refreshUserProfile();
        setStatusMessage('Authentication session verified. Returning to circles...');

        // If this screen was loaded inside an OAuth popup window, notify the opener and close
        if (window.opener) {
          try {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
          } catch (e) {
            // cross-origin opener
          }
          setTimeout(() => {
            window.close();
          }, 600);
          return;
        }

        setTimeout(() => {
          onNavigate('/');
        }, 1200);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error completing authentication callback.');
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, []);

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsResetting(true);
    setErrorMessage(null);
    try {
      await confirmPasswordResetCode(newPassword);
      setResetSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password. Link may have expired.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101827] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl font-bold font-display tracking-tight text-[#F5F6F8]">
          XCircle Authentication
        </h2>
        <p className="text-xs text-[#A7AFBC] mt-1">Connecting your verified circles and alumni network</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-5 text-center shadow-xl">
          {loading ? (
            <div className="py-8 space-y-3">
              <Loader2 className="w-8 h-8 text-[#344B6B] animate-spin mx-auto stroke-[2.5]" />
              <p className="text-sm font-medium text-[#A7AFBC]">Finalizing authentication...</p>
            </div>
          ) : isRecovery ? (
            resetSuccess ? (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F5F6F8] font-display">
                  Password Updated
                </h3>
                <p className="text-xs text-[#A7AFBC]">
                  Your credentials have been securely updated. You can now access your circles.
                </p>
                <button
                  onClick={() => onNavigate('/signin')}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-left">
                <h3 className="text-lg font-semibold text-[#F5F6F8] font-display text-center">
                  Set New Password
                </h3>
                
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">{errorMessage}</div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-50 text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isResetting ? 'Saving password...' : 'Update Password'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )
          ) : (
            <div className="space-y-4">
              {errorMessage ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-rose-400 stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F5F6F8] font-display">Authentication Notice</h3>
                  <p className="text-xs text-[#A7AFBC]">{errorMessage}</p>
                  <button
                    onClick={() => onNavigate('/signin')}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors"
                  >
                    Go to Sign In
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F5F6F8] font-display">Session Verified</h3>
                  <p className="text-xs text-[#A7AFBC]">
                    {statusMessage || 'Returning to your active circle...'}
                  </p>
                  <button
                    onClick={() => onNavigate('/')}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Enter XCircle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
