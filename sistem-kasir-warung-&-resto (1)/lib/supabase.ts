import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

function isValidHttpUrl(stringUrl: string): boolean {
  if (!stringUrl) return false;
  if (
    stringUrl === 'https://your-project.supabase.co' ||
    stringUrl === 'your-supabase-url' ||
    stringUrl.includes('YOUR_SUPABASE')
  ) {
    return false;
  }
  try {
    const url = new URL(stringUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = isValidHttpUrl(supabaseUrl) && Boolean(supabaseAnonKey);

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    clientInstance = null;
  }
}

export const supabase = clientInstance;

export const SUPABASE_STATUS = {
  configured: Boolean(clientInstance),
  url: supabaseUrl,
};

