import { create } from 'zustand';

interface UIState {
  isBalanceHidden: boolean;
  toggleBalanceHidden: () => void;
  setBalanceHidden: (hidden: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBalanceHidden: false,
  toggleBalanceHidden: () => set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),
  setBalanceHidden: (hidden) => set({ isBalanceHidden: hidden }),
  activeModal: null,
  setActiveModal: (activeModal) => set({ activeModal }),
}));
