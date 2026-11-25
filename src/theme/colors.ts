export const colors = {
  // Grayscale Palette (Monochrome)
  black: '#000000',
  gray950: '#090909',
  gray900: '#111111',
  gray850: '#151515',
  gray800: '#171717',
  gray750: '#1D1D1D',
  gray700: '#303030',
  gray600: '#525252',
  gray500: '#737373',
  gray400: '#A3A3A3',
  gray300: '#D4D4D4',
  gray200: '#E5E5E5',
  gray100: '#F5F5F5',
  gray50: '#F7F7F7',
  white: '#FFFFFF',

  // Semantic Status Colors
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.12)',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.12)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.12)',

  // Overlay
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
} as const;

export type ColorPalette = typeof colors;
