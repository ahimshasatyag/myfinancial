import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { SUPPORTED_CURRENCIES } from '../../../constants/currency';
import { useTheme } from '../../../providers/theme-provider';

export default function CurrencySettingsScreen() {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      <ScreenHeader title="Pengaturan Mata Uang" showBack />
      <View style={styles.content}>
        <GlassCard style={styles.card}>
          {Object.values(SUPPORTED_CURRENCIES).map((c) => (
            <View key={c.code} style={styles.item}>
              <Text style={[styles.code, { color: theme.colors.textPrimary }]}>{c.code}</Text>
              <Text style={[styles.name, { color: theme.colors.textSecondary }]}>{c.name} ({c.symbol})</Text>
            </View>
          ))}
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  code: {
    fontWeight: '600',
  },
  name: {
    fontSize: 13,
  },
});
