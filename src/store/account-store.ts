import { create } from 'zustand';
import { Account } from '../types/database.types';

interface AccountState {
  accounts: Account[];
  selectedAccountId: string | null;
  setAccounts: (accounts: Account[]) => void;
  setSelectedAccountId: (id: string | null) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  selectedAccountId: null,
  setAccounts: (accounts) => set({ accounts }),
  setSelectedAccountId: (selectedAccountId) => set({ selectedAccountId }),
}));
