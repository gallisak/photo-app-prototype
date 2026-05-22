import { create } from 'zustand';

export type SubscriptionPlan = 'free' | 'starter' | 'pro';

interface SubscriptionState {
    currentPlan: SubscriptionPlan;
    setCurrentPlan: (plan: SubscriptionPlan) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    currentPlan: 'free',
    setCurrentPlan: (plan: SubscriptionPlan) => set({ currentPlan: plan }),
}));