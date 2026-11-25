import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';

export default function AccountPickerModal() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScreenHeader title="Pilih Akun" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        <GlassCard>
          <Text>Pilihan Akun / Rekening</Text>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});
