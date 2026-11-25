import { supabase } from '../../../lib/supabase/client';
import {
  CreateTransactionInput,
  CreateTransferInput,
  TransactionWithDetails,
  UpdateTransactionInput,
} from '../types/transaction.types';
import { TransactionFilterOptions } from '../../../types/common.types';

const DEFAULT_PAGE_LIMIT = 50;

export const transactionRepository = {
  async getTransactions(
    userId: string,
    filters?: TransactionFilterOptions
  ): Promise<TransactionWithDetails[]> {
    const limit = filters?.limit ?? DEFAULT_PAGE_LIMIT;
    const page = filters?.page ?? 0;
    const from = page * limit;
    const to = from + limit - 1;

    let query = (supabase as any)
      .from('transactions')
      .select('*, accounts(id, name, currency_code), categories(id, name, icon, transaction_type)')
      .eq('user_id', userId);

    switch (filters?.sortBy) {
      case 'date_asc':
        query = query.order('transaction_date', { ascending: true }).order('created_at', { ascending: true });
        break;
      case 'amount_desc':
        query = query.order('amount', { ascending: false }).order('transaction_date', { ascending: false });
        break;
      case 'amount_asc':
        query = query.order('amount', { ascending: true }).order('transaction_date', { ascending: false });
        break;
      default:
        query = query.order('transaction_date', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('transaction_type', filters.type);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.accountId) {
      query = query.eq('account_id', filters.accountId);
    }
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.trim();
      query = query.or(`title.ilike.%${q}%,merchant.ilike.%${q}%`);
    }

    query = query.range(from, to);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as TransactionWithDetails[];
  },

  async getTransactionById(userId: string, id: string): Promise<TransactionWithDetails> {
    const { data, error } = await (supabase as any)
      .from('transactions')
      .select('*, accounts(id, name, currency_code), categories(id, name, icon, transaction_type)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as TransactionWithDetails;
  },

  async createTransaction(userId: string, input: CreateTransactionInput) {
    const { data, error } = await (supabase as any)
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: input.accountId,
        category_id: input.categoryId || null,
        transaction_type: input.transactionType,
        amount: input.amount,
        currency_code: (input.currencyCode || 'IDR').toUpperCase(),
        title: input.title.trim(),
        merchant: input.merchant?.trim() || null,
        payment_method: input.paymentMethod || null,
        transaction_date: input.transactionDate,
        transaction_time: input.transactionTime || null,
        reference_number: input.referenceNumber?.trim() || null,
        description: input.description?.trim() || null,
        notes: input.notes?.trim() || null,
        status: input.status || 'completed',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTransaction(userId: string, id: string, input: UpdateTransactionInput) {
    const payload: Record<string, any> = {};
    if (input.accountId !== undefined) payload.account_id = input.accountId;
    if (input.categoryId !== undefined) payload.category_id = input.categoryId || null;
    if (input.transactionType !== undefined) payload.transaction_type = input.transactionType;
    if (input.amount !== undefined) payload.amount = input.amount;
    if (input.currencyCode !== undefined) payload.currency_code = input.currencyCode.toUpperCase();
    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.merchant !== undefined) payload.merchant = input.merchant?.trim() || null;
    if (input.paymentMethod !== undefined) payload.payment_method = input.paymentMethod || null;
    if (input.transactionDate !== undefined) payload.transaction_date = input.transactionDate;
    if (input.transactionTime !== undefined) payload.transaction_time = input.transactionTime || null;
    if (input.referenceNumber !== undefined)
      payload.reference_number = input.referenceNumber?.trim() || null;
    if (input.description !== undefined) payload.description = input.description?.trim() || null;
    if (input.notes !== undefined) payload.notes = input.notes?.trim() || null;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await (supabase as any)
      .from('transactions')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createTransfer(userId: string, input: CreateTransferInput) {
    const { data, error } = await (supabase as any)
      .from('account_transfers')
      .insert({
        user_id: userId,
        from_account_id: input.fromAccountId,
        to_account_id: input.toAccountId,
        amount: input.amount,
        currency_code: (input.currencyCode || 'IDR').toUpperCase(),
        transfer_date: input.transferDate,
        transfer_time: input.transferTime || null,
        reference_number: input.referenceNumber?.trim() || null,
        description: input.description?.trim() || null,
        notes: input.notes?.trim() || null,
        goal_id: input.goalId || null,
        goal_action: input.goalId ? input.goalAction || 'contribution' : null,
        status: input.status || 'completed',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTransaction(userId: string, id: string) {
    const { error } = await (supabase as any)
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  },
};
