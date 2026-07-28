import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables or localStorage overrides
export const getSupabaseCredentials = () => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('avatar_studio_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('avatar_studio_supabase_anon_key') : null;

  const url = localUrl || import.meta.env.VITE_SUPABASE_URL || 'https://kbdhzssmodxcmgnhyuln.supabase.co';
  const anonKey = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZGh6c3Ntb2R4Y21nbmh5dWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTk3MTAsImV4cCI6MjEwMDgzNTcxMH0.fXOMwOm0YHBBit6kPhngAcFTxHau-LtMTpKDMC8z5WQ';

  return { url, anonKey, isConfigured: Boolean(url && anonKey && !url.includes('placeholder')) };
};

const { url, anonKey } = getSupabaseCredentials();

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
