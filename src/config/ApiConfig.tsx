import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

// Create Axios instance
const API: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v1/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - httpOnly cookies are automatically included via withCredentials
API.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // httpOnly cookies are automatically sent by browser when withCredentials: true
        // No need to manually add Authorization header
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;

        // Handle authentication errors (401 Unauthorized, 403 Forbidden)
        if (status === 401 || status === 403) {
            console.error("🔒 Session Expired - Clearing auth and redirecting");

            // Clear auth immediately and synchronously
            try {
                const { useAuthStore } = require("../store/auth.store");
                const authStore = useAuthStore.getState();
                authStore.clearAuth();
            } catch (e) {
                console.error("Failed to clear auth store:", e);
            }

            // Clear all storage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('auth-storage');
                    sessionStorage.clear();
                } catch (e) {
                    console.error("Failed to clear storage:", e);
                }

                // Check if we're on an auth page
                const isAuthPage = window.location.pathname.includes('/sign-in') ||
                    window.location.pathname.includes('/sign-up') ||
                    window.location.pathname.includes('/forgot-password');

                // If not on auth page, redirect
                if (!isAuthPage) {
                    // Dispatch event first for immediate listener response
                    const event = new CustomEvent('auth-expired', { detail: { status } });
                    window.dispatchEvent(event);

                    // Then redirect - use setTimeout to ensure event is processed
                    setTimeout(() => {
                        window.location.href = '/sign-in?session=expired';
                    }, 0);
                }
            }
        }

        // Always reject the error to stop component execution
        return Promise.reject(error);
    }
);

export default API;
