export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    PROFILE: ['auth', 'profile'],
    SETTINGS: ['auth', 'settings'],
  },
  DASHBOARD: {
    SUMMARY: ['dashboard', 'summary'],
    CASH_FLOW: ['dashboard', 'cash_flow'],
    RECENT_TRANSACTIONS: ['dashboard', 'recent_transactions'],
  },
  TRANSACTIONS: {
    LIST: (filters?: any) => ['transactions', 'list', filters],
    DETAIL: (id: string) => ['transactions', 'detail', id],
    ATTACHMENTS: (id: string) => ['transactions', 'attachments', id],
  },
  ACCOUNTS: {
    LIST: ['accounts', 'list'],
    BALANCES: ['accounts', 'balances'],
    DETAIL: (id: string) => ['accounts', 'detail', id],
  },
  CATEGORIES: {
    LIST: (type?: string) => ['categories', 'list', type],
    DETAIL: (id: string) => ['categories', 'detail', id],
  },
  BUDGETS: {
    LIST: ['budgets', 'list'],
    PROGRESS: ['budgets', 'progress'],
    DETAIL: (id: string) => ['budgets', 'detail', id],
  },
  SAVINGS: {
    LIST: ['savings', 'list'],
    PROGRESS: ['savings', 'progress'],
    DETAIL: (id: string) => ['savings', 'detail', id],
  },
  RECURRING: {
    LIST: ['recurring', 'list'],
    DETAIL: (id: string) => ['recurring', 'detail', id],
  },
  REPORTS: {
    MONTHLY: (month: string) => ['reports', 'monthly', month],
    CATEGORIES: (month: string) => ['reports', 'categories', month],
  },
};
