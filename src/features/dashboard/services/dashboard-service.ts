import { supabase } from '../../../lib/supabase/client';
import { accountRepository } from '../../accounts/repositories/account-repository';
import { transactionRepository } from '../../transactions/repositories/transaction-repository';
import { DashboardSummary } from '../types/dashboard.types';
import { getCurrentWeekDates, getMonthStartAndEnd } from '../../../utils/date';
import { calculateCashFlow, sumBalancesByCurrency } from '../../../utils/transaction';

export const dashboardService = {
  async getDashboardSummary(
    userId: string,
    preferredCurrency: string = 'IDR'
  ): Promise<DashboardSummary> {
    const { startDate, endDate } = getMonthStartAndEnd();

    // 1. Fetch active account balances from reporting view `account_balances`
    const accounts = await accountRepository.getAccountBalances(userId, { onlyActive: true });

    // PRD §13.1 & §13.5: agregasi per currency, tidak menjumlahkan lintas mata uang
    const balancesByCurrency = sumBalancesByCurrency(accounts, true);
    const primaryBalanceEntry =
      balancesByCurrency.find((b) => b.currencyCode === preferredCurrency) ||
      balancesByCurrency[0];
    const primaryCurrency = primaryBalanceEntry?.currencyCode || preferredCurrency;

    // 2. Fetch completed transactions for primary currency (covering current month and current week)
    const weekDates = getCurrentWeekDates();
    const weekStart = weekDates[0].dateString;
    const weekEnd = weekDates[6].dateString;

    const queryStart = startDate < weekStart ? startDate : weekStart;
    const queryEnd = endDate > weekEnd ? endDate : weekEnd;

    const { data: rawTx, error: txErr } = await (supabase as any)
      .from('transactions')
      .select('transaction_type, amount, status, currency_code, transaction_date')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('transaction_date', queryStart)
      .lte('transaction_date', queryEnd);

    if (txErr) throw txErr;

    const currencyMatches = (tx: any) =>
      !tx.currency_code || tx.currency_code.toUpperCase() === primaryCurrency.toUpperCase();

    const isMatchingDate = (txDate: any, targetDate: string) => {
      if (!txDate) return false;
      return String(txDate).trim().slice(0, 10) === targetDate;
    };

    const monthlyTx = (rawTx || []).filter(
      (tx: any) =>
        currencyMatches(tx) &&
        String(tx.transaction_date).slice(0, 10) >= startDate &&
        String(tx.transaction_date).slice(0, 10) <= endDate
    );

    const cashFlow = calculateCashFlow(monthlyTx, primaryCurrency);

    // Total balance dihitung langsung dari net_cash_flow (Pemasukan - Pengeluaran)
    const totalBalance = cashFlow.netCashFlow;

    // 3. Hitung weekly cash flow per hari untuk diagram BarChart
    const weeklyCashFlow = weekDates.map(({ label, subLabel, dateString, fullDateLabel }) => {
      const dayTxs = (rawTx || []).filter(
        (tx: any) => currencyMatches(tx) && isMatchingDate(tx.transaction_date, dateString)
      );
      let dayNet = 0;
      let dayIncome = 0;
      let dayExpense = 0;

      for (const tx of dayTxs) {
        const amt = Number(tx.amount || 0);
        if (tx.transaction_type === 'income') {
          dayIncome += amt;
          dayNet += amt;
        } else if (tx.transaction_type === 'expense') {
          dayExpense += amt;
          dayNet -= amt;
        }
      }

      return {
        label,
        subLabel,
        dateString,
        fullDateLabel,
        value: dayNet,
        income: dayIncome,
        expense: dayExpense,
      };
    });

    // 4. Fetch recent transactions with account & category details
    const recentTransactions = await transactionRepository.getTransactions(userId, {
      limit: 6,
      page: 0,
    });

    return {
      primaryCurrency,
      totalBalance,
      balancesByCurrency,
      monthlyIncome: cashFlow.totalIncome,
      monthlyExpense: cashFlow.totalExpense,
      netCashFlow: cashFlow.netCashFlow,
      monthlyTransactionCount: cashFlow.transactionCount,
      recentTransactions,
      accountBalances: accounts,
      weeklyCashFlow,
    };
  },
};
