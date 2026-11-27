import { supabase } from '../../../lib/supabase/client';

export type DebtType = 'payable' | 'receivable';
export type DebtStatus = 'active' | 'paid' | 'overdue';

export interface DebtOverviewItem {
  debt_id: string;
  user_id: string;
  type: DebtType;
  counterparty_name: string;
  title: string;
  principal_amount: number;
  paid_amount: number;
  remaining_amount: number;
  progress_percentage: number;
  currency_code: string;
  due_date: string | null;
  status: DebtStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DebtPaymentItem {
  id: string;
  debt_id: string;
  amount: number;
  payment_date: string;
  notes: string | null;
  created_at: string;
}

export interface CreateDebtInput {
  type: DebtType;
  counterpartyName: string;
  title: string;
  principalAmount: number;
  paidAmount?: number;
  currencyCode?: string;
  dueDate?: string | null;
  notes?: string | null;
}

export interface AddDebtPaymentInput {
  debtId: string;
  amount: number;
  notes?: string | null;
}

export const debtService = {
  async getDebts(userId: string): Promise<DebtOverviewItem[]> {
    const { data, error } = await (supabase as any)
      .from('debts_overview')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return ((data || []) as any[]).map((d) => ({
      ...d,
      principal_amount: Number(d.principal_amount || 0),
      paid_amount: Number(d.paid_amount || 0),
      remaining_amount: Number(d.remaining_amount || 0),
      progress_percentage: Number(d.progress_percentage || 0),
    }));
  },

  async getDebtById(userId: string, debtId: string) {
    const [{ data: debt, error: debtErr }, { data: payments, error: payErr }] = await Promise.all([
      (supabase as any)
        .from('debts_overview')
        .select('*')
        .eq('debt_id', debtId)
        .eq('user_id', userId)
        .single(),
      (supabase as any)
        .from('debt_payments')
        .select('*')
        .eq('debt_id', debtId)
        .eq('user_id', userId)
        .order('payment_date', { ascending: false })
        .order('created_at', { ascending: false }),
    ]);

    if (debtErr) throw debtErr;
    if (payErr) throw payErr;

    return {
      debt: {
        ...debt,
        principal_amount: Number(debt.principal_amount || 0),
        paid_amount: Number(debt.paid_amount || 0),
        remaining_amount: Number(debt.remaining_amount || 0),
        progress_percentage: Number(debt.progress_percentage || 0),
      } as DebtOverviewItem,
      payments: ((payments || []) as any[]).map((p) => ({
        ...p,
        amount: Number(p.amount || 0),
      })) as DebtPaymentItem[],
    };
  },

  async createDebt(userId: string, input: CreateDebtInput) {
    if (!input.title.trim()) throw new Error('Judul utang/piutang wajib diisi');
    if (!input.counterpartyName.trim()) throw new Error('Nama pihak wajib diisi');
    if (!input.principalAmount || input.principalAmount <= 0) {
      throw new Error('Nominal harus lebih dari 0');
    }

    const initialPaid = Math.max(input.paidAmount || 0, 0);
    const status: DebtStatus = initialPaid >= input.principalAmount ? 'paid' : 'active';

    const { data, error } = await (supabase as any)
      .from('debts')
      .insert({
        user_id: userId,
        type: input.type,
        counterparty_name: input.counterpartyName.trim(),
        title: input.title.trim(),
        principal_amount: input.principalAmount,
        paid_amount: initialPaid,
        currency_code: (input.currencyCode || 'IDR').toUpperCase(),
        due_date: input.dueDate?.trim() || null,
        notes: input.notes?.trim() || null,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addPayment(userId: string, input: AddDebtPaymentInput) {
    if (!input.amount || input.amount <= 0) {
      throw new Error('Nominal pembayaran harus lebih dari 0');
    }

    const { data, error } = await (supabase as any)
      .from('debt_payments')
      .insert({
        user_id: userId,
        debt_id: input.debtId,
        amount: input.amount,
        notes: input.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsPaid(userId: string, debtId: string, remainingAmount: number) {
    if (remainingAmount > 0) {
      return this.addPayment(userId, {
        debtId,
        amount: remainingAmount,
        notes: 'Pelunasan penuh',
      });
    }

    const { data, error } = await (supabase as any)
      .from('debts')
      .update({ status: 'paid' })
      .eq('id', debtId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDebt(userId: string, debtId: string) {
    const { error } = await (supabase as any)
      .from('debts')
      .delete()
      .eq('id', debtId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
