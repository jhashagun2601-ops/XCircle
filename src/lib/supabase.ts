import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both VITE_ and standard env prefix definitions
const rawUrl = 
  (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.SUPABASE_URL)) ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
  '';

const rawKey = 
  (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.SUPABASE_ANON_KEY)) ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  '';

// Support both VITE_, standard env prefix, and client-side saved configuration
const storedUrl = typeof window !== 'undefined' ? (localStorage.getItem('xcircle_supabase_url') || '') : '';
const storedKey = typeof window !== 'undefined' ? (localStorage.getItem('xcircle_supabase_anon_key') || '') : '';

export const supabaseUrl = (rawUrl || storedUrl).trim();
export const supabaseAnonKey = (rawKey || storedKey).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('http')
);

// Graceful client instance with explicit session persistence and PKCE flow
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce',
      },
    })
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

/**
 * Automatically persists credentials to .env on the server and local storage
 */
export async function saveSupabaseCredentials(url: string, anonKey: string): Promise<boolean> {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('xcircle_supabase_url', cleanUrl);
    localStorage.setItem('xcircle_supabase_anon_key', cleanKey);
  }

  try {
    const res = await fetch('/api/configure-supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supabaseUrl: cleanUrl, supabaseAnonKey: cleanKey }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not reach /api/configure-supabase; saved to local browser storage:', err);
    return true;
  }
}

