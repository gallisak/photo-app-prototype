import { create } from 'zustand';

interface AuthState {
  user: { email: string; name?: string } | null;
  registrationData: { email?: string; password?: string; name?: string } | null;
  setRegistrationData: (data: Partial<AuthState['registrationData']>) => void;
  clearRegistrationData: () => void;
  login: (email: string) => void;
  register: (finalData?: { name: string }) => void; 
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  registrationData: null,
  setRegistrationData: (data) => set((state) => ({
    registrationData: { ...state.registrationData, ...data }
  })),
  clearRegistrationData: () => set({ registrationData: null }),
  login: (email) => set({ user: { email } }),
register: (finalData) => {
  const { registrationData } = get();
  const mergedData = { ...registrationData, ...finalData };
  
  if (mergedData?.email) {
    set({
      user: { email: mergedData.email, name: mergedData.name },
      registrationData: null
    });
  }
},
  logout: () => set({ user: null }),
}));