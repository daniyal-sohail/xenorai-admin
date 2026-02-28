import { AdminChatApi, IAdminChat, IChatMessage } from "@/api/AdminChatApi";
import { create } from "zustand";

interface AdminChatState {
    chats: IAdminChat[];
    messagesByChat: Record<string, IChatMessage[]>;
    selectedChatId: string | null;
    loading: boolean;
    error: string | null;

    fetchChats: () => Promise<void>;
    selectChat: (chatId: string) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
}

export const useAdminChatStore = create<AdminChatState>((set, get) => ({
    chats: [],
    messagesByChat: {},
    selectedChatId: null,
    loading: false,
    error: null,

    fetchChats: async () => {
        try {
            set({ loading: true, error: null });
            const chats = await AdminChatApi.listChats();
            set({ chats });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error" });
        } finally {
            set({ loading: false });
        }
    },

    selectChat: async (chatId) => {
        set({ selectedChatId: chatId });

        if (get().messagesByChat[chatId]) return; // 🚀 prevent refetch

        try {
            set({ loading: true });
            const messages = await AdminChatApi.getMessages(chatId);
            set((state) => ({
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: messages,
                },
            }));
        } finally {
            set({ loading: false });
        }
    },

    sendMessage: async (content) => {
        const { selectedChatId } = get();
        if (!selectedChatId) return;

        const message = await AdminChatApi.sendMessage(selectedChatId, content);

        set((state) => ({
            messagesByChat: {
                ...state.messagesByChat,
                [selectedChatId]: [
                    ...(state.messagesByChat[selectedChatId] || []),
                    message,
                ],
            },
        }));
    },
}));