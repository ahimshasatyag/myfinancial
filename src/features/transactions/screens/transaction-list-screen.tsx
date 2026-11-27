import { useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassInput } from '../../../components/ui/glass-input';
import { ROUTES } from '../../../constants/routes';
import { useDebounce } from '../../../hooks/use-debounce';
import { useTheme } from '../../../providers/theme-provider';
import { TransactionFilter } from '../components/transaction-filter';
import { TransactionList } from '../components/transaction-list';
import { TransactionSummary } from '../components/transaction-summary';
import { useTransactions } from '../hooks/use-transactions';
import { transactionCalculator } from '../utils/transaction-calculator';

type StatusFilter = 'all' | 'completed' | 'pending' | 'cancelled';

export const TransactionListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);

  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactions({
    type: filterType,
    status: statusFilter,
    searchQuery: debouncedSearch || undefined,
  });

  const totals = transactionCalculator.calculateTotals(transactions || []);

  const statusChips: { label: string; value: StatusFilter }[] = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Selesai', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Batal', value: 'cancelled' },
  ];

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Aktivitas Transaksi"
        rightAction={
          <HeaderActions
            actions={[
              {
                icon: <Plus size={20} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.TRANSACTIONS.NEW as any),
              },
            ]}
          />
        }
      />
      <View className="flex-1 px-4 pt-2">
        <GlassInput
          placeholder="Cari judul atau merchant..."
          value={searchText}
          onChangeText={setSearchText}
          leftIcon={<Search size={18} color={theme.colors.textMuted} />}
          containerStyle={{ marginBottom: 12 }}
        />

        <TransactionSummary
          totalIncome={totals.totalIncome}
          totalExpense={totals.totalExpense}
        />

        <TransactionFilter currentType={filterType} onSelectType={setFilterType} />

        {/* Status Filter Chips */}
        <View className="flex-row flex-wrap gap-2 mb-3 -mt-2">
          {statusChips.map((chip) => {
            const active = statusFilter === chip.value;
            return (
              <TouchableOpacity
                key={chip.value}
                activeOpacity={0.75}
                onPress={() => setStatusFilter(chip.value)}
                className="px-3 py-1 rounded-full border"
                style={{
                  backgroundColor: active ? theme.colors.button : theme.colors.card,
                  borderColor: active ? theme.colors.button : theme.colors.border,
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{
                    color: active ? theme.colors.buttonText : theme.colors.textSecondary,
                  }}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TransactionList
          transactions={transactions || []}
          onRefresh={refetch}
          refreshing={isLoading}
          isError={isError}
          errorMessage={(error as Error)?.message}
        />
      </View>
    </ScreenContainer>
  );
};
