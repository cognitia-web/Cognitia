import { createClient } from '@supabase/supabase-js';

if (!process.env.VITE_SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL must be set. Please connect to Supabase.");
}

if (!process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error("VITE_SUPABASE_ANON_KEY must be set. Please connect to Supabase.");
}

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// For server-side operations that need elevated permissions
export const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);