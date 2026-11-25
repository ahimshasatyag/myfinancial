import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../providers/theme-provider';
import { ROUTES } from '../constants/routes';

export default function AuthCallback() {
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(ROUTES.TABS.DASHBOARD as any);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.screen,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.button} />
    </View>
  );
}
