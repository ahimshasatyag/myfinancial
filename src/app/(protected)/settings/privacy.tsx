import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { useTheme } from '../../../providers/theme-provider';

export default function PrivacyScreen() {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      <ScreenHeader title="Kebijakan Privasi" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={styles.card}>
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
            Komitmen Privasi budgetku
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Aplikasi budgetku dirancang dengan prinsip privasi sejak awal (Privacy by Design). Seluruh
            data transaksi, akun, dan anggaran Anda dilindungi dengan enkripsi standar industri dan
            Row Level Security (RLS) PostgreSQL, sehingga hanya Anda yang dapat mengakses data finansial
            Anda.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Kami tidak menjual atau membagikan riwayat transaksi Anda kepada pihak ketiga manapun untuk
            keperluan iklan.
          </Text>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    padding: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
});
