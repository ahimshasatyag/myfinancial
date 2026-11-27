import { supabase } from '../../../lib/supabase/client';
import { getMonthStartAndEnd } from '../../../utils/date';

export interface DailyTransactionItem {
  id: string;
  title: string;
  amount: number;
  transaction_type: 'income' | 'expense' | 'transfer';
  category_name?: string;
  category_icon?: string;
}

export interface DailyFinancialSummary {
  date: string; // 'YYYY-MM-DD'
  dayNumber: number;
  totalIncome: number;
  totalExpense: number;
  transactions: DailyTransactionItem[];
}

export interface CategorySpendItem {
  category_id?: string;
  category_name: string;
  total_spend: number;
  percentage: number;
  color: string;
  icon?: string;
}

export interface MonthlyReportData {
  cashFlow: {
    total_income: number;
    total_expense: number;
    net_cash_flow: number;
  };
  categorySpend: CategorySpendItem[];
  dailyData: Record<string, DailyFinancialSummary>;
  trendData: number[];
  peakExpense: {
    day: number;
    dateStr: string;
    amount: number;
  };
  averageDailyExpense: number;
  activeDaysCount: number;
  totalExpense: number;
}

export const VIBRANT_CATEGORY_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#F97316', // Orange
];

export function formatCalendarAmount(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) {
    const val = abs / 1_000_000_000;
    return (val >= 10 || val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'M';
  }
  if (abs >= 1_000_000) {
    const val = abs / 1_000_000;
    return (val >= 10 || val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'JT';
  }
  if (abs >= 1_000) {
    const val = abs / 1_000;
    return (val >= 100 || val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'RB';
  }
  return Math.round(abs).toString();
}

export const reportService = {
  async getMonthlyReport(userId: string, date: Date = new Date()): Promise<MonthlyReportData> {
    const { startDate, endDate } = getMonthStartAndEnd(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize daily map for every single day in the month
    const dailyData: Record<string, DailyFinancialSummary> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyData[dateStr] = {
        date: dateStr,
        dayNumber: day,
        totalIncome: 0,
        totalExpense: 0,
        transactions: [],
      };
    }

    // Query transactions table directly
    const { data: rawTransactions, error: txError } = await (supabase as any)
      .from('transactions')
      .select(`
        id,
        title,
        amount,
        transaction_type,
        transaction_date,
        category_id,
        status,
        categories ( id, name, icon, color )
      `)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: true });

    if (txError) {
      console.warn('Error fetching transactions for monthly report:', txError.message);
    }

    const transactions = rawTransactions || [];

    let totalIncome = 0;
    let totalExpense = 0;
    const categorySpendMap: Record<
      string,
      { category_id?: string; category_name: string; total_spend: number; color?: string; icon?: string }
    > = {};

    transactions.forEach((tx: any) => {
      const amount = Number(tx.amount || 0);
      const dateKey = tx.transaction_date;

      if (tx.transaction_type === 'income') {
        totalIncome += amount;
        if (dailyData[dateKey]) {
          dailyData[dateKey].totalIncome += amount;
        }
      } else if (tx.transaction_type === 'expense') {
        totalExpense += amount;
        if (dailyData[dateKey]) {
          dailyData[dateKey].totalExpense += amount;
        }

        const catId = tx.category_id || 'uncategorized';
        const catName = tx.categories?.name || 'Lainnya';
        if (!categorySpendMap[catId]) {
          categorySpendMap[catId] = {
            category_id: catId,
            category_name: catName,
            total_spend: 0,
            color: tx.categories?.color,
            icon: tx.categories?.icon,
          };
        }
        categorySpendMap[catId].total_spend += amount;
      }

      if (dailyData[dateKey]) {
        dailyData[dateKey].transactions.push({
          id: tx.id,
          title: tx.title || 'Transaksi',
          amount,
          transaction_type: tx.transaction_type,
          category_name: tx.categories?.name,
          category_icon: tx.categories?.icon,
        });
      }
    });

    const categorySpend: CategorySpendItem[] = Object.values(categorySpendMap)
      .sort((a, b) => b.total_spend - a.total_spend)
      .map((cat, idx) => ({
        category_id: cat.category_id,
        category_name: cat.category_name,
        total_spend: cat.total_spend,
        percentage: totalExpense > 0 ? Math.round((cat.total_spend / totalExpense) * 100) : 0,
        color: cat.color || VIBRANT_CATEGORY_COLORS[idx % VIBRANT_CATEGORY_COLORS.length],
        icon: cat.icon,
      }));

    let peakDay = 0;
    let peakDateStr = '';
    let peakAmount = 0;
    let activeDaysCount = 0;

    const trendData: number[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayExpense = dailyData[dateStr]?.totalExpense || 0;
      trendData.push(dayExpense);

      if (dayExpense > 0) {
        activeDaysCount++;
      }
      if (dayExpense > peakAmount) {
        peakAmount = dayExpense;
        peakDay = day;
        peakDateStr = dateStr;
      }
    }

    const averageDailyExpense = daysInMonth > 0 ? Math.round(totalExpense / daysInMonth) : 0;

    return {
      cashFlow: {
        total_income: totalIncome,
        total_expense: totalExpense,
        net_cash_flow: totalIncome - totalExpense,
      },
      categorySpend,
      dailyData,
      trendData,
      peakExpense: {
        day: peakDay,
        dateStr: peakDateStr,
        amount: peakAmount,
      },
      averageDailyExpense,
      activeDaysCount,
      totalExpense,
    };
  },
};
