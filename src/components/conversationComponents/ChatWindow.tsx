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

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input on conversation change
    useEffect(() => {
        if (conversation && !conversation.aiEnabled) {
            inputRef.current?.focus();
        }
    }, [conversation]);

    const handleSend = useCallback(() => {
        const content = messageInput.trim();
        if (!content || isSending) return;

        onSendMessage(content);
        setMessageInput("");
    }, [messageInput, isSending, onSendMessage]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                        <User size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Conversation Selected
                    </h3>
                    <p className="text-gray-600">
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

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {conversation.visitorId.slice(0, 16)}...
                            </h3>
                            <p className="text-sm text-gray-600">{domainName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* AI Toggle */}
                        <button
                            onClick={() => onToggleAI(!conversation.aiEnabled)}
                            disabled={conversation.status === "closed"}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${conversation.aiEnabled
                                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                                conversation.aiEnabled
                                    ? "Disable AI (Take over manually)"
                                    : "Enable AI (Let bot respond)"
                            }
                        >
                            {conversation.aiEnabled ? (
                                <>
                                    <Bot size={18} />
                                    AI Mode
                                </>
                            ) : (
                                <>
                                    <User size={18} />
                                    Manual Mode
                                </>
                            )}
                        </button>

                        {/* Close Conversation */}
                        {conversation.status !== "closed" && (
                            <button
                                onClick={onCloseConversation}
                                className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                title="Close conversation"
                            >
                                <X size={18} />
                                Close
                            </button>
                        )}

                        {/* Status Badge */}
                        <div
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${conversation.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : conversation.status === "handoff"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {conversation.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* AI Disabled Warning */}
                {!conversation.aiEnabled && conversation.status !== "closed" && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 flex items-center gap-2">
                        <AlertCircle size={16} className="text-emerald-600" />
                        <p className="text-sm text-emerald-700">
                            <strong>Manual mode:</strong> You're now responding to this visitor. AI is disabled.
                        </p>
                    </div>
                )}

                {/* Closed Warning */}
                {conversation.status === "closed" && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2">
                        <AlertCircle size={16} className="text-gray-600" />
                        <p className="text-sm text-gray-700">
                            This conversation has been closed. No new messages can be sent.
                        </p>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                                <User size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-600">No messages yet</p>
                        </div>
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

            {/* Input Area */}
            {conversation.status !== "closed" && (
                <div className="bg-white border-t border-gray-200 px-6 py-4">
                    {conversation.aiEnabled ? (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 text-center">
                            <p className="text-sm text-indigo-700">
                                <strong>AI is handling this conversation.</strong> Disable AI mode to send manual messages.
                            </p>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <textarea
                                ref={inputRef}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your message..."
                                rows={1}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                disabled={isSending}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!messageInput.trim() || isSending}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
                            >
                                {isSending ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <Send size={20} />
                                )}
                                Send
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};