// src/api/StatsApi.ts
import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

/* =======================
   TYPES
======================= */

export interface IDashboardDomainStat {
    domainId: string;
    domainName: string;
    conversations: number;
    active: number;
}

export interface IDashboardStats {
    totalChats: number;
    totalLeads: number;
    activeConversations: number;
    todaysChats: number;
    byDomain: IDashboardDomainStat[];
}

/* =======================
   ERROR HANDLER
======================= */

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data;

        if (responseData?.details && Array.isArray(responseData.details)) {
            const detailMessages = responseData.details
                .map((d: any) => d.message || d.msg)
                .filter(Boolean)
                .join(", ");
            throw new Error(detailMessages || "Validation error");
        }

        throw new Error(
            responseData?.message ||
            error.message ||
            "Something went wrong"
        );
    }

    throw new Error("Something went wrong");
};

/* =======================
   API
======================= */

export const StatsApi = {
    getDashboardStats: async (): Promise<IDashboardStats> => {
        try {
            const res = await API.get("/stats/dashboard");
            return res.data.data.stats;
        } catch (error) {
            return handleError(error);
        }
    }
};
