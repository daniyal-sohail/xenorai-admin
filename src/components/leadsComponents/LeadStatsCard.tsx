"use client";

import { FC, memo } from "react";
import { Users, TrendingUp, Phone, UserCheck } from "lucide-react";
import { ILead } from "./LeadsTypes";

interface LeadStatsCardProps {
    leads: ILead[];
    totalLeads: number;
}

const LeadStatsCardComponent: FC<LeadStatsCardProps> = ({ leads, totalLeads }) => {
    const leadsWithPhone = leads.filter((l) => l.phone).length;
    const leadsWithName = leads.filter((l) => l.name).length;
    const leadsWithProducts = leads.filter(
        (l) => l.productsInterested && l.productsInterested.length > 0
    ).length;

    const stats = [
        {
            label: "Total Leads",
            value: totalLeads,
            icon: Users,
            color: "indigo",
            bgColor: "bg-indigo-100",
            textColor: "text-indigo-600",
        },
        {
            label: "With Contact Info",
            value: leadsWithPhone,
            icon: Phone,
            color: "emerald",
            bgColor: "bg-emerald-100",
            textColor: "text-emerald-600",
        },
        {
            label: "Identified",
            value: leadsWithName,
            icon: UserCheck,
            color: "purple",
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
        },
        {
            label: "Product Interest",
            value: leadsWithProducts,
            icon: TrendingUp,
            color: "orange",
            bgColor: "bg-orange-100",
            textColor: "text-orange-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
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
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <stat.icon className={stat.textColor} size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const LeadStatsCard = memo(LeadStatsCardComponent);