import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useReports(date: Date = new Date()) {
  const { userId } = useAuth();
  const monthKey = date.toISOString().slice(0, 7);

  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.MONTHLY(monthKey),
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return reportService.getMonthlyReport(userId, date);
    },
    enabled: !!userId,
  });
}
