import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassInput } from '../../../components/ui/glass-input';
import { TransactionList } from '../components/transaction-list';
import {
  TransactionFilter,
  TransactionTypeFilter,
  TransactionStatusFilter,
} from '../components/transaction-filter';
import { TransactionSummary } from '../components/transaction-summary';
import { useTransactions } from '../hooks/use-transactions';
import { useDebounce } from '../../../hooks/use-debounce';
import { transactionCalculator } from '../utils/transaction-calculator';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

export const TransactionListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<TransactionTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>('all');
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
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 6 }}>
        <GlassInput
          placeholder="Cari judul atau merchant..."
          value={searchText}
          onChangeText={setSearchText}
          leftIcon={<Search size={18} color={theme.colors.textMuted} />}
          containerStyle={{ marginBottom: 12 }}
        />

        {/* 1. Ringkasan Total Masuk dan Total Keluar (Berdampingan rapi) */}
        <TransactionSummary
          totalIncome={totals.totalIncome}
          totalExpense={totals.totalExpense}
        />

        {/* 2. Dropdown Filter (Tipe & Status) */}
        <TransactionFilter
          currentType={filterType}
          onSelectType={setFilterType}
          currentStatus={statusFilter}
          onSelectStatus={setStatusFilter}
        />

        {/* 3. Daftar Transaksi */}
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
