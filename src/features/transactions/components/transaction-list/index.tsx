import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '../../../../components/ui/glass-card';
import { TransactionCard } from '../transaction-card';
import { EmptyState } from '../../../../components/common/empty-state';
import { ErrorState } from '../../../../components/common/error-state';
import { DateText } from '../../../../components/common/date-text';
import { TransactionWithDetails } from '../../types/transaction.types';
import { AccountType } from '../../../../types/database.types';
import { groupTransactionsByDate } from '../../../../utils/transaction';
import { useTheme } from '../../../../providers/theme-provider';
import { ROUTES } from '../../../../constants/routes';

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: 'Tunai',
  bank: 'Bank',
  e_wallet: 'E-Wallet',
  credit_card: 'Kartu Kredit',
  investment: 'Investasi',
  other: 'Lainnya',
};

export interface TransactionListProps {
  transactions: TransactionWithDetails[];
  onRefresh?: () => void;
  refreshing?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onRefresh,
  refreshing = false,
  isError = false,
  errorMessage,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const grouped = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  if (isError) {
    return (
      <GlassCard style={{ marginTop: 12 }}>
        <ErrorState
          message={errorMessage || 'Gagal memuat daftar transaksi.'}
          onRetry={onRefresh}
        />
      </GlassCard>
    );
  }

  if (!refreshing && transactions.length === 0) {
    return (
      <GlassCard style={{ marginTop: 12 }}>
        <EmptyState
          title="Belum ada transaksi"
          description="Mulai catat pemasukan dan pengeluaran Anda agar kondisi keuangan terpantau akurat."
          actionTitle="Catat Transaksi"
          onAction={() => router.push(ROUTES.TRANSACTIONS.NEW as any)}
        />
      </GlassCard>
    );
  }

  return (
    <FlatList
      data={grouped}
      keyExtractor={(group) => group.date}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      renderItem={({ item: group }) => {
        const accountTypes = Array.from(
          new Set(
            group.items
              .map((tx) => tx.accounts?.account_type)
              .filter((t): t is AccountType => Boolean(t))
          )
        );

        return (
          <View className="mb-4">
            <View className="px-1 mb-2">
              <View className="flex-row items-center justify-between">
                <DateText
                  date={group.date}
                  format="long"
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: theme.colors.textSecondary,
                  }}
                />
                <Text className="text-xs font-medium" style={{ color: theme.colors.textMuted }}>
                  {group.items.length} transaksi
                </Text>
              </View>

              {accountTypes.length > 0 ? (
                <View className="flex-row flex-wrap gap-1.5 mt-1.5">
                  {accountTypes.map((type) => (
                    <View
                      key={type}
                      className="px-2.5 py-1 rounded-full border"
                      style={{
                        backgroundColor: theme.colors.cardMuted,
                        borderColor: theme.colors.border,
                      }}
                    >
                      <Text
                        className="text-[14px] font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {ACCOUNT_TYPE_LABELS[type] || type}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>

            <GlassCard contentStyle={{ padding: 0 }}>
              {group.items.map((tx, idx) => (
                <View key={tx.id}>
                  <TransactionCard
                    title={tx.title}
                    amount={Number(tx.amount)}
                    currencyCode={tx.currency_code}
                    type={tx.transaction_type}
                    status={tx.status}
                    date={tx.transaction_date}
                    accountName={tx.accounts?.name}
                    categoryName={tx.categories?.name}
                    onPress={() => router.push(ROUTES.TRANSACTIONS.DETAIL(tx.id) as any)}
                  />
                  {idx < group.items.length - 1 && (
                    <View
                      className="h-[1px] w-full"
                      style={{ backgroundColor: theme.colors.border }}
                    />
                  )}
                </View>
              ))}
            </GlassCard>
          </View>
        );
      }}
    />
  );
};
