import Decimal from 'decimal.js';
import { AccountBalanceView, Transaction } from '../types/database.types';

export interface CurrencyTotal {
  currencyCode: string;
  total: number;
}

export interface CashFlowTotals {
  currencyCode: string;
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  transactionCount: number;
}

export interface TransactionDateGroup<T extends { transaction_date: string }> {
  date: string;
  items: T[];
  netAmount: number;
}

/**
 * Mengelompokkan saldo rekening berdasarkan mata uang (PRD §13.1 & §13.5).
 * Nominal dengan currency berbeda tidak pernah dijumlahkan langsung.
 */
export function sumBalancesByCurrency(
  accounts: AccountBalanceView[],
  onlyIncludedInTotal: boolean = true
): CurrencyTotal[] {
  const map = new Map<string, Decimal>();

  for (const acc of accounts) {
    if (onlyIncludedInTotal && !acc.include_in_total) continue;
    const code = acc.currency_code || 'IDR';
    const current = map.get(code) ?? new Decimal(0);
    map.set(code, current.plus(new Decimal(acc.current_balance ?? 0)));
  }

  return Array.from(map.entries()).map(([currencyCode, value]) => ({
    currencyCode,
    total: value.toDecimalPlaces(2).toNumber(),
  }));
}

/**
 * Menghitung income, expense, dan net cash flow hanya dari transaksi berstatus `completed`
 * untuk satu mata uang tertentu (PRD §13.2 & §13.3).
 */
export function calculateCashFlow(
  transactions: Pick<Transaction, 'transaction_type' | 'amount' | 'status' | 'currency_code'>[],
  currencyCode: string = 'IDR'
): CashFlowTotals {
  let income = new Decimal(0);
  let expense = new Decimal(0);
  let count = 0;

  for (const tx of transactions) {
    if (tx.status !== 'completed') continue;
    if ((tx.currency_code || 'IDR') !== currencyCode) continue;

    const amt = new Decimal(tx.amount ?? 0);
    if (tx.transaction_type === 'income') {
      income = income.plus(amt);
    } else if (tx.transaction_type === 'expense') {
      expense = expense.plus(amt);
    }
    count += 1;
  }

  return {
    currencyCode,
    totalIncome: income.toDecimalPlaces(2).toNumber(),
    totalExpense: expense.toDecimalPlaces(2).toNumber(),
    netCashFlow: income.minus(expense).toDecimalPlaces(2).toNumber(),
    transactionCount: count,
  };
}

/**
 * Mengelompokkan daftar transaksi berdasarkan `transaction_date` (PRD §9.7).
 */
export function groupTransactionsByDate<
  T extends {
    transaction_date: string;
    transaction_type: 'income' | 'expense';
    amount: number;
    status?: string;
  }
>(transactions: T[]): TransactionDateGroup<T>[] {
  const map = new Map<string, { items: T[]; net: Decimal }>();

  for (const tx of transactions) {
    const key = tx.transaction_date;
    const existing = map.get(key) ?? { items: [], net: new Decimal(0) };
    existing.items.push(tx);

    if (!tx.status || tx.status === 'completed') {
      const amt = new Decimal(tx.amount ?? 0);
      existing.net = tx.transaction_type === 'income' ? existing.net.plus(amt) : existing.net.minus(amt);
    }
    map.set(key, existing);
  }

  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, group]) => ({
      date,
      items: group.items,
      netAmount: group.net.toDecimalPlaces(2).toNumber(),
    }));
}
