import { lightTheme, ThemeColors } from './light';
import { darkTheme } from './dark';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';
import { glass } from './glass';

export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  glass: typeof glass;
}

export const themes = {
  light: {
    ...lightTheme,
    typography,
    spacing,
    radius,
    shadows,
    glass,
  },
  dark: {
    ...darkTheme,
    typography,
    spacing,
    radius,
    shadows,
    glass,
  },
};

export { colors, lightTheme, darkTheme, typography, spacing, radius, shadows, glass };
