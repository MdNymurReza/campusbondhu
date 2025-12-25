// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  isAuthenticated: boolean;
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clear auth state
  const clearAuth = () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('supabase.auth.token');
  };

  // Initialize auth
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');

        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('❌ Error getting session:', error);
          // Clear any invalid session
          if (error.message.includes('Invalid token')) {
            clearAuth();
          }
        }

        console.log('📋 Initial session:', currentSession?.user?.email || 'No user');

        if (currentSession?.user) {
          // Verify the user still exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', currentSession.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('❌ Profile check failed:', profileError);
            await supabase.auth.signOut();
            clearAuth();
          } else {
            setSession(currentSession);
            setUser(currentSession.user);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        clearAuth();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🎯 Auth event:', event, currentSession?.user?.email || 'No user');

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Handle specific events
        switch (event) {
          case 'SIGNED_IN':
            toast({
              title: 'লগইন সফল!',
              description: 'স্বাগতম!',
            });
            // Small delay to ensure state is updated
            setTimeout(() => navigate('/dashboard'), 100);
            break;

          case 'SIGNED_OUT':
            toast({
              title: 'লগআউট সফল',
              description: 'সফলভাবে লগআউট হয়েছে।',
            });
            clearAuth();
            setTimeout(() => navigate('/'), 100);
            break;

          case 'USER_UPDATED':
            console.log('🔄 User updated');
            break;

          case 'TOKEN_REFRESHED':
            console.log('🔁 Token refreshed');
            break;

          default:
            // Handle any other events
            console.log('🔄 Auth event:', event);
            break;
        }
      }
    );

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Attempting signup for:', email);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('📨 Signup response:', {
        user: data.user?.email,
        session: data.session ? 'Yes' : 'No',
        error: error?.message
      });

      if (error) {
        // Handle specific errors
        let errorMessage = error.message;

        if (error.message.includes('User already registered')) {
          errorMessage = 'এই ইমেইল দিয়ে আগেই রেজিস্টার করা হয়েছে। লগইন করুন।';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'অনেক চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।';
        } else if (error.message.includes('weak password')) {
          errorMessage = 'পাসওয়ার্ড খুব দুর্বল। শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।';
        }

        toast({
          title: 'রেজিস্ট্রেশন ব্যর্থ',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        });
        return { error };
      }

      // Success - check if email confirmation was sent
      if (data.user && !data.session) {
        toast({
          title: 'সফল!',
          description: 'কনফার্মেশন ইমেইল পাঠানো হয়েছে। আপনার ইমেইল চেক করুন।',
          duration: 5000,
        });
        console.log('📧 Email confirmation sent to:', email);

        // Redirect to confirmation page
        setTimeout(() => {
          navigate(`/auth/confirm?email=${encodeURIComponent(email)}&sent=true`);
        }, 1500);

      } else if (data.session) {
        // Auto logged in (email confirmations disabled)
        toast({
          title: 'রেজিস্ট্রেশন সফল!',
          description: 'স্বাগতম! আপনার অ্যাকাউন্ট তৈরি হয়েছে।',
        });
        console.log('✅ User auto-logged in (email confirmation disabled)');
      }

      return { error: null };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      toast({
        title: 'ত্রুটি হয়েছে',
        description: 'একটি অজানা ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।',
        variant: 'destructive',
        duration: 5000,
      });
      return { error };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) {
        console.error('❌ Login error:', error);

        // Check specific errors
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: 'ইমেইল যাচাই প্রয়োজন',
            description: 'অনুগ্রহ করে আপনার ইমেইল যাচাই করুন।',
            variant: 'destructive',
            duration: 5000,
          });
          navigate(`/auth/confirm?email=${encodeURIComponent(email)}`);
          return { error };
        }

        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'লগইন ব্যর্থ',
            description: 'ইমেইল বা পাসওয়ার্ড ভুল।',
            variant: 'destructive',
            duration: 3000,
          });
          return { error };
        }

        if (error.message.includes('rate limit')) {
          toast({
            title: 'রেট লিমিট',
            description: 'অনেক চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।',
            variant: 'destructive',
            duration: 5000,
          });
          return { error };
        }

        // Generic error
        toast({
          title: 'লগইন ব্যর্থ',
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        });
        return { error };
      }

      // Success
      console.log('✅ Login successful for:', email);
      // Toast will be shown by onAuthStateChange
      return { error: null };
    } catch (error: any) {
      console.error('❌ Login exception:', error);
      toast({
        title: 'লগইন ব্যর্থ',
        description: 'একটি ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।',
        variant: 'destructive',
        duration: 5000,
      });
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Toast will be shown by onAuthStateChange
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      toast({
        title: 'লগআউট ব্যর্থ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // OAuth functions
  const signInWithGoogle = async () => {
    try {
      console.log('🌐 Google OAuth starting...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('❌ Google OAuth error:', error);
      toast({
        title: 'Google লগইন ব্যর্থ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log('🐙 GitHub OAuth starting...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('❌ GitHub OAuth error:', error);
      toast({
        title: 'GitHub লগইন ব্যর্থ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Password reset
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে',
        description: 'অনুগ্রহ করে আপনার ইমেইল চেক করুন।',
        duration: 5000,
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'পাসওয়ার্ড রিসেট ব্যর্থ',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword.trim(),
      });

      if (error) throw error;

      toast({
        title: 'পাসওয়ার্ড আপডেট হয়েছে!',
        description: 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।',
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'পাসওয়ার্ড আপডেট ব্যর্থ',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  // Update profile
  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      toast({
        title: 'প্রোফাইল আপডেট হয়েছে!',
        description: 'আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।',
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'প্রোফাইল আপডেট ব্যর্থ',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  // Resend confirmation email
  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: 'কনফার্মেশন ইমেইল আবার পাঠানো হয়েছে',
        description: 'অনুগ্রহ করে আপনার ইমেইল চেক করুন।',
        duration: 5000,
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'ইমেইল পাঠানো ব্যর্থ',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
    resendConfirmationEmail,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};