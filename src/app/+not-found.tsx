import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ScreenContainer } from '../components/layout/screen-container';
import { GlassButton } from '../components/ui/glass-button';
import { useTheme } from '../providers/theme-provider';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Halaman tidak ditemukan.
        </Text>
        <Link href="/" asChild>
          <GlassButton title="Kembali ke Beranda" onPress={() => {}} style={styles.link} />
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
  },
});
