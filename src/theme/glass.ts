import { ViewStyle } from 'react-native';
import { radius } from './radius';

export const glass = {
  blurIntensity: {
    light: 40,
    regular: 60,
    strong: 90,
  },
  card: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderColor: 'rgba(229, 229, 229, 0.7)',
      borderWidth: 1,
      borderRadius: radius.xl,
    } as ViewStyle,
    dark: {
      backgroundColor: 'rgba(21, 21, 21, 0.85)',
      borderColor: 'rgba(48, 48, 48, 0.7)',
      borderWidth: 1,
      borderRadius: radius.xl,
    } as ViewStyle,
  },
  input: {
    light: {
      backgroundColor: 'rgba(247, 247, 247, 0.9)',
      borderColor: 'rgba(229, 229, 229, 0.8)',
      borderWidth: 1,
      borderRadius: radius.lg,
    } as ViewStyle,
    dark: {
      backgroundColor: 'rgba(29, 29, 29, 0.9)',
      borderColor: 'rgba(48, 48, 48, 0.8)',
      borderWidth: 1,
      borderRadius: radius.lg,
    } as ViewStyle,
  },
  bottomTab: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderColor: 'rgba(229, 229, 229, 0.6)',
      borderTopWidth: 1,
    } as ViewStyle,
    dark: {
      backgroundColor: 'rgba(21, 21, 21, 0.85)',
      borderColor: 'rgba(48, 48, 48, 0.6)',
      borderTopWidth: 1,
    } as ViewStyle,
  },
};
