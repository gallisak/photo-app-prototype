import { useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { updateProfile } from 'firebase/auth';
import { useAuthStore } from '../../../store/useAuthStore';

export function useRegisterStep2() {
    const router = useRouter();
    const { email, password } = useLocalSearchParams<{ email?: string; password?: string }>();
    const register = useAuthStore((state) => state.register);
    const isLoading = useAuthStore((state) => state.isLoading);

    const handleRegister = useCallback(async (name: string) => {
        if (!email || !password) {
            Alert.alert('Error', 'Registration data was lost. Please start over.');
            router.replace('/(auth)/register');
            return;
        }

        try {
            await register(email, password);

            const { auth } = require('../../../config/firebase');
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name.trim()
                });
            }

            Alert.alert('Success', 'Account created successfully!');
            router.replace('/(tabs)');
        } catch (err: any) {
            let errorMessage = 'Could not sign up. Please try again.';

            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'This email address is already in use.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'The password is too weak.';
            }

            Alert.alert('Registration Failed', errorMessage);
        }
    }, [email, password, register, router]);

    return {
        isLoading,
        handleRegister
    };
}