import React from 'react';
import { Stack } from 'expo-router';

export default function TransactionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="all" />
      <Stack.Screen name="new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="transfer" options={{ presentation: 'modal' }} />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/edit" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
