import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
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
      <Stack.Screen name="modals/account-picker" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modals/category-picker" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modals/date-picker" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modals/transaction-filter" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
