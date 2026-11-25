import { PaymentMethod, TransactionType } from '../types/database.types';

export const TRANSACTION_TYPES: { label: string; value: TransactionType }[] = [
  { label: 'Pengeluaran', value: 'expense' },
  { label: 'Pemasukan', value: 'income' },
];

export const PAYMENT_METHODS: { label: string; value: PaymentMethod }[] = [
  { label: 'Tunai', value: 'cash' },
  { label: 'Transfer Bank', value: 'bank_transfer' },
  { label: 'QRIS', value: 'qris' },
  { label: 'E-Wallet', value: 'e_wallet' },
  { label: 'Kartu Debit', value: 'debit_card' },
  { label: 'Kartu Kredit', value: 'credit_card' },
  { label: 'Lainnya', value: 'other' },
];
