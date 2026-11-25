import { useQuery } from '@tanstack/react-query';
import { reportService, MonthlyReportData } from '../services/reportService';
import { QUERY_KEYS } from '../../../constants/query-keys';
import { useAuth } from '../../../providers/auth-provider';

export function useReports(date: Date = new Date()) {
  const { userId } = useAuth();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;

  return useQuery<MonthlyReportData>({
    queryKey: QUERY_KEYS.REPORTS.MONTHLY(monthKey),
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return reportService.getMonthlyReport(userId, date);
    },
    enabled: !!userId,
  });
}
