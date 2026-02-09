"use client";

import { FC, memo } from "react";
import { MessageSquare, User, Clock, Circle } from "lucide-react";
import { IConversation } from "./ConversationTypes";

interface ConversationListItemProps {
    conversation: IConversation;
    isSelected: boolean;
    onClick: (conversation: IConversation) => void;
}

const ConversationListItemComponent: FC<ConversationListItemProps> = ({
    conversation,
    isSelected,
    onClick,
}) => {
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
        return date.toLocaleDateString();
    };

    const getStatusColor = () => {
        switch (conversation.status) {
            case "active":
                return "bg-emerald-500";
            case "handoff":
                return "bg-orange-500";
            case "closed":
                return "bg-gray-400";
            default:
                return "bg-gray-400";
        }
    };

    const getStatusLabel = () => {
        switch (conversation.status) {
            case "active":
                return "AI Active";
            case "handoff":
                return "Handoff";
            case "closed":
                return "Closed";
            default:
                return conversation.status;
        }
    };

    const domainName =
        typeof conversation.domainId === "object"
            ? conversation.domainId.domainName
            : "Unknown Domain";

    const lastMessagePreview = conversation.lastMessage?.content
        ? conversation.lastMessage.content.slice(0, 60) + (conversation.lastMessage.content.length > 60 ? "..." : "")
        : "No messages yet";

    return (
        <div
            onClick={() => onClick(conversation)}
            className={`p-4 border-b border-gray-200 cursor-pointer transition-all hover:bg-gray-50 ${isSelected ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
                }`}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">
                            {conversation.visitorId.slice(0, 12)}...
                        </p>
                        <p className="text-xs text-gray-500">{domainName}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(conversation.lastMessageAt)}
                    </span>
                    <div className="flex items-center gap-1">
                        <Circle size={8} className={`${getStatusColor()} fill-current`} />
                        <span className="text-xs font-medium text-gray-600">
                            {getStatusLabel()}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{lastMessagePreview}</p>

            {conversation.status === "handoff" && (
                <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                    <MessageSquare size={12} />
                    <span className="font-medium">Needs your attention</span>
                </div>
            )}
        </div>
    );
};

export const ConversationListItem = memo(ConversationListItemComponent);