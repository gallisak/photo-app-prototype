import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '../../../store/useAuthStore';

export function useLogin() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const handleLogin = useCallback(async (email: string, password: string) => {
        try {
            await login(email.trim(), password);
            router.replace('/(tabs)');
        } catch (err: any) {
            let errorMessage = 'Failed to sign in. Please try again.';

            if (err.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            Alert.alert('Login Failed', errorMessage);
        }
    }, [login, router]);

    return {
        isLoading,
        handleLogin
    };
}