import { supabase } from '../lib/supabase/client';

export const backupService = {
  async exportUserData(userId: string) {
    const [accounts, transactions, categories, goals, goalContributions] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userId),
      supabase.from('transactions').select('*').eq('user_id', userId),
      supabase.from('categories').select('*').eq('user_id', userId),
      (supabase as any).from('goals').select('*').eq('user_id', userId),
      (supabase as any).from('goal_contributions').select('*').eq('user_id', userId),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      userId,
      accounts: accounts.data || [],
      transactions: transactions.data || [],
      categories: categories.data || [],
      goals: goals.data || [],
      goalContributions: goalContributions.data || [],
    };
  },
};
