import { useRouter } from 'expo-router';
import { Bell, User } from 'lucide-react-native';
import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { EmptyState } from '../../../components/common/empty-state';
import { ErrorState } from '../../../components/common/error-state';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../providers/auth-provider';
import { useTheme } from '../../../providers/theme-provider';
import { useSavings } from '../../savings/hooks/useSavings';
import { BalanceCard } from '../components/balance-card';
import { GoalsPreview } from '../components/goals-preview';
import { QuickActions } from '../components/quick-actions';
import { RecentTransactions } from '../components/recent-transactions';
import { SpendingInsight } from '../components/spending-insight';
import { useDashboard } from '../hooks/use-dashboard';

export const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const { theme } = useTheme();
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const { data: goals, isLoading: isGoalsLoading, refetch: refetchGoals } = useSavings();

  const greeting = profile?.full_name ? `Halo, ${profile.full_name}` : 'Budgetku';
  const hasNoAccounts = !isLoading && data && data.accountBalances.length === 0;

  return (
    <ScreenContainer>
      <ScreenHeader
        title={greeting}
        subtitle="Ringkasan finansial Anda"
        rightAction={
          <HeaderActions
            actions={[
              {
                icon: <Bell size={18} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.SETTINGS.NOTIFICATIONS as any),
              },
              {
                icon: <User size={18} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.PROFILE.INDEX as any),
              },
            ]}
          />
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isGoalsLoading}
            onRefresh={() => {
              refetch();
              refetchGoals();
            }}
          />
        }
      >
        {isError ? (
          <GlassCard style={{ marginBottom: 16 }}>
            <ErrorState
              message={(error as Error)?.message || 'Gagal memuat ringkasan dashboard.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        ) : null}

        <BalanceCard
          totalBalance={data?.netCashFlow ?? data?.totalBalance ?? 0}
          income={data?.monthlyIncome || 0}
          expense={data?.monthlyExpense || 0}
          currencyCode={data?.primaryCurrency || 'IDR'}
          balancesByCurrency={data?.balancesByCurrency || []}
          onAddTransaction={() => router.push(ROUTES.TRANSACTIONS.NEW as any)}
        />

        {hasNoAccounts ? (
          <GlassCard style={{ marginBottom: 16 }}>
            <EmptyState
              title="Mulai dengan Menambah Akun"
              description="Tambahkan rekening bank, dompet tunai, atau e-wallet pertama Anda agar saldo dapat dihitung otomatis."
              actionTitle="Tambah Akun Pertama"
              onAction={() => router.push(ROUTES.ACCOUNTS.NEW as any)}
            />
          </GlassCard>
        ) : null}

        <GoalsPreview goals={goals || []} />
        <QuickActions />
        <SpendingInsight
          income={data?.monthlyIncome || 0}
          expense={data?.monthlyExpense || 0}
          transactionCount={data?.monthlyTransactionCount || 0}
        />
        <RecentTransactions transactions={data?.recentTransactions || []} />
        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
};
