import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser, IAuthResponse, AuthApi } from "../api/AuthApi";

interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    profileImg?: File;
}

interface AuthState {
    user: IUser | null;
    accessToken: string;
    refreshToken: string;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: IUser) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;

    register: (payload: RegisterPayload) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: "",
            refreshToken: "",
            loading: false,
            error: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken, isAuthenticated: !!accessToken }),
            clearAuth: () => set({
                user: null,
                accessToken: "",
                refreshToken: "",
                isAuthenticated: false,
                error: null
            }),

            register: async (payload) => {
                try {
                    set({ loading: true, error: null });
                    const data: IAuthResponse = await AuthApi.register(payload);
                    set({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true
                    });
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Registration failed";
                    set({ error: errorMessage });
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },

            login: async (email: string, password: string) => {
                try {
                    set({ loading: true, error: null });
                    const data: IAuthResponse = await AuthApi.login(email, password);
                    set({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true
                    });
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Login failed";
                    set({ error: errorMessage });
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                try {
                    set({ loading: true, error: null });
                    await AuthApi.logout();
                    get().clearAuth();
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Logout failed";
                    set({ error: errorMessage });
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },

            refreshAccessToken: async () => {
                try {
                    const { accessToken } = await AuthApi.refreshToken();
                    set({ accessToken, isAuthenticated: true });
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to refresh token";
                    set({ error: errorMessage, isAuthenticated: false });
                    // Don't throw, just clear auth on token refresh failure
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
