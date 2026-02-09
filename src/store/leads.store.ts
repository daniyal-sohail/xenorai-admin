// src/store/useLeadStore.ts
import { ILead, ILeadStats, IPagination, LeadApi } from "@/api/LeadsApi";
import { create } from "zustand";

interface LeadState {
    leads: ILead[];
    selectedLead: ILead | null;
    pagination: IPagination | null;
    stats: ILeadStats | null;

    loading: boolean;
    error: string | null;

    // Actions
    fetchLeads: (params: {
        domainId: string;
        page?: number;
        limit?: number;
    }) => Promise<void>;

    fetchLeadById: (leadId: string) => Promise<void>;
    updateLead: (leadId: string, data: { name?: string; phone?: string }) => Promise<void>;
    deleteLead: (leadId: string) => Promise<void>;
    fetchLeadStats: (domainId?: string) => Promise<void>;

    clearSelectedLead: () => void;
}

export const useLeadStore = create<LeadState>((set, get) => ({
    leads: [],
    selectedLead: null,
    pagination: null,
    stats: null,

    loading: false,
    error: null,

    fetchLeads: async (params) => {
        try {
            set({ loading: true, error: null });
            const data = await LeadApi.getLeads(params);

            set({
                leads: data.leads,
                pagination: data.pagination,
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to fetch leads",
            });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    fetchLeadById: async (leadId) => {
        try {
            set({ loading: true, error: null });
            const lead = await LeadApi.getLeadById(leadId);
            set({ selectedLead: lead });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to fetch lead",
            });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    updateLead: async (leadId, data) => {
        try {
            set({ loading: true, error: null });
            const updated = await LeadApi.updateLead(leadId, data);

            set({
                leads: get().leads.map((l) =>
                    l._id === leadId ? updated : l
                ),
                selectedLead:
                    get().selectedLead?._id === leadId
                        ? updated
                        : get().selectedLead,
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to update lead",
            });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    deleteLead: async (leadId) => {
        try {
            set({ loading: true, error: null });
            await LeadApi.deleteLead(leadId);

            set({
                leads: get().leads.filter((l) => l._id !== leadId),
                selectedLead:
                    get().selectedLead?._id === leadId ? null : get().selectedLead,
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to delete lead",
            });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    fetchLeadStats: async (domainId) => {
        try {
            const stats = await LeadApi.getLeadStats(domainId);
            set({ stats });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to fetch stats",
            });
        }
    },

    clearSelectedLead: () => set({ selectedLead: null }),
}));
