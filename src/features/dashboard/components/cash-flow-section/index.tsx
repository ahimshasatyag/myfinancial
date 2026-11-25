import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { BarChart } from '../../../../components/charts/bar-chart';
import { CurrencyText } from '../../../../components/common/currency-text';
import { useTheme } from '../../../../providers/theme-provider';

export interface CashFlowSectionProps {
  netCashFlow: number;
}

export const CashFlowSection: React.FC<CashFlowSectionProps> = ({ netCashFlow }) => {
  const { theme } = useTheme();

  // Mock bar flow for past days
  const chartData = [
    { label: 'Sen', value: 120000 },
    { label: 'Sel', value: 250000 },
    { label: 'Rab', value: 80000 },
    { label: 'Kam', value: 340000 },
    { label: 'Jum', value: 190000 },
    { label: 'Sab', value: 450000 },
    { label: 'Min', value: 160000 },
  ];

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Arus Kas Bersih</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Periode bulan ini
          </Text>
        </View>
        <CurrencyText amount={netCashFlow} colored showSign style={styles.netAmount} />
      </View>
      <BarChart data={chartData} height={120} />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  netAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
