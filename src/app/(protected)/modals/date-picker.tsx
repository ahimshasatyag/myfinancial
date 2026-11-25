import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';

export default function DatePickerModal() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScreenHeader title="Pilih Tanggal" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        <GlassCard>
          <Text>Pilih Tanggal Transaksi</Text>
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
