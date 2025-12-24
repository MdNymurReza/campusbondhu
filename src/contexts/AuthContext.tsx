// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

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
        },
      });

      if (error) throw error;

      toast({
        title: 'অ্যাকাউন্ট তৈরি হয়েছে!',
        description: 'অনুগ্রহ করে আপনার ইমেইল যাচাই করুন।',
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'রেজিস্ট্রেশন ব্যর্থ',
        description: error.message || 'একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'লগইন সফল!',
        description: 'স্বাগতম!',
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'লগইন ব্যর্থ',
        description: error.message || 'ইমেইল বা পাসওয়ার্ড ভুল।',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'লগআউট সফল',
        description: 'সফলভাবে লগআউট হয়েছে।',
      });
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
          redirectTo: `${window.location.origin}/dashboard`,
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
          redirectTo: `${window.location.origin}/dashboard`,
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

  const value = {
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