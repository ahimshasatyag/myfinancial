import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuthStore } from '../store/auth-store';
import { Profile, UserSettings } from '../types/database.types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  profile: Profile | null;
  settings: UserSettings | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, settings, isLoading, setAuth, setProfile, setSettings, setLoading, reset } =
    useAuthStore();

  const fetchUserData = async (userId: string) => {
    try {
      const [{ data: prof }, { data: sett }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      if (prof) setProfile(prof);
      if (sett) setSettings(sett);
    } catch (e) {
      console.warn('Error fetching user data:', e);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check current session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        if (session) {
          setAuth(session.user, session);
          fetchUserData(session.user.id).finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Error checking session:', err);
        if (mounted) setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session) {
        setAuth(session.user, session);
        await fetchUserData(session.user.id);
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    reset();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        userId: user?.id || null,
        profile,
        settings,
        refreshUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
