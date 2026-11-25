import { useQuery } from '@tanstack/react-query';
import { recurringService } from '../services/recurringService';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useRecurring() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.RECURRING.LIST,
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return recurringService.getRecurringTransactions(userId);
    },
    enabled: !!userId,
  });
}
