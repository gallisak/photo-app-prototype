import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export function useRegister() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleNext = useCallback(() => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters long.');
            return;
        }

        router.push({
            pathname: '/(auth)/register-step-2',
            params: {
                email: email.trim(),
                password: password
            }
        });
    }, [email, password, router]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleNext
    };
}