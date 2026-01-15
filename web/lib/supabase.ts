/**
 * Supabase Client for Authentication
 * 
 * Handles user authentication with Supabase Auth.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Use placeholder values for development if not configured
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not configured. Authentication will not work.');
  console.warn('');
  console.warn('   Setup Instructions:');
  console.warn('   1. Create web/.env.local with your Supabase credentials:');
  console.warn('      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  console.warn('');
  console.warn('   2. Configure email confirmation settings in Supabase Dashboard:');
  console.warn('      - Go to Authentication > Settings > Email Auth');
  console.warn('      - Toggle "Enable email confirmations" based on your needs');
  console.warn('      - For development: disable to skip email confirmation');
  console.warn('      - For production: enable to require email verification');
  console.warn('');
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
