//HOla este codigo basicamente es para guardar el token posteriormente en el layout de applicant estara el de proteccion y pertinencia  
// La idea es que el token dure 1 dia pero eso lo gestiona el backend~Cuitlan
import { create } from 'zustand';
interface AuthState {
  token: string | null;
  id: string | null;
  email: string | null;
  status: string | null;

  login: (data: { id: string; email: string; status: string; token: string }) => void;
  logoutAplicant: () => void;
  initialize: () => void; 
} 
const LOCAL_STORAGE_TOKEN_KEY = 'authToken';
const LOCAL_STORAGE_ID_KEY = 'authId';

export const useApplicantStore = create<AuthState>((set) => ({
  token: null,
  id: null,
  email: null,
  status: null,

  login: (data) => {
    set({
      token: data.token,
      id: data.id,
      email: data.email,
      status: data.status,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(LOCAL_STORAGE_ID_KEY, data.id);
    }
    console.log(data.id, LOCAL_STORAGE_ID_KEY);
  },
  logoutAplicant: () => {
    set({
      token: null,
      id: null,
      email: null,
      status: null,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ID_KEY);
    }
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      const storedId = localStorage.getItem(LOCAL_STORAGE_ID_KEY);
      if (storedToken && storedId) {
        set({ 
            token: storedToken,
            id: storedId 
        });
      }
    }
  },
}));