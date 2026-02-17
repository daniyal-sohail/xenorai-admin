"use client";

import { FC, memo } from "react";
import { Bot, User, Headset } from "lucide-react";
import { IMessage } from "./ConversationTypes";

interface ChatMessageProps {
    message: IMessage;
}

const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const ChatMessageComponent: FC<ChatMessageProps> = ({ message }) => {
    const isVisitor = message.sender === "visitor";
    const isBot = message.sender === "bot";
    const isHuman = message.sender === "human";

    const senderConfig = isBot
        ? { label: "AI", icon: Bot, color: "#059669", bgIcon: "rgba(52,211,153,0.1)", borderIcon: "1px solid rgba(52,211,153,0.2)" }
        : isHuman
            ? { label: "You", icon: Headset, color: "#f97518", bgIcon: "rgba(249,117,24,0.08)", borderIcon: "1px solid rgba(249,117,24,0.2)" }
            : { label: "Visitor", icon: User, color: "#6b7280", bgIcon: "#f9fafb", borderIcon: "1px solid #e5e7eb" };

    return (
        <div className={`flex gap-2.5 mb-4 ${!isVisitor ? "justify-end" : ""}`}>
            {isVisitor && (
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
                >
                    <User size={14} className="text-gray-500" />
                </div>
            )}

            <div className={`max-w-[70%] ${!isVisitor ? "order-first" : ""}`}>
                {/* Sender label */}
                <div className={`flex items-center gap-1 mb-1 ${!isVisitor ? "justify-end" : ""}`}>
                    <div
                        className="w-4 h-4 rounded-md flex items-center justify-center"
                        style={{ background: senderConfig.bgIcon, border: senderConfig.borderIcon }}
                    >
                        <senderConfig.icon size={10} style={{ color: senderConfig.color }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: senderConfig.color }}>
                        {senderConfig.label}
                    </span>
                </div>

                {/* Bubble */}
                <div
                    className="rounded-2xl px-4 py-2.5"
                    style={
                        isVisitor
                            ? { background: "#fff", border: "1px solid #e5e7eb", borderTopLeftRadius: 6 }
                            : isBot
                                ? { background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", borderTopRightRadius: 6 }
                                : { background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)", borderTopRightRadius: 6 }
                    }
                >
                    <p className="text-sm text-gray-900 whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                    </p>

                    {/* Metadata */}
                    {message.meta && Object.keys(message.meta).length > 0 && (
                        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                            {message.meta.products && message.meta.products.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    🛍️ Recommended: {message.meta.products.join(", ")}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center justify-end mt-1.5">
                        <span className="text-[10px] text-gray-400">{formatTime(message.createdAt)}</span>
                    </div>
                </div>
            </div>

            {!isVisitor && (
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={
                        isBot
                            ? { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }
                            : { background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.2)" }
                    }
                >
                    {isBot ? <Bot size={14} style={{ color: "#059669" }} /> : <Headset size={14} style={{ color: "#f97518" }} />}
                </div>
            )}
        </div>
    );
};

export const ChatMessage = memo(ChatMessageComponent);