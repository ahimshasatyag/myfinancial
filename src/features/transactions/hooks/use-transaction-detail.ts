import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction-service';
import { UpdateTransactionInput } from '../types/transaction.types';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useTransactionDetail(id: string) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const invalidateRelated = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
    queryClient.invalidateQueries({ queryKey: ['budgets'] });
    queryClient.invalidateQueries({ queryKey: ['reports'] });
  };

  const query = useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS.DETAIL(id), userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return transactionService.getTransactionById(userId, id);
    },
    enabled: !!userId && !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateTransactionInput) => {
      if (!userId) throw new Error('User not authenticated');
      return transactionService.updateTransaction(userId, id, input);
    },
    onSuccess: invalidateRelated,
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return transactionService.deleteTransaction(userId, id);
    },
    onSuccess: invalidateRelated,
  });

  return {
    ...query,
    transaction: query.data,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
