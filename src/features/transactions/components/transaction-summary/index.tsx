import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
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
  const { theme, isDark } = useTheme();

  return (
    <GlassCard style={styles.cardContainer} contentStyle={styles.cardContent}>
      {/* Kolom Kiri: Total Masuk */}
      <View style={styles.col}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.18)' : '#D1FAE5' },
            ]}
          >
            <ArrowDownLeft size={13} color="#10B981" />
          </View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total Masuk</Text>
        </View>
        <CurrencyText
          amount={totalIncome}
          style={[styles.amount, { color: isDark ? '#34D399' : '#059669' }]}
        />
      </View>

      {/* Garis Pemisah Tengah */}
      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' },
        ]}
      />

      {/* Kolom Kanan: Total Keluar */}
      <View style={styles.col}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2' },
            ]}
          >
            <ArrowUpRight size={13} color="#EF4444" />
          </View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total Keluar</Text>
        </View>
        <CurrencyText
          amount={totalExpense}
          style={[styles.amount, { color: isDark ? '#F87171' : '#DC2626' }]}
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  col: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  divider: {
    width: 1,
    height: 38,
    marginHorizontal: 12,
  },
});
