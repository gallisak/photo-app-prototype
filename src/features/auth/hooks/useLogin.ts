import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '../../../store/useAuthStore';

export function useLogin() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = useCallback(async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            await login(email.trim(), password);
            router.replace('/(tabs)');
        } catch (err: any) {
            let errorMessage = 'Failed to sign in. Please try again.';

            if (err.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            }

            Alert.alert('Login Failed', errorMessage);
        }
    }, [email, password, login, router]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        handleLogin
    };
}