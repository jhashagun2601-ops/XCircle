import { SsoOrganization } from '../types';

export const SSO_ORGANIZATIONS: SsoOrganization[] = [
  {
    id: 'sso_google',
    name: 'Google & Alphabet Workforce',
    domain: 'google.com',
    protocol: 'oidc',
    ssoConfigured: false,
    notes: 'Google Workspace Enterprise SAML/OIDC requires admin-granted client credentials in Supabase Enterprise SSO.',
  },
  {
    id: 'sso_du',
    name: 'Delhi University Identity Provider',
    domain: 'du.ac.in',
    protocol: 'saml',
    ssoConfigured: false,
    notes: 'National Academic Depository & University Shibboleth/SAML IdP.',
  },
  {
    id: 'sso_bits',
    name: 'BITS Pilani Alumni SSO',
    domain: 'alumni.bits-pilani.ac.in',
    protocol: 'oidc',
    ssoConfigured: false,
    notes: 'OIDC Federation for BITS Alumni Directory.',
  },
  {
    id: 'sso_iitd',
    name: 'IIT Delhi Enterprise Federation',
    domain: 'iitd.ac.in',
    protocol: 'saml',
    ssoConfigured: false,
    notes: 'IIT Delhi CAS/SAML institutional login.',
  },
  {
    id: 'sso_mckinsey',
    name: 'McKinsey & Company Alumni Portal',
    domain: 'mckinsey.com',
    protocol: 'saml',
    ssoConfigured: false,
    notes: 'Corporate Okta SAML 2.0 Integration.',
  },
  {
    id: 'sso_demo_sandbox',
    name: 'XCircle Sandbox Identity Provider (Testing)',
    domain: 'sandbox.xcircle.org',
    protocol: 'oidc',
    ssoConfigured: true,
    notes: 'Pre-configured developer sandbox IdP for validating SSO login flows.',
  },
];
