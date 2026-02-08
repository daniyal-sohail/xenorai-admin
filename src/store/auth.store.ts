import { create } from "zustand";

type User = { name: string; email: string };

type AuthState = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: { name: "Admin User", email: "admin@example.com" }, // placeholder
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
