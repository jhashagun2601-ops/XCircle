import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { COUNTRIES, DEFAULT_COUNTRY } from '../../data/countries';
import { Logo } from '../common/Logo';
import { 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Home, 
  GraduationCap, 
  RefreshCw 
} from 'lucide-react';

interface CompleteProfileScreenProps {
  onNavigate: (route: string) => void;
}

export const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({ onNavigate }) => {
  const { 
    user, 
    profile, 
    sendPhoneOtp, 
    verifyPhoneOtp, 
    completeRegistrationProfile 
  } = useAuth();

  // Country & 10-digit Phone state
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [testOtpNotice, setTestOtpNotice] = useState<string | null>(null);

  // Batch & Year state
  const [batch, setBatch] = useState(profile?.batch || '');
  const [academicYear, setAcademicYear] = useState(profile?.academicYear || '2019');
  const [institution, setInstitution] = useState(profile?.institution || 'DPS Noida');
  const [employer, setEmployer] = useState(profile?.employer || '');
  const [apartmentCommunity, setApartmentCommunity] = useState(profile?.apartmentCommunity || '');

  // Loading & error handling
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Strict 10-digit enforcement: no 11th digit allowed, numbers only
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digitsOnly);
    // If phone number changes after OTP sent, reset verification
    if (isPhoneVerified) {
      setIsPhoneVerified(false);
      setIsOtpSent(false);
    }
  };

  const handleSendOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setTestOtpNotice(null);

    if (phoneNumber.length !== 10) {
      setErrorMessage('Please enter exactly 10 digits for your local phone number.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await sendPhoneOtp(selectedCountry.dialCode, phoneNumber);
      setIsOtpSent(true);
      setCooldown(res.cooldown || 30);
      setSuccessMessage(res.message);
      if (res.testOtp) {
        setTestOtpNotice(res.testOtp);
        // Pre-fill for ease of testing in preview
        setOtpCode(res.testOtp);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send OTP to this number. Please verify details.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const ok = await verifyPhoneOtp(phoneNumber, otpCode);
      if (ok) {
        setIsPhoneVerified(true);
        setSuccessMessage('Phone number verified successfully!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isPhoneVerified) {
      setErrorMessage('Please complete phone OTP verification before continuing.');
      return;
    }

    if (!batch.trim()) {
      setErrorMessage('Please provide your batch number or batch name (e.g. Batch 2019).');
      return;
    }

    if (!academicYear.trim()) {
      setErrorMessage('Please provide your academic or joining year (e.g. 2019).');
      return;
    }

    setIsSavingProfile(true);
    try {
      await completeRegistrationProfile({
        phoneNumber,
        countryCode: selectedCountry.dialCode,
        batch: batch.trim(),
        academicYear: academicYear.trim(),
        institution: institution.trim() || 'DPS Noida',
        employer: employer.trim() || undefined,
        apartmentCommunity: apartmentCommunity.trim() || undefined,
      });

      setSuccessMessage('Profile completed! Reconnecting to your circles...');
      setTimeout(() => {
        onNavigate('/');
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save profile details.');
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101827] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#344B6B]/20 text-[#A7AFBC] text-xs font-mono mb-2 border border-[#344B6B]/30">
          <Sparkles className="w-3 h-3 text-[#344B6B]" />
          Step 2 of 2: Profile Completion
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#F5F6F8]">
          Welcome, {user?.displayName || 'Alumni Member'}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#A7AFBC]">
          Complete your verified identity to unlock your Academic, Employer, and Local Circles
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl">
          {/* User authenticated badge */}
          <div className="p-3 rounded-lg bg-[#1B1E24] border border-[#242831] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 truncate">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-7 h-7 rounded-md object-cover border border-[#242831]" />
              ) : (
                <div className="w-7 h-7 rounded-md bg-[#344B6B] flex items-center justify-center font-bold text-[#F5F6F8]">
                  {user?.displayName?.[0] || 'A'}
                </div>
              )}
              <div className="truncate">
                <p className="font-semibold text-[#F5F6F8] truncate">{user?.displayName || 'Verified Account'}</p>
                <p className="text-[#A7AFBC] text-[11px] font-mono truncate">{user?.email}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Authenticated
            </span>
          </div>

          {/* Diagnostic Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success notice */}
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* SECTION 1: Phone Verification */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#F5F6F8] uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#344B6B]" />
                <span>Phone Number & OTP Verification</span>
              </label>
              {isPhoneVerified && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            {/* Country Selector + Exactly 10 digits input */}
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
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.dialCode}
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
                  placeholder="10-digit mobile number"
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

            {/* OTP Code Input */}
            {isOtpSent && !isPhoneVerified && (
              <div className="p-3.5 rounded-lg bg-[#1B1E24] border border-[#242831] space-y-2.5">
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
                    <CheckCircle2 className="w-3.5 h-3.5" />
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
          </div>

          {/* SECTION 2: Batch, Academic Year, and Community Affiliations */}
          <form onSubmit={handleFinalSubmit} className="space-y-3.5 pt-2 border-t border-[#242831]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-[#344B6B]" />
                  <span>Batch Name / Number</span>
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. Batch 2019"
                  required
                  className="w-full px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#344B6B]" />
                  <span>Academic / Joining Year</span>
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
                <GraduationCap className="w-3 h-3 text-[#344B6B]" />
                <span>Primary School or University</span>
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

            {/* Optional Community Affiliations: Employer & Apartment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#344B6B]" />
                  <span>Employer / Workplace (Optional)</span>
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

            <button
              type="submit"
              disabled={isSavingProfile || !isPhoneVerified}
              className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-50 text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>{isSavingProfile ? 'Saving & Finalizing...' : 'Save Profile & Enter XCircle'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
