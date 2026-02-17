// src/app/store/authCompanyStore.ts
import { create } from 'zustand';

interface CompanyAuthState {
  token: string | null;
  companyId: string | null;  
  email: string | null;
  status: string | null;

  login: (data: {
    companyId?: string;        
    id?: string;             
    email: string;
    status: string;
    token: string;
  }) => void;

  logout: () => void;
  initialize: () => void;

  saveCompanyData: (data: {
    companyId: string;
    email: string;
    status: string;
    token: string;
  }) => void;
}

const LOCAL_STORAGE_TOKEN_KEY = 'authToken';
const LOCAL_STORAGE_COMPANY_ID_KEY = 'companyId';

export const useCompanyStore = create<CompanyAuthState>((set) => ({
  token: null,
  companyId: null,
  email: null,
  status: null,

  login: ({ companyId, id, email, status, token }) => {
    const finalCompanyId = companyId ?? id ?? null;

    set({
      companyId: finalCompanyId,
      email,
      status,
      token,
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
      if (finalCompanyId) {
        localStorage.setItem(LOCAL_STORAGE_COMPANY_ID_KEY, finalCompanyId);
      }
    }
  },

  logout: () => {
    set({
      token: null,
      companyId: null,
      email: null,
      status: null,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_COMPANY_ID_KEY);
    }
  },

  initialize: () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    const companyId = localStorage.getItem(LOCAL_STORAGE_COMPANY_ID_KEY);

    if (token && companyId) {
      set({
        token,
        companyId,
      });
    }
  },

  saveCompanyData: ({ companyId, email, status, token }) => {
    set({
      companyId,
      email,
      status,
      token,
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
      localStorage.setItem(LOCAL_STORAGE_COMPANY_ID_KEY, companyId);
    }
  },
}));
