"use client";

import { FC, useState, useCallback, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Headset, AlertCircle, MessageSquare } from "lucide-react";
import { IConversation, IMessage } from "./ConversationTypes";
import { ChatMessage } from "./ChatMessage";
import { formatVisitorName } from "@/lib/visitorName";

interface ChatWindowProps {
    conversation: IConversation | null;
    messages: IMessage[];
    isLoading: boolean;
    onSendMessage: (content: string) => void;
    onToggleAI: (enabled: boolean) => void;
    isSending: boolean;
}

export const ChatWindow: FC<ChatWindowProps> = ({
    conversation,
    messages,
    isLoading,
    onSendMessage,
    onToggleAI,
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

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    /* ── Empty state ── */
    if (!conversation) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f9fafb",
                }}
            >
                <div style={{ textAlign: "center", padding: "0 24px" }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 18,
                            background: "rgba(249,117,24,0.08)",
                            border: "1px solid rgba(249,117,24,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 14px",
                        }}
                    >
                        <MessageSquare size={22} color="#f97518" />
                    </div>
                    <h3
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#111827",
                            margin: "0 0 6px 0",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        No Conversation Selected
                    </h3>
                    <p style={{ fontSize: 12.5, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
                        Select a conversation from the list to start chatting
                    </p>
                </div>
            </div>
        );
    }

    const domainName =
        typeof conversation.domainId === "object"
            ? conversation.domainId.domainName
            : "Unknown Domain";

    const aiEnabled = conversation.aiEnabled;

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", minWidth: 0 }}>
            {/* ── Header ── */}
            <div
                style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #f3f4f6",
                    background: "#fff",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: aiEnabled ? 0 : 10,
                    }}
                >
                    {/* Visitor info */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 13,
                                background: "linear-gradient(135deg, #f97518, #ea5a00)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: "0 2px 8px rgba(249,117,24,0.25)",
                            }}
                        >
                            <User size={17} color="#fff" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p
                                style={{
                                    fontSize: 13.5,
                                    fontWeight: 700,
                                    color: "#111827",
                                    margin: "0 0 2px 0",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                {formatVisitorName(conversation.visitorId)}
                            </p>
                            <p
                                style={{
                                    fontSize: 11.5,
                                    color: "#9ca3af",
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {domainName}
                            </p>
                        </div>
                    </div>

                    {/* AI Toggle */}
                    <button
                        onClick={() => onToggleAI(!aiEnabled)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 12px",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: "1.5px solid",
                            transition: "all 0.15s",
                            flexShrink: 0,
                            ...(aiEnabled
                                ? {
                                    background: "rgba(5,150,105,0.07)",
                                    color: "#059669",
                                    borderColor: "rgba(5,150,105,0.2)",
                                }
                                : {
                                    background: "rgba(249,117,24,0.07)",
                                    color: "#f97518",
                                    borderColor: "rgba(249,117,24,0.22)",
                                }),
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                        }}
                    >
                        {aiEnabled ? <Bot size={13} /> : <Headset size={13} />}
                        {aiEnabled ? "AI Active" : "Manual"}
                    </button>
                </div>

                {/* Manual mode banner */}
                {!aiEnabled && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "7px 12px",
                            borderRadius: 10,
                            background: "rgba(249,117,24,0.05)",
                            border: "1px solid rgba(249,117,24,0.15)",
                        }}
                    >
                        <AlertCircle size={13} color="#f97518" />
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#ea5a00", margin: 0 }}>
                            Manual mode — you're now responding to this visitor
                        </p>
                    </div>
                )}
            </div>

            {/* ── Messages ── */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px",
                    background: "#f9fafb",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {isLoading ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Loader2 size={26} color="#f97518" style={{ animation: "spin 1s linear infinite" }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : messages.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ fontSize: 13, color: "#b0b7c3" }}>No messages yet</p>
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

            {/* ── Input ── */}
            <div
                style={{
                    padding: "14px 20px",
                    borderTop: "1px solid #f3f4f6",
                    background: "#fff",
                    flexShrink: 0,
                }}
            >
                {aiEnabled ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 14px",
                            borderRadius: 12,
                            background: "rgba(5,150,105,0.05)",
                            border: "1px solid rgba(5,150,105,0.15)",
                        }}
                    >
                        <Bot size={14} color="#059669" />
                        <p style={{ fontSize: 12.5, fontWeight: 500, color: "#059669", margin: 0 }}>
                            AI is handling this conversation — disable AI to reply manually
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                        <textarea
                            ref={inputRef}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message… (Enter to send)"
                            rows={1}
                            disabled={isSending}
                            style={{
                                flex: 1,
                                padding: "10px 14px",
                                borderRadius: 12,
                                border: "1.5px solid #e5e7eb",
                                fontSize: 13.5,
                                color: "#111827",
                                background: "#fafafa",
                                outline: "none",
                                resize: "none",
                                fontFamily: "inherit",
                                lineHeight: 1.5,
                                transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                                maxHeight: 120,
                                overflowY: "auto",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#f97518";
                                e.target.style.boxShadow = "0 0 0 3px rgba(249,117,24,0.1)";
                                e.target.style.background = "#fff";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
                                e.target.style.boxShadow = "none";
                                e.target.style.background = "#fafafa";
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!messageInput.trim() || isSending}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 18px",
                                borderRadius: 12,
                                border: "none",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#fff",
                                cursor: messageInput.trim() && !isSending ? "pointer" : "not-allowed",
                                opacity: messageInput.trim() && !isSending ? 1 : 0.5,
                                background: "linear-gradient(135deg, #f97518, #ea5a00)",
                                boxShadow: messageInput.trim() ? "0 4px 14px rgba(249,117,24,0.3)" : "none",
                                transition: "opacity 0.15s, box-shadow 0.15s, transform 0.1s",
                                flexShrink: 0,
                            }}
                            onMouseEnter={(e) => {
                                if (messageInput.trim() && !isSending)
                                    e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            {isSending ? (
                                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <Send size={14} />
                            )}
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};