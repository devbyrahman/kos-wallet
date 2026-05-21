import { createClient } from '@supabase/supabase-js'

/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * Why this file exists:
 * We need to instantiate the Supabase client once and share it throughout the application
 * so that we don't recreate clients in every component. This is a "singleton" pattern.
 * 
 * Beginner Concept - Vite Env Variables:
 * In Vite, variables in `.env.local` starting with `VITE_` are automatically loaded into
 * the special `import.meta.env` object. 
 * 
 * Safe Checks:
 * If keys are missing, we log a helpful warning in the console so that the developer
 * knows to configure their `.env.local` file.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-project')) {
  console.warn(
    '⚠️ Supabase Credentials Missing: Please update the `.env.local` file with your real Supabase URL and Anon Key!'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      lockSession: false // Menonaktifkan tab-locking untuk mencegah deadlock di Chrome secara permanen!
    }
  }
)
