import { create } from 'zustand';
import { Appearance } from 'react-native';
import { secureStorage } from '../lib/secure-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  themePreference: ThemePreference;
  effectiveTheme: 'light' | 'dark';
  setThemePreference: (pref: ThemePreference) => Promise<void>;
  initTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themePreference: 'system',
  effectiveTheme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',

  setThemePreference: async (pref: ThemePreference) => {
    await secureStorage.setItem('budgetku_theme_pref', pref);
    const resolved =
      pref === 'system'
        ? Appearance.getColorScheme() === 'dark'
          ? 'dark'
          : 'light'
        : pref;
    set({ themePreference: pref, effectiveTheme: resolved });
  },

  initTheme: async () => {
    const saved = (await secureStorage.getItem('budgetku_theme_pref')) as ThemePreference | null;
    const pref = saved || 'system';
    const resolved =
      pref === 'system'
        ? Appearance.getColorScheme() === 'dark'
          ? 'dark'
          : 'light'
        : pref;
    set({ themePreference: pref, effectiveTheme: resolved });
  },
}));
