import { AdminChatApi, IAdminChat, IChatMessage } from "@/api/AdminChatApi";
import { create } from "zustand";

interface AdminChatState {
    chats: IAdminChat[];
    messagesByChat: Record<string, IChatMessage[]>;
    selectedChatId: string | null;
    selectedUserId: string | null;
    loading: boolean;
    error: string | null;

    fetchChats: () => Promise<void>;
    selectChat: (chatId: string) => Promise<void>;
    sendMessage: (content: string, useSocket?: boolean) => Promise<void>;
    addMessageToChat: (chatId: string, message: IChatMessage) => void;
    setMessagesForChat: (chatId: string, messages: IChatMessage[]) => void;
    setSelectedUserId: (userId: string | null) => void;
}

export const useAdminChatStore = create<AdminChatState>((set, get) => ({
    chats: [],
    messagesByChat: {},
    selectedChatId: null,
    selectedUserId: null,
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

        // Find the userId for this chat
        const chat = get().chats.find(c => c._id === chatId);
        if (chat?.user?._id) {
            set({ selectedUserId: chat.user._id });
        }

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

    sendMessage: async (content, useSocket = false) => {
        const { selectedChatId } = get();
        if (!selectedChatId) return;

        // If not using socket, fall back to API (for backwards compatibility)
        if (!useSocket) {
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
        }
        // When using socket, the message will be added via socket event listener
    },

    addMessageToChat: (chatId, message) => {
        set((state) => ({
            messagesByChat: {
                ...state.messagesByChat,
                [chatId]: [
                    ...(state.messagesByChat[chatId] || []),
                    message,
                ],
            },
        }));
    },

    setMessagesForChat: (chatId, messages) => {
        set((state) => ({
            messagesByChat: {
                ...state.messagesByChat,
                [chatId]: messages,
            },
        }));
    },

    setSelectedUserId: (userId) => {
        set({ selectedUserId: userId });
    },
}));