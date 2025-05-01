import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // Get the current site URL based on where the app is running
      const currentUrl = window.location.origin;
      console.log('Current origin:', currentUrl);
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${currentUrl}/verify-email?redirect_type=signup`,
          data: {
            email_confirm: true,
            redirect_url: `${currentUrl}/verify-email`
          }
        }
      });

      console.log('Signup attempt with redirect URL:', `${currentUrl}/verify-email?redirect_type=signup`);
      console.log('Supabase signup response:', { data, error });

      if (error) {
        return { data: null, error };
      }

      // If we have a user object but no session, it means email confirmation is needed
      if (data.user && !data.session) {
        return { data, error: null };
      }

      // If we have neither user nor session, something went wrong
      if (!data.user && !data.session) {
        return {
          data: null,
          error: new Error('Failed to create account. Please try again.')
        };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        data: null,
        error: new Error(error.message || 'An unexpected error occurred')
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 