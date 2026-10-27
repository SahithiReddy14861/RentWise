import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vite inlines VITE_* env vars at build time. If they are missing (e.g. not set
// in the Netlify environment), createClient would throw synchronously and crash
// the whole React tree to a blank page. Instead, degrade gracefully: export
// null and let the data layer surface a user-facing error. The UI still renders.
let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'RentWise: Supabase env vars are missing. Set VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY in your build environment (e.g. Netlify site settings).'
  );
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
