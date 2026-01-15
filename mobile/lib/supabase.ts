/**
 * Supabase Client for Authentication (Mobile)
 * 
 * Handles user authentication with Supabase Auth.
 * Uses expo-secure-store for token persistence.
 * Configured for deep link handling.
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not configured. Authentication will not work.');
  console.warn('');
  console.warn('   Setup Instructions:');
  console.warn('   1. Create mobile/.env with your Supabase credentials:');
  console.warn('      EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('      EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  console.warn('');
  console.warn('   2. Configure email confirmation settings in Supabase Dashboard:');
  console.warn('      - Go to Authentication > Settings > Email Auth');
  console.warn('      - Toggle "Enable email confirmations" based on your needs');
  console.warn('      - For development: disable to skip email confirmation');
  console.warn('      - For production: enable to require email verification');
  console.warn('');
}

// Custom storage implementation using expo-secure-store
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable for deep link handling
  },
});
