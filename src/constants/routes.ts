export const ROUTES = {
  AUTH: {
    WELCOME: '/(auth)/welcome',
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
    RESET_PASSWORD: '/(auth)/reset-password',
  },
  TABS: {
    DASHBOARD: '/(protected)/(tabs)',
    TRANSACTIONS: '/(protected)/(tabs)/transactions',
    GOALS: '/(protected)/(tabs)/goals',
    REPORTS: '/(protected)/(tabs)/reports',
    SETTINGS: '/(protected)/(tabs)/settings',
  },
  TRANSACTIONS: {
    NEW: '/(protected)/transactions/new',
    TRANSFER: '/(protected)/transactions/transfer',
    DETAIL: (id: string) => `/(protected)/transactions/${id}` as const,
    EDIT: (id: string) => `/(protected)/transactions/${id}/edit` as const,
  },
  ACCOUNTS: {
    LIST: '/(protected)/accounts',
    NEW: '/(protected)/accounts/new',
    DETAIL: (id: string) => `/(protected)/accounts/${id}` as const,
    EDIT: (id: string) => `/(protected)/accounts/${id}/edit` as const,
  },
  CATEGORIES: {
    LIST: '/(protected)/categories',
    NEW: '/(protected)/categories/new',
    DETAIL: (id: string) => `/(protected)/categories/${id}` as const,
  },
  SAVINGS: {
    LIST: '/(protected)/savings',
    NEW: '/(protected)/savings/new',
    DETAIL: (id: string) => `/(protected)/savings/${id}` as const,
  },
  RECURRING: {
    LIST: '/(protected)/recurring',
    NEW: '/(protected)/recurring/new',
    DETAIL: (id: string) => `/(protected)/recurring/${id}` as const,
  },
  INVESTMENTS: {
    LIST: '/(protected)/investments',
    NEW: '/(protected)/investments/new',
    DETAIL: (id: string) => `/(protected)/investments/${id}` as const,
  },
  DEBTS: {
    LIST: '/(protected)/debts',
    NEW: '/(protected)/debts/new',
    DETAIL: (id: string) => `/(protected)/debts/${id}` as const,
  },
  PROFILE: {
    INDEX: '/(protected)/profile',
    EDIT: '/(protected)/profile/edit',
  },
  SETTINGS: {
    APPEARANCE: '/(protected)/settings/appearance',
    CURRENCY: '/(protected)/settings/currency',
    NOTIFICATIONS: '/(protected)/settings/notifications',
    PRIVACY: '/(protected)/settings/privacy',
    BACKUP: '/(protected)/settings/backup',
  },
  MODALS: {
    CATEGORY_PICKER: '/(protected)/modals/category-picker',
    ACCOUNT_PICKER: '/(protected)/modals/account-picker',
    DATE_PICKER: '/(protected)/modals/date-picker',
    TRANSACTION_FILTER: '/(protected)/modals/transaction-filter',
  },
} as const;
