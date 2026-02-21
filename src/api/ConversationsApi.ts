// src/api/ConversationsApi.ts
import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

export interface IMessage {
    _id: string;
    conversationId: string;
    sender: "visitor" | "bot" | "human";
    content: string;
    isRead: boolean;
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
    status: "active" | "handoff";
    aiEnabled: boolean;
    lastMessageAt: string;
    createdAt: string;
    lastMessage?: IMessage | null;
    unreadCount?: number; // populated by backend aggregation
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
}

export interface ConversationFilters {
    domainId?: string;
    status?: "active" | "handoff";
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
            const messages = responseData.details
                .map((d: any) => d.message || d.msg)
                .filter(Boolean)
                .join(", ");
            throw new Error(messages || responseData.message || "Validation error");
        }
        throw new Error(responseData?.message || error.message || "Something went wrong");
    }
    throw new Error("Something went wrong");
};

export const ConversationApi = {
    fetchConversations: async (
        filters: ConversationFilters
    ): Promise<{ conversations: IConversation[]; pagination: IPagination }> => {
        try {
            const res = await API.get("/conversations/owner/conversations", { params: filters });
            return res.data.data;
        } catch (err) {
            return handleError(err);
        }
    },

    fetchConversationMessages: async (
        conversationId: string,
        page = 1,
        limit = 50
    ): Promise<{ messages: IMessage[]; pagination: IPagination }> => {
        try {
            const res = await API.get(`/conversations/${conversationId}/messages`, {
                params: { page, limit },
            });
            return res.data.data;
        } catch (err) {
            return handleError(err);
        }
    },

    // Mark all visitor/bot messages in a conversation as read
    markMessagesAsRead: async (conversationId: string): Promise<void> => {
        try {
            await API.post(`/conversations/${conversationId}/read`);
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
    },

    // Public widget endpoints (no auth required)
    sendPublicChatMessage: async (
        domainKey: string,
        content: string,
        visitorId?: string
    ): Promise<{
        message: IMessage;
        botResponse?: IMessage;
        visitorId: string;
        conversationId: string;
    }> => {
        try {
            const res = await API.post("/conversations/public/chat", {
                domainKey,
                content,
                visitorId,
            });
            return res.data.data;
        } catch (err) {
            return handleError(err);
        }
    },

    requestPublicHandoff: async (
        domainKey: string,
        conversationId: string,
        visitorId: string
    ): Promise<{ conversation: IConversation }> => {
        try {
            const res = await API.post("/conversations/public/handoff", {
                domainKey,
                conversationId,
                visitorId,
            });
            return res.data.data;
        } catch (err) {
            return handleError(err);
        }
    },
};