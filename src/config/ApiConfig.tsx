import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

// Create Axios instance
const API: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v1/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
API.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Get token from auth-storage in localStorage
        const authStorage = localStorage.getItem("auth-storage");
        let token = null;

        if (authStorage) {
            try {
                const parsedAuth = JSON.parse(authStorage);
                token = parsedAuth.state?.accessToken;
            } catch (error) {
                console.error("Failed to parse auth storage:", error);
            }
        }

        // Ensure headers exist and assign Authorization safely
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API;
