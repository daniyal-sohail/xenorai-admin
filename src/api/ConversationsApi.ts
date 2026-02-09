// src/api/conversation.api.ts
import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

// types/conversation.types.ts
export interface IMessage {
    _id: string;
    conversationId: string;
    sender: "visitor" | "bot" | "human";
    content: string;
    meta?: Record<string, any>;
    createdAt: string;
    updatedAt?: string;
}

export interface IConversation {
    _id: string;
    domainId: string | {
        _id: string;
        domainName: string;
        domainKey: string;
    };
    userId: string;
    visitorId: string;
    status: "active" | "handoff" | "closed";
    aiEnabled: boolean;
    lastMessageAt: string;
    createdAt: string;
    lastMessage?: IMessage | null;
    messages?: IMessage[];
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface IConversationStats {
    total: number;
    active: number;
    handoff: number;
    closed: number;
}

export interface ConversationFilters {
    domainId?: string;
    status?: "active" | "handoff" | "closed";
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}



const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data;
        if (responseData?.details && Array.isArray(responseData.details)) {
            const messages = responseData.details.map((d: any) => d.message || d.msg).filter(Boolean).join(", ");
            throw new Error(messages || responseData.message || "Validation error");
        }
        throw new Error(responseData?.message || error.message || "Something went wrong");
    }
    throw new Error("Something went wrong");
};

export const ConversationApi = {
    fetchConversations: async (filters: ConversationFilters): Promise<{ conversations: IConversation[], pagination: any }> => {
        try {
            const res = await API.get("/conversations/owner/conversations", { params: filters });
            return res.data.data;
        } catch (err) {
            return handleError(err);
        }
    },

    fetchConversationMessages: async (conversationId: string, page = 1, limit = 50): Promise<{ messages: IMessage[], pagination: any }> => {
        try {
            const res = await API.get(`/conversations/${conversationId}/messages`, { params: { page, limit } });
            return res.data.data;
        } catch (err) {
            return handleError(err);
        }
    },

    addMessage: async (conversationId: string, content: string, sender: "visitor" | "bot" | "human" = "human"): Promise<IMessage> => {
        try {
            const res = await API.post("/conversations/message", { conversationId, content, sender });
            return res.data.data.message;
        } catch (err) {
            return handleError(err);
        }
    },

    fetchStats: async (domainId?: string): Promise<IConversationStats> => {
        try {
            const res = await API.get("/conversations/owner/stats", { params: { domainId } });
            return res.data.data.stats;
        } catch (err) {
            return handleError(err);
        }
    }
};
