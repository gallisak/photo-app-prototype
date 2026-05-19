import { create } from 'zustand';

interface AuthState {
  user: { email: string; name?: string } | null;
  registrationData: { email?: string; password?: string; name?: string } | null;
  setRegistrationData: (data: Partial<AuthState['registrationData']>) => void;
  clearRegistrationData: () => void;
  login: (email: string) => void;
  register: () => void;
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
  register: () => {
    const { registrationData } = get();
    if (registrationData?.email) {
      set({
        user: { email: registrationData.email, name: registrationData.name },
        registrationData: null
      });
    }
  },
  logout: () => set({ user: null }),
}));