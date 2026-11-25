import { supabase } from '../../../lib/supabase/client';
import { accountRepository } from '../../accounts/repositories/account-repository';
import { transactionRepository } from '../../transactions/repositories/transaction-repository';
import { DashboardSummary } from '../types/dashboard.types';
import { getMonthStartAndEnd } from '../../../utils/date';
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
    const totalBalance = primaryBalanceEntry?.total || 0;

    // 2. Fetch completed monthly transactions for primary currency
    const { data: monthlyTx, error: txErr } = await (supabase as any)
      .from('transactions')
      .select('transaction_type, amount, status, currency_code')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .eq('currency_code', primaryCurrency)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);

    if (txErr) throw txErr;

    const cashFlow = calculateCashFlow(monthlyTx || [], primaryCurrency);

    // 3. Fetch recent transactions with account & category details
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
    };
  },
};
