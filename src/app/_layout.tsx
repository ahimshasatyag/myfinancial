import React from 'react';
import '../../global.css';
import { Stack } from 'expo-router';
import { AppProvider } from '../providers/app-provider';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#090909' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            contentStyle: { backgroundColor: '#090909' },
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: '#090909' },
          }}
        />
        <Stack.Screen
          name="(protected)"
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: '#090909' },
          }}
        />
        <Stack.Screen name="auth-callback" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Halaman Tidak Ditemukan' }} />
      </Stack>
    </AppProvider>
  );
}
