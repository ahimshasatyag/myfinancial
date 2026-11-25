import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface GlassBadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
}) => {
  const { theme, isDark } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: theme.colors.successBg,
          text: theme.colors.success,
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'danger':
        return {
          bg: theme.colors.dangerBg,
          text: theme.colors.danger,
          border: 'rgba(239, 68, 68, 0.3)',
        };
      case 'warning':
        return {
          bg: theme.colors.warningBg,
          text: theme.colors.warning,
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'info':
        return {
          bg: theme.colors.infoBg,
          text: theme.colors.info,
          border: 'rgba(59, 130, 246, 0.3)',
        };
      default:
        return {
          bg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          text: theme.colors.textSecondary,
          border: theme.colors.border,
        };
    }
  };

  const c = getColors();
  const paddingH = size === 'sm' ? 6 : 10;
  const paddingV = size === 'sm' ? 2 : 4;
  const fontSize = size === 'sm' ? 11 : 12;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: c.bg,
          borderColor: c.border,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          borderRadius: theme.radius.full,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: c.text, fontSize }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
