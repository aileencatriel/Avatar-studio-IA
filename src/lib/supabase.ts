import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables or localStorage overrides
export const getSupabaseCredentials = () => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('avatar_studio_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('avatar_studio_supabase_anon_key') : null;

  const url = localUrl || import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anonKey = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

  return { url, anonKey, isConfigured: Boolean(url && anonKey && !url.includes('placeholder')) };
};

const { url, anonKey } = getSupabaseCredentials();

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
