import { supabase } from '../../../lib/supabase/client';

export const recurringService = {
  async getRecurringTransactions(userId: string) {
    const { data, error } = await (supabase as any)
      .from('recurring_transactions')
      .select('*, accounts(name), categories(name)')
      .eq('user_id', userId)
      .order('next_run_date');
    if (error) throw error;
    return (data || []) as any[];
  },
};
