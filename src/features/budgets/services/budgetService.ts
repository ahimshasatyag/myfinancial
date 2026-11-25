import { supabase } from '../../../lib/supabase/client';

export const budgetService = {
  async getBudgets(userId: string) {
    const { data, error } = await (supabase as any)
      .from('budget_progress')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []) as any[];
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
