import { AdminApi } from "@/api/AdminApi";
import { create } from "zustand";

interface AdminState {
    // USERS
    users: any[];
    usersPagination: any;
    selectedUser: any | null;

    // STATS
    stats: any;

    // DOMAINS
    domains: any[];
    domainsPagination: any;

    loading: boolean;
    error: string | null;

    // ACTIONS
    fetchUsers: (params?: any) => Promise<void>;
    fetchUserDetails: (userId: string) => Promise<void>;
    approveUser: (userId: string) => Promise<void>;
    approveBulk: (userIds: string[]) => Promise<void>;

    fetchStats: () => Promise<void>;
    fetchDomains: (params?: any) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    users: [],
    usersPagination: null,
    selectedUser: null,

    stats: null,

    domains: [],
    domainsPagination: null,

    loading: false,
    error: null,

    // ================= USERS =================

    fetchUsers: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const data = await AdminApi.getUsers(params);
            set({
                users: data.users,
                usersPagination: data.pagination,
            });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error" });
        } finally {
            set({ loading: false });
        }
    },

    fetchUserDetails: async (userId) => {
        try {
            set({ loading: true, error: null });
            const user = await AdminApi.getUserDetails(userId);
            set({ selectedUser: user });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error" });
        } finally {
            set({ loading: false });
        }
    },

    approveUser: async (userId) => {
        const updatedUser = await AdminApi.approveUser(userId);

        // 🔥 Update only that user (no full refetch)
        set((state) => ({
            users: state.users.map((u) =>
                u._id === userId ? updatedUser : u
            ),
        }));
    },

    approveBulk: async (userIds) => {
        await AdminApi.approveBulk(userIds);

        // safest production option
        await get().fetchUsers();
    },

    // ================= STATS =================

    fetchStats: async () => {
        const stats = await AdminApi.getStats();
        set({ stats });
    },

    // ================= DOMAINS =================

    fetchDomains: async (params = {}) => {
        try {
            set({ loading: true });
            const data = await AdminApi.getDomains(params);
            set({
                domains: data.domains,
                domainsPagination: data.pagination,
            });
        } finally {
            set({ loading: false });
        }
    },
}));