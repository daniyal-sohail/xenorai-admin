"use client";

import { FC, memo } from "react";
import { User, Clock } from "lucide-react";
import { IConversation } from "./ConversationTypes";

interface ConversationListItemProps {
    conversation: IConversation;
    isSelected: boolean;
    unreadCount: number; // passed from parent via store.unreadCounts
    onClick: (conversation: IConversation) => void;
}

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

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
        ? conversation.lastMessage.content.slice(0, 50) +
        (conversation.lastMessage.content.length > 50 ? "…" : "")
        : "No messages yet";

    const statusConfig = {
        active: { label: "AI", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" },
        handoff: { label: "Manual", color: "#f97518", bg: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.2)" },
    };

    const status = statusConfig[conversation.status] || statusConfig.active;

    return (
        <div
            onClick={() => onClick(conversation)}
            className="p-4 cursor-pointer transition-all hover:bg-gray-50"
            style={{
                borderBottom: "1px solid #f3f4f6",
                borderLeft: isSelected ? "3px solid #f97518" : "3px solid transparent",
                background: isSelected ? "rgba(249,117,24,0.03)" : "transparent",
            }}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Avatar with unread dot */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                            style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)" }}
                        >
                            <User size={16} />
                        </div>
                        {unreadCount > 0 && (
                            <div
                                className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ background: "#ef4444", fontSize: 9, padding: "0 3px" }}
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                            {conversation.visitorId.slice(0, 14)}…
                        </p>
                        <p className="text-xs text-gray-400 truncate">{domainName}</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {formatTime(conversation.lastMessageAt)}
                    </span>
                    <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: status.color, background: status.bg, border: status.border }}
                    >
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Last message preview — bold if unread */}
            <p
                className={`text-xs line-clamp-2 leading-relaxed ${unreadCount > 0 ? "text-gray-800 font-semibold" : "text-gray-500"
                    }`}
            >
                {lastMessagePreview}
            </p>
        </div>
    );
};

export const ConversationListItem = memo(ConversationListItemComponent);