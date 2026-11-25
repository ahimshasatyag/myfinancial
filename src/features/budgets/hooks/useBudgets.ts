import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budgetService';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useBudgets() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.BUDGETS.LIST,
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return budgetService.getBudgets(userId);
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (input: { name: string; totalAmount: number; startDate: string; endDate: string }) => {
      if (!userId) throw new Error('User not authenticated');
      return budgetService.createBudget(userId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BUDGETS.LIST });
    },
  });

  return { ...query, createBudget: createMutation.mutateAsync, isCreating: createMutation.isPending };
}
