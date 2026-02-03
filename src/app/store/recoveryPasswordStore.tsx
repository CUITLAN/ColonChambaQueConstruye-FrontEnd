import { create } from 'zustand';

interface RecoveryState {
  email: string | null;
  token: string | null; 
  
  setRecoveryData: (email: string, token: string) => void;
  resetRecoveryData: () => void;
}

export const useRecoveryStore = create<RecoveryState>((set) => ({
  email: null,
  token: null,

  setRecoveryData: (email, token) => 
    set({ email, token }),

  resetRecoveryData: () => 
    set({ email: null, token: null }),
}));