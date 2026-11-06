import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SSO_ORGANIZATIONS } from '../../data/ssoOrganizations';
import { SsoOrganization } from '../../types';
import { Building2, ArrowRight, AlertCircle, X, Shield, Info, CheckCircle2 } from 'lucide-react';

interface SsoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SsoModal: React.FC<SsoModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { signInWithSSO } = useAuth();

  const [domainInput, setDomainInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDomainSubmit = async (domainToUse?: string) => {
    setErrorMessage(null);
    setSuccessNotice(null);

    const domain = (domainToUse || domainInput).trim().toLowerCase().replace(/^@/, '');
    if (!domain || !domain.includes('.')) {
      setErrorMessage('Please enter a valid organisation domain (e.g. mckinsey.com, du.ac.in, or google.com).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signInWithSSO(domain);
      setSuccessNotice(res.message);
      if (domain.includes('sandbox')) {
        setTimeout(() => {
          onClose();
          onNavigate('/');
        }, 900);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Organisation SSO identity provider could not be reached.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOrg = (org: SsoOrganization) => {
    setDomainInput(org.domain);
    if (!org.ssoConfigured) {
      setErrorMessage(`SSO integration for ${org.name} (${org.domain}) requires institutional SAML/OIDC identity provider credentials in Supabase Enterprise SSO.`);
      return;
    }
    handleDomainSubmit(org.domain);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
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
            <Building2 className="w-3 h-3 text-[#344B6B]" />
            Enterprise & Institutional Access
          </div>
          <h2 className="text-xl font-bold font-display text-[#F5F6F8]">
            Organisation Single Sign-On (SSO)
          </h2>
          <p className="text-xs text-[#A7AFBC] mt-1 leading-relaxed">
            Sign in with your verified company or university credentials through federated SAML 2.0 or OpenID Connect (OIDC).
          </p>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Identity Provider Notice</span>
            </div>
            <p className="leading-relaxed text-[11px]">{errorMessage}</p>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{successNotice}</div>
          </div>
        )}

        {/* Domain Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDomainSubmit();
          }}
          className="space-y-3 pt-1"
        >
          <div>
            <label className="block text-xs font-medium text-[#A7AFBC] uppercase tracking-wider mb-1.5">
              Enter Organisation Domain
            </label>
            <div className="relative">
              <span className="text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm">
                @
              </span>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="company.com or university.ac.in"
                required
                className="w-full pl-8 pr-3 py-2.5 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
              />
            </div>
            <p className="text-[11px] text-[#A7AFBC] mt-1">
              We'll look up your identity provider and redirect you to your organisation's portal.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !domainInput.trim()}
            className="w-full py-2.5 px-4 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-50 text-[#F5F6F8] font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Verifying Identity Provider...' : 'Continue to Organisation Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Supported Identity Directory */}
        <div className="pt-3 border-t border-[#242831] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A7AFBC]">
              Supported Institutional & Workplace IdPs
            </span>
            <span className="text-[10px] text-[#A7AFBC] flex items-center gap-1 font-mono">
              <Shield className="w-3 h-3 text-[#344B6B]" />
              SAML / OIDC
            </span>
          </div>

          <div className="space-y-2">
            {SSO_ORGANIZATIONS.map((org) => (
              <div
                key={org.id}
                onClick={() => handleSelectOrg(org)}
                className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  org.ssoConfigured
                    ? 'bg-[#1B1E24] border-[#344B6B]/40 hover:border-[#344B6B]'
                    : 'bg-[#1B1E24]/60 border-[#242831] hover:border-[#344B6B]/30'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F5F6F8] truncate">{org.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#101827] text-[#A7AFBC] border border-[#242831]">
                      {org.protocol}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A7AFBC] font-mono mt-0.5">@{org.domain}</p>
                </div>

                <div className="shrink-0 text-right">
                  {org.ssoConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ● Active Test IdP
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#101827] text-[#A7AFBC] border border-[#242831]">
                      Credentials Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#1B1E24] border border-[#242831] text-[11px] text-[#A7AFBC] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#344B6B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              To configure SAML 2.0 or OpenID Connect for your university or company domain, register the metadata URL in your Supabase Authentication &gt; SSO dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
