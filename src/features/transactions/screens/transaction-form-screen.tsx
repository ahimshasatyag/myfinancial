import React, { useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { LoadingOverlay } from '../../../components/common/loading-overlay';
import { TransactionForm } from '../components/transaction-form';
import { useTransactionForm } from '../hooks/use-transaction-form';
import { useTransactionDetail } from '../hooks/use-transaction-detail';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useCategories } from '../../categories/hooks/useCategories';
import { CreateTransactionInput } from '../types/transaction.types';

export const TransactionFormScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    type?: 'income' | 'expense';
    accountId?: string;
  }>();
  const isEdit = !!params.id;

  const { submitTransaction, updateTransaction, errors, formError, isLoading } =
    useTransactionForm();
  const { transaction: existing, isLoading: isLoadingDetail } = useTransactionDetail(
    params.id || ''
  );

  // PRD §6.3 & §13.1: gunakan feature hooks & hanya tampilkan akun/kategori aktif
  const { data: accounts } = useAccounts({ onlyActive: true });
  const { data: categories } = useCategories({ onlyActive: true });

  const accountOptions = useMemo(
    () =>
      (accounts || []).map((a) => ({
        id: a.account_id,
        name: a.account_name,
        currencyCode: a.currency_code,
      })),
    [accounts]
  );

  const categoryOptions = useMemo(
    () =>
      (categories || []).map((c) => ({
        id: c.id,
        name: c.name,
        transactionType: c.transaction_type,
      })),
    [categories]
  );

  const handleSubmit = async (input: CreateTransactionInput) => {
    const success =
      isEdit && params.id
        ? await updateTransaction(params.id, input)
        : await submitTransaction(input);
    if (success) {
      router.back();
    }
  };

  if (isEdit && isLoadingDetail) {
    return <LoadingOverlay visible message="Memuat transaksi..." />;
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'} showBack />
      <KeyboardWrapper className="px-4 pt-2">
        <TransactionForm
          key={existing?.id || 'new'}
          initialType={params.type || 'expense'}
          initialAccountId={params.accountId}
          initialValues={
            existing
              ? {
                  accountId: existing.account_id,
                  categoryId: existing.category_id,
                  transactionType: existing.transaction_type,
                  amount: Number(existing.amount),
                  currencyCode: existing.currency_code,
                  title: existing.title,
                  merchant: existing.merchant,
                  paymentMethod: existing.payment_method,
                  transactionDate: existing.transaction_date,
                  referenceNumber: existing.reference_number,
                  status: existing.status,
                  notes: existing.notes,
                }
              : undefined
          }
          submitLabel={isEdit ? 'Simpan Perubahan' : 'Simpan Transaksi'}
          accounts={accountOptions}
          categories={categoryOptions}
          errors={errors}
          formError={formError}
          onSubmit={handleSubmit}
          loading={isLoading}
        />
      </KeyboardWrapper>
    </ScreenContainer>
  );
};
