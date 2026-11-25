import { TextStyle } from 'react-native';

export const typography = {
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  presets: {
    heading1: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 38,
    } as TextStyle,
    heading2: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
    } as TextStyle,
    heading3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    } as TextStyle,
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    } as TextStyle,
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    } as TextStyle,
    bodySmall: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    } as TextStyle,
    caption: {
      fontSize: 11,
      fontWeight: '500',
      lineHeight: 14,
    } as TextStyle,
  },
} as const;
