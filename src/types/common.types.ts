export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: Status;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface TransactionFilterOptions {
  type?: 'all' | 'income' | 'expense';
  status?: 'all' | 'pending' | 'completed' | 'cancelled';
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  sortBy?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  page?: number;
  limit?: number;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: string;
  color?: string;
}
