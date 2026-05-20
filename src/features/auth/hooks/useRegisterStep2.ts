import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';

export function useRegisterStep2() {
    const router = useRouter();
    const setRegistrationData = useAuthStore((state) => state.setRegistrationData);
    const registerUser = useAuthStore((state) => state.register);

    const [name, setName] = useState('');

    const handleRegister = useCallback(() => {
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        setRegistrationData({ name });

        registerUser({ name });

        router.replace('/(tabs)');
    }, [name, setRegistrationData, registerUser, router]);

    return {
        name,
        setName,
        handleRegister
    };
}
