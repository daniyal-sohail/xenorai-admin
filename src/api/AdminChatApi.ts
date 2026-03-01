import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        throw new Error(
            error.response?.data?.message || error.message || "Something went wrong"
        );
    }
    throw new Error("Something went wrong");
};

export interface IAdminChat {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    lastMessage?: string;
    updatedAt: string;
    unreadCount: number;
}

export interface IChatMessage {
    _id: string;
    adminChatId: string;
    sender: string;
    content: string;
    createdAt: string;
}

export const AdminChatApi = {
    listChats: async (params?: any): Promise<IAdminChat[]> => {
        try {
            const res = await API.get("/admin/chats", { params });
            return res.data.data.chats;
        } catch (error) {
            return handleError(error);
        }
    },

    getMessages: async (chatId: string, params?: any): Promise<IChatMessage[]> => {
        try {
            const res = await API.get(`/admin/chats/${chatId}/messages`, { params });
            return res.data.data.messages;
        } catch (error) {
            return handleError(error);
        }
    },

    sendMessage: async (chatId: string, content: string): Promise<IChatMessage> => {
        try {
            const res = await API.post(`/admin/chats/${chatId}/message`, { content });
            return res.data.data.message;
        } catch (error) {
            return handleError(error);
        }
    },
};