"use client";

import { FC, memo } from "react";
import { Users, Phone, UserCheck, TrendingUp } from "lucide-react";
import { ILead } from "./LeadsTypes";

interface LeadStatsCardProps {
    leads: ILead[];
    totalLeads: number;
}

const LeadStatsCardComponent: FC<LeadStatsCardProps> = ({ leads, totalLeads }) => {
    const leadsWithPhone = leads.filter((l) => l.phone).length;
    const leadsWithName = leads.filter((l) => l.name).length;
    const leadsWithProducts = leads.filter((l) => l.productsInterested && l.productsInterested.length > 0).length;

    const stats = [
        {
            label: "Total Leads",
            value: totalLeads,
            icon: Users,
            iconStyle: { background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)", color: "#f97518" },
            valueStyle: { color: "#111827" },
        },
        {
            label: "With Contact Info",
            value: leadsWithPhone,
            icon: Phone,
            iconStyle: { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#059669" },
            valueStyle: { color: "#059669" },
        },
        {
            label: "Identified",
            value: leadsWithName,
            icon: UserCheck,
            iconStyle: { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#6366f1" },
            valueStyle: { color: "#6366f1" },
        },
        {
            label: "Product Interest",
            value: leadsWithProducts,
            icon: TrendingUp,
            iconStyle: { background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)", color: "#f97518" },
            valueStyle: { color: "#111827" },
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
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

export const LeadStatsCard = memo(LeadStatsCardComponent);