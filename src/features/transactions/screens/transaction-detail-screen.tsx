import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Trash2,
  Pencil,
  Calendar,
  CreditCard,
  Tag,
  Store,
  Hash,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { CurrencyText } from '../../../components/common/currency-text';
import { DateText } from '../../../components/common/date-text';
import { ConfirmationDialog } from '../../../components/common/confirmation-dialog';
import { LoadingOverlay } from '../../../components/common/loading-overlay';
import { ErrorState } from '../../../components/common/error-state';
import { useTransactionDetail } from '../hooks/use-transaction-detail';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

export const TransactionDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { transaction, isLoading, isError, error, refetch, deleteTransaction, isDeleting } =
    useTransactionDetail(id!);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return <LoadingOverlay visible message="Memuat detail transaksi..." />;
  }

  if (isError || !transaction) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Detail Transaksi" showBack />
        <View className="p-4">
          <GlassCard>
            <ErrorState
              message={(error as Error)?.message || 'Transaksi tidak ditemukan.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        </View>
      </ScreenContainer>
    );
  }

  const isIncome = transaction.transaction_type === 'income';
  const statusLabel =
    transaction.status === 'completed'
      ? 'Selesai'
      : transaction.status === 'pending'
      ? 'Pending'
      : 'Dibatalkan';

  const handleDelete = async () => {
    await deleteTransaction();
    setShowDeleteConfirm(false);
    router.back();
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Detail Transaksi"
        showBack
        rightAction={
          <HeaderActions
            actions={[
              {
                icon: <Pencil size={18} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.TRANSACTIONS.EDIT(transaction.id) as any),
              },
              {
                icon: <Trash2 size={18} color={theme.colors.danger} />,
                onPress: () => setShowDeleteConfirm(true),
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
            <View
              className="w-14 h-14 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: theme.colors.cardMuted }}
            >
              {isIncome ? (
                <ArrowDownLeft size={26} color={theme.colors.textPrimary} />
              ) : (
                <ArrowUpRight size={26} color={theme.colors.textPrimary} />
              )}
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <GlassBadge label={isIncome ? 'Income' : 'Expense'} size="sm" />
              <View className="flex-row items-center gap-1">
                {transaction.status === 'completed' ? (
                  <CheckCircle2 size={14} color={theme.colors.textPrimary} />
                ) : transaction.status === 'pending' ? (
                  <Clock size={14} color={theme.colors.textSecondary} />
                ) : (
                  <XCircle size={14} color={theme.colors.textMuted} />
                )}
                <Text className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                  {statusLabel}
                </Text>
              </View>
            </View>
            <Text
              className="text-lg font-semibold text-center mb-1.5"
              style={{ color: theme.colors.textPrimary }}
            >
              {transaction.title}
            </Text>
            <CurrencyText
              amount={isIncome ? Number(transaction.amount) : -Number(transaction.amount)}
              currencyCode={transaction.currency_code}
              showSign
              style={{ fontSize: 28, fontWeight: '800' }}
            />
          </View>
        </GlassCard>

        <GlassCard>
          <DetailRow
            icon={<Calendar size={17} color={theme.colors.textMuted} />}
            label="Tanggal"
            value={<DateText date={transaction.transaction_date} format="long" />}
            borderColor={theme.colors.border}
          />
          <DetailRow
            icon={<CreditCard size={17} color={theme.colors.textMuted} />}
            label="Akun"
            value={`${transaction.accounts?.name || '-'} (${transaction.currency_code})`}
            borderColor={theme.colors.border}
          />
          <DetailRow
            icon={<Tag size={17} color={theme.colors.textMuted} />}
            label="Kategori"
            value={transaction.categories?.name || 'Tanpa Kategori'}
            borderColor={theme.colors.border}
          />
          {transaction.payment_method ? (
            <DetailRow
              icon={<CreditCard size={17} color={theme.colors.textMuted} />}
              label="Metode"
              value={transaction.payment_method.replace('_', ' ').toUpperCase()}
              borderColor={theme.colors.border}
            />
          ) : null}
          {transaction.merchant ? (
            <DetailRow
              icon={<Store size={17} color={theme.colors.textMuted} />}
              label="Merchant"
              value={transaction.merchant}
              borderColor={theme.colors.border}
            />
          ) : null}
          {transaction.reference_number ? (
            <DetailRow
              icon={<Hash size={17} color={theme.colors.textMuted} />}
              label="Referensi"
              value={transaction.reference_number}
              borderColor={theme.colors.border}
            />
          ) : null}
          {transaction.notes ? (
            <DetailRow
              icon={<FileText size={17} color={theme.colors.textMuted} />}
              label="Catatan"
              value={transaction.notes}
              borderColor={theme.colors.border}
              isLast
            />
          ) : null}
        </GlassCard>
      </ScrollView>

      <ConfirmationDialog
        visible={showDeleteConfirm}
        title="Hapus Transaksi?"
        message="Transaksi ini akan dihapus permanen dan saldo akun akan otomatis disesuaikan."
        confirmLabel="Hapus"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </ScreenContainer>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  borderColor: string;
  isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, borderColor, isLast }) => {
  const { theme } = useTheme();
  return (
    <View
      className="flex-row items-center justify-between py-3"
      style={!isLast ? { borderBottomWidth: 1, borderBottomColor: borderColor } : undefined}
    >
      <View className="flex-row items-center gap-2.5">
        {icon}
        <Text className="text-[13px]" style={{ color: theme.colors.textSecondary }}>
          {label}
        </Text>
      </View>
      {typeof value === 'string' ? (
        <Text
          className="text-[13px] font-semibold max-w-[60%] text-right"
          style={{ color: theme.colors.textPrimary }}
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
};
