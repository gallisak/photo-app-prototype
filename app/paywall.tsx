import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';
import { useSubscriptionStore, SubscriptionPlan } from '../src/store/useSubscriptionStore';
import CustomText from '../src/components/ui/CustomText';
import { X, Check } from 'lucide-react-native';

export default function PaywallScreen() {
    const router = useRouter();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { currentPlan, setCurrentPlan } = useSubscriptionStore();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    const plans = [
        { id: 'free' as SubscriptionPlan, name: 'Free Starter', price: '$0', features: ['Up to 5 AI messages per day', 'Basic filters'] },
        { id: 'starter' as SubscriptionPlan, name: 'Photo Enthusiast', price: '$4.99 / mo', features: ['Unlimited AI Assistant 🔮', 'Access to Photo Coach 📸'] },
        { id: 'pro' as SubscriptionPlan, name: 'Pro Studio', price: '$14.99 / mo', features: ['All features of Enthusiast plan', '4K Rendering'] },
    ];

    const handlePurchase = async (plan: SubscriptionPlan) => {
        if (plan === 'free') return;

        setLoading(true);
        setSelectedPlan(plan);

        try {
            // 1. Fetch the client secret from our serverless Expo API Route
            const cents = plan === 'starter' ? 499 : 1499;
            const response = await fetch('/api/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: cents,
                    plan: plan,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to fetch payment details.');
            }

            const { clientSecret } = data;

            // 2. Initialize the native payment sheet from Stripe React Native SDK
            const { error: initError } = await initPaymentSheet({
                merchantDisplayName: 'Photo App Studio, Inc.',
                paymentIntentClientSecret: clientSecret,
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: 'Demo User',
                },
            });

            if (initError) {
                throw new Error(initError.message);
            }

            // 3. Present the native payment sheet to the customer (This displays the REAL Credit Card input form!)
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                // If payment is cancelled or failed:
                Alert.alert('Payment Cancelled', presentError.message);
            } else {
                // 4. Update the Zustand subscription store on success
                setCurrentPlan(plan);
                Alert.alert(
                    'Success! 🎉',
                    `Subscription ${plan.toUpperCase()} successfully activated via Stripe.`
                );
                router.back();
            }
        } catch (error: any) {
            console.error('Stripe Integration Error:', error);
            Alert.alert('Stripe Error', error.message || 'Something went wrong during payment.');
        } finally {
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white px-6 pt-16" showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-end mb-6">
                <TouchableOpacity onPress={() => router.back()} disabled={loading}>
                    <X size={26} color="#000000" />
                </TouchableOpacity>
            </View>

            <View className="items-center mb-10">
                <CustomText variant="title" className="text-black text-3xl font-black uppercase tracking-wider mb-2">
                    Upgrade Plan
                </CustomText>
                <CustomText className="text-zinc-400 text-sm text-center">
                    Secure checkout powered by Stripe 💳
                </CustomText>
            </View>

            <View className="mb-10">
                {plans.map((plan) => {
                    const isCurrent = currentPlan === plan.id;
                    const isThisLoading = loading && selectedPlan === plan.id;

                    return (
                        <View
                            key={plan.id}
                            className={`w-full p-5 border-2 mb-4 rounded-xl ${isCurrent ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'
                                }`}
                        >
                            <View className="flex-row justify-between items-center mb-3">
                                <CustomText className="text-black font-black text-lg uppercase tracking-wide">
                                    {plan.name}
                                </CustomText>
                                <CustomText className="text-black font-black text-xl">
                                    {plan.price}
                                </CustomText>
                            </View>

                            {plan.features.map((feat, i) => (
                                <View key={i} className="flex-row items-center mb-1.5">
                                    <Check size={14} color="#000000" className="mr-2" />
                                    <CustomText className="text-zinc-600 text-xs">{feat}</CustomText>
                                </View>
                            ))}

                            {plan.id !== 'free' && (
                                <TouchableOpacity
                                    onPress={() => handlePurchase(plan.id)}
                                    disabled={loading || isCurrent}
                                    className={`w-full h-11 rounded-lg justify-center items-center mt-4 ${isCurrent ? 'bg-zinc-200' : 'bg-black'
                                        }`}
                                >
                                    {isThisLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <CustomText className={`font-bold text-xs uppercase ${isCurrent ? 'text-zinc-600' : 'text-white'
                                            }`}>
                                            {isCurrent ? 'Current Plan' : 'Purchase with Stripe'}
                                        </CustomText>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}