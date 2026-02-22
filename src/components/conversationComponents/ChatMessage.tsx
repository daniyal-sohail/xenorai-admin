"use client";

import { FC, memo } from "react";
import { Bot, User, Headset } from "lucide-react";
import { IMessage } from "./ConversationTypes";

interface ChatMessageProps {
    message: IMessage;
}

const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const SENDER_CONFIG = {
    bot: {
        label: "AI",
        Icon: Bot,
        color: "#059669",
        iconBg: "rgba(5,150,105,0.1)",
        iconBorder: "rgba(5,150,105,0.2)",
        bubbleBg: "rgba(5,150,105,0.06)",
        bubbleBorder: "rgba(5,150,105,0.15)",
        avatarBg: "rgba(5,150,105,0.1)",
        avatarBorder: "rgba(5,150,105,0.2)",
    },
    human: {
        label: "You",
        Icon: Headset,
        color: "#f97518",
        iconBg: "rgba(249,117,24,0.08)",
        iconBorder: "rgba(249,117,24,0.2)",
        bubbleBg: "rgba(249,117,24,0.06)",
        bubbleBorder: "rgba(249,117,24,0.15)",
        avatarBg: "rgba(249,117,24,0.1)",
        avatarBorder: "rgba(249,117,24,0.2)",
    },
    visitor: {
        label: "Visitor",
        Icon: User,
        color: "#6b7280",
        iconBg: "#f3f4f6",
        iconBorder: "#e5e7eb",
        bubbleBg: "#fff",
        bubbleBorder: "#e5e7eb",
        avatarBg: "#f3f4f6",
        avatarBorder: "#e5e7eb",
    },
} as const;

const ChatMessageComponent: FC<ChatMessageProps> = ({ message }) => {
    const sender = (message.sender as keyof typeof SENDER_CONFIG) in SENDER_CONFIG
        ? (message.sender as keyof typeof SENDER_CONFIG)
        : "visitor";
    const config = SENDER_CONFIG[sender];
    const isVisitor = sender === "visitor";

    return (
        <div
            style={{
                display: "flex",
                gap: 10,
                marginBottom: 16,
                justifyContent: isVisitor ? "flex-start" : "flex-end",
                alignItems: "flex-end",
            }}
        >
            {/* Visitor avatar — left */}
            {isVisitor && (
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: config.avatarBg,
                        border: `1px solid ${config.avatarBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginBottom: 2,
                    }}
                >
                    <config.Icon size={14} color={config.color} />
                </div>
            )}

            <div
                style={{
                    maxWidth: "68%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: isVisitor ? "flex-start" : "flex-end",
                }}
            >
                {/* Sender label */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        flexDirection: isVisitor ? "row" : "row-reverse",
                    }}
                >
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: 5,
                            background: config.iconBg,
                            border: `1px solid ${config.iconBorder}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <config.Icon size={9} color={config.color} />
                    </div>
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            color: config.color,
                        }}
                    >
                        {config.label}
                    </span>
                </div>

                {/* Bubble */}
                <div
                    style={{
                        background: config.bubbleBg,
                        border: `1px solid ${config.bubbleBorder}`,
                        borderRadius: 16,
                        borderTopLeftRadius: isVisitor ? 4 : 16,
                        borderTopRightRadius: isVisitor ? 16 : 4,
                        padding: "10px 14px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                >
                    <p
                        style={{
                            fontSize: 13.5,
                            color: "#1f2937",
                            margin: 0,
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                        }}
                    >
                        {message.content}
                    </p>

                    {/* Products metadata */}
                    {message.meta?.products && message.meta.products.length > 0 && (
                        <div
                            style={{
                                marginTop: 8,
                                paddingTop: 8,
                                borderTop: "1px solid rgba(0,0,0,0.06)",
                            }}
                        >
                            <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>
                                🛍️ Recommended: {message.meta.products.join(", ")}
                            </p>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 6,
                        }}
                    >
                        <span style={{ fontSize: 10, color: "#b0b7c3", letterSpacing: "0.01em" }}>
                            {formatTime(message.createdAt)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Non-visitor avatar — right */}
            {!isVisitor && (
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: config.avatarBg,
                        border: `1px solid ${config.avatarBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginBottom: 2,
                    }}
                >
                    <config.Icon size={14} color={config.color} />
                </div>
            )}
        </div>
    );
};

export const ChatMessage = memo(ChatMessageComponent);