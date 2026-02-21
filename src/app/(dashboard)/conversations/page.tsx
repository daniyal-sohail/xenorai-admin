"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useConversationStore } from "@/store/conversations.store";
import { useDomainStore } from "@/store/domain.store";
import { useAuthStore } from "@/store/auth.store";
import { IConversation, IMessage } from "@/api/ConversationsApi";
import { useConversationFilters } from "@/components/conversationComponents/useConversationsFilters";
import { useSocket } from "@/components/conversationComponents/useSocket";
import { ConversationStatsCard } from "@/components/conversationComponents/ConversationStatsCard";
import { ConversationFilters } from "@/components/conversationComponents/ConversationFilters";
import { ConversationListSkeleton } from "@/components/conversationComponents/ConversationSkeleton";
import { ConversationListItem } from "@/components/conversationComponents/ConversationListitems";
import { ChatWindow } from "@/components/conversationComponents/ChatWindow";
import { Popup, PopupType } from "@/components/common/PopUp";
import { DomainSelector } from "@/components/leadsComponents/DomainSelector";

export default function ConversationsPage() {
    const {
        conversations,
        selectedConversation,
        stats,
        loading,
        error,
        unreadCounts,
        fetchConversations,
        fetchConversationMessages,
        markMessagesAsRead,
        selectConversation,
        fetchStats,
        setConversationsFromSocket,
        setUnreadCounts,
        addIncomingMessage,
        updateConversationUnread,
    } = useConversationStore();

    const { domains, fetchDomains } = useDomainStore();
    const { user, accessToken } = useAuthStore(); // accessToken passed to useSocket

    const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [toast, setToast] = useState<{ open: boolean; type: PopupType; message: string }>({
        open: false,
        type: "info",
        message: "",
    });

    const showToast = useCallback((type: PopupType, message: string) => {
        setToast({ open: true, type, message });
    }, []);

    const { filters, filteredConversations, handleFilterChange, hasActiveFilters } =
        useConversationFilters(conversations);

    // Socket — token verified server-side, no userId in payloads
    const { sendMessage, toggleAI, isConnected } = useSocket({
        token: accessToken || "",
        domainId: selectedDomainId || undefined,

        // Backend emits conversations_list + unread_counts on owner_join
        onConversationsList: setConversationsFromSocket,
        onUnreadCounts: setUnreadCounts,

        // New visitor message
        onVisitorMessageReceived: useCallback((data: any) => {
            addIncomingMessage(data.conversationId, data.message);

            // Only increment unread badge if this conversation isn't currently open
            const isOpen = useConversationStore.getState().selectedConversation?._id === data.conversationId;
            if (!isOpen) {
                updateConversationUnread(data.conversationId, true);
            }

            // If this conversation IS open, append to local messages
            if (isOpen) {
                setMessages((prev) => [...prev, data.message]);
            }
        }, [addIncomingMessage, updateConversationUnread]),

        // AI responded
        onAiResponseSent: useCallback((data: any) => {
            addIncomingMessage(data.conversationId, data.message);

            const isOpen = useConversationStore.getState().selectedConversation?._id === data.conversationId;
            if (isOpen) {
                setMessages((prev) => [...prev, data.message]);
            }
        }, [addIncomingMessage]),

        // Visitor requested human
        onHandoffRequest: useCallback((data: any) => {
            showToast("info", `Handoff requested — a visitor wants to speak with you`);
            if (selectedDomainId) {
                fetchConversations({ domainId: selectedDomainId });
            }
        }, [selectedDomainId, showToast, fetchConversations]),

        onError: useCallback((errorMsg: string) => {
            showToast("error", errorMsg);
        }, [showToast]),
    });

    useEffect(() => { fetchDomains(); }, [fetchDomains]);

    useEffect(() => {
        if (domains.length > 0 && !selectedDomainId) {
            setSelectedDomainId(domains[0]._id);
        }
    }, [domains, selectedDomainId]);

    useEffect(() => {
        if (selectedDomainId) {
            fetchConversations({ domainId: selectedDomainId, limit: 100 });
            fetchStats(selectedDomainId);
        }
    }, [selectedDomainId, fetchConversations, fetchStats]);

    // When a conversation is selected — load messages + mark as read
    useEffect(() => {
        if (!selectedConversation) return;

        setMessagesLoading(true);
        fetchConversationMessages(selectedConversation._id)
            .then(() => {
                const msgs = useConversationStore.getState().selectedConversation?.messages || [];
                setMessages(msgs);
                // Mark messages as read and clear unread badge
                markMessagesAsRead(selectedConversation._id);
            })
            .catch(() => showToast("error", "Failed to load messages"))
            .finally(() => setMessagesLoading(false));
    }, [selectedConversation?._id]);

    useEffect(() => {
        if (error) showToast("error", error);
    }, [error]);

    const handleDomainChange = useCallback((domainId: string) => {
        setSelectedDomainId(domainId || null);
        selectConversation(null as any);
        setMessages([]);
    }, [selectConversation]);

    const handleConversationSelect = useCallback((conversation: IConversation) => {
        selectConversation(conversation);
    }, [selectConversation]);

    const handleSendMessage = useCallback(async (content: string) => {
        if (!selectedConversation || !selectedDomainId) return;

        setIsSending(true);
        try {
            // Send via socket — confirmation comes back as "message_sent" event
            sendMessage(
                selectedConversation._id,
                selectedConversation.visitorId,
                content,
                selectedDomainId
            );

            // Optimistic UI
            const optimisticMessage: IMessage = {
                _id: `temp-${Date.now()}`,
                conversationId: selectedConversation._id,
                sender: "human",
                content,
                isRead: true,
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, optimisticMessage]);
        } catch {
            showToast("error", "Failed to send message");
        } finally {
            setIsSending(false);
        }
    }, [selectedConversation, selectedDomainId, sendMessage, showToast]);

    const handleToggleAI = useCallback((enabled: boolean) => {
        if (!selectedConversation || !selectedDomainId) return;

        toggleAI(selectedConversation._id, selectedDomainId, selectedConversation.visitorId, enabled);

        // Optimistic update
        useConversationStore.setState((state: any) => ({
            selectedConversation: state.selectedConversation
                ? { ...state.selectedConversation, aiEnabled: enabled, status: enabled ? "active" : "handoff" }
                : null,
            conversations: state.conversations.map((c: any) =>
                c._id === selectedConversation._id
                    ? { ...c, aiEnabled: enabled, status: enabled ? "active" : "handoff" }
                    : c
            ),
        }));

        showToast("success", enabled ? "AI enabled" : "AI disabled — you can now reply manually");
    }, [selectedConversation, selectedDomainId, toggleAI, showToast]);

    const handleRefresh = useCallback(() => {
        if (selectedDomainId) {
            fetchConversations({ domainId: selectedDomainId, limit: 100 });
            fetchStats(selectedDomainId);
            showToast("success", "Conversations refreshed");
        }
    }, [selectedDomainId, fetchConversations, fetchStats, showToast]);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <MessageSquare size={28} className="text-indigo-600" />
                                    Live Conversations
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Chat with your website visitors in real-time
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isConnected ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                                        <Wifi size={14} />
                                        <span className="text-xs font-medium">Connected</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full">
                                        <WifiOff size={14} />
                                        <span className="text-xs font-medium">Disconnected</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={loading || !selectedDomainId}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full px-4 sm:px-6 lg:px-8 py-6">
                    <DomainSelector
                        domains={domains}
                        selectedDomainId={selectedDomainId}
                        onDomainChange={handleDomainChange}
                    />

                    {selectedDomainId && (
                        <>
                            <ConversationStatsCard stats={stats} />

                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                style={{ height: "calc(100vh - 340px)" }}
                            >
                                <div className="flex h-full">
                                    {/* Sidebar */}
                                    <div className="w-96 border-r border-gray-200 flex flex-col">
                                        <ConversationFilters
                                            filters={filters}
                                            onFilterChange={handleFilterChange}
                                        />
                                        <div className="flex-1 overflow-y-auto">
                                            {loading ? (
                                                <ConversationListSkeleton count={5} />
                                            ) : filteredConversations.length === 0 ? (
                                                <div className="flex items-center justify-center h-full p-6">
                                                    <div className="text-center">
                                                        <MessageSquare size={48} className="text-gray-400 mx-auto mb-3" />
                                                        <p className="text-gray-600">
                                                            {hasActiveFilters
                                                                ? "No conversations match your filters"
                                                                : "No conversations yet"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                filteredConversations.map((conv) => (
                                                    <ConversationListItem
                                                        key={conv._id}
                                                        conversation={conv}
                                                        isSelected={selectedConversation?._id === conv._id}
                                                        unreadCount={unreadCounts[conv._id] || 0}
                                                        onClick={handleConversationSelect}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Chat Window */}
                                    <ChatWindow
                                        conversation={selectedConversation}
                                        messages={messages}
                                        isLoading={messagesLoading}
                                        onSendMessage={handleSendMessage}
                                        onToggleAI={handleToggleAI}
                                        isSending={isSending}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Popup
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
}