"use client";

import { FC, memo } from "react";
import { User, Clock } from "lucide-react";
import { IConversation } from "./ConversationTypes";
import { formatVisitorName } from "@/lib/visitorName";

interface ConversationListItemProps {
    conversation: IConversation;
    isSelected: boolean;
    unreadCount: number;
    onClick: (conversation: IConversation) => void;
}

const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const STATUS_CONFIG = {
    active: {
        label: "AI",
        color: "#059669",
        bg: "rgba(5,150,105,0.08)",
        border: "rgba(5,150,105,0.2)",
        dot: "#34d399",
    },
    handoff: {
        label: "Manual",
        color: "#f97518",
        bg: "rgba(249,117,24,0.08)",
        border: "rgba(249,117,24,0.22)",
        dot: "#f97518",
    },
} as const;

const ConversationListItemComponent: FC<ConversationListItemProps> = ({
    conversation,
    isSelected,
    unreadCount,
    onClick,
}) => {
    const domainName =
        typeof conversation.domainId === "object"
            ? conversation.domainId.domainName
            : "Unknown Domain";

    const lastMessagePreview = conversation.lastMessage?.content
        ? conversation.lastMessage.content.length > 55
            ? conversation.lastMessage.content.slice(0, 55) + "…"
            : conversation.lastMessage.content
        : "No messages yet";

    const status = STATUS_CONFIG[conversation.status] ?? STATUS_CONFIG.active;
    const hasUnread = unreadCount > 0;

    return (
        <div
            onClick={() => onClick(conversation)}
            style={{
                padding: "13px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
                borderLeft: isSelected ? "3px solid #f97518" : "3px solid transparent",
                background: isSelected ? "rgba(249,117,24,0.03)" : "transparent",
                transition: "background 0.12s, border-left-color 0.12s",
            }}
            onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = "#f9fafb";
            }}
            onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = "transparent";
                else e.currentTarget.style.background = "rgba(249,117,24,0.03)";
            }}
        >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
                {/* Avatar + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 12,
                                background: isSelected
                                    ? "linear-gradient(135deg, #f97518, #ea5a00)"
                                    : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background 0.15s",
                            }}
                        >
                            <User size={15} color={isSelected ? "#fff" : "#9ca3af"} />
                        </div>
                        {/* Online indicator / unread dot */}
                        {hasUnread && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: -3,
                                    right: -3,
                                    minWidth: 17,
                                    height: 17,
                                    borderRadius: 9,
                                    background: "#ef4444",
                                    border: "2px solid #fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    color: "#fff",
                                    padding: "0 3px",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </div>
                        )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                        <p
                            style={{
                                fontWeight: hasUnread ? 700 : 600,
                                fontSize: 13,
                                color: "#111827",
                                margin: "0 0 3px 0",
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
                                fontSize: 11,
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

                {/* Meta */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 10,
                            color: "#b0b7c3",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <Clock size={9} />
                        {formatTime(conversation.lastMessageAt)}
                    </span>
                    <span
                        style={{
                            padding: "2px 7px",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: status.color,
                            background: status.bg,
                            border: `1px solid ${status.border}`,
                        }}
                    >
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Last message preview */}
            <p
                style={{
                    fontSize: 12,
                    color: hasUnread ? "#374151" : "#9ca3af",
                    fontWeight: hasUnread ? 600 : 400,
                    margin: 0,
                    lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {lastMessagePreview}
            </p>
        </div>
    );
};

export const ConversationListItem = memo(ConversationListItemComponent);