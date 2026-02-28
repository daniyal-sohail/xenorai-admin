import { SupportChatApi } from "@/api/SupportApi";
import { create } from "zustand";

interface IChatMessage {
    _id: string;
    sender: string;
    content: string;
    createdAt: string;
}

interface SupportChatState {
    messages: IChatMessage[];
    loading: boolean;
    error: string | null;

    fetchMessages: () => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
}

export const useSupportChatStore = create<SupportChatState>((set) => ({
    messages: [],
    loading: false,
    error: null,

    fetchMessages: async () => {
        try {
            set({ loading: true, error: null });
            const messages = await SupportChatApi.getMyMessages();
            set({ messages });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error" });
        } finally {
            set({ loading: false });
        }
    },

    sendMessage: async (content) => {
        const message = await SupportChatApi.sendMessage(content);
        set((state) => ({
            messages: [...state.messages, message],
        }));
    },
}));