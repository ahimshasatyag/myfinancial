import Decimal from 'decimal.js';
import { Transaction } from '../../../types/database.types';

export const transactionCalculator = {
  /**
   * PRD §13.2 & §13.3: hanya transaksi berstatus `completed` yang dihitung pada total & net cash flow.
   */
  calculateTotals(
    transactions: Pick<Transaction, 'transaction_type' | 'amount' | 'status'>[]
  ) {
    let income = new Decimal(0);
    let expense = new Decimal(0);

    transactions.forEach((t) => {
      if (t.status && t.status !== 'completed') return;
      const amt = new Decimal(t.amount ?? 0);
      if (t.transaction_type === 'income') {
        income = income.plus(amt);
      } else if (t.transaction_type === 'expense') {
        expense = expense.plus(amt);
      }
    });

    return {
      totalIncome: income.toDecimalPlaces(2).toNumber(),
      totalExpense: expense.toDecimalPlaces(2).toNumber(),
      netTotal: income.minus(expense).toDecimalPlaces(2).toNumber(),
    };
  },
};
