import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';
import { AddDebtPaymentInput, CreateDebtInput, debtService } from '../services/debtService';

export function useDebts() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['debts'] });
  };

  const query = useQuery({
    queryKey: [...QUERY_KEYS.DEBTS.LIST, userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return debtService.getDebts(userId);
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateDebtInput) => {
      if (!userId) throw new Error('User not authenticated');
      return debtService.createDebt(userId, input);
    },
    onSuccess: invalidateAll,
  });

  const paymentMutation = useMutation({
    mutationFn: (input: AddDebtPaymentInput) => {
      if (!userId) throw new Error('User not authenticated');
      return debtService.addPayment(userId, input);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEBTS.DETAIL(vars.debtId) });
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: ({ debtId, remainingAmount }: { debtId: string; remainingAmount: number }) => {
      if (!userId) throw new Error('User not authenticated');
      return debtService.markAsPaid(userId, debtId, remainingAmount);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEBTS.DETAIL(vars.debtId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (debtId: string) => {
      if (!userId) throw new Error('User not authenticated');
      return debtService.deleteDebt(userId, debtId);
    },
    onSuccess: invalidateAll,
  });

  return {
    ...query,
    createDebt: createMutation.mutateAsync,
    addPayment: paymentMutation.mutateAsync,
    markAsPaid: markPaidMutation.mutateAsync,
    deleteDebt: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isPaying: paymentMutation.isPending,
    isMarkingPaid: markPaidMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useDebtDetail(debtId?: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.DEBTS.DETAIL(debtId || ''), userId],
    queryFn: () => {
      if (!userId || !debtId) throw new Error('Debt ID or user missing');
      return debtService.getDebtById(userId, debtId);
    },
    enabled: !!userId && !!debtId,
  });
}
