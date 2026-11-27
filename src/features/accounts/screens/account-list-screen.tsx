import React, { useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Landmark,
  Wallet,
  CreditCard,
  Smartphone,
  TrendingUp,
  ChevronRight,
} from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { FabButton } from '../../../components/ui/fab-button';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { CurrencyText } from '../../../components/common/currency-text';
import { EmptyState } from '../../../components/common/empty-state';
import { ErrorState } from '../../../components/common/error-state';
import { useAccounts } from '../hooks/useAccounts';
import { sumBalancesByCurrency } from '../../../utils/transaction';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

export const AccountListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { data: accounts, isLoading, isError, error, refetch } = useAccounts();

  const totalsByCurrency = useMemo(
    () => sumBalancesByCurrency(accounts || [], true),
    [accounts]
  );

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Landmark size={20} color={theme.colors.textPrimary} />;
      case 'credit_card':
        return <CreditCard size={20} color={theme.colors.textPrimary} />;
      case 'e_wallet':
        return <Smartphone size={20} color={theme.colors.textPrimary} />;
      case 'investment':
        return <TrendingUp size={20} color={theme.colors.textPrimary} />;
      default:
        return <Wallet size={20} color={theme.colors.textPrimary} />;
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Daftar Akun & Dompet" showBack />

      <View className="flex-1 px-4 pt-3">
        {isError ? (
          <GlassCard>
            <ErrorState
              message={(error as Error)?.message || 'Gagal memuat daftar akun.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        ) : !isLoading && (!accounts || accounts.length === 0) ? (
          <GlassCard>
            <EmptyState
              title="Belum ada akun"
              description="Tambahkan rekening bank, dompet tunai, atau e-wallet untuk mulai mencatat transaksi."
              actionTitle="Tambah Akun"
              onAction={() => router.push(ROUTES.ACCOUNTS.NEW as any)}
            />
          </GlassCard>
        ) : (
          <FlatList
            data={accounts || []}
            keyExtractor={(item) => item.account_id}
            onRefresh={refetch}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 96 }}
            ListHeaderComponent={
              totalsByCurrency.length > 0 ? (
                <GlassCard variant="glass" intensity={50} style={{ marginBottom: 16 }}>
                  <Text
                    className="text-xs font-medium mb-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Total Saldo (Akun dalam Total)
                  </Text>
                  <View className="gap-1.5">
                    {totalsByCurrency.map((item) => (
                      <View
                        key={item.currencyCode}
                        className="flex-row items-baseline justify-between"
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: theme.colors.textMuted }}
                        >
                          {item.currencyCode}
                        </Text>
                        <CurrencyText
                          amount={item.total}
                          currencyCode={item.currencyCode}
                          style={{ fontSize: 22, fontWeight: '800' }}
                        />
                      </View>
                    ))}
                  </View>
                </GlassCard>
              ) : undefined
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.push(ROUTES.ACCOUNTS.DETAIL(item.account_id) as any)}
              >
                <GlassCard
                  style={{
                    marginBottom: 12,
                    opacity: item.is_active ? 1 : 0.6,
                  }}
                  contentStyle={{
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View
                      className="w-11 h-11 rounded-full items-center justify-center mr-3.5"
                      style={{ backgroundColor: theme.colors.cardMuted }}
                    >
                      {getAccountIcon(item.account_type)}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="text-[15px] font-semibold"
                          style={{ color: theme.colors.textPrimary }}
                          numberOfLines={1}
                        >
                          {item.account_name}
                        </Text>
                        {!item.is_active && <GlassBadge label="Nonaktif" size="sm" />}
                      </View>
                      <Text
                        className="text-[11px] font-medium mt-0.5"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {item.account_type.replace('_', ' ').toUpperCase()} • {item.currency_code}
                        {!item.include_in_total ? ' • Di luar total' : ''}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <CurrencyText
                      amount={Number(item.current_balance)}
                      currencyCode={item.currency_code}
                      style={{ fontSize: 15, fontWeight: '700' }}
                    />
                    <ChevronRight size={16} color={theme.colors.textMuted} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <FabButton
        accessibilityLabel="Tambah akun baru"
        onPress={() => router.push(ROUTES.ACCOUNTS.NEW as any)}
      />
    </ScreenContainer>
  );
};
