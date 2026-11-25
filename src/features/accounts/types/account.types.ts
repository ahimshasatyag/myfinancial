import { Account, AccountBalanceView, AccountType } from '../../../types/database.types';

export interface CreateAccountInput {
  name: string;
  accountType: AccountType;
  institutionName?: string | null;
  accountNumberLast4?: string | null;
  currencyCode?: string;
  openingBalance: number;
  includeInTotal?: boolean;
  isActive?: boolean;
  color?: string | null;
  icon?: string | null;
  notes?: string | null;
}

export interface UpdateAccountInput extends Partial<CreateAccountInput> {}

export type AccountRecord = Account;
export type AccountBalanceRecord = AccountBalanceView;

export const ACCOUNT_TYPE_OPTIONS: { label: string; value: AccountType }[] = [
  { label: 'Bank', value: 'bank' },
  { label: 'Tunai', value: 'cash' },
  { label: 'E-Wallet', value: 'e_wallet' },
  { label: 'Kartu Kredit', value: 'credit_card' },
  { label: 'Investasi', value: 'investment' },
  { label: 'Lainnya', value: 'other' },
];
