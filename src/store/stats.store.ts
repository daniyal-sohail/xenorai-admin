// src/stores/stats.store.ts
import { create } from "zustand";
import { StatsApi, IDashboardStats } from "@/api/StatsApi";

/* =======================
   STATE
======================= */

interface StatsState {
    dashboard: IDashboardStats | null;

    loading: boolean;
    error: string | null;

    fetchDashboardStats: () => Promise<void>;
    clearStats: () => void;
}

/* =======================
   STORE
======================= */

export const useStatsStore = create<StatsState>((set, get) => ({
    dashboard: null,
    loading: false,
    error: null,

    fetchDashboardStats: async () => {
        try {
            // prevent useless refetch re-render
            if (get().loading) return;

            set({ loading: true, error: null });

            const stats = await StatsApi.getDashboardStats();

            set((state) => {
                // shallow compare to avoid unnecessary re-renders
                if (JSON.stringify(state.dashboard) === JSON.stringify(stats)) {
                    return { loading: false };
                }

                return {
                    dashboard: stats,
                    loading: false
                };
            });
        } catch (err) {
            set({
                loading: false,
                error: err instanceof Error ? err.message : "Failed to load dashboard stats"
            });
        }
    },

    clearStats: () => set({ dashboard: null, error: null })
}));
