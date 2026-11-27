import { supabase } from '../../../lib/supabase/client';
import { GoalStatus } from '../../../types/database.types';

export interface GoalOverviewItem {
  goal_id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_amount: number;
  saved_amount: number;
  remaining_amount: number;
  progress_percentage: number;
  currency_code: string;
  target_date: string | null;
  status: GoalStatus;
  icon: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalContributionItem {
  id: string;
  goal_id: string;
  action: 'contribution' | 'withdrawal';
  amount: number;
  contribution_date: string;
  notes: string | null;
  created_at: string;
}

export interface CreateGoalInput {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  currencyCode?: string;
  targetDate?: string | null;
  description?: string | null;
}

export interface AddGoalContributionInput {
  goalId: string;
  action: 'contribution' | 'withdrawal';
  amount: number;
  notes?: string | null;
}

export const savingsService = {
  async getSavingsGoals(
    userId: string,
    statusFilter?: GoalStatus | 'all'
  ): Promise<GoalOverviewItem[]> {
    let query = (supabase as any)
      .from('goals_overview')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return ((data || []) as any[]).map((g) => ({
      ...g,
      target_amount: Number(g.target_amount || 0),
      saved_amount: Number(g.saved_amount || 0),
      remaining_amount: Number(g.remaining_amount || 0),
      progress_percentage: Number(g.progress_percentage || 0),
    }));
  },

  async getGoalById(userId: string, goalId: string) {
    const [{ data: goal, error: goalErr }, { data: contributions, error: contribErr }] =
      await Promise.all([
        (supabase as any)
          .from('goals_overview')
          .select('*')
          .eq('goal_id', goalId)
          .eq('user_id', userId)
          .single(),
        (supabase as any)
          .from('goal_contributions')
          .select('*')
          .eq('goal_id', goalId)
          .eq('user_id', userId)
          .order('contribution_date', { ascending: false })
          .order('created_at', { ascending: false }),
      ]);

    if (goalErr) throw goalErr;
    if (contribErr) throw contribErr;

    return {
      goal: {
        ...goal,
        target_amount: Number(goal.target_amount || 0),
        saved_amount: Number(goal.saved_amount || 0),
        remaining_amount: Number(goal.remaining_amount || 0),
        progress_percentage: Number(goal.progress_percentage || 0),
      } as GoalOverviewItem,
      contributions: ((contributions || []) as any[]).map((c) => ({
        ...c,
        amount: Number(c.amount || 0),
      })) as GoalContributionItem[],
    };
  },

  async createGoal(userId: string, input: CreateGoalInput) {
    if (!input.name.trim()) throw new Error('Nama goal wajib diisi');
    if (!input.targetAmount || input.targetAmount <= 0) {
      throw new Error('Target nominal harus lebih dari 0');
    }

    const initialSaved = Math.max(input.currentAmount || 0, 0);
    const status: GoalStatus = initialSaved >= input.targetAmount ? 'completed' : 'active';

    const { data, error } = await (supabase as any)
      .from('goals')
      .insert({
        user_id: userId,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        target_amount: input.targetAmount,
        current_amount: initialSaved,
        currency_code: (input.currencyCode || 'IDR').toUpperCase(),
        target_date: input.targetDate?.trim() || null,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addContribution(userId: string, input: AddGoalContributionInput) {
    if (!input.amount || input.amount <= 0) {
      throw new Error('Nominal harus lebih dari 0');
    }

    const { data, error } = await (supabase as any)
      .from('goal_contributions')
      .insert({
        user_id: userId,
        goal_id: input.goalId,
        action: input.action,
        amount: input.amount,
        notes: input.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGoalStatus(userId: string, goalId: string, status: GoalStatus) {
    const { data, error } = await (supabase as any)
      .from('goals')
      .update({ status })
      .eq('id', goalId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGoal(userId: string, goalId: string) {
    const { error } = await (supabase as any)
      .from('goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
