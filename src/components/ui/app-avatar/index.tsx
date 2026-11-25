import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface AppAvatarProps {
  source?: string | null;
  name?: string | null;
  size?: number;
}

export const AppAvatar: React.FC<AppAvatarProps> = ({ source, name, size = 44 }) => {
  const { theme, isDark } = useTheme();

  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.colors.border,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarPlaceholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? '#262626' : '#E5E5E5',
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4, color: theme.colors.textPrimary }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
  },
  avatarPlaceholder: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
  },
});
