import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction-service';
import {
  CreateTransactionInput,
  CreateTransferInput,
  UpdateTransactionInput,
} from '../types/transaction.types';
import { validateTransactionInput, validateTransferInput } from '../schemas/transaction.schema';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useTransactionForm() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // PRD §14.4: invalidasi seluruh cache terkait setelah mutasi finansial
  const invalidateFinancialQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
    queryClient.invalidateQueries({ queryKey: ['budgets'] });
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    queryClient.invalidateQueries({ queryKey: ['savings'] });
  };

  const createTxMutation = useMutation({
    mutationFn: (input: CreateTransactionInput) => {
      if (!userId) throw new Error('User not authenticated');
      return transactionService.createTransaction(userId, input);
    },
    onSuccess: invalidateFinancialQueries,
  });

  const updateTxMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTransactionInput }) => {
      if (!userId) throw new Error('User not authenticated');
      return transactionService.updateTransaction(userId, id, input);
    },
    onSuccess: invalidateFinancialQueries,
  });

  const createTransferMutation = useMutation({
    mutationFn: (input: CreateTransferInput) => {
      if (!userId) throw new Error('User not authenticated');
      return transactionService.createTransfer(userId, input);
    },
    onSuccess: invalidateFinancialQueries,
  });

  const submitTransaction = async (input: CreateTransactionInput) => {
    setFormError(null);
    const errs = validateTransactionInput(input);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    setErrors({});
    try {
      await createTxMutation.mutateAsync(input);
      return true;
    } catch (e: any) {
      setFormError(e?.message || 'Gagal menyimpan transaksi');
      return false;
    }
  };

  const updateTransaction = async (id: string, input: CreateTransactionInput) => {
    setFormError(null);
    const errs = validateTransactionInput(input);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    setErrors({});
    try {
      await updateTxMutation.mutateAsync({ id, input });
      return true;
    } catch (e: any) {
      setFormError(e?.message || 'Gagal memperbarui transaksi');
      return false;
    }
  };

  const submitTransfer = async (input: CreateTransferInput) => {
    setFormError(null);
    const errs = validateTransferInput(input);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    setErrors({});
    try {
      await createTransferMutation.mutateAsync(input);
      return true;
    } catch (e: any) {
      setFormError(e?.message || 'Gagal menyimpan transfer');
      return false;
    }
  };

  return {
    submitTransaction,
    updateTransaction,
    submitTransfer,
    errors,
    formError,
    isLoading:
      createTxMutation.isPending || updateTxMutation.isPending || createTransferMutation.isPending,
  };
}
