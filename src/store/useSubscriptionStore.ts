import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubscriptionPlan = 'free' | 'starter' | 'pro';

interface SubscriptionState {
    currentPlan: SubscriptionPlan;
    setCurrentPlan: (plan: SubscriptionPlan) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set) => ({
            currentPlan: 'free',
            setCurrentPlan: (plan: SubscriptionPlan) => set({ currentPlan: plan }),
        }),
        {
            name: 'photo-app-subscription',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);