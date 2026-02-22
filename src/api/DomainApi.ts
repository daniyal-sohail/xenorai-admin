import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

/* -------------------- TYPES -------------------- */

export type ToneType = "professional" | "friendly" | "salesy";
export type IndustryType = "ecommerce" | "services" | "saas" | "other";

export interface IDomain {
    _id: string;
    domainName: string;
    domainKey: string;
    botName: string;
    botAvatar?: string | null;
    tone: ToneType;
    botEnabled: boolean;
    fallbackMessage: string;
    companyDescription?: string | null;
    industryType: IndustryType;
    createdAt: string;
    updatedAt: string;
}

export interface IDomainWithScript {
    domain: IDomain;
    botScript: string;
}

interface CreateDomainPayload {
    domainName: string;
    botName?: string;
    botAvatar?: File;
    tone?: ToneType;
    fallbackMessage?: string;
    companyDescription?: string;
    industryType?: IndustryType;
}

interface UpdateDomainPayload {
    botName?: string;
    botAvatar?: File | null;
    tone?: ToneType;
    fallbackMessage?: string;
    companyDescription?: string;
    industryType?: IndustryType;
}

/* -------------------- ERROR HANDLER -------------------- */

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data;

        if (responseData?.details && Array.isArray(responseData.details)) {
            const message = responseData.details
                .map((d: any) => d.message || d.msg)
                .filter(Boolean)
                .join(", ");
            throw new Error(message || "Validation error");
        }

        throw new Error(responseData?.message || error.message || "Something went wrong");
    }
    throw new Error("Something went wrong");
};

/* -------------------- API -------------------- */

export const DomainApi = {
    create: async (payload: CreateDomainPayload): Promise<IDomain> => {
        try {
            const formData = new FormData();
            formData.append("domainName", payload.domainName);
            if (payload.botName) formData.append("botName", payload.botName);
            if (payload.tone) formData.append("tone", payload.tone);
            if (payload.fallbackMessage) formData.append("fallbackMessage", payload.fallbackMessage);
            if (payload.companyDescription) formData.append("companyDescription", payload.companyDescription);
            if (payload.industryType) formData.append("industryType", payload.industryType);
            if (payload.botAvatar instanceof File) formData.append("botAvatar", payload.botAvatar);

            const res = await API.post("/domains", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data.domain;
        } catch (error) {
            return handleError(error);
        }
    },

    getMyDomains: async (): Promise<IDomain[]> => {
        try {
            const res = await API.get("/domains");
            return res.data.data.domains;
        } catch (error) {
            return handleError(error);
        }
    },

    getById: async (domainId: string): Promise<IDomainWithScript> => {
        try {
            const res = await API.get(`/domains/${domainId}`);
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    update: async (
        domainId: string,
        payload: UpdateDomainPayload
    ): Promise<IDomain> => {
        try {
            const formData = new FormData();
            if (payload.botName !== undefined) formData.append("botName", payload.botName);
            if (payload.tone) formData.append("tone", payload.tone);
            if (payload.fallbackMessage !== undefined) formData.append("fallbackMessage", payload.fallbackMessage);
            if (payload.companyDescription !== undefined) formData.append("companyDescription", payload.companyDescription);
            if (payload.industryType) formData.append("industryType", payload.industryType);
            if (payload.botAvatar instanceof File) {
                formData.append("botAvatar", payload.botAvatar);
            }
            // If botAvatar is explicitly null, don't send it (keeps existing)

            const res = await API.put(`/domains/${domainId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data.domain;
        } catch (error) {
            return handleError(error);
        }
    },

    delete: async (domainId: string): Promise<boolean> => {
        try {
            await API.delete(`/domains/${domainId}`);
            return true;
        } catch (error) {
            return handleError(error);
        }
    },

    toggleBot: async (domainId: string): Promise<IDomain> => {
        try {
            const res = await API.patch(`/domains/${domainId}/toggle`);
            return res.data.data.domain;
        } catch (error) {
            return handleError(error);
        }
    },

    getByKey: async (domainKey: string): Promise<IDomain> => {
        try {
            const res = await API.get(`/domains/public/${domainKey}`);
            return res.data.data.domain;
        } catch (error) {
            return handleError(error);
        }
    },

    getScriptByKey: async (domainKey: string): Promise<string> => {
        try {
            const res = await API.get(`/domains/public/${domainKey}/script`);
            return res.data.data.script;
        } catch (error) {
            return handleError(error);
        }
    },
};
