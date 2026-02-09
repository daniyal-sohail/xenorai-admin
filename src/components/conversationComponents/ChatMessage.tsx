"use client";

import { FC, memo } from "react";
import { Check, CheckCheck, Bot, User as UserIcon, Headset } from "lucide-react";
import { IMessage } from "./ConversationTypes";

interface ChatMessageProps {
    message: IMessage;
}

const ChatMessageComponent: FC<ChatMessageProps> = ({ message }) => {
    const isVisitor = message.sender === "visitor";
    const isBot = message.sender === "bot";
    const isHuman = message.sender === "human";

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getSenderIcon = () => {
        if (isBot) return <Bot size={14} className="text-indigo-600" />;
        if (isHuman) return <Headset size={14} className="text-emerald-600" />;
        return <UserIcon size={14} className="text-gray-600" />;
    };

    const getSenderLabel = () => {
        if (isBot) return "AI Assistant";
        if (isHuman) return "Support Agent";
        return "Visitor";
    };

    return (
        <div className={`flex gap-2 mb-4 ${!isVisitor ? "justify-end" : ""}`}>
            {isVisitor && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <UserIcon size={16} />
                </div>
            )}

            <div
                className={`max-w-[70%] ${!isVisitor ? "order-first" : ""
                    }`}
            >
                {/* Sender label */}
                <div
                    className={`flex items-center gap-1 mb-1 ${!isVisitor ? "justify-end" : ""
                        }`}
                >
                    {getSenderIcon()}
                    <span className="text-xs font-medium text-gray-600">
                        {getSenderLabel()}
                    </span>
                </div>

                {/* Message bubble */}
                <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm ${isVisitor
                        ? "bg-white border border-gray-200 rounded-tl-none"
                        : isBot
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-emerald-600 text-white rounded-tr-none"
                        }`}
                >
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                    </p>

                    {/* Metadata */}
                    {message.meta && Object.keys(message.meta).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                            {message.meta.products && message.meta.products.length > 0 && (
                                <p className="text-xs opacity-90">
                                    🛍️ Recommended: {message.meta.products.join(", ")}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Timestamp */}
                    <div
                        className={`flex items-center justify-end gap-1 mt-1 ${isVisitor ? "text-gray-500" : "text-white/70"
                            }`}
                    >
                        <span className="text-xs">{formatTime(message.createdAt)}</span>
                        {!isVisitor && (
                            <CheckCheck size={14} className="opacity-80" />
                        )}
                    </div>
                </div>
            </div>

            {!isVisitor && (
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm ${isBot
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                        : "bg-gradient-to-br from-emerald-500 to-teal-600"
                        }`}
                >
                    {isBot ? <Bot size={16} /> : <Headset size={16} />}
                </div>
            )}
        </div>
    );
};

export const ChatMessage = memo(ChatMessageComponent);