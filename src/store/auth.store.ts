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
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: IUser) => void;
    clearAuth: () => void;

    register: (payload: RegisterPayload) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: (code: string) => Promise<void>;
    logout: () => Promise<void>;
    updatePassword: (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => Promise<void>;
    setPassword: (data: {
        newPassword: string;
        confirmPassword: string;
    }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            clearAuth: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                }),

            register: async (payload) => {
                try {
                    set({ loading: true, error: null });
                    const data: IAuthResponse = await AuthApi.register(payload);
                    set({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true,
                    });
                } catch (err) {
                    const errorMessage =
                        err instanceof Error ? err.message : "Registration failed";
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
                        isAuthenticated: true,
                    });
                } catch (err) {
                    const errorMessage =
                        err instanceof Error ? err.message : "Login failed";
                    set({ error: errorMessage });
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },

            googleLogin: async (code: string) => {
                try {
                    set({ loading: true, error: null });
                    const data: IAuthResponse = await AuthApi.googleLogin(code);
                    set({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true,
                    });
                } catch (err) {
                    const errorMessage =
                        err instanceof Error ? err.message : "Google login failed";
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
                    const errorMessage =
                        err instanceof Error ? err.message : "Logout failed";
                    set({ error: errorMessage });
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },



            updatePassword: async (data) => {
                try {
                    set({ loading: true, error: null });
                    await AuthApi.updatePassword(data);
                } catch (err) {
                    const errorMessage =
                        err instanceof Error ? err.message : "Failed to update password";
                    set({ error: errorMessage });
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },

            setPassword: async (data) => {
                try {
                    set({ loading: true, error: null });
                    await AuthApi.setPassword(data);
                } catch (err) {
                    const errorMessage =
                        err instanceof Error ? err.message : "Failed to set password";
                    set({ error: errorMessage });
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
            }),
            onRehydrateStorage: () => (state) => {
                // After rehydration, ensure isAuthenticated matches user state
                if (state) {
                    state.isAuthenticated = !!state.user;
                }
            },
        }
    )
);