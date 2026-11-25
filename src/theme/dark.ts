import { colors } from './colors';
import { ThemeColors } from './light';

export const darkTheme = {
  mode: 'dark' as const,
  colors: {
    // Exact Design Standards from Spec
    screen: colors.gray950, // #090909
    card: colors.gray850,   // #151515
    input: colors.gray750,  // #1D1D1D
    button: colors.gray100, // #F5F5F5
    buttonText: colors.gray900, // #111111
    modal: colors.gray750,  // #1D1D1D
    bottomTab: 'rgba(21, 21, 21, 0.88)', // Dark glass
    border: colors.gray700, // #303030

    // Text hierarchy
    text: colors.gray100,
    textPrimary: colors.white,
    textSecondary: colors.gray400,
    textMuted: colors.gray600,
    textInverse: colors.gray900,

    // Component variants
    buttonSecondary: colors.gray750,
    buttonSecondaryText: colors.white,
    cardMuted: colors.gray750,
    divider: colors.gray700,
    placeholder: colors.gray600,

    // Status
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
    info: colors.info,
    successBg: 'rgba(16, 185, 129, 0.18)',
    dangerBg: 'rgba(239, 68, 68, 0.18)',
    warningBg: 'rgba(245, 158, 11, 0.18)',
    infoBg: 'rgba(59, 130, 246, 0.18)',

    // Glass effects
    glassBackground: 'rgba(21, 21, 21, 0.78)',
    glassBorder: 'rgba(48, 48, 48, 0.8)',
    glassInput: 'rgba(29, 29, 29, 0.85)',
  } as ThemeColors,
};
