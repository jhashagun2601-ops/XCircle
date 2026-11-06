import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { SupabaseSetupModal } from './SupabaseSetupModal';
import { MagicLinkModal } from './MagicLinkModal';
import { SsoModal } from './SsoModal';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Database,
  Info
} from 'lucide-react';

interface SignInScreenProps {
  onNavigate: (route: string) => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onNavigate }) => {
  const { 
    signInWithEmail, 
    signInWithGoogle, 
    enterDevPreview, 
    isSupabaseConfigured, 
    error, 
    clearError 
  } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Modals
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [showSsoModal, setShowSsoModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        handleDevPreview(email);
        return;
      }
      await signInWithEmail(email, password);
      onNavigate('/');
    } catch (err: any) {
      setLocalError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        handleDevPreview('adeeba2611@gmail.com');
        return;
      }
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevPreview = (customEmail?: string) => {
    clearError();
    setLocalError(null);
    enterDevPreview(customEmail || email || undefined);
    onNavigate('/');
  };

  return (
    <div className="min-h-screen bg-[#101827] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#344B6B]">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#F5F6F8]">
          Sign In to XCircle
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#A7AFBC]">
          Reconnect with verified school classmates, alumni, and former colleagues
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl">
          
          {/* Instant Access Mode (Dev / Preview Banner) */}
          {(!isSupabaseConfigured || import.meta.env.DEV) && (
            <div className="p-3.5 rounded-lg bg-[#1B1E24] border border-[#242831] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#344B6B]" />
                  <span className="text-xs font-semibold text-[#F5F6F8]">
                    {!isSupabaseConfigured ? 'Instant Access Mode' : 'Development Preview Access'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#344B6B]/20 text-[#A7AFBC] border border-[#344B6B]/30">
                  {!isSupabaseConfigured ? 'PREVIEW MODE' : 'DEV ONLY'}
                </span>
              </div>
              <p className="text-[11px] text-[#A7AFBC] leading-relaxed">
                {!isSupabaseConfigured
                  ? 'Supabase credentials are not connected in .env yet. Click below to enter and explore all XCircle features immediately.'
                  : 'Test and interact with all application screens without live OAuth credentials.'}
              </p>
              <button
                type="button"
                onClick={() => handleDevPreview()}
                className="w-full py-2 px-3 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{email ? `Launch Preview as ${email}` : 'Launch Verified Alumni Preview'}</span>
              </button>
            </div>
          )}

          {/* =========================================================================
              SECTION 1: THREE CLEARLY VISIBLE PRIMARY AUTHENTICATION OPTIONS
              ========================================================================= */}
          <div className="space-y-2.5">
            {/* Option 1: Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#1B1E24] hover:bg-[#242831] text-[#F5F6F8] border border-[#242831] hover:border-[#344B6B] font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Option 2: Continue with Magic Link */}
            <button
              type="button"
              onClick={() => setShowMagicLinkModal(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#1B1E24] hover:bg-[#242831] text-[#F5F6F8] border border-[#242831] hover:border-[#344B6B] font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-[#344B6B] shrink-0" />
              <span>Continue with Magic Link</span>
            </button>

            {/* Option 3: Organisation SSO */}
            <button
              type="button"
              onClick={() => setShowSsoModal(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#1B1E24] hover:bg-[#242831] text-[#F5F6F8] border border-[#242831] hover:border-[#344B6B] font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors"
            >
              <Building2 className="w-4 h-4 text-[#344B6B] shrink-0" />
              <span>Organisation SSO</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#242831] w-full" />
            <span className="bg-[#142238] px-3 text-[11px] uppercase tracking-wider text-[#A7AFBC] relative z-10 font-medium">
              or sign in with password
            </span>
          </div>

          {/* Diagnostic Error Notice */}
          {(localError || error) && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-1">
              <div className="flex items-center gap-2 font-medium text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Authentication Notice</span>
              </div>
              <p className="leading-relaxed text-[11px]">{localError || error}</p>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@alumni.edu"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-xs text-[#A7AFBC] hover:text-[#F5F6F8] hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7AFBC] hover:text-[#F5F6F8]"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Supabase status notice if not yet configured */}
          {!isSupabaseConfigured && (
            <div className="p-3 rounded-lg bg-[#1B1E24] border border-[#242831] text-xs text-[#A7AFBC] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[#F5F6F8] font-medium text-[11px]">
                <Info className="w-3.5 h-3.5 text-[#344B6B] shrink-0" />
                <span>Live Supabase Database Setup</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSetupModal(true)}
                className="px-2.5 py-1 rounded bg-[#242831] hover:bg-[#344B6B]/40 text-[#F5F6F8] font-medium text-[11px] transition-colors border border-[#344B6B]/30 flex items-center gap-1 shrink-0"
              >
                <Database className="w-3 h-3 text-[#344B6B]" />
                <span>Configure .env</span>
              </button>
            </div>
          )}

          {/* Route to Sign Up */}
          <div className="pt-2 text-center text-xs text-[#A7AFBC] border-t border-[#242831]">
            <span>Don't have an account yet? </span>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="text-[#F5F6F8] hover:underline font-medium ml-1"
            >
              Sign up & find your batch
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <MagicLinkModal
        isOpen={showMagicLinkModal}
        onClose={() => setShowMagicLinkModal(false)}
        onNavigate={onNavigate}
      />

      <SsoModal
        isOpen={showSsoModal}
        onClose={() => setShowSsoModal(false)}
        onNavigate={onNavigate}
      />

      <SupabaseSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </div>
  );
};
