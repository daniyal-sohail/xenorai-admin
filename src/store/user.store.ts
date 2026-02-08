// src/store/useUserStore.ts
import { create } from "zustand";
import { IUser } from "@/api/AuthApi";
import { UserApi } from "@/api/UserApi";

interface UserState {
    user: IUser | null;
    loading: boolean;
    error: string | null;

    fetchProfile: () => Promise<void>;
    updateProfile: (data: {
        fullName?: string;
        profileImage?: File;
    }) => Promise<void>;

    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: false,
    error: null,

    fetchProfile: async () => {
        try {
            set({ loading: true, error: null });
            const user = await UserApi.getProfile();
            set({ user });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to fetch profile";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    updateProfile: async (data) => {
        try {
            set({ loading: true, error: null });
            const updatedUser = await UserApi.updateProfile(data);
            set({ user: updatedUser });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Profile update failed";
            set({ error: message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    clearUser: () => set({ user: null, error: null }),
}));
