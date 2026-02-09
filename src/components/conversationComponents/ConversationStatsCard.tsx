"use client";

import { FC, memo } from "react";
import { MessageSquare, Bot, AlertCircle, XCircle } from "lucide-react";
import { IConversationStats } from "./ConversationTypes";

interface ConversationStatsCardProps {
    stats: IConversationStats | null;
}

const ConversationStatsCardComponent: FC<ConversationStatsCardProps> = ({ stats }) => {
    if (!stats) return null;

    const statItems = [
        {
            label: "Total Conversations",
            value: stats.total,
            icon: MessageSquare,
            color: "indigo",
            bgColor: "bg-indigo-100",
            textColor: "text-indigo-600",
        },
        {
            label: "Active (AI)",
            value: stats.active,
            icon: Bot,
            color: "emerald",
            bgColor: "bg-emerald-100",
            textColor: "text-emerald-600",
        },
        {
            label: "Needs Attention",
            value: stats.handoff,
            icon: AlertCircle,
            color: "orange",
            bgColor: "bg-orange-100",
            textColor: "text-orange-600",
        },
        {
            label: "Closed",
            value: stats.closed,
            icon: XCircle,
            color: "gray",
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">
                                {stat.label}
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div
                            className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                        >
                            <stat.icon className={stat.textColor} size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ConversationStatsCard = memo(ConversationStatsCardComponent);