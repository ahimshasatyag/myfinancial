import { colors } from './colors';

export interface ThemeColors {
  // Standards
  screen: string;
  card: string;
  input: string;
  button: string;
  buttonText: string;
  modal: string;
  bottomTab: string;
  border: string;

  // Text hierarchy
  text: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Components
  buttonSecondary: string;
  buttonSecondaryText: string;
  cardMuted: string;
  divider: string;
  placeholder: string;

  // Status
  success: string;
  danger: string;
  warning: string;
  info: string;
  successBg: string;
  dangerBg: string;
  warningBg: string;
  infoBg: string;

  // Glass
  glassBackground: string;
  glassBorder: string;
  glassInput: string;
}

export const lightTheme = {
  mode: 'light' as const,
  colors: {
    // Exact Design Standards from Spec
    screen: colors.gray100, // #F5F5F5
    card: colors.white,     // #FFFFFF
    input: colors.gray50,   // #F7F7F7
    button: colors.gray800, // #171717
    buttonText: colors.white, // #FFFFFF
    modal: colors.white,    // #FFFFFF
    bottomTab: 'rgba(255, 255, 255, 0.88)', // White glass
    border: colors.gray200, // #E5E5E5

    // Text hierarchy
    text: colors.gray800,
    textPrimary: colors.gray900,
    textSecondary: colors.gray500,
    textMuted: colors.gray400,
    textInverse: colors.white,

    // Component variants
    buttonSecondary: colors.gray200,
    buttonSecondaryText: colors.gray900,
    cardMuted: colors.gray50,
    divider: colors.gray200,
    placeholder: colors.gray400,

    // Status
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
    info: colors.info,
    successBg: colors.successLight,
    dangerBg: colors.dangerLight,
    warningBg: colors.warningLight,
    infoBg: colors.infoLight,

    // Glass effects
    glassBackground: 'rgba(255, 255, 255, 0.75)',
    glassBorder: 'rgba(229, 229, 229, 0.8)',
    glassInput: 'rgba(247, 247, 247, 0.85)',
  } as ThemeColors,
};
