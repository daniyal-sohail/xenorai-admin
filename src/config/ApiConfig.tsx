import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

// Create Axios instance
const API: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v1/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

const processQueue = (token: string | null) => {
    failedQueue.forEach((resolveWithToken) => {
        if (token) {
            resolveWithToken(token);
        }
    });
    failedQueue = [];
};

API.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Keep cookie auth support and also attach bearer token when available
        if (typeof window !== 'undefined') {
            try {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    const parsedAuth = JSON.parse(authStorage);
                    if (parsedAuth.state?.accessToken) {
                        config.headers = config.headers || {};
                        config.headers.Authorization = `Bearer ${parsedAuth.state.accessToken}`;
                    }
                }
            } catch (e) {
                console.warn("Failed to get token from storage:", e);
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = (error.config || {}) as RetryableRequestConfig;

        // Handle authentication errors (401 Unauthorized)
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for token refresh to complete
                return new Promise((resolve) => {
                    failedQueue.push((token: string) => {
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(API(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try to refresh token
                const refreshResponse = await axios.post(
                    'http://localhost:5000/api/v1/auth/refresh-token',
                    {},
                    { withCredentials: true }
                );

                const newToken = refreshResponse.data.data.accessToken;

                // Update localStorage with new token
                if (typeof window !== 'undefined') {
                    const authStorage = localStorage.getItem('auth-storage');
                    if (authStorage) {
                        const parsedAuth = JSON.parse(authStorage);
                        parsedAuth.state.accessToken = newToken;
                        localStorage.setItem('auth-storage', JSON.stringify(parsedAuth));
                    }
                }

                isRefreshing = false;
                processQueue(newToken);

                // Retry original request with new token
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                console.error("🔒 Token refresh failed - Clearing auth and redirecting");
                isRefreshing = false;
                processQueue(null);

                // Clear auth
                try {
                    const { useAuthStore } = require("../store/auth.store");
                    const authStore = useAuthStore.getState();
                    authStore.clearAuth();
                } catch (e) {
                    console.error("Failed to clear auth store:", e);
                }

                // Clear storage
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.removeItem('auth-storage');
                    } catch (e) {
                        console.error("Failed to clear storage:", e);
                    }

                    // Check if we're on an auth page
                    const isAuthPage = window.location.pathname.includes('/sign-in') ||
                        window.location.pathname.includes('/sign-up') ||
                        window.location.pathname.includes('/forgot-password');

                    // Only redirect if not already on auth page
                    if (!isAuthPage) {
                        const event = new CustomEvent('auth-expired', { detail: { status } });
                        window.dispatchEvent(event);
                        setTimeout(() => {
                            window.location.href = '/sign-in?session=expired';
                        }, 100);
                    }
                }
                return Promise.reject(refreshError);
            }
        }

        // For other errors, reject normally
        return Promise.reject(error);
    }
);

export default API;
