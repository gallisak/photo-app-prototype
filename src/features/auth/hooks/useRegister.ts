import { useCallback } from 'react';
import { useRouter } from 'expo-router';

export function useRegister() {
    const router = useRouter();

    const handleNext = useCallback((email: string, password: string) => {
        router.push({
            pathname: '/(auth)/register-step-2',
            params: {
                email: email.trim(),
                password: password
            }
        });
    }, [router]);

    return {
        handleNext
    };
}