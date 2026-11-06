import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { COUNTRIES, DEFAULT_COUNTRY } from '../../data/countries';
import { Logo } from '../common/Logo';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Building2, 
  Home, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

interface SignUpScreenProps {
  onNavigate: (route: string) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigate }) => {
  const { 
    signUpWithEmail, 
    signInWithGoogle, 
    sendPhoneOtp, 
    verifyPhoneOtp, 
    clearError, 
    error 
  } = useAuth();

  // Wizard Step: 1 = Basic Info & Password, 2 = Phone & OTP Verification, 3 = Batch & Community Affiliation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: User & Password
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Country & Phone OTP
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [testOtpNotice, setTestOtpNotice] = useState<string | null>(null);

  // Step 3: Batch & Academic Year
  const [batch, setBatch] = useState('');
  const [academicYear, setAcademicYear] = useState('2019');
  const [institution, setInstitution] = useState('');
  const [employer, setEmployer] = useState('');
  const [apartmentCommunity, setApartmentCommunity] = useState('');

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Phone input: strictly 10 digits, numbers only, no 11th digit allowed
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digitsOnly);
    if (isPhoneVerified) {
      setIsPhoneVerified(false);
      setIsOtpSent(false);
    }
  };

  // Password strength validation
  const getPasswordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: 'Empty', color: 'bg-zinc-700' };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, label: 'Moderate', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  // Advance from Step 1 to Step 2
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!displayName.trim() || !email.trim() || !password) {
      setLocalError('Please complete all required fields in this step.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    setCurrentStep(2);
  };

  // Send Phone OTP
  const handleSendOtp = async () => {
    setLocalError(null);
    setSuccessNotice(null);
    setTestOtpNotice(null);

    if (phoneNumber.length !== 10) {
      setLocalError('Please enter exactly 10 digits for your local mobile number.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await sendPhoneOtp(selectedCountry.dialCode, phoneNumber);
      setIsOtpSent(true);
      setCooldown(res.cooldown || 30);
      setSuccessNotice(res.message);
      if (res.testOtp) {
        setTestOtpNotice(res.testOtp);
        setOtpCode(res.testOtp);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Could not send verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyOtp = async () => {
    setLocalError(null);
    setSuccessNotice(null);

    if (otpCode.length !== 6) {
      setLocalError('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const verified = await verifyPhoneOtp(phoneNumber, otpCode);
      if (verified) {
        setIsPhoneVerified(true);
        setSuccessNotice('Phone number verified successfully!');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Advance from Step 2 to Step 3
  const handleStep2Next = () => {
    setLocalError(null);
    if (!isPhoneVerified) {
      setLocalError('Please verify your phone number via OTP to continue.');
      return;
    }
    setCurrentStep(3);
  };

  // Final Submission on Step 3
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setSuccessNotice(null);

    if (!batch.trim()) {
      setLocalError('Please provide your batch number or batch name (e.g. Batch 2019).');
      return;
    }

    if (!academicYear.trim()) {
      setLocalError('Please provide your academic or joining year (e.g. 2019).');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUpWithEmail(
        email.trim(),
        password,
        displayName.trim(),
        selectedCountry.dialCode,
        phoneNumber,
        batch.trim(),
        academicYear.trim(),
        employer.trim() || undefined,
        apartmentCommunity.trim() || undefined,
        institution.trim() || 'DPS Noida'
      );

      setSuccessNotice('Registration complete! Reconnecting you to your batch...');
      setTimeout(() => {
        onNavigate('/');
      }, 1000);
    } catch (err: any) {
      setLocalError(err.message || 'Could not complete registration.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    clearError();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      // If user profile is incomplete, app will guide them through complete profile
    } catch (err: any) {
      setLocalError(err.message || 'Google registration could not be completed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101827] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#344B6B]">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#F5F6F8]">
          Join XCircle Community
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#A7AFBC]">
          Verified circles for your schools, colleges, employers & local societies
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl">
          
          {/* Step Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F5F6F8] font-semibold">
                Step {currentStep} of 3: {currentStep === 1 ? 'Account Setup' : currentStep === 2 ? 'Phone Verification' : 'Batch & Circles'}
              </span>
              <span className="text-[#A7AFBC]">{currentStep * 33}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1B1E24] rounded-full overflow-hidden border border-[#242831]">
              <div
                className="h-full bg-[#344B6B] transition-all duration-300 rounded-full"
                style={{ width: `${currentStep * 33.33}%` }}
              />
            </div>
          </div>

          {/* Google Sign-in on Step 1 */}
          {currentStep === 1 && (
            <>
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
                  <span>Sign up with Google</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#242831] w-full" />
                <span className="bg-[#142238] px-3 text-[11px] uppercase tracking-wider text-[#A7AFBC] relative z-10 font-medium">
                  or register with email
                </span>
              </div>
            </>
          )}

          {/* Error Notice */}
          {(localError || error) && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{localError || error}</div>
            </div>
          )}

          {/* Success Notice */}
          {successNotice && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{successNotice}</div>
            </div>
          )}

          {/* =========================================================================
              STEP 1: Basic Information & Password
              ========================================================================= */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-3.5">
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
                    autoFocus
                    className="w-full pl-9 pr-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
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
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-9 pr-10 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7AFBC] hover:text-[#F5F6F8]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#A7AFBC]">Strength: <strong className="text-white">{strength.label}</strong></span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`w-4 h-1 rounded-full ${
                            lvl <= strength.score ? strength.color : 'bg-[#242831]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full pl-9 pr-10 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7AFBC] hover:text-[#F5F6F8]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`text-[10px] font-mono mt-1 ${password === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Phone Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* =========================================================================
              STEP 2: Country Selection, 10-Digit Phone & OTP Verification
              ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#344B6B]" />
                    <span>Phone Number Verification</span>
                  </label>
                  {isPhoneVerified && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Country Selector & 10-digit input */}
                <div className="flex gap-2">
                  <div className="w-28 shrink-0">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const c = COUNTRIES.find(x => x.code === e.target.value) || DEFAULT_COUNTRY;
                        setSelectedCountry(c);
                      }}
                      disabled={isPhoneVerified}
                      className="w-full px-2.5 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs text-[#F5F6F8] focus:outline-none focus:border-[#344B6B] truncate"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.dialCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      disabled={isPhoneVerified}
                      maxLength={10}
                      placeholder="10-digit number"
                      autoFocus
                      className="w-full px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] font-mono placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#A7AFBC]">
                      {phoneNumber.length}/10
                    </span>
                  </div>

                  {!isPhoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || phoneNumber.length !== 10 || cooldown > 0}
                      className="px-3 py-2 bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-40 text-[#F5F6F8] text-xs font-medium rounded-lg transition-colors shrink-0"
                    >
                      {isSendingOtp ? 'Sending...' : cooldown > 0 ? `${cooldown}s` : isOtpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#A7AFBC] mt-1">
                  Enter exactly 10 digits. The country calling code ({selectedCountry.dialCode}) is selected separately.
                </p>
              </div>

              {/* OTP Input Card */}
              {isOtpSent && !isPhoneVerified && (
                <div className="p-3.5 rounded-lg bg-[#1B1E24] border border-[#242831] space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AFBC]">Enter 6-digit OTP code</span>
                    {testOtpNotice && (
                      <span className="font-mono text-[11px] text-amber-300">
                        Code: <strong className="text-white">{testOtpNotice}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      placeholder="••••••"
                      className="flex-1 px-3 py-2 bg-[#142238] border border-[#242831] rounded-lg text-sm font-mono tracking-widest text-[#F5F6F8] focus:outline-none focus:border-[#344B6B] text-center"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || otpCode.length !== 6}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1"
                    >
                      <span>{isVerifyingOtp ? 'Verifying...' : 'Verify'}</span>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {cooldown > 0 && (
                    <p className="text-[10px] text-[#A7AFBC] flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-[#344B6B]" />
                      <span>Resend available in {cooldown} seconds</span>
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3.5 py-2.5 rounded-lg bg-[#1B1E24] text-[#A7AFBC] hover:text-[#F5F6F8] border border-[#242831] text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleStep2Next}
                  disabled={!isPhoneVerified}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-40 text-[#F5F6F8] font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Batch Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: Batch Number & Academic / Joining Year
              ========================================================================= */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#344B6B]" />
                    <span>Batch Number or Name</span>
                  </label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="e.g. Batch 2019"
                    required
                    autoFocus
                    className="w-full px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#344B6B]" />
                    <span>Academic or Joining Year</span>
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2019"
                    required
                    className="w-full px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#344B6B]" />
                  <span>Primary School or College</span>
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. DPS Noida or Delhi University"
                  required
                  className="w-full px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              {/* Optional Employer & Apartment affiliations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#344B6B]" />
                    <span>Company / Workplace (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    placeholder="e.g. Google or FinTech Clan"
                    className="w-full px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Home className="w-3 h-3 text-[#344B6B]" />
                    <span>Apartment Society (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={apartmentCommunity}
                    onChange={(e) => setApartmentCommunity(e.target.value)}
                    placeholder="e.g. Pavilion Greens, Sec 137"
                    className="w-full px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-2.5 rounded-lg bg-[#1B1E24] text-[#A7AFBC] hover:text-[#F5F6F8] border border-[#242831] text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-50 text-[#F5F6F8] font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration & Join Circles'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

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
