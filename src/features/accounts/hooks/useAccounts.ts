import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';
import { CreateAccountInput, UpdateAccountInput } from '../types/account.types';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useAccounts(options?: { onlyActive?: boolean }) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
    queryClient.invalidateQueries({ queryKey: ['reports'] });
  };

  const query = useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNTS.LIST, userId, options?.onlyActive ?? false],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return accountService.getAccounts(userId, options);
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateAccountInput) => {
      if (!userId) throw new Error('User not authenticated');
      return accountService.createAccount(userId, input);
    },
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAccountInput }) => {
      if (!userId) throw new Error('User not authenticated');
      return accountService.updateAccount(userId, id, input);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS.DETAIL(vars.id) });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!userId) throw new Error('User not authenticated');
      return accountService.toggleAccountActive(userId, id, isActive);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS.DETAIL(vars.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userId) throw new Error('User not authenticated');
      return accountService.deleteAccount(userId, id);
    },
    onSuccess: invalidateAll,
  });

  return {
    ...query,
    createAccount: createMutation.mutateAsync,
    updateAccount: updateMutation.mutateAsync,
    toggleAccountActive: toggleActiveMutation.mutateAsync,
    deleteAccount: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending || toggleActiveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useAccountDetail(id?: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNTS.DETAIL(id || ''), userId],
    queryFn: () => {
      if (!userId || !id) throw new Error('Account ID or user missing');
      return accountService.getAccountById(userId, id);
    },
    enabled: !!userId && !!id,
  });
}
