import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';

export function useLogin() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = useCallback(() => {
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        const result = login(email, password);

        if (result.success) {
            router.replace('/(tabs)');
        } else {
            alert(result.message);
        }
    }, [email, password, login, router]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin
    };
}
