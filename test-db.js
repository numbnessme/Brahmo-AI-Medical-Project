import { createClient } from '@supabase/supabase-js';

// Reads from the environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ CRITICAL ERRORS: Your environment variables are missing from .env.local!");
} else {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Attempt to select a single row from your seeded drugs table
  supabase.from('drugs').select('generic_name').limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error("❌ CONNECTION FAILED:", error.message);
      } else {
        console.log("✅ SUPABASE CONNECTIVITY VERIFIED! First record found:", data);
      }
    });
}