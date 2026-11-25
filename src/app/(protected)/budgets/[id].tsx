import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';

export default function BudgetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer>
      <ScreenHeader title="Detail Anggaran" showBack />
      <View style={styles.content}>
        <GlassCard>
          <Text style={styles.text}>Anggaran ID: {id}</Text>
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
