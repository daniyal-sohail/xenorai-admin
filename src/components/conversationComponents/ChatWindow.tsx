"use client";

import { FC, useState, useCallback, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Power, X, AlertCircle } from "lucide-react";
import { IConversation, IMessage } from "./ConversationTypes";
import { ChatMessage } from "./ChatMessage";

interface ChatWindowProps {
    conversation: IConversation | null;
    messages: IMessage[];
    isLoading: boolean;
    onSendMessage: (content: string) => void;
    onToggleAI: (enabled: boolean) => void;
    onCloseConversation: () => void;
    isSending: boolean;
}

export const ChatWindow: FC<ChatWindowProps> = ({
    conversation,
    messages,
    isLoading,
    onSendMessage,
    onToggleAI,
    onCloseConversation,
    isSending,
}) => {
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (conversation && !conversation.aiEnabled) inputRef.current?.focus();
    }, [conversation]);

    const handleSend = useCallback(() => {
        const content = messageInput.trim();
        if (!content || isSending) return;
        onSendMessage(content);
        setMessageInput("");
    }, [messageInput, isSending, onSendMessage]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
        },
        [handleSend]
    );

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)" }}
                    >
                        <User size={24} style={{ color: "#f97518" }} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">No Conversation Selected</h3>
                    <p className="text-xs text-gray-500">Select a conversation from the list to start chatting</p>
                </div>
            </div>
        );
    }

    const domainName =
        typeof conversation.domainId === "object"
            ? conversation.domainId.domainName
            : "Unknown Domain";

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)" }}
                        >
                            <User size={18} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-sm text-gray-900 truncate">{conversation.visitorId.slice(0, 20)}…</h3>
                            <p className="text-xs text-gray-400 truncate">{domainName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* AI Toggle */}
                        <button
                            onClick={() => onToggleAI(!conversation.aiEnabled)}
                            disabled={conversation.status === "closed"}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={
                                conversation.aiEnabled
                                    ? { background: "rgba(52,211,153,0.1)", color: "#059669", border: "1px solid rgba(52,211,153,0.2)" }
                                    : { background: "rgba(249,117,24,0.08)", color: "#ea5a00", border: "1px solid rgba(249,117,24,0.2)" }
                            }
                        >
                            {conversation.aiEnabled ? <><Bot size={13} /> AI</> : <><User size={13} /> Manual</>}
                        </button>

                        {/* Close */}
                        {conversation.status !== "closed" && (
                            <button
                                onClick={onCloseConversation}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                                <X size={13} /> Close
                            </button>
                        )}
                    </div>
                </div>

                {/* Warnings */}
                {!conversation.aiEnabled && conversation.status !== "closed" && (
                    <div
                        className="rounded-xl px-3 py-2 flex items-center gap-2"
                        style={{ background: "rgba(249,117,24,0.05)", border: "1px solid rgba(249,117,24,0.15)" }}
                    >
                        <AlertCircle size={13} style={{ color: "#f97518" }} />
                        <p className="text-xs font-medium" style={{ color: "#ea5a00" }}>
                            Manual mode — You're now responding
                        </p>
                    </div>
                )}

                {conversation.status === "closed" && (
                    <div
                        className="rounded-xl px-3 py-2 flex items-center gap-2"
                        style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
                    >
                        <AlertCircle size={13} className="text-gray-400" />
                        <p className="text-xs font-medium text-gray-500">Conversation closed</p>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 size={28} className="animate-spin" style={{ color: "#f97518" }} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-400">No messages yet</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <ChatMessage key={message._id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            {conversation.status !== "closed" && (
                <div className="px-5 py-4" style={{ borderTop: "1px solid #f3f4f6" }}>
                    {conversation.aiEnabled ? (
                        <div
                            className="rounded-xl px-4 py-3 text-center"
                            style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}
                        >
                            <p className="text-xs font-medium text-emerald-700">
                                AI is handling this conversation. Disable AI mode to send manual messages.
                            </p>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <textarea
                                ref={inputRef}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your message…"
                                rows={1}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm resize-none transition-all focus:outline-none bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)]"
                                disabled={isSending}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!messageInput.trim() || isSending}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                                style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)", boxShadow: "0 4px 16px rgba(249,117,24,0.25)" }}
                            >
                                {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Send
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};