import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { CurrencyText } from '../../../../components/common/currency-text';
import { DateText } from '../../../../components/common/date-text';
import { EmptyState } from '../../../../components/common/empty-state';
import { Transaction } from '../../../../types/database.types';
import { useTheme } from '../../../../providers/theme-provider';
import { ROUTES } from '../../../../constants/routes';

export interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Transaksi Terbaru</Text>
        <TouchableOpacity
          onPress={() => router.push(ROUTES.TABS.TRANSACTIONS as any)}
          style={styles.seeAllBtn}
        >
          <Text style={[styles.seeAllText, { color: theme.colors.textSecondary }]}>Lihat Semua</Text>
          <ChevronRight size={14} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {transactions.length === 0 ? (
        <GlassCard>
          <EmptyState
            title="Belum ada transaksi"
            description="Mulai catat pemasukan dan pengeluaran harian Anda."
            actionTitle="Tambah Transaksi"
            onAction={() => router.push(ROUTES.TRANSACTIONS.NEW as any)}
          />
        </GlassCard>
      ) : (
        <GlassCard style={styles.listCard}>
          {transactions.map((item, idx) => {
            const isIncome = item.transaction_type === 'income';
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => router.push(ROUTES.TRANSACTIONS.DETAIL(item.id) as any)}
                style={[
                  styles.itemRow,
                  idx < transactions.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isIncome ? theme.colors.successBg : theme.colors.dangerBg,
                      },
                    ]}
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={16} color={theme.colors.success} />
                    ) : (
                      <ArrowUpRight size={16} color={theme.colors.danger} />
                    )}
                  </View>
                  <View style={styles.titleBox}>
                    <Text
                      style={[styles.itemTitle, { color: theme.colors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <DateText date={item.transaction_date} format="relative" />
                  </View>
                </View>

                <CurrencyText
                  amount={isIncome ? Number(item.amount) : -Number(item.amount)}
                  colored
                  showSign
                  style={styles.itemAmount}
                />
              </TouchableOpacity>
            );
          })}
        </GlassCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    marginRight: 2,
  },
  listCard: {
    padding: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleBox: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
