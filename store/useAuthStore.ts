import { create } from 'zustand';

interface AuthState {
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  
  login: (email) => set({ user: { email } }),
  logout: () => set({ user: null }),
}));