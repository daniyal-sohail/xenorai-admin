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
    (error: AxiosError) => {
        const status = error.response?.status;

        // Handle authentication errors
        if (status === 401 || status === 403) {
            console.error("🔒 Authentication failed - Token expired or invalid");

            // Clear auth via Zustand store
            try {
                const { useAuthStore } = require("../store/auth.store");
                useAuthStore.getState().clearAuth();
            } catch (e) {
                console.error("Failed to clear auth store:", e);
            }

            // Only redirect if we're not already on an auth page
            if (typeof window !== 'undefined' &&
                !window.location.pathname.includes('/sign-in') &&
                !window.location.pathname.includes('/sign-up')) {
                window.location.href = '/sign-in';
            }
        }

        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API;
