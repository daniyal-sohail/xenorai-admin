// src/stores/conversation.store.ts
import { ConversationApi, ConversationFilters, IConversation, IConversationStats, IMessage } from "@/api/ConversationsApi";
import { IPagination } from "@/api/LeadsApi";
import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface ConversationState {
    conversations: IConversation[];
    selectedConversation: IConversation | null;
    pagination: IPagination | null;
    stats: IConversationStats | null;
    loading: boolean;
    error: string | null;

    fetchConversations: (filters?: ConversationFilters) => Promise<void>;
    fetchConversationMessages: (conversationId: string, page?: number, limit?: number) => Promise<void>;
    addMessage: (conversationId: string, content: string, sender?: "user" | "ai" | "admin") => Promise<IMessage | null>;
    selectConversation: (conversation: IConversation) => void;
    fetchStats: (domainId?: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>()(
    devtools((set, get) => ({
        conversations: [],
        selectedConversation: null,
        pagination: null,
        stats: null,
        loading: false,
        error: null,

        fetchConversations: async (filters = {}) => {
            try {
                set({ loading: true, error: null });
                const result = await ConversationApi.fetchConversations(filters);
                set({
                    conversations: result.conversations,
                    pagination: result.pagination,
                    loading: false
                });
            } catch (err: any) {
                set({ loading: false, error: err.message });
            }
        },

        fetchConversationMessages: async (conversationId, page = 1, limit = 50) => {
            try {
                set({ loading: true, error: null });
                const result = await ConversationApi.fetchConversationMessages(conversationId, page, limit);
                const selected = get().selectedConversation;
                if (selected?._id === conversationId) {
                    set({ selectedConversation: { ...selected, messages: result.messages }, loading: false });
                } else {
                    set({ loading: false });
                }
            } catch (err: any) {
                set({ loading: false, error: err.message });
            }
        },

        addMessage: async (conversationId, content, sender = "user") => {
            try {
                const msg = await ConversationApi.addMessage(conversationId, content, sender);
                const selected = get().selectedConversation;

                if (selected?._id === conversationId) {
                    set({
                        selectedConversation: {
                            ...selected,
                            messages: [...(selected.messages || []), msg],
                            lastMessage: msg,
                            lastMessageAt: msg.createdAt
                        }
                    });
                }

                set({
                    conversations: get().conversations.map(conv =>
                        conv._id === conversationId ? { ...conv, lastMessage: msg, lastMessageAt: msg.createdAt } : conv
                    )
                });

                return msg;
            } catch (err: any) {
                set({ error: err.message });
                return null;
            }
        },

        selectConversation: (conversation) => set({ selectedConversation: conversation }),

        fetchStats: async (domainId) => {
            try {
                set({ loading: true, error: null });
                const stats = await ConversationApi.fetchStats(domainId);
                set({ stats, loading: false });
            } catch (err: any) {
                set({ loading: false, error: err.message });
            }
        }
    }))
);
