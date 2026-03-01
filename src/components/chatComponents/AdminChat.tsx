"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Send, MessageSquare, X, ChevronDown } from "lucide-react";
import { useAdminChatStore } from "@/store/useAdminChatStore";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import { useAuthStore } from "@/store/auth.store";
import { IChatMessage } from "@/api/AdminChatApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name?: string, email?: string) {
    const src = name || email || "?";
    return src.slice(0, 2).toUpperCase();
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
const ChatListSkeleton = () => (
    <div className="space-y-1 p-3">
        {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-3/5" />
                    <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                </div>
            </div>
        ))}
    </div>
);

const MessagesSkeleton = () => (
    <div className="p-4 space-y-4">
        {[false, true, false, true, false].map((right, i) => (
            <div key={i} className={`flex gap-2 ${right ? "justify-end" : "justify-start"} animate-pulse`}>
                {!right && <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0 mt-1" />}
                <div className={`h-10 rounded-2xl bg-gray-200 ${right ? "w-48" : "w-64"}`} />
            </div>
        ))}
    </div>
);

// ─── Bubble ───────────────────────────────────────────────────────────────────
interface BubbleProps {
    content: string;
    time: string;
    isAdmin: boolean;
}

const Bubble = ({ content, time, isAdmin }: BubbleProps) => (
    <div className={`flex gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
        {!isAdmin && (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shrink-0 mt-1" />
        )}
        <div className={`max-w-xs lg:max-w-md ${isAdmin ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
            <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isAdmin
                    ? "bg-[#f97518] text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm"
                    }`}
            >
                {content}
            </div>
            <span className="text-[10px] text-gray-400 px-1">{time}</span>
        </div>
        {isAdmin && (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-1">
                A
            </div>
        )}
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminChatPage() {
    const {
        chats,
        messagesByChat,
        selectedChatId,
        selectedUserId,
        loading,
        fetchChats,
        selectChat,
        sendMessage,
        addMessageToChat,
        setMessagesForChat
    } = useAdminChatStore();

    const { accessToken } = useAuthStore();

    const [search, setSearch] = useState("");
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Use refs to avoid closure issues with socket callbacks
    const selectedChatIdRef = useRef(selectedChatId);
    const addMessageToChatRef = useRef(addMessageToChat);
    const setMessagesForChatRef = useRef(setMessagesForChat);

    // Keep refs in sync with current values
    useEffect(() => {
        selectedChatIdRef.current = selectedChatId;
    }, [selectedChatId]);

    useEffect(() => {
        addMessageToChatRef.current = addMessageToChat;
        setMessagesForChatRef.current = setMessagesForChat;
    }, [addMessageToChat, setMessagesForChat]);

    // Initialize socket connection
    const { sendMessage: socketSendMessage, joinChat, isConnected } = useAdminSocket({
        token: accessToken || "",
        userId: selectedUserId,
        onChatHistory: (data) => {
            console.log("Admin received chat history", data);
            const currentChatId = selectedChatIdRef.current;
            if (currentChatId) {
                setMessagesForChatRef.current(currentChatId, data.messages);
            }
        },
        onNewMessage: (message: IChatMessage) => {
            console.log("Admin received new message", message);
            // Use the adminChatId from the message to ensure correct routing
            const chatId = message.adminChatId || selectedChatIdRef.current;
            if (chatId) {
                addMessageToChatRef.current(chatId, message);
            }
        },
        onError: (error) => {
            console.error("Socket error:", error);
        },
    });

    useEffect(() => { fetchChats(); }, [fetchChats]);

    // Join the selected user's chat room when selection changes
    useEffect(() => {
        if (selectedUserId && isConnected) {
            console.log("Admin joining chat for user:", selectedUserId);
            joinChat(selectedUserId);
        }
    }, [selectedUserId, isConnected, joinChat]);

    // auto-scroll to bottom when messages update
    useEffect(() => {
        if (!showScrollBtn) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatId, messagesByChat, showScrollBtn]);

    const onScroll = () => {
        const el = messagesContainerRef.current;
        if (!el) return;
        setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollBtn(false);
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedChatId || !selectedUserId || sending) return;
        setSending(true);
        const content = input.trim();
        setInput("");
        try {
            // Use socket for real-time messaging
            if (isConnected) {
                socketSendMessage(selectedUserId, content);
            } else {
                // Fallback to API if socket not connected
                await sendMessage(content, false);
            }
        } finally {
            setSending(false);
        }
    };

    const filteredChats = chats.filter((c) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            c.user?.name?.toLowerCase().includes(s) ||
            c.user?.email?.toLowerCase().includes(s)
        );
    });

    const selectedChat = chats.find((c) => c._id === selectedChatId);
    const messages = selectedChatId ? (messagesByChat[selectedChatId] ?? null) : null;

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            {/* ── Sidebar ────────────────────────────────────────────── */}
            <div className="w-72 shrink-0 bg-white border-r border-gray-100 flex flex-col">
                {/* Sidebar header */}
                <div className="px-4 pt-5 pb-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Support Chats</h2>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users…"
                            className="w-full pl-8 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#f97518] focus:ring-2 focus:ring-orange-100 transition"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto">
                    {loading && !chats.length ? (
                        <ChatListSkeleton />
                    ) : filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <MessageSquare size={24} className="opacity-30 mb-2" />
                            <p className="text-sm">No chats found</p>
                        </div>
                    ) : (
                        <ul className="p-2 space-y-0.5">
                            {filteredChats.map((chat) => {
                                const isActive = chat._id === selectedChatId;
                                const lastMsg = (chat as any).lastMessage;
                                return (
                                    <li key={chat._id}>
                                        <button
                                            onClick={() => selectChat(chat._id)}
                                            className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all ${isActive
                                                ? "bg-orange-50 border border-orange-100"
                                                : "hover:bg-gray-50 border border-transparent"
                                                }`}
                                        >
                                            {/* Avatar */}
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isActive
                                                ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                                : "bg-gray-200 text-gray-600"
                                                }`}>
                                                {initials(chat.user?.name, chat.user?.email)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <p className={`text-sm font-semibold truncate ${isActive ? "text-[#f97518]" : "text-gray-800"}`}>
                                                        {chat.user?.name || chat.user?.email || "Unknown"}
                                                    </p>
                                                    {lastMsg && (
                                                        <span className="text-[10px] text-gray-400 shrink-0">
                                                            {formatTime(lastMsg.createdAt)}
                                                        </span>
                                                    )}
                                                </div>
                                                {lastMsg ? (
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.content}</p>
                                                ) : (
                                                    <p className="text-xs text-gray-300 italic mt-0.5">No messages yet</p>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* ── Main Chat ──────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                {!selectedChatId ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={28} className="text-[#f97518]" />
                            </div>
                            <p className="font-semibold text-gray-700">Select a conversation</p>
                            <p className="text-sm mt-1">Choose a chat from the sidebar to start</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat header */}
                        <div className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                                {initials(selectedChat?.user?.name, selectedChat?.user?.email)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {selectedChat?.user?.name || selectedChat?.user?.email || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-400">{selectedChat?.user?.email}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={onScroll}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                        >
                            {messages === null ? (
                                <MessagesSkeleton />
                            ) : messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <p className="text-sm">No messages yet. Say hi!</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <Bubble
                                        key={msg._id}
                                        content={msg.content}
                                        time={formatTime(msg.createdAt)}
                                        isAdmin={msg.sender === "admin"}
                                    />
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        {showScrollBtn && (
                            <button
                                onClick={scrollToBottom}
                                className="absolute bottom-20 right-6 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-[#f97518] transition-colors"
                            >
                                <ChevronDown size={16} />
                            </button>
                        )}

                        {/* Input */}
                        <div className="bg-white border-t border-gray-100 px-4 py-3">
                            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-[#f97518] focus-within:ring-2 focus-within:ring-orange-100 transition">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    rows={1}
                                    placeholder="Type a message… (Enter to send)"
                                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none max-h-32"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || sending}
                                    className="p-2 bg-[#f97518] hover:bg-[#ea5a00] text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                >
                                    {sending ? (
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
                                    ) : (
                                        <Send size={15} />
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1.5 px-1">Shift+Enter for new line</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}