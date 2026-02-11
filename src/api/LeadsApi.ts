// src/api/LeadApi.ts
import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

export interface ILead {
    _id: string;
    domainId: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    productsInterested?: string[];
    recommendedProduct?: string | null;
    tags?: string[];
    conversationId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface ILeadListResponse {
    leads: ILead[];
    pagination: IPagination;
}

export interface ILeadStats {
    total: number;
    byDomain: Array<{
        _id: string;
        total: number;
    }>;
}

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const data = error.response?.data;
        throw new Error(data?.message || error.message || "Something went wrong");
    }
    throw new Error("Something went wrong");
};

export const LeadApi = {
    getLeads: async (params: {
        domainId: string;
        page?: number;
        limit?: number;
    }): Promise<ILeadListResponse> => {
        try {
            const res = await API.get("/leads", { params });
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    getLeadById: async (leadId: string): Promise<ILead> => {
        try {
            const res = await API.get(`/leads/${leadId}`);
            return res.data.data.lead;
        } catch (error) {
            return handleError(error);
        }
    },

    updateLead: async (
        leadId: string,
        payload: { name?: string; phone?: string }
    ): Promise<ILead> => {
        try {
            const res = await API.put(`/leads/${leadId}`, payload);
            return res.data.data.lead;
        } catch (error) {
            return handleError(error);
        }
    },

    deleteLead: async (leadId: string): Promise<boolean> => {
        try {
            await API.delete(`/leads/${leadId}`);
            return true;
        } catch (error) {
            return handleError(error);
        }
    },

    getLeadStats: async (domainId?: string): Promise<ILeadStats> => {
        try {
            const res = await API.get("/leads/stats", {
                params: domainId ? { domainId } : {},
            });
            return res.data.data.stats;
        } catch (error) {
            return handleError(error);
        }
    },
};
