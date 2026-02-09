import { create } from "zustand";
import { DomainApi, IDomain } from "@/api/DomainApi";

interface DomainState {
    domains: IDomain[];
    activeDomain: IDomain | null;
    botScript: string | null;

    loading: boolean;
    error: string | null;

    fetchDomains: () => Promise<void>;
    fetchDomainById: (id: string) => Promise<void>;
    createDomain: (payload: any) => Promise<void>;
    updateDomain: (id: string, payload: any) => Promise<void>;
    deleteDomain: (id: string) => Promise<void>;
    toggleBotStatus: (id: string) => Promise<void>;
    clearActiveDomain: () => void;
}

export const useDomainStore = create<DomainState>((set, get) => ({
    domains: [],
    activeDomain: null,
    botScript: null,
    loading: false,
    error: null,

    /* -------------------- FETCH ALL -------------------- */
    fetchDomains: async () => {
        try {
            set({ loading: true, error: null });
            const domains = await DomainApi.getMyDomains();
            set({ domains });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to fetch domains" });
        } finally {
            set({ loading: false });
        }
    },

    /* -------------------- FETCH ONE -------------------- */
    fetchDomainById: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const { domain, botScript } = await DomainApi.getById(id);
            set({ activeDomain: domain, botScript });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to fetch domain" });
        } finally {
            set({ loading: false });
        }
    },

    /* -------------------- CREATE -------------------- */
    createDomain: async (payload) => {
        try {
            set({ loading: true, error: null });
            const domain = await DomainApi.create(payload);
            set({ domains: [...get().domains, domain] });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Create failed" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    /* -------------------- UPDATE -------------------- */
    updateDomain: async (id, payload) => {
        try {
            set({ loading: true, error: null });
            const updated = await DomainApi.update(id, payload);

            set({
                domains: get().domains.map(d => (d._id === id ? updated : d)),
                activeDomain:
                    get().activeDomain?._id === id ? updated : get().activeDomain,
            });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Update failed" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    /* -------------------- DELETE -------------------- */
    deleteDomain: async (id) => {
        try {
            set({ loading: true, error: null });
            await DomainApi.delete(id);
            set({
                domains: get().domains.filter(d => d._id !== id),
                activeDomain: null,
                botScript: null,
            });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Delete failed" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    /* -------------------- TOGGLE BOT -------------------- */
    toggleBotStatus: async (id) => {
        try {
            const updated = await DomainApi.toggleBot(id);
            set({
                domains: get().domains.map(d => (d._id === id ? updated : d)),
                activeDomain:
                    get().activeDomain?._id === id ? updated : get().activeDomain,
            });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Toggle failed" });
        }
    },

    clearActiveDomain: () => set({ activeDomain: null, botScript: null }),
}));
