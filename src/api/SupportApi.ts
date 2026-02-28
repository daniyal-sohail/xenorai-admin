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

export const SupportChatApi = {
    getMyMessages: async (params?: any) => {
        try {
            const res = await API.get("/support/chat/messages", { params });
            return res.data.data.messages;
        } catch (error) {
            return handleError(error);
        }
    },

    sendMessage: async (content: string) => {
        try {
            const res = await API.post("/support/chat/message", { content });
            return res.data.data.message;
        } catch (error) {
            return handleError(error);
        }
    },
};