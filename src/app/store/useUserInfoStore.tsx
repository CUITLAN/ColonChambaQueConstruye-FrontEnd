import { create } from 'zustand';

interface UserProfileData {
  id:string;
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  email: string;
  phone: string;
  scholarship: string; 
  degree: string;      
  summary: string;     
  experience: string;
  interestJob: string; 
  cvUrl: string | null;
}

interface UserState {
  user: UserProfileData | null;
  isLoading: boolean;
  error: string | null;

  fetchUserData: (userId: string, token: string) => Promise<void>;
  updateLocalUser: (data: Partial<UserProfileData>) => void; 
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUserData: async (userId, token) => {
    const current = get().user
    if(current?.id === userId)return

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[STORE] status:', response.status);
      if (!response.ok) throw new Error('Error al obtener datos del usuario');

      const result = await response.json();
      const apiData = result.data; 
      console.log('[STORE] apiData used:', apiData);
      const mappedUser: UserProfileData = {
        id:userId,
        firstName: apiData.firstName || '', 
        lastName: apiData.lastName || '',
        address: apiData.address || '',
        birthDate: apiData.birthDate || '', 
        //contacto
        email: apiData.email || '',
        phone: apiData.cellPhone || '', 
        
        // Professional STEP
        scholarship: apiData.academicLevel || 'Licenciatura',
        degree: apiData.degree || '',
        
        summary: '', 
        
        experience: apiData.jobExperience || '',
        interestJob: apiData.desiredPosition || '', 
        
        // EL CV debe de ir en otro lado pero lo incluyo aqui para la referencia
        cvUrl: null 
      };

      set({ user: mappedUser, isLoading: false });
      console.log('[STORE] mappedUser saved:', mappedUser);
      console.log('[STORE] get().user now:', get().user);

    } catch (error) {
      console.error(error);
      set({ error: 'No se pudo cargar la información', isLoading: false });
    }
  },

  updateLocalUser: (data) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...data } });
    }
  },

  clearUser: () => set({ user: null }),
}));