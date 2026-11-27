import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';
import {
  AddInvestmentTxInput,
  CreateInvestmentInput,
  investmentService,
} from '../services/investmentService';

export function useInvestments() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['investments'] });
  };

  const query = useQuery({
    queryKey: [...QUERY_KEYS.INVESTMENTS.LIST, userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return investmentService.getInvestments(userId);
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateInvestmentInput) => {
      if (!userId) throw new Error('User not authenticated');
      return investmentService.createInvestment(userId, input);
    },
    onSuccess: invalidateAll,
  });

  const txMutation = useMutation({
    mutationFn: (input: AddInvestmentTxInput) => {
      if (!userId) throw new Error('User not authenticated');
      return investmentService.addTransaction(userId, input);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INVESTMENTS.DETAIL(vars.investmentId),
      });
    },
  });

  const updateValueMutation = useMutation({
    mutationFn: ({ investmentId, currentValue }: { investmentId: string; currentValue: number }) => {
      if (!userId) throw new Error('User not authenticated');
      return investmentService.updateCurrentValue(userId, investmentId, currentValue);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INVESTMENTS.DETAIL(vars.investmentId),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (investmentId: string) => {
      if (!userId) throw new Error('User not authenticated');
      return investmentService.deleteInvestment(userId, investmentId);
    },
    onSuccess: invalidateAll,
  });

  return {
    ...query,
    createInvestment: createMutation.mutateAsync,
    addTransaction: txMutation.mutateAsync,
    updateCurrentValue: updateValueMutation.mutateAsync,
    deleteInvestment: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isAddingTx: txMutation.isPending,
    isUpdatingValue: updateValueMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useInvestmentDetail(investmentId?: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.INVESTMENTS.DETAIL(investmentId || ''), userId],
    queryFn: () => {
      if (!userId || !investmentId) throw new Error('Investment ID or user missing');
      return investmentService.getInvestmentById(userId, investmentId);
    },
    enabled: !!userId && !!investmentId,
  });
}
