import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.trim() !== '' && supabaseAnonKey && supabaseAnonKey.trim() !== '');

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja .env.example).'
  );
}

const safeUrl = isSupabaseConfigured ? (supabaseUrl as string) : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured ? (supabaseAnonKey as string) : 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey);
