import { create } from 'zustand';

interface User {
  email: string;
  password?: string;
  name?: string;
}

interface AuthState {
  user: { email: string; name?: string } | null;
  usersList: User[];
  registrationData: { email?: string; password?: string; name?: string } | null;
  setRegistrationData: (data: Partial<AuthState['registrationData']>) => void;
  clearRegistrationData: () => void;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (finalData?: { name: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  usersList: [],
  registrationData: null,

  setRegistrationData: (data) => set((state) => ({
    registrationData: { ...state.registrationData, ...data }
  })),

  clearRegistrationData: () => set({ registrationData: null }),

  login: (email, password) => {
    const { usersList } = get();
    
    const foundUser = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, message: 'User not found. Please register.' };
    }

    if (foundUser.password !== password) {
      return { success: false, message: 'Wrong password.' };
    }

    set({ user: { email: foundUser.email, name: foundUser.name } });
    return { success: true, message: 'Success!' };
  },

  register: (finalData) => {
    const { registrationData, usersList } = get();
    const mergedData = { ...registrationData, ...finalData };

    if (mergedData?.email && mergedData?.password) {
      const newUser: User = {
        email: mergedData.email,
        password: mergedData.password,
        name: mergedData.name
      };

      set({
        user: { email: mergedData.email, name: mergedData.name },
        usersList: [...usersList, newUser],
        registrationData: null
      });
    }
  },

  logout: () => set({ user: null }),
}));