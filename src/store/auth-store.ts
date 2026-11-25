import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { Profile, UserSettings } from '../types/database.types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  settings: UserSettings | null;
  isLoading: boolean;
  setAuth: (user: User | null, session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSettings: (settings: UserSettings | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  settings: null,
  isLoading: true,
  setAuth: (user, session) => set({ user, session }),
  setProfile: (profile) => set({ profile }),
  setSettings: (settings) => set({ settings }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, session: null, profile: null, settings: null, isLoading: false }),
}));
