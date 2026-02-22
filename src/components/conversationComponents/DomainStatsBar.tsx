"use client";

import { FC, memo } from "react";
import { MessageSquare, Bot, AlertCircle } from "lucide-react";
import { DomainSelector } from "@/components/leadsComponents/DomainSelector";
import { IConversationStats } from "./ConversationTypes";

interface DomainStatsBarProps {
    domains: any[];
    selectedDomainId: string | null;
    onDomainChange: (domainId: string) => void;
    stats: IConversationStats | null;
}

const DomainStatsBarComponent: FC<DomainStatsBarProps> = ({
    domains,
    selectedDomainId,
    onDomainChange,
    stats,
}) => {
    return (
        <div className="flex items-center gap-3 flex-1 min-w-0">
            <DomainSelector
                domains={domains}
                selectedDomainId={selectedDomainId}
                onDomainChange={onDomainChange}
            />

            {selectedDomainId && stats && (
                <div className="flex items-center gap-2">
                    <StatPill
                        icon={<MessageSquare size={11} />}
                        label="Total"
                        value={stats.total}
                        color="#6b7280"
                        bg="rgba(107,114,128,0.08)"
                        border="1px solid rgba(107,114,128,0.18)"
                    />
                    <StatPill
                        icon={<Bot size={11} />}
                        label="AI"
                        value={stats.active}
                        color="#059669"
                        bg="rgba(52,211,153,0.1)"
                        border="1px solid rgba(52,211,153,0.2)"
                    />
                    <StatPill
                        icon={<AlertCircle size={11} />}
                        label="Manual"
                        value={stats.handoff}
                        color="#f97518"
                        bg="rgba(249,117,24,0.08)"
                        border="1px solid rgba(249,117,24,0.2)"
                    />
                </div>
            )}
        </div>
    );
};

interface StatPillProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    bg: string;
    border: string;
}

function StatPill({ icon, label, value, color, bg, border }: StatPillProps) {
    return (
        <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: bg, border, color }}
        >
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            <span className="text-xs font-extrabold">{value}</span>
        </div>
    );
}

export const DomainStatsBar = memo(DomainStatsBarComponent);