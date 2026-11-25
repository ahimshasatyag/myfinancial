import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/theme-store';
import { themes, Theme } from '../theme';

interface ThemeContextValue {
  theme: Theme;
  mode: 'light' | 'dark';
  isDark: boolean;
  setThemePreference: (pref: 'light' | 'dark' | 'system') => Promise<void>;
  themePreference: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { themePreference, effectiveTheme, setThemePreference, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    if (themePreference === 'system' && systemColorScheme) {
      useThemeStore.setState({ effectiveTheme: systemColorScheme });
    }
  }, [systemColorScheme, themePreference]);

  const activeTheme = themes[effectiveTheme] || themes.light;

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        mode: effectiveTheme,
        isDark: effectiveTheme === 'dark',
        setThemePreference,
        themePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if accessed outside ThemeProvider
    return {
      theme: themes.light,
      mode: 'light',
      isDark: false,
      setThemePreference: async () => {},
      themePreference: 'system',
    };
  }
  return context;
}
