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
            <ArrowDownLeft size={15} color={theme.colors.success} />
          </View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Pemasukan</Text>
        </View>
        <CurrencyText
          amount={income}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={styles.amount}
        />
      </GlassCard>

      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.dangerBg }]}>
            <ArrowUpRight size={15} color={theme.colors.danger} />
          </View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Pengeluaran</Text>
        </View>
        <CurrencyText
          amount={expense}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={styles.amount}
        />
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
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
