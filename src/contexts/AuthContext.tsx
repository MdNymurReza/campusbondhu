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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize auth state
    const getSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Handle navigation based on auth events
        switch (event) {
          case 'SIGNED_IN':
            toast({
              title: 'লগইন সফল!',
              description: 'স্বাগতম!',
            });
            navigate('/dashboard');
            break;
          case 'SIGNED_OUT':
            toast({
              title: 'লগআউট সফল',
              description: 'সফলভাবে লগআউট হয়েছে।',
            });
            navigate('/');
            break;
          case 'USER_UPDATED':
            console.log('User updated:', currentSession?.user);
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - navigation is handled inside the callback

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // Handle specific errors
        if (error.message.includes('User already registered')) {
          toast({
            title: 'ইমেইল ইতিমধ্যে রেজিস্টার্ড',
            description: 'এই ইমেইলটি ইতিমধ্যে রেজিস্টার্ড আছে। লগইন করুন বা অন্য ইমেইল ব্যবহার করুন।',
            variant: 'destructive',
          });
          return { error };
        }
        throw error;
      }

      // Check if email confirmation was sent
      if (data.session === null && data.user) {
        toast({
          title: 'কনফার্মেশন ইমেইল পাঠানো হয়েছে!',
          description: 'অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং কনফার্মেশন লিংক ক্লিক করুন।',
        });
        navigate('/auth/confirm?sent=true&email=' + encodeURIComponent(email));
      } else {
        // Auto login if email confirmation is disabled
        toast({
          title: 'রেজিস্ট্রেশন সফল!',
          description: 'স্বাগতম! আপনার অ্যাকাউন্ট তৈরি হয়েছে।',
        });
        navigate('/dashboard');
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific errors
      if (error.message?.includes('password')) {
        toast({
          title: 'পাসওয়ার্ড দুর্বল',
          description: 'অনুগ্রহ করে একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন (অন্তত ৬ অক্ষর)।',
          variant: 'destructive',
        });
      } else if (error.message?.includes('email')) {
        toast({
          title: 'ইমেইল ভুল',
          description: 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন।',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'রেজিস্ট্রেশন ব্যর্থ',
          description: error.message || 'একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।',
          variant: 'destructive',
        });
      }
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if user needs to confirm email
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: 'ইমেইল যাচাই প্রয়োজন',
            description: 'অনুগ্রহ করে আপনার ইমেইল যাচাই করুন। কনফার্মেশন লিংক ইমেইলে পাঠানো হয়েছে।',
            variant: 'destructive',
          });
          navigate('/auth/confirm?email=' + encodeURIComponent(email));
          return { error };
        }
        
        // Check for invalid credentials
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'লগইন ব্যর্থ',
            description: 'ইমেইল বা পাসওয়ার্ড ভুল।',
            variant: 'destructive',
          });
          return { error };
        }
        
        throw error;
      }

      // Success - navigation will be handled by onAuthStateChange
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Generic error fallback
      if (!error.message?.includes('Invalid login credentials')) {
        toast({
          title: 'লগইন ব্যর্থ',
          description: error.message || 'একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।',
          variant: 'destructive',
        });
      }
      
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Navigation will be handled by onAuthStateChange
    } catch (error: any) {
      toast({
        title: 'লগআউট ব্যর্থ',
        description: error.message || 'একটি ত্রুটি হয়েছে।',
        variant: 'destructive',
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
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
      toast({
        title: 'Google লগইন ব্যর্থ',
        description: error.message || 'একটি ত্রুটি হয়েছে।',
        variant: 'destructive',
      });
    }
  };

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'GitHub লগইন ব্যর্থ',
        description: error.message || 'একটি ত্রুটি হয়েছে।',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে',
        description: 'অনুগ্রহ করে আপনার ইমেইল চেক করুন।',
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'পাসওয়ার্ড রিসেট ব্যর্থ',
        description: error.message || 'একটি ত্রুটি হয়েছে।',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
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
        description: error.message || 'একটি ত্রুটি হয়েছে।',
        variant: 'destructive',
      });
      return { error };
    }
  };

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
        description: error.message || 'একটি ত্রুটি হয়েছে।',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'কনফার্মেশন ইমেইল আবার পাঠানো হয়েছে',
        description: 'অনুগ্রহ করে আপনার ইমেইল চেক করুন।',
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'ইমেইল পাঠানো ব্যর্থ',
        description: error.message || 'একটি ত্রুটি হয়েছে।',
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