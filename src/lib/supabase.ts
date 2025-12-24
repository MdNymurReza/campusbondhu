import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging (remove in production)
console.log('🔧 Supabase Config Check:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Set (hidden)' : '❌ Missing');
console.log('Current Origin:', window.location.origin);

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is missing. Please check your .env file.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is missing. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'campusbondhu-lms',
    },
  },
});

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
    if (data.session) {
      console.log('👤 User session found:', data.session.user.email);
    }
  }
});