import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionType } from '../../../types/database.types';
import { categoryService } from '../services/categoryService';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useCategories(options?: { type?: TransactionType; onlyActive?: boolean }) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const query = useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES.LIST(options?.type), userId, options?.onlyActive ?? false],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return categoryService.getCategories(userId, options);
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateCategoryInput) => {
      if (!userId) throw new Error('User not authenticated');
      return categoryService.createCategory(userId, input);
    },
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) => {
      if (!userId) throw new Error('User not authenticated');
      return categoryService.updateCategory(userId, id, input);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.DETAIL(vars.id) });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!userId) throw new Error('User not authenticated');
      return categoryService.toggleCategoryActive(userId, id, isActive);
    },
    onSuccess: (_data, vars) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.DETAIL(vars.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userId) throw new Error('User not authenticated');
      return categoryService.deleteCategory(userId, id);
    },
    onSuccess: invalidateAll,
  });

  return {
    ...query,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    toggleCategoryActive: toggleActiveMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending || toggleActiveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useCategoryDetail(id?: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES.DETAIL(id || ''), userId],
    queryFn: () => {
      if (!userId || !id) throw new Error('Category ID or user missing');
      return categoryService.getCategoryById(userId, id);
    },
    enabled: !!userId && !!id,
  });
}
