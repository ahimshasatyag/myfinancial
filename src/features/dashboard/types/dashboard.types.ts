import { AccountBalanceView } from '../../../types/database.types';
import { CurrencyTotal } from '../../../utils/transaction';
import { TransactionWithDetails } from '../../transactions/types/transaction.types';
import { BarChartItem } from '../../../components/charts/bar-chart';

export interface DashboardSummary {
  primaryCurrency: string;
  totalBalance: number;
  balancesByCurrency: CurrencyTotal[];
  monthlyIncome: number;
  monthlyExpense: number;
  netCashFlow: number;
  monthlyTransactionCount: number;
  recentTransactions: TransactionWithDetails[];
  accountBalances: AccountBalanceView[];
  weeklyCashFlow?: BarChartItem[];
}
