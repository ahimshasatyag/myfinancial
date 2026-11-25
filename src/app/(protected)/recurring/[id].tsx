import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';

export default function RecurringDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer>
      <ScreenHeader title="Detail Transaksi Berulang" showBack />
      <View style={styles.content}>
        <GlassCard>
          <Text style={styles.text}>Jadwal ID: {id}</Text>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  text: {
    fontSize: 14,
  },
});
