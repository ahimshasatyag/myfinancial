import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transaction-service';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { TransactionFilterOptions } from '../../../types/common.types';
import { useAuth } from '../../../providers/auth-provider';

export function useTransactions(filters?: TransactionFilterOptions) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS.LIST(filters), userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return transactionService.getTransactions(userId, filters);
    },
    enabled: !!userId,
  });
}
