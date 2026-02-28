import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { AxiosError } from 'axios';

/**
 * Hook to handle session expiration
 * Detects 401/403 errors and redirects to sign-in
 */
export const useSessionExpiration = () => {
    const router = useRouter();
    const { clearAuth } = useAuthStore();

    const handleSessionExpired = (error: unknown) => {
        if (error instanceof AxiosError) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                console.log('🔒 Session expired (detected in hook)');
                clearAuth();
                router.push('/sign-in?session=expired');
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        // Listen for auth-expired events
        const handleAuthExpired = () => {
            console.log('🔒 Session expired event');
            clearAuth();
            router.push('/sign-in?session=expired');
        };

        window.addEventListener('auth-expired', handleAuthExpired);
        return () => {
            window.removeEventListener('auth-expired', handleAuthExpired);
        };
    }, [router, clearAuth]);

    return { handleSessionExpired };
};
