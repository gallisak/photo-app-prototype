import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';

export function useRegister() {
    const router = useRouter();
    const setRegistrationData = useAuthStore((state) => state.setRegistrationData);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleNext = useCallback(() => {
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        setRegistrationData({ email, password });
        router.push('/(auth)/register-step-2');
    }, [email, password, setRegistrationData, router]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleNext
    };
}
