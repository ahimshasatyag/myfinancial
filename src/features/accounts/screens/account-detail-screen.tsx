import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pencil, Plus, Archive, RotateCcw, Trash2 } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassButton } from '../../../components/ui/glass-button';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { AppDivider } from '../../../components/ui/app-divider';
import { CurrencyText } from '../../../components/common/currency-text';
import { ConfirmationDialog } from '../../../components/common/confirmation-dialog';
import { LoadingOverlay } from '../../../components/common/loading-overlay';
import { ErrorState } from '../../../components/common/error-state';
import { useAccountDetail, useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../../transactions/hooks/use-transactions';
import { TransactionCard } from '../../transactions/components/transaction-card';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

export const AccountDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: account, isLoading, isError, error, refetch } = useAccountDetail(id);
  const { toggleAccountActive, deleteAccount, isUpdating, isDeleting } = useAccounts();
  const { data: recentTx } = useTransactions({ accountId: id, limit: 10 });

  if (isLoading) {
    return <LoadingOverlay visible message="Memuat detail akun..." />;
  }

  if (isError || !account) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Detail Akun" showBack />
        <View className="p-4">
          <GlassCard>
            <ErrorState
              message={(error as Error)?.message || 'Akun tidak ditemukan.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        </View>
      </ScreenContainer>
    );
  }

  const handleToggleActive = async () => {
    try {
      await toggleAccountActive({ id: account.id, isActive: !account.is_active });
      refetch();
    } catch (e: any) {
      Alert.alert('Gagal', e?.message || 'Tidak dapat mengubah status akun.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(account.id);
      setShowDeleteConfirm(false);
      router.back();
    } catch (e: any) {
      setShowDeleteConfirm(false);
      Alert.alert('Tidak Dapat Menghapus', e?.message || 'Akun sudah memiliki transaksi.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={account.name}
        showBack
        rightAction={
          <HeaderActions
            actions={[
              {
                icon: <Pencil size={18} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.ACCOUNTS.EDIT(account.id) as any),
              },
            ]}
          />
        }
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard variant="glass" intensity={55} style={{ marginBottom: 16 }}>
          <View className="items-center py-2">
            <GlassBadge
              label={account.is_active ? 'Aktif' : 'Nonaktif'}
              variant={account.is_active ? 'success' : 'default'}
              style={{ marginBottom: 12 }}
            />
            <Text className="text-xs font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
              Saldo Saat Ini ({account.currency_code})
            </Text>
            <CurrencyText
              amount={Number(account.current_balance)}
              currencyCode={account.currency_code}
              style={{ fontSize: 30, fontWeight: '800', marginBottom: 8 }}
            />
            <Text className="text-xs font-medium" style={{ color: theme.colors.textMuted }}>
              {account.institution_name ? `${account.institution_name} • ` : ''}
              {account.account_type.replace('_', ' ').toUpperCase()}
              {account.account_number_last4 ? ` • •••• ${account.account_number_last4}` : ''}
            </Text>
          </View>

          <AppDivider className="my-4" />

          <View className="flex-row justify-between items-center">
            <Text className="text-xs" style={{ color: theme.colors.textSecondary }}>
              Saldo Awal
            </Text>
            <CurrencyText
              amount={Number(account.opening_balance)}
              currencyCode={account.currency_code}
              style={{ fontSize: 13, fontWeight: '600' }}
            />
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xs" style={{ color: theme.colors.textSecondary }}>
              Masuk Total Dashboard
            </Text>
            <Text className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
              {account.include_in_total ? 'Ya' : 'Tidak'}
            </Text>
          </View>
          {account.notes ? (
            <View className="mt-3">
              <Text className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>
                Catatan
              </Text>
              <Text className="text-[13px]" style={{ color: theme.colors.textPrimary }}>
                {account.notes}
              </Text>
            </View>
          ) : null}
        </GlassCard>

        {/* Quick actions */}
        <View className="flex-row gap-2.5 mb-5">
          {account.is_active && (
            <GlassButton
              title="Catat Transaksi"
              onPress={() =>
                router.push({
                  pathname: ROUTES.TRANSACTIONS.NEW as any,
                  params: { accountId: account.id },
                })
              }
              size="sm"
              leftIcon={<Plus size={15} color={theme.colors.buttonText} />}
              style={{ flex: 1 }}
            />
          )}
          <GlassButton
            title={account.is_active ? 'Arsipkan' : 'Aktifkan'}
            variant="outline"
            onPress={handleToggleActive}
            loading={isUpdating}
            size="sm"
            leftIcon={
              account.is_active ? (
                <Archive size={15} color={theme.colors.textPrimary} />
              ) : (
                <RotateCcw size={15} color={theme.colors.textPrimary} />
              )
            }
            style={{ flex: 1 }}
          />
          <GlassButton
            title=""
            variant="outline"
            onPress={() => setShowDeleteConfirm(true)}
            size="sm"
            leftIcon={<Trash2 size={15} color={theme.colors.danger} />}
          />
        </View>

        {/* Recent transactions for this account */}
        <Text className="text-sm font-semibold mb-2.5" style={{ color: theme.colors.textPrimary }}>
          Transaksi Terbaru di Akun Ini
        </Text>
        <GlassCard contentStyle={{ padding: 0 }}>
          {!recentTx || recentTx.length === 0 ? (
            <View className="p-5 items-center">
              <Text className="text-xs" style={{ color: theme.colors.textMuted }}>
                Belum ada transaksi pada akun ini.
              </Text>
            </View>
          ) : (
            recentTx.map((tx, idx) => (
              <View key={tx.id}>
                <TransactionCard
                  title={tx.title}
                  amount={Number(tx.amount)}
                  currencyCode={tx.currency_code}
                  type={tx.transaction_type}
                  status={tx.status}
                  date={tx.transaction_date}
                  categoryName={tx.categories?.name}
                  onPress={() => router.push(ROUTES.TRANSACTIONS.DETAIL(tx.id) as any)}
                />
                {idx < recentTx.length - 1 && (
                  <View className="h-[1px]" style={{ backgroundColor: theme.colors.border }} />
                )}
              </View>
            ))
          )}
        </GlassCard>
      </ScrollView>

      <ConfirmationDialog
        visible={showDeleteConfirm}
        title="Hapus Akun?"
        message="Akun yang sudah memiliki riwayat transaksi tidak bisa dihapus permanen dan sebaiknya diarsipkan saja."
        confirmLabel="Hapus"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </ScreenContainer>
  );
};
