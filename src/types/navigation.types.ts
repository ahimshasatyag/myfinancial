export type RootStackParamList = {
  index: undefined;
  '+not-found': undefined;
  '(auth)': undefined;
  '(protected)': undefined;
  'auth-callback': undefined;
};

export type AuthStackParamList = {
  welcome: undefined;
  login: undefined;
  register: undefined;
  'forgot-password': undefined;
  'reset-password': { token?: string };
};

export type TabsParamList = {
  index: undefined;          // Dashboard
  transactions: undefined;   // Transaction list
  goals: undefined;          // Goals overview
  reports: undefined;        // Reports & Analytics
  settings: undefined;       // App Settings
};

export type TransactionsStackParamList = {
  index: undefined;
  new: { type?: 'income' | 'expense'; accountId?: string };
  transfer: { fromAccountId?: string };
  '[id]': { id: string };
  '[id]/edit': { id: string };
};

export type AccountsStackParamList = {
  index: undefined;
  new: undefined;
  '[id]': { id: string };
  '[id]/edit': { id: string };
};
