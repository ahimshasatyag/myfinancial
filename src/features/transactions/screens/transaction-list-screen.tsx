import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { FabButton } from '../../../components/ui/fab-button';
import { GlassInput } from '../../../components/ui/glass-input';
import { ROUTES } from '../../../constants/routes';
import { useDebounce } from '../../../hooks/use-debounce';
import { useTheme } from '../../../providers/theme-provider';
import { formatDate, getTodayDateString } from '../../../utils/date';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { TransactionList } from '../components/transaction-list';
import {
  TransactionFilter,
  TransactionTypeFilter,
} from '../components/transaction-filter';
import { TransactionSummary } from '../components/transaction-summary';
import { useTransactions } from '../hooks/use-transactions';
import { transactionCalculator } from '../utils/transaction-calculator';

export const TransactionListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<TransactionTypeFilter>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);

  const todayDate = getTodayDateString();
  const { data: accounts } = useAccounts();

  const accountOptions = useMemo(
    () =>
      (accounts || []).map((acc) => ({
        id: acc.account_id,
        name: acc.account_name,
      })),
    [accounts]
  );

  // Hanya tampilkan transaksi hari ini
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactions({
    type: filterType,
    accountId: accountFilter === 'all' ? undefined : accountFilter,
    startDate: todayDate,
    endDate: todayDate,
    searchQuery: debouncedSearch || undefined,
  });

  const totals = transactionCalculator.calculateTotals(transactions || []);

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Aktivitas Transaksi"
        subtitle={`Hari ini, ${formatDate(todayDate, 'long')}`}
      />
      <View className="flex-1 px-4 pt-1.5">
        <GlassInput
          placeholder="Cari transaksi hari ini..."
          value={searchText}
          onChangeText={setSearchText}
          leftIcon={<Search size={18} color={theme.colors.textMuted} />}
          containerStyle={{ marginBottom: 12 }}
        />

        {/* 1. Ringkasan Total Masuk dan Total Keluar Hari Ini */}
        <TransactionSummary
          totalIncome={totals.totalIncome}
          totalExpense={totals.totalExpense}
        />

        {/* 2. Dropdown Filter (Tipe & Akun) */}
        <TransactionFilter
          currentType={filterType}
          onSelectType={setFilterType}
          accounts={accountOptions}
          currentAccountId={accountFilter}
          onSelectAccount={setAccountFilter}
        />

        {/* 3. Header Transaksi Hari Ini + Tombol Lihat Semua */}
        <View className="flex-row items-center justify-between mb-2.5 px-0.5">
          <Text
            className="text-[14px] font-bold"
            style={{ color: theme.colors.textPrimary }}
          >
            Transaksi Hari Ini
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(ROUTES.TRANSACTIONS.ALL as any)}
            className="flex-row items-center gap-0.5"
          >
            <Text
              className="text-[12px] font-semibold"
              style={{ color: theme.colors.textSecondary }}
            >
              Lihat Semua Transaksi
            </Text>
            <ChevronRight size={14} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* 4. Daftar Transaksi Hari Ini */}
        <TransactionList
          transactions={transactions || []}
          onRefresh={refetch}
          refreshing={isLoading}
          isError={isError}
          errorMessage={(error as Error)?.message}
        />
      </View>

      <FabButton
        hasTabBar
        accessibilityLabel="Tambah transaksi baru"
        onPress={() => router.push(ROUTES.TRANSACTIONS.NEW as any)}
      />
    </ScreenContainer>
  );
};
