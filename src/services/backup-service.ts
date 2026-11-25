import { supabase } from '../lib/supabase/client';

export const backupService = {
  async exportUserData(userId: string) {
    const [accounts, transactions, categories, budgets, savings] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userId),
      supabase.from('transactions').select('*').eq('user_id', userId),
      supabase.from('categories').select('*').eq('user_id', userId),
      supabase.from('budgets').select('*').eq('user_id', userId),
      supabase.from('savings_goals').select('*').eq('user_id', userId),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      userId,
      accounts: accounts.data || [],
      transactions: transactions.data || [],
      categories: categories.data || [],
      budgets: budgets.data || [],
      savings: savings.data || [],
    };
  },
};
