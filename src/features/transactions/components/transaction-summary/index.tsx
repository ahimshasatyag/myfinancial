import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrencyText } from '../../../../components/common/currency-text';
import { GlassCard } from '../../../../components/ui/glass-card';
import { useTheme } from '../../../../providers/theme-provider';

export interface TransactionSummaryProps {
  totalIncome: number;
  totalExpense: number;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  totalIncome,
  totalExpense,
}) => {
  const { theme } = useTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.col}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total Masuk</Text>
        <CurrencyText amount={totalIncome} colored showSign style={styles.income} />
      </View>
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      <View style={styles.col}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total Keluar</Text>
        <CurrencyText amount={-totalExpense} colored showSign style={styles.expense} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  income: {
    fontSize: 16,
    fontWeight: '700',
  },
  expense: {
    fontSize: 16,
    fontWeight: '700',
  },
});
