import { supabase } from '../../../lib/supabase/client';

export type InvestmentCategory =
  | 'stock'
  | 'mutual_fund'
  | 'gold'
  | 'crypto'
  | 'bond'
  | 'deposit'
  | 'other';

export type InvestmentTxType = 'buy' | 'sell' | 'dividend';

export interface InvestmentOverviewItem {
  investment_id: string;
  user_id: string;
  name: string;
  symbol: string | null;
  category: InvestmentCategory;
  platform: string | null;
  invested_amount: number;
  current_value: number;
  profit_loss: number;
  return_percentage: number;
  currency_code: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestmentTxItem {
  id: string;
  investment_id: string;
  tx_type: InvestmentTxType;
  amount: number;
  tx_date: string;
  notes: string | null;
  created_at: string;
}

export interface CreateInvestmentInput {
  name: string;
  symbol?: string | null;
  category: InvestmentCategory;
  platform?: string | null;
  investedAmount: number;
  currentValue?: number;
  currencyCode?: string;
  notes?: string | null;
}

export interface AddInvestmentTxInput {
  investmentId: string;
  txType: InvestmentTxType;
  amount: number;
  notes?: string | null;
}

export const INVESTMENT_CATEGORY_LABELS: Record<InvestmentCategory, string> = {
  stock: 'Saham',
  mutual_fund: 'Reksa Dana',
  gold: 'Emas',
  crypto: 'Kripto',
  bond: 'Obligasi',
  deposit: 'Deposito',
  other: 'Lainnya',
};

export const investmentService = {
  async getInvestments(userId: string): Promise<InvestmentOverviewItem[]> {
    const { data, error } = await (supabase as any)
      .from('investments_overview')
      .select('*')
      .eq('user_id', userId)
      .order('current_value', { ascending: false });

    if (error) throw error;
    return ((data || []) as any[]).map((item) => ({
      ...item,
      invested_amount: Number(item.invested_amount || 0),
      current_value: Number(item.current_value || 0),
      profit_loss: Number(item.profit_loss || 0),
      return_percentage: Number(item.return_percentage || 0),
    }));
  },

  async getInvestmentById(userId: string, investmentId: string) {
    const [{ data: inv, error: invErr }, { data: txs, error: txErr }] = await Promise.all([
      (supabase as any)
        .from('investments_overview')
        .select('*')
        .eq('investment_id', investmentId)
        .eq('user_id', userId)
        .single(),
      (supabase as any)
        .from('investment_transactions')
        .select('*')
        .eq('investment_id', investmentId)
        .eq('user_id', userId)
        .order('tx_date', { ascending: false })
        .order('created_at', { ascending: false }),
    ]);

    if (invErr) throw invErr;
    if (txErr) throw txErr;

    return {
      investment: {
        ...inv,
        invested_amount: Number(inv.invested_amount || 0),
        current_value: Number(inv.current_value || 0),
        profit_loss: Number(inv.profit_loss || 0),
        return_percentage: Number(inv.return_percentage || 0),
      } as InvestmentOverviewItem,
      transactions: ((txs || []) as any[]).map((t) => ({
        ...t,
        amount: Number(t.amount || 0),
      })) as InvestmentTxItem[],
    };
  },

  async createInvestment(userId: string, input: CreateInvestmentInput) {
    if (!input.name.trim()) throw new Error('Nama aset investasi wajib diisi');
    if (input.investedAmount < 0) throw new Error('Modal awal tidak boleh negatif');

    const invested = Math.max(input.investedAmount || 0, 0);
    const current =
      input.currentValue !== undefined && input.currentValue >= 0 ? input.currentValue : invested;

    const { data, error } = await (supabase as any)
      .from('investments')
      .insert({
        user_id: userId,
        name: input.name.trim(),
        symbol: input.symbol?.trim().toUpperCase() || null,
        category: input.category,
        platform: input.platform?.trim() || null,
        invested_amount: invested,
        current_value: current,
        currency_code: (input.currencyCode || 'IDR').toUpperCase(),
        notes: input.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addTransaction(userId: string, input: AddInvestmentTxInput) {
    if (!input.amount || input.amount <= 0) {
      throw new Error('Nominal transaksi harus lebih dari 0');
    }

    const { data, error } = await (supabase as any)
      .from('investment_transactions')
      .insert({
        user_id: userId,
        investment_id: input.investmentId,
        tx_type: input.txType,
        amount: input.amount,
        notes: input.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCurrentValue(userId: string, investmentId: string, currentValue: number) {
    if (currentValue < 0) throw new Error('Nilai pasar tidak boleh negatif');

    const { data, error } = await (supabase as any)
      .from('investments')
      .update({ current_value: currentValue })
      .eq('id', investmentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteInvestment(userId: string, investmentId: string) {
    const { error } = await (supabase as any)
      .from('investments')
      .delete()
      .eq('id', investmentId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
