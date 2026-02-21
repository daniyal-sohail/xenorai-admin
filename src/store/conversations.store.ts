// src/stores/conversation.store.ts
import {
    ConversationApi,
    ConversationFilters,
    IConversation,
    IConversationStats,
    IMessage,
    IPagination,
} from "@/api/ConversationsApi";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ConversationState {
    // Dashboard state
    conversations: IConversation[];
    selectedConversation: IConversation | null;
    pagination: IPagination | null;
    stats: IConversationStats | null;
    loading: boolean;
    error: string | null;
    unreadCounts: Record<string, number>; // conversationId → unread count

    // Public widget state
    publicConversation: IConversation | null;
    publicMessages: IMessage[];
    publicLoading: boolean;
    visitorId: string | null;

    // Dashboard methods
    fetchConversations: (filters?: ConversationFilters) => Promise<void>;
    fetchConversationMessages: (conversationId: string, page?: number, limit?: number) => Promise<void>;
    markMessagesAsRead: (conversationId: string) => Promise<void>;
    selectConversation: (conversation: IConversation) => void;
    fetchStats: (domainId?: string) => Promise<void>;

    // Socket-driven setters (called from useSocket callbacks)
    setConversationsFromSocket: (data: { conversations: IConversation[]; pagination: IPagination }) => void;
    setUnreadCounts: (counts: Record<string, number>) => void;
    addIncomingMessage: (conversationId: string, message: IMessage) => void;
    updateConversationUnread: (conversationId: string, increment?: boolean) => void;

    // Public widget methods
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
        unreadCounts: {},

        // Public widget
        publicConversation: null,
        publicMessages: [],
        publicLoading: false,
        visitorId: null,

        // ─── Dashboard Methods ────────────────────────────────────────────────

        fetchConversations: async (filters = {}) => {
            try {
                set({ loading: true, error: null });
                const result = await ConversationApi.fetchConversations(filters);
                // Seed unread counts from the backend-populated unreadCount field
                const unreadCounts: Record<string, number> = {};
                result.conversations.forEach((c) => {
                    if (c.unreadCount) unreadCounts[c._id] = c.unreadCount;
                });
                set({
                    conversations: result.conversations,
                    pagination: result.pagination,
                    unreadCounts: { ...get().unreadCounts, ...unreadCounts },
                    loading: false,
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
                    set({
                        selectedConversation: { ...selected, messages: result.messages },
                        loading: false,
                    });
                } else {
                    set({ loading: false });
                }
            } catch (err: any) {
                set({ loading: false, error: err.message });
            }
        },

        // Call when owner opens a conversation — marks messages read on backend + clears badge
        markMessagesAsRead: async (conversationId) => {
            try {
                await ConversationApi.markMessagesAsRead(conversationId);
                // Clear unread badge locally
                set((state) => ({
                    unreadCounts: { ...state.unreadCounts, [conversationId]: 0 },
                    conversations: state.conversations.map((c) =>
                        c._id === conversationId ? { ...c, unreadCount: 0 } : c
                    ),
                }));
            } catch (err: any) {
                console.error("markMessagesAsRead error:", err.message);
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

        // ─── Socket-driven Setters ────────────────────────────────────────────

        // Called when socket emits "conversations_list"
        setConversationsFromSocket: (data) => {
            const unreadCounts: Record<string, number> = {};
            data.conversations.forEach((c) => {
                if (c.unreadCount) unreadCounts[c._id] = c.unreadCount;
            });
            set({
                conversations: data.conversations,
                pagination: data.pagination,
                unreadCounts: { ...get().unreadCounts, ...unreadCounts },
            });
        },

        // Called when socket emits "unread_counts"
        setUnreadCounts: (counts) => {
            set({ unreadCounts: counts });
        },

        // Called when socket emits "visitor_message_received" or "ai_response_sent"
        // Appends message to selectedConversation if it's open, and updates list preview
        addIncomingMessage: (conversationId, message) => {
            const state = get();

            // Append to open conversation
            if (state.selectedConversation?._id === conversationId) {
                set({
                    selectedConversation: {
                        ...state.selectedConversation,
                        messages: [...(state.selectedConversation.messages || []), message],
                        lastMessage: message,
                        lastMessageAt: message.createdAt,
                    },
                });
            }

            // Update conversation list preview + bump to top
            set({
                conversations: [
                    ...state.conversations
                        .map((c) =>
                            c._id === conversationId
                                ? { ...c, lastMessage: message, lastMessageAt: message.createdAt }
                                : c
                        )
                        .sort(
                            (a, b) =>
                                new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                        ),
                ],
            });
        },

        // Increment or reset unread count for a conversation
        updateConversationUnread: (conversationId, increment = true) => {
            set((state) => {
                const current = state.unreadCounts[conversationId] || 0;
                return {
                    unreadCounts: {
                        ...state.unreadCounts,
                        [conversationId]: increment ? current + 1 : 0,
                    },
                    conversations: state.conversations.map((c) =>
                        c._id === conversationId
                            ? { ...c, unreadCount: increment ? (c.unreadCount || 0) + 1 : 0 }
                            : c
                    ),
                };
            });
        },

        // ─── Public Widget Methods ────────────────────────────────────────────

        sendPublicMessage: async (domainKey, content) => {
            try {
                set({ publicLoading: true, error: null });
                const result = await ConversationApi.sendPublicChatMessage(
                    domainKey,
                    content,
                    get().visitorId || undefined
                );

                // Persist visitor ID
                if (!get().visitorId) {
                    set({ visitorId: result.visitorId });
                    localStorage.setItem("chatbot-visitor-id", result.visitorId);
                }

                // Set conversation reference
                if (!get().publicConversation) {
                    set({ publicConversation: { _id: result.conversationId } as IConversation });
                }

                // Add visitor message + bot response
                const messages: IMessage[] = [result.message];
                if (result.botResponse) messages.push(result.botResponse);

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
                if (!convo?._id || !get().visitorId) throw new Error("No active conversation");

                set({ publicLoading: true, error: null });
                const result = await ConversationApi.requestPublicHandoff(
                    domainKey,
                    convo._id,
                    get().visitorId!
                );

                set({ publicConversation: result.conversation, publicLoading: false });
            } catch (err: any) {
                set({ publicLoading: false, error: err.message });
                throw err;
            }
        },

        setPublicConversation: (conversation) => set({ publicConversation: conversation }),
        setPublicMessages: (messages) => set({ publicMessages: messages }),
        addPublicMessage: (message) =>
            set({ publicMessages: [...get().publicMessages, message] }),
        setVisitorId: (id) => {
            set({ visitorId: id });
            localStorage.setItem("chatbot-visitor-id", id);
        },
    }))
);