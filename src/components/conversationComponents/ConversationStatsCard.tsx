"use client";

import { FC, memo } from "react";
import { MessageSquare, Bot, AlertCircle } from "lucide-react";
import { IConversationStats } from "./ConversationTypes";

interface ConversationStatsCardProps {
    stats: IConversationStats | null;
}

const ConversationStatsCardComponent: FC<ConversationStatsCardProps> = ({ stats }) => {
    if (!stats) return null;

    const statItems = [
        {
            label: "Total",
            value: stats.total,
            icon: MessageSquare,
            iconStyle: { background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)", color: "#f97518" },
            valueStyle: { color: "#111827" },
        },
        {
            label: "Active (AI)",
            value: stats.active,
            icon: Bot,
            iconStyle: { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#059669" },
            valueStyle: { color: "#059669" },
        },
        {
            label: "Manual",
            value: stats.handoff,
            icon: AlertCircle,
            iconStyle: { background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)", color: "#f97518" },
            valueStyle: { color: "#111827" },
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems.map((stat, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-5 transition-shadow hover:shadow-md"
                    style={{ border: "1px solid #e5e7eb" }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={stat.iconStyle}
                        >
                            <stat.icon size={15} style={{ color: stat.iconStyle.color }} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold" style={stat.valueStyle}>{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

export const ConversationStatsCard = memo(ConversationStatsCardComponent);