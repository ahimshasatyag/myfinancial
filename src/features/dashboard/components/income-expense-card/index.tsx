import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrencyText } from '../../../../components/common/currency-text';
import { GlassCard } from '../../../../components/ui/glass-card';
import { useTheme } from '../../../../providers/theme-provider';

export interface IncomeExpenseCardProps {
  income: number;
  expense: number;
}

export const IncomeExpenseCard: React.FC<IncomeExpenseCardProps> = ({ income, expense }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.successBg }]}>
            <ArrowDownLeft size={16} color={theme.colors.success} />
          </View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Pemasukan</Text>
        </View>
        <CurrencyText amount={income} style={styles.amount} />
      </GlassCard>

      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.dangerBg }]}>
            <ArrowUpRight size={16} color={theme.colors.danger} />
          </View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Pengeluaran</Text>
        </View>
        <CurrencyText amount={expense} style={styles.amount} />
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
