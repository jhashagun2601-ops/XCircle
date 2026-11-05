import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigate: (route: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const { sendPasswordReset, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email) {
      setLocalError('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setLocalError(err.message || 'Unable to send password reset email. Check if the address is registered.');
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
          Reset Your Password
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#A7AFBC]">
          Enter your registered email to receive a secure recovery link
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F5F6F8] font-display">
                Reset Link Sent
              </h3>
              <p className="text-xs text-[#A7AFBC] leading-relaxed">
                We've sent a password recovery link to <span className="font-semibold text-[#F5F6F8]">{email}</span>. Click the link in the email to set a new password.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/signin')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(localError || error) && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{localError || error}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                  Registered Email Address
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Sending link...' : 'Send Recovery Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('/signin')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
