import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AddGoalContributionInput,
  CreateGoalInput,
  savingsService,
} from '../services/savingsService';
import { GoalStatus } from '../../../types/database.types';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useSavings(statusFilter: GoalStatus | 'all' = 'all') {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['savings'] });
  };

  const query = useQuery({
    queryKey: [...QUERY_KEYS.SAVINGS.LIST, userId, statusFilter],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return savingsService.getSavingsGoals(userId, statusFilter);
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateGoalInput) => {
      if (!userId) throw new Error('User not authenticated');
      return savingsService.createGoal(userId, input);
    },
    onSuccess: invalidateAll,
  });

  const contributionMutation = useMutation({
    mutationFn: (input: AddGoalContributionInput) => {
      if (!userId) throw new Error('User not authenticated');
      return savingsService.addContribution(userId, input);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS.DETAIL(vars.goalId) });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ goalId, status }: { goalId: string; status: GoalStatus }) => {
      if (!userId) throw new Error('User not authenticated');
      return savingsService.updateGoalStatus(userId, goalId, status);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS.DETAIL(vars.goalId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (goalId: string) => {
      if (!userId) throw new Error('User not authenticated');
      return savingsService.deleteGoal(userId, goalId);
    },
    onSuccess: invalidateAll,
  });

  return {
    ...query,
    createGoal: createMutation.mutateAsync,
    addContribution: contributionMutation.mutateAsync,
    updateGoalStatus: statusMutation.mutateAsync,
    deleteGoal: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isContributing: contributionMutation.isPending,
    isUpdating: statusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useGoalDetail(goalId?: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.SAVINGS.DETAIL(goalId || ''), userId],
    queryFn: () => {
      if (!userId || !goalId) throw new Error('Goal ID or user missing');
      return savingsService.getGoalById(userId, goalId);
    },
    enabled: !!userId && !!goalId,
  });
}
