import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../providers/auth-provider';
import { useTheme } from '../../providers/theme-provider';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
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

  // Proteksi rute: Jika belum login, selalu redirect ke welcome screen
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="accounts" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="budgets" />
      <Stack.Screen name="savings" />
      <Stack.Screen name="recurring" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="modals" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
