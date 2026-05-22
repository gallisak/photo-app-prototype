import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './useAuthStore';

export type SubscriptionPlan = 'free' | 'starter' | 'pro';

interface SubscriptionState {
    plans: Record<string, SubscriptionPlan>; // Maps user UID -> SubscriptionPlan
    currentPlan: SubscriptionPlan;
    setCurrentPlan: (plan: SubscriptionPlan) => void;
    syncUserPlan: (userId: string | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set, get) => ({
            plans: {},
            currentPlan: 'free',
            setCurrentPlan: (plan: SubscriptionPlan) => {
                const userId = useAuthStore.getState().user?.uid;
                if (userId) {
                    set((state) => ({
                        plans: {
                            ...state.plans,
                            [userId]: plan,
                        },
                        currentPlan: plan,
                    }));
                } else {
                    set({ currentPlan: plan });
                }
            },
            syncUserPlan: (userId: string | null) => {
                if (userId) {
                    const userPlan = get().plans[userId] || 'free';
                    set({ currentPlan: userPlan });
                } else {
                    set({ currentPlan: 'free' });
                }
            },
        }),
        {
            name: 'photo-app-subscription',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ plans: state.plans }), // Persist only the plans map to AsyncStorage
        }
    )
);

// Dynamically sync subscription state whenever user logs in, registers, or logs out
useAuthStore.subscribe((state) => {
    const userId = state.user?.uid || null;
    useSubscriptionStore.getState().syncUserPlan(userId);
});