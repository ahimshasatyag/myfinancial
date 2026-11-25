import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../../providers/theme-provider';

export interface GlassCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  className?: string;
  variant?: 'solid' | 'glass';
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  contentStyle,
  className,
  variant = 'solid',
  intensity = 45,
}) => {
  const { theme, isDark } = useTheme();

  if (variant === 'glass') {
    return (
      <View
        className={className}
        style={[
          styles.container,
          {
            borderColor: theme.colors.border,
            borderRadius: theme.radius.xl,
            borderWidth: 1,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        <BlurView
          intensity={intensity}
          tint={isDark ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.glassBackground }]}
        />
        <View style={[styles.inner, contentStyle]}>{children}</View>
      </View>
    );
  }

  // Solid standard card (#FFFFFF in light, #151515 in dark)
  return (
    <View
      className={className}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
          borderWidth: 1,
        },
        style,
      ]}
    >
      <View style={[styles.inner, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  inner: {
    padding: 20,
  },
});
