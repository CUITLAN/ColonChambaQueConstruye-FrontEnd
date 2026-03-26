
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  id: string | null;
  email: string | null;
  status: string | null;

  login: (data: { id: string; email: string; status: string; token: string }) => void;
  logout: () => void;
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

    console.log("Login exitoso — ID y Token guardados");
    console.log("ID:", data.id);
    console.log("TOKEN:", data.token);
  },

  logout: () => {
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

    console.log(" Sesión cerrada y store limpiado");
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      const storedId = localStorage.getItem(LOCAL_STORAGE_ID_KEY);

      if (storedToken && storedId) {
        set({
          token: storedToken,
          id: storedId,
        });

        console.log("Estado restaurado desde localStorage");
        console.log("ID:", storedId);
        console.log("TOKEN:", storedToken);
      }
    }
  },
}));
