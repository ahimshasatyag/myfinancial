import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '../../../../components/ui/glass-card';
import { TransactionCard } from '../transaction-card';
import { EmptyState } from '../../../../components/common/empty-state';
import { ErrorState } from '../../../../components/common/error-state';
import { DateText } from '../../../../components/common/date-text';
import { TransactionWithDetails } from '../../types/transaction.types';
import { groupTransactionsByDate } from '../../../../utils/transaction';
import { useTheme } from '../../../../providers/theme-provider';
import { ROUTES } from '../../../../constants/routes';

interface AccountTransactionGroup {
  accountId: string;
  accountName: string;
  items: TransactionWithDetails[];
}

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
        // Kelompokkan transaksi pada tanggal ini berdasarkan account_id dengan label dari accounts.name
        const accountMap = new Map<string, AccountTransactionGroup>();
        for (const tx of group.items) {
          const accountId = tx.accounts?.id || tx.account_id || 'unknown';
          const accountName = tx.accounts?.name || tx.account_name || 'Tanpa Akun';
          const existing = accountMap.get(accountId);
          if (existing) {
            existing.items.push(tx);
          } else {
            accountMap.set(accountId, {
              accountId,
              accountName,
              items: [tx],
            });
          }
        }
        const accountGroups = Array.from(accountMap.values());

        return (
          <View className="mb-4">
            <View className="flex-row items-center justify-between px-1 mb-2">
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

            {accountGroups.map((accGroup, accIdx) => (
              <View
                key={accGroup.accountId}
                className={accIdx < accountGroups.length - 1 ? 'mb-3' : undefined}
              >
                <View className="flex-row items-center justify-between px-1 mb-1.5">
                  <Text
                    className="text-[13px] font-bold"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {accGroup.accountName}
                  </Text>
                  {accountGroups.length > 1 ? (
                    <Text
                      className="text-[11px] font-medium"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {accGroup.items.length} transaksi
                    </Text>
                  ) : null}
                </View>

                <GlassCard contentStyle={{ padding: 0 }}>
                  {accGroup.items.map((tx, idx) => (
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
                      {idx < accGroup.items.length - 1 && (
                        <View
                          className="h-[1px] w-full"
                          style={{ backgroundColor: theme.colors.border }}
                        />
                      )}
                    </View>
                  ))}
                </GlassCard>
              </View>
            ))}
          </View>
        );
      }}
    />
  );
};
