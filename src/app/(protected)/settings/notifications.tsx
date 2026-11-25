import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { AppSwitch } from '../../../components/ui/app-switch';
import { useTheme } from '../../../providers/theme-provider';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const [dailyReminder, setDailyReminder] = useState(true);
  const [budgetAlert, setBudgetAlert] = useState(true);

  return (
    <ScreenContainer>
      <ScreenHeader title="Notifikasi" showBack />
      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.textBox}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Pengingat Harian</Text>
              <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>
                Ingatkan saya setiap malam untuk mencatat pengeluaran
              </Text>
            </View>
            <AppSwitch value={dailyReminder} onValueChange={setDailyReminder} />
          </View>

          <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

          <View style={styles.row}>
            <View style={styles.textBox}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Peringatan Anggaran</Text>
              <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>
                Beri peringatan saat penggunaan anggaran mencapai 80%
              </Text>
            </View>
            <AppSwitch value={budgetAlert} onValueChange={setBudgetAlert} />
          </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  textBox: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginVertical: 12,
  },
});
