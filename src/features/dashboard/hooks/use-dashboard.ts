import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useDashboard() {
  const { userId, settings } = useAuth();
  const preferredCurrency = settings?.preferred_currency || 'IDR';

  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.SUMMARY, userId, preferredCurrency],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return dashboardService.getDashboardSummary(userId, preferredCurrency);
    },
    enabled: !!userId,
  });
}
