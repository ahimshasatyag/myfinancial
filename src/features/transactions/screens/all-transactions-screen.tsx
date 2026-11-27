import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { FabButton } from '../../../components/ui/fab-button';
import { GlassInput } from '../../../components/ui/glass-input';
import { ROUTES } from '../../../constants/routes';
import { useDebounce } from '../../../hooks/use-debounce';
import { useTheme } from '../../../providers/theme-provider';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { TransactionList } from '../components/transaction-list';
import {
  TransactionFilter,
  TransactionTypeFilter,
} from '../components/transaction-filter';
import { TransactionSummary } from '../components/transaction-summary';
import { useTransactions } from '../hooks/use-transactions';
import { transactionCalculator } from '../utils/transaction-calculator';

export const AllTransactionsScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<TransactionTypeFilter>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);

  const { data: accounts } = useAccounts();

  const accountOptions = useMemo(
    () =>
      (accounts || []).map((acc) => ({
        id: acc.account_id,
        name: acc.account_name,
      })),
    [accounts]
  );

  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactions({
    type: filterType,
    accountId: accountFilter === 'all' ? undefined : accountFilter,
    searchQuery: debouncedSearch || undefined,
    limit: 200,
  });

  const totals = transactionCalculator.calculateTotals(transactions || []);

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Semua Transaksi"
        subtitle="Seluruh riwayat transaksi Anda"
        showBack
      />
      <View className="flex-1 px-4 pt-1.5">
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

        <TransactionFilter
          currentType={filterType}
          onSelectType={setFilterType}
          accounts={accountOptions}
          currentAccountId={accountFilter}
          onSelectAccount={setAccountFilter}
        />

        <TransactionList
          transactions={transactions || []}
          onRefresh={refetch}
          refreshing={isLoading}
          isError={isError}
          errorMessage={(error as Error)?.message}
        />
      </View>

      <FabButton
        accessibilityLabel="Tambah transaksi baru"
        onPress={() => router.push(ROUTES.TRANSACTIONS.NEW as any)}
      />
    </ScreenContainer>
  );
};
