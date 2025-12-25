// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing. Please check your .env file.');
  throw new Error('VITE_SUPABASE_URL is missing. Please check your .env file.');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing. Please check your .env file.');
  throw new Error('VITE_SUPABASE_ANON_KEY is missing. Please check your .env file.');
}

console.log('🔧 Supabase Config:');
console.log('URL:', supabaseUrl);
console.log('Key Present:', supabaseAnonKey ? 'Yes' : 'No');
console.log('Current Origin:', window.location.origin);

// Create Supabase client with improved configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development',
  },
  global: {
    headers: {
      'X-Client-Info': 'campusbondhu-lms',
    },
  },
  db: {
    schema: 'public',
  },
});

// Test connection on startup
export const testSupabaseConnection = async () => {
  try {
    console.log('🔌 Testing Supabase connection...');
    
    // Test 1: Check if we can reach Supabase
    const { data: healthData, error: healthError } = await supabase.from('profiles').select('count').limit(0);
    
    if (healthError && healthError.code !== '42P01') { // 42P01 is "table doesn't exist" which is okay
      console.error('❌ Supabase connection failed:', healthError.message);
      return { success: false, error: healthError };
    }
    
    // Test 2: Check auth
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Auth session check failed:', sessionError.message);
      return { success: false, error: sessionError };
    }
    
    console.log('✅ Supabase connection successful');
    console.log('👤 Session:', sessionData.session ? 'Active' : 'No session');
    
    return { success: true, session: sessionData.session };
  } catch (error: any) {
    console.error('❌ Connection test exception:', error.message);
    return { success: false, error };
  }
};

// Run connection test in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testSupabaseConnection();
  }, 1000);
}