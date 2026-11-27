import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Plus } from 'lucide-react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { CurrencyText } from '../../../../components/common/currency-text';
import { CurrencyTotal } from '../../../../utils/transaction';
import { useUIStore } from '../../../../store/ui-store';
import { useTheme } from '../../../../providers/theme-provider';

export interface BalanceCardProps {
  totalBalance: number;
  income?: number;
  expense?: number;
  currencyCode?: string;
  balancesByCurrency?: CurrencyTotal[];
  onAddTransaction?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  income = 0,
  expense = 0,
  currencyCode = 'IDR',
  balancesByCurrency = [],
  onAddTransaction,
}) => {
  const { theme } = useTheme();
  const { isBalanceHidden, toggleBalanceHidden } = useUIStore();

  const otherCurrencies = balancesByCurrency.filter((b) => b.currencyCode !== currencyCode);

  return (
    <GlassCard
      variant="glass"
      intensity={55}
      style={styles.card}
      contentStyle={styles.cardContent}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={[styles.titleLabel, { color: theme.colors.textSecondary }]}>
            Total Saldo ({currencyCode})
          </Text>
          <TouchableOpacity
            onPress={toggleBalanceHidden}
            activeOpacity={0.7}
            accessibilityLabel={isBalanceHidden ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isBalanceHidden ? (
              <EyeOff size={16} color={theme.colors.textMuted} />
            ) : (
              <Eye size={16} color={theme.colors.textMuted} />
            )}
          </TouchableOpacity>
        </View>

        {onAddTransaction && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAddTransaction}
            accessibilityLabel="Tambah transaksi baru"
            style={[styles.addBtn, { backgroundColor: theme.colors.button }]}
          >
            <Plus size={16} color={theme.colors.buttonText} />
          </TouchableOpacity>
        )}
      </View>

      <CurrencyText
        amount={totalBalance}
        currencyCode={currencyCode}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={styles.balanceAmount}
      />

      {otherCurrencies.length > 0 && (
        <View style={styles.currencyRow}>
          {otherCurrencies.map((item) => (
            <View
              key={item.currencyCode}
              style={[
                styles.currencyPill,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.cardMuted },
              ]}
            >
              <Text style={[styles.currencyCodeText, { color: theme.colors.textMuted }]}>
                {item.currencyCode}
              </Text>
              <CurrencyText
                amount={item.total}
                currencyCode={item.currencyCode}
                style={styles.currencyValText}
              />
            </View>
          ))}
        </View>
      )}

      {/* Pemasukan & Pengeluaran tergabung dalam 1 card */}
      <View style={[styles.summaryRow, { borderTopColor: theme.colors.border }]}>
        <View style={styles.summaryCol}>
          <View style={styles.summaryHeader}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.successBg }]}>
              <ArrowDownLeft size={14} color={theme.colors.success} />
            </View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Pemasukan
            </Text>
          </View>
          <CurrencyText
            amount={income}
            currencyCode={currencyCode}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={styles.summaryAmount}
          />
        </View>

        <View style={[styles.verticalDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.summaryCol}>
          <View style={styles.summaryHeader}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.dangerBg }]}>
              <ArrowUpRight size={14} color={theme.colors.danger} />
            </View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Pengeluaran
            </Text>
          </View>
          <CurrencyText
            amount={expense}
            currencyCode={currencyCode}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={styles.summaryAmount}
          />
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  currencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  currencyPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyCodeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  currencyValText: {
    fontSize: 11,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 14,
    gap: 12,
  },
  summaryCol: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch',
    opacity: 0.7,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
