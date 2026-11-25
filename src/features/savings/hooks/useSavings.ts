import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsService } from '../services/savingsService';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useSavings() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.SAVINGS.LIST,
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return savingsService.getSavingsGoals(userId);
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (input: { name: string; targetAmount: number; targetDate?: string }) => {
      if (!userId) throw new Error('User not authenticated');
      return savingsService.createGoal(userId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS.LIST });
    },
  });

  return { ...query, createGoal: createMutation.mutateAsync, isCreating: createMutation.isPending };
}
