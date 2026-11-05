import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  uid: string; // compatibility
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  institution: string;
  batch: string;
  location: string;
  bio: string;
  trustScore: number;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  isDevPreview?: boolean;
}

export function formatAuthError(error: any): string {
  if (!error) return '';
  const message = error.message || String(error);
  
  if (message.includes('Invalid login credentials')) {
    return 'Incorrect email or password. Please verify your details.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Your email has not been verified yet. Please check your inbox for the confirmation link.';
  }
  if (message.includes('User already registered')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (!isSupabaseConfigured) {
    return 'Supabase is not yet configured with valid credentials in .env (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Please add your Supabase credentials or use Development Preview Access.';
  }
  return message;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isSupabaseConfigured: boolean;
  isDevPreview: boolean;
  clearError: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string, institution: string, batch: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  enterDevPreview: (customEmail?: string, customName?: string, institution?: string, batch?: string) => void;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  confirmPasswordResetCode: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDevPreview, setIsDevPreview] = useState<boolean>(false);

  const clearError = () => setError(null);

  // Helper to construct AuthUser from Supabase User
  const mapSupabaseUser = (sbUser: SupabaseUser): AuthUser => {
    return {
      id: sbUser.id,
      uid: sbUser.id,
      email: sbUser.email ?? null,
      displayName: (sbUser.user_metadata?.displayName || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0]) ?? null,
      photoURL: sbUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${sbUser.id}`,
      emailVerified: Boolean(sbUser.email_confirmed_at),
    };
  };

  // Build profile from user metadata or persistent local storage
  const buildProfileFromUser = (sbUser: SupabaseUser, extra?: { displayName?: string; institution?: string; batch?: string }): UserProfile => {
    const meta = sbUser.user_metadata || {};
    const storageKey = `xcircle_profile_${sbUser.id}`;
    const cached = localStorage.getItem(storageKey);
    let parsedCached: Partial<UserProfile> = {};
    if (cached) {
      try {
        parsedCached = JSON.parse(cached);
      } catch (e) {
        // ignore
      }
    }

    const constructed: UserProfile = {
      uid: sbUser.id,
      email: sbUser.email || '',
      displayName: extra?.displayName || meta.displayName || meta.full_name || parsedCached.displayName || 'Alumni Member',
      avatar: meta.avatar_url || parsedCached.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${sbUser.id}`,
      institution: extra?.institution || meta.institution || parsedCached.institution || 'DPS Noida',
      batch: extra?.batch || meta.batch || parsedCached.batch || 'Batch 2019',
      location: meta.location || parsedCached.location || 'New Delhi / NCR',
      bio: meta.bio || parsedCached.bio || 'Reconnecting with batch friends and alumni on XCircle',
      trustScore: parsedCached.trustScore || 88,
      emailVerified: Boolean(sbUser.email_confirmed_at),
      createdAt: sbUser.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDevPreview: false,
    };

    localStorage.setItem(storageKey, JSON.stringify(constructed));
    return constructed;
  };

  // Preview mode (active when Supabase credentials are pending or in testing)
  const enterDevPreview = (
    customEmail?: string,
    customName?: string,
    institution?: string,
    batch?: string
  ) => {
    const cachedProfile = localStorage.getItem('xcircle_dev_preview_profile');
    let saved: Partial<UserProfile> = {};
    if (cachedProfile) {
      try {
        saved = JSON.parse(cachedProfile);
      } catch (e) {
        // ignore
      }
    }

    const email = customEmail || saved.email || 'adeeba2611@gmail.com';
    const displayName = customName || saved.displayName || (customEmail ? customEmail.split('@')[0] : 'Adeeba');
    const userInstitution = institution || saved.institution || 'DPS Noida';
    const userBatch = batch || saved.batch || 'Batch 2019';

    const devProfile: UserProfile = {
      uid: 'dev_preview_user',
      email,
      displayName,
      avatar: saved.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      institution: userInstitution,
      batch: userBatch,
      location: saved.location || 'New Delhi / NCR',
      bio: saved.bio || `${userInstitution} ${userBatch} · Reconnecting with school batch and alumni on XCircle`,
      trustScore: saved.trustScore || 92,
      emailVerified: true,
      createdAt: saved.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDevPreview: true,
    };

    setProfile(devProfile);
    setUser({
      id: devProfile.uid,
      uid: devProfile.uid,
      email: devProfile.email,
      displayName: devProfile.displayName,
      photoURL: devProfile.avatar,
      emailVerified: true,
    });
    setIsDevPreview(true);
    localStorage.setItem('xcircle_dev_preview_active', 'true');
    localStorage.setItem('xcircle_dev_preview_profile', JSON.stringify(devProfile));
    setError(null);
  };

  // Listen to Supabase Auth State changes & manage session persistence
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const wasDevActive = localStorage.getItem('xcircle_dev_preview_active') === 'true';
      if (wasDevActive) {
        enterDevPreview();
      }
      setLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setUser(mapped);
        const p = buildProfileFromUser(session.user);
        setProfile(p);
        setIsDevPreview(false);
      } else if (localStorage.getItem('xcircle_dev_preview_active') === 'true') {
        enterDevPreview();
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }).catch(err => {
      console.warn('Supabase getSession notice:', err);
      if (localStorage.getItem('xcircle_dev_preview_active') === 'true') {
        enterDevPreview();
      }
      setLoading(false);
    });

    // 2. Auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setUser(mapped);
        const p = buildProfileFromUser(session.user);
        setProfile(p);
        setIsDevPreview(false);
        localStorage.removeItem('xcircle_dev_preview_active');
      } else {
        if (!localStorage.getItem('xcircle_dev_preview_active')) {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const refreshUserProfile = async () => {
    if (!isSupabaseConfigured) return;
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (sbUser) {
      setUser(mapSupabaseUser(sbUser));
      setProfile(buildProfileFromUser(sbUser));
    }
  };

  // 1. Sign in with Email and Password
  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      const msg = 'Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not set in your environment. You can enter via Development Preview Access below while configuring credentials.';
      setError(msg);
      throw new Error(msg);
    }
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      const msg = formatAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
    if (data.user) {
      localStorage.removeItem('xcircle_dev_preview_active');
      setUser(mapSupabaseUser(data.user));
      setProfile(buildProfileFromUser(data.user));
    }
  };

  // 2. Sign up with Email and Password
  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    institution: string,
    batch: string
  ) => {
    setError(null);
    if (!isSupabaseConfigured) {
      const msg = 'Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are missing in .env. Configure them or use Development Preview Access.';
      setError(msg);
      throw new Error(msg);
    }
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          displayName,
          institution,
          batch,
        },
      },
    });
    if (err) {
      const msg = formatAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
    if (data.user) {
      localStorage.removeItem('xcircle_dev_preview_active');
      setUser(mapSupabaseUser(data.user));
      setProfile(buildProfileFromUser(data.user, { displayName, institution, batch }));
    }
  };

  // 3. Real Google OAuth (handles both iframe and standalone modes)
  const signInWithGoogle = async () => {
    setError(null);
    if (!isSupabaseConfigured) {
      const msg = 'Supabase credentials are not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.';
      setError(msg);
      throw new Error(msg);
    }

    const redirectUrl = `${window.location.origin}/auth/callback`;
    const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (isInIframe) {
      // In an iframe (such as AI Studio preview), Google OAuth redirects fail with X-Frame-Options: DENY.
      // Use skipBrowserRedirect: true and open a popup window directly to Google auth.
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (err) {
        const msg = formatAuthError(err);
        setError(msg);
        throw new Error(msg);
      }

      if (data?.url) {
        const width = 520;
        const height = 640;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          data.url,
          'xcircle_google_auth',
          `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
        );

        if (!popup) {
          // If popup was blocked, fallback to standard redirect
          window.location.href = data.url;
          return;
        }

        // Listen for postMessage from the popup window callback
        const handleAuthMessage = async (event: MessageEvent) => {
          if (event.data?.type === 'OAUTH_AUTH_SUCCESS' || event.data?.type === 'SUPABASE_AUTH_SUCCESS') {
            window.removeEventListener('message', handleAuthMessage);
            if (popup && !popup.closed) {
              popup.close();
            }
            await refreshUserProfile();
          }
        };

        window.addEventListener('message', handleAuthMessage);

        // Also check if popup was closed by user
        const checkClosedInterval = setInterval(async () => {
          if (popup.closed) {
            clearInterval(checkClosedInterval);
            window.removeEventListener('message', handleAuthMessage);
            await refreshUserProfile();
          }
        }, 1000);
      }
    } else {
      // Top-level window: standard OAuth redirect
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (err) {
        const msg = formatAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
    }
  };

  // 4. Send email verification
  const sendVerificationEmail = async () => {
    if (!isSupabaseConfigured || !user?.email) {
      throw new Error('Supabase is not configured or user has no email address.');
    }
    setError(null);
    const { error: err } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });
    if (err) {
      const msg = formatAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // 5. Send password reset
  const sendPasswordReset = async (email: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      const msg = 'Supabase credentials are not set. Cannot send password reset email without a live Supabase project.';
      setError(msg);
      throw new Error(msg);
    }
    const redirectUrl = `${window.location.origin}/auth/callback?type=recovery`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (err) {
      const msg = formatAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // 6. Confirm password reset
  const confirmPasswordResetCode = async (newPassword: string) => {
    setError(null);
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      const msg = formatAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // 7. Logout
  const logout = async () => {
    setError(null);
    localStorage.removeItem('xcircle_dev_preview_active');
    localStorage.removeItem('xcircle_dev_preview_profile');
    setIsDevPreview(false);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err: any) {
        console.warn('Sign out notice:', err);
      }
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        isSupabaseConfigured,
        isDevPreview,
        clearError,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        enterDevPreview,
        sendVerificationEmail,
        sendPasswordReset,
        confirmPasswordResetCode,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
