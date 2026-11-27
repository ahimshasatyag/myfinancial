import { supabase } from '../../../lib/supabase/client';

export const budgetService = {
  async getBudgets(userId: string) {
    // 1. Try querying the 'budget_progress' database view
    try {
      const { data, error } = await (supabase as any)
        .from('budget_progress')
        .select('*')
        .eq('user_id', userId);

      if (!error && Array.isArray(data)) {
        return data as any[];
      }
    } catch {
      // Fall through to direct table query fallback if view is missing (404)
    }

    // 2. Fallback: Query 'budgets' table directly and compute progress from 'transactions'
    try {
      const { data: rawBudgets, error: budgetError } = await (supabase as any)
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (budgetError) {
        console.warn('Failed to fetch budgets table fallback:', budgetError.message);
        return [];
      }

      if (!rawBudgets || rawBudgets.length === 0) {
        return [];
      }

      // Fetch user's completed expense transactions to calculate spending
      const { data: expenses } = await (supabase as any)
        .from('transactions')
        .select('amount, transaction_date')
        .eq('user_id', userId)
        .eq('transaction_type', 'expense')
        .eq('status', 'completed');

      const transactions = (expenses || []) as { amount: number; transaction_date: string }[];

      return rawBudgets.map((b: any) => {
        const totalBudget = Number(b.total_amount || 0);
        const spent = transactions
          .filter((t) => {
            if (!t.transaction_date) return false;
            return t.transaction_date >= b.period_start && t.transaction_date <= b.period_end;
          })
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        const percentageUsed =
          totalBudget > 0 ? Math.round((spent / totalBudget) * 100 * 100) / 100 : 0;
        const remaining = Math.max(totalBudget - spent, 0);

        return {
          budget_id: b.id,
          user_id: b.user_id,
          budget_name: b.name,
          period_type: b.period_type,
          period_start: b.period_start,
          period_end: b.period_end,
          total_budget: totalBudget,
          total_spent: spent,
          remaining_amount: remaining,
          percentage_used: percentageUsed,
        };
      });
    } catch (err: any) {
      console.warn('Fallback budget computation error:', err?.message);
      return [];
    }
  },

  async createBudget(userId: string, input: { name: string; totalAmount: number; startDate: string; endDate: string }) {
    const { data, error } = await (supabase as any)
      .from('budgets')
      .insert({
        user_id: userId,
        name: input.name,
        total_amount: input.totalAmount,
        period_start: input.startDate,
        period_end: input.endDate,
        currency_code: 'IDR',
        is_active: true,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
