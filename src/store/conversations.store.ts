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
    // Public chat state
    publicConversation: IConversation | null;
    publicMessages: IMessage[];
    publicLoading: boolean;
    visitorId: string | null;

    // Dashboard methods
    fetchConversations: (filters?: ConversationFilters) => Promise<void>;
    fetchConversationMessages: (conversationId: string, page?: number, limit?: number) => Promise<void>;
    addMessage: (conversationId: string, content: string, sender?: "visitor" | "bot" | "human") => Promise<IMessage | null>;
    selectConversation: (conversation: IConversation) => void;
    fetchStats: (domainId?: string) => Promise<void>;

    // Public chat methods
    sendPublicMessage: (domainKey: string, content: string) => Promise<void>;
    requestHandoff: (domainKey: string) => Promise<void>;
    setPublicConversation: (conversation: IConversation | null) => void;
    setPublicMessages: (messages: IMessage[]) => void;
    addPublicMessage: (message: IMessage) => void;
    setVisitorId: (id: string) => void;
}

export const useConversationStore = create<ConversationState>()(
    devtools((set, get) => ({
        conversations: [],
        selectedConversation: null,
        pagination: null,
        stats: null,
        loading: false,
        error: null,
        // Public chat
        publicConversation: null,
        publicMessages: [],
        publicLoading: false,
        visitorId: null,

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

        addMessage: async (conversationId, content, sender = "human") => {
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
        },

        // Public Chat Methods
        sendPublicMessage: async (domainKey, content) => {
            try {
                set({ publicLoading: true, error: null });
                const result = await ConversationApi.sendPublicChatMessage(
                    domainKey,
                    content,
                    get().visitorId || undefined
                );

                // Set visitor ID if not already set
                if (!get().visitorId) {
                    set({ visitorId: result.visitorId });
                    localStorage.setItem("chatbot-visitor-id", result.visitorId);
                }

                // Update conversation
                if (!get().publicConversation) {
                    set({ publicConversation: { _id: result.conversationId } as IConversation });
                }

                // Add messages
                const messages: IMessage[] = [result.message];
                if (result.botResponse) {
                    messages.push(result.botResponse);
                }

                set({
                    publicMessages: [...get().publicMessages, ...messages],
                    publicLoading: false,
                });
            } catch (err: any) {
                set({ publicLoading: false, error: err.message });
                throw err;
            }
        },

        requestHandoff: async (domainKey) => {
            try {
                const convo = get().publicConversation;
                if (!convo?._id || !get().visitorId) {
                    throw new Error("No active conversation");
                }

                set({ publicLoading: true, error: null });
                const result = await ConversationApi.requestPublicHandoff(
                    domainKey,
                    convo._id,
                    get().visitorId!
                );

                set({
                    publicConversation: result.conversation,
                    publicLoading: false,
                });
            } catch (err: any) {
                set({ publicLoading: false, error: err.message });
                throw err;
            }
        },

        setPublicConversation: (conversation) =>
            set({ publicConversation: conversation }),

        setPublicMessages: (messages) => set({ publicMessages: messages }),

        addPublicMessage: (message) =>
            set({ publicMessages: [...get().publicMessages, message] }),

        setVisitorId: (id) => {
            set({ visitorId: id });
            localStorage.setItem("chatbot-visitor-id", id);
        },
    }))
);
