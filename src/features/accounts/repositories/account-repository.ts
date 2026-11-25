import { supabase } from '../../../lib/supabase/client';
import {
  AccountBalanceRecord,
  AccountRecord,
  CreateAccountInput,
  UpdateAccountInput,
} from '../types/account.types';

export interface AccountWithBalance extends AccountRecord {
  current_balance: number;
}

export const accountRepository = {
  async getAccountBalances(
    userId: string,
    options?: { onlyActive?: boolean }
  ): Promise<AccountBalanceRecord[]> {
    let query = (supabase as any)
      .from('account_balances')
      .select('*')
      .eq('user_id', userId)
      .order('is_active', { ascending: false })
      .order('account_name', { ascending: true });

    if (options?.onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as AccountBalanceRecord[];
  },

  async getAccountsRaw(
    userId: string,
    options?: { onlyActive?: boolean }
  ): Promise<AccountRecord[]> {
    let query = (supabase as any)
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('is_active', { ascending: false })
      .order('name', { ascending: true });

    if (options?.onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as AccountRecord[];
  },

  async getAccountById(userId: string, id: string): Promise<AccountWithBalance> {
    const [{ data: acc, error: accErr }, { data: bal }] = await Promise.all([
      (supabase as any)
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single(),
      (supabase as any)
        .from('account_balances')
        .select('current_balance')
        .eq('account_id', id)
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

    if (accErr) throw accErr;
    return {
      ...(acc as AccountRecord),
      current_balance:
        bal?.current_balance !== undefined
          ? Number(bal.current_balance)
          : Number(acc.opening_balance || 0),
    };
  },

  async createAccount(userId: string, input: CreateAccountInput): Promise<AccountRecord> {
    const { data, error } = await (supabase as any)
      .from('accounts')
      .insert({
        user_id: userId,
        name: input.name.trim(),
        account_type: input.accountType,
        institution_name: input.institutionName?.trim() || null,
        account_number_last4: input.accountNumberLast4?.trim() || null,
        currency_code: (input.currencyCode || 'IDR').toUpperCase(),
        opening_balance: input.openingBalance,
        include_in_total: input.includeInTotal ?? true,
        is_active: input.isActive ?? true,
        color: input.color || null,
        icon: input.icon || null,
        notes: input.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as AccountRecord;
  },

  async updateAccount(
    userId: string,
    id: string,
    input: UpdateAccountInput
  ): Promise<AccountRecord> {
    const payload: Record<string, any> = {};
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.accountType !== undefined) payload.account_type = input.accountType;
    if (input.institutionName !== undefined)
      payload.institution_name = input.institutionName?.trim() || null;
    if (input.accountNumberLast4 !== undefined)
      payload.account_number_last4 = input.accountNumberLast4?.trim() || null;
    if (input.currencyCode !== undefined) payload.currency_code = input.currencyCode.toUpperCase();
    if (input.openingBalance !== undefined) payload.opening_balance = input.openingBalance;
    if (input.includeInTotal !== undefined) payload.include_in_total = input.includeInTotal;
    if (input.isActive !== undefined) payload.is_active = input.isActive;
    if (input.color !== undefined) payload.color = input.color || null;
    if (input.icon !== undefined) payload.icon = input.icon || null;
    if (input.notes !== undefined) payload.notes = input.notes?.trim() || null;

    const { data, error } = await (supabase as any)
      .from('accounts')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as AccountRecord;
  },

  async deleteAccount(userId: string, id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
