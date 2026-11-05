import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Mail, Lock, User, GraduationCap, Calendar, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SignUpScreenProps {
  onNavigate: (route: string) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigate }) => {
  const { signUpWithEmail, signInWithGoogle, enterDevPreview, isSupabaseConfigured, error, clearError } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [institution, setInstitution] = useState('');
  const [batch, setBatch] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setSuccessNotice(null);

    if (!displayName || !email || !password) {
      setLocalError('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        enterDevPreview(email, displayName, institution || 'DPS Noida', batch || 'Batch 2019');
        setSuccessNotice('Account profile initialized! Reconnecting you to your batch...');
        setTimeout(() => {
          onNavigate('/');
        }, 900);
        return;
      }

      await signUpWithEmail(
        email, 
        password, 
        displayName, 
        institution || 'DPS Noida', 
        batch || 'Batch 2019'
      );
      setSuccessNotice('Account registered successfully! A confirmation link has been sent to your email.');
      setTimeout(() => {
        onNavigate('/');
      }, 1500);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    clearError();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        enterDevPreview('adeeba2611@gmail.com', 'Adeeba', 'DPS Noida', 'Batch 2019');
        onNavigate('/');
        return;
      }
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-up could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101827] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#F5F6F8]">
          Create Your XCircle Profile
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#A7AFBC]">
          Join your school, college & alumni circles with peer verification
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl">
          {/* Real Google OAuth Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#242831] w-full" />
            <span className="bg-[#142238] px-3 text-[11px] uppercase tracking-wider text-[#A7AFBC] relative z-10 font-medium">
              or register with email
            </span>
          </div>

          {/* Success Notification */}
          {successNotice && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successNotice}</div>
            </div>
          )}

          {/* Error Notice */}
          {(localError || error) && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{localError || error}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Aastha Sharma"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                  School / College
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. DPS Noida"
                    className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                  Batch Year
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="e.g. Batch 2019"
                    className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>
            </div>

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
              <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Create Account & Join Batch'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Route to Sign In */}
          <div className="pt-2 text-center text-xs text-[#A7AFBC] border-t border-[#242831]">
            <span>Already have an XCircle account? </span>
            <button
              type="button"
              onClick={() => onNavigate('/signin')}
              className="text-[#F5F6F8] hover:underline font-medium ml-1"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
