import {
  AccountType,
  Transaction,
  PaymentMethod,
  TransactionType,
  TransactionStatus,
  GoalTransferAction,
} from '../../../types/database.types';

export interface CreateTransactionInput {
  accountId: string;
  categoryId?: string | null;
  transactionType: TransactionType;
  amount: number;
  currencyCode?: string;
  title: string;
  merchant?: string | null;
  paymentMethod?: PaymentMethod | null;
  transactionDate: string;
  transactionTime?: string | null;
  referenceNumber?: string | null;
  description?: string | null;
  notes?: string | null;
  status?: TransactionStatus;
  attachmentUri?: string | null;
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

export interface CreateTransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currencyCode?: string;
  transferDate: string;
  transferTime?: string | null;
  referenceNumber?: string | null;
  description?: string | null;
  notes?: string | null;
  goalId?: string | null;
  goalAction?: GoalTransferAction | null;
  status?: TransactionStatus;
}

export interface TransactionWithDetails extends Transaction {
  accounts?: { id?: string; name: string; account_type?: AccountType; currency_code?: string } | null;
  categories?: { id?: string; name: string; icon?: string | null; transaction_type?: TransactionType } | null;
  account_name?: string;
  category_name?: string;
  category_icon?: string | null;
}
