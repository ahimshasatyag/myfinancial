import { supabase } from '../../../lib/supabase/client';
import { getMonthStartAndEnd } from '../../../utils/date';

export const reportService = {
  async getMonthlyReport(userId: string, date: Date = new Date()) {
    const { startDate, endDate } = getMonthStartAndEnd(date);

    const [{ data: cashFlow }, { data: categorySpend }] = await Promise.all([
      (supabase as any).from('monthly_cash_flow').select('*').eq('user_id', userId).maybeSingle(),
      (supabase as any).from('monthly_category_spend').select('*').eq('user_id', userId),
    ]);

    return {
      cashFlow: cashFlow || { total_income: 0, total_expense: 0, net_cash_flow: 0 },
      categorySpend: (categorySpend || []) as any[],
    };
  },
};
