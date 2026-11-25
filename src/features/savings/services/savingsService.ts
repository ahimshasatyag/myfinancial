import { supabase } from '../../../lib/supabase/client';

export const savingsService = {
  async getSavingsGoals(userId: string) {
    const { data, error } = await (supabase as any)
      .from('savings_goal_progress')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []) as any[];
  },

  async createGoal(userId: string, input: { name: string; targetAmount: number; targetDate?: string }) {
    const { data, error } = await (supabase as any)
      .from('savings_goals')
      .insert({
        user_id: userId,
        name: input.name,
        target_amount: input.targetAmount,
        target_date: input.targetDate || null,
        currency_code: 'IDR',
        status: 'active',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
