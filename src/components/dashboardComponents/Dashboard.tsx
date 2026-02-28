"use client";

import { useEffect } from "react";
import {
    Users,
    CheckCircle,
    Clock,
    Globe,
    MessageSquare,
    TrendingUp,
    Activity,
    UserCheck,
    Layers,
    Zap,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

// ─── Skeleton ────────────────────────────────────────────────────────────────
const StatSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100" />
            <div className="w-16 h-4 rounded bg-gray-100" />
        </div>
        <div className="w-20 h-8 rounded bg-gray-100 mb-1" />
        <div className="w-28 h-3 rounded bg-gray-100" />
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    accent?: string;
    sub?: string;
    badge?: string;
}

const StatCard = ({ label, value, icon, accent = "bg-orange-50 text-[#f97518]", sub, badge }: StatCardProps) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
                {icon}
            </div>
            {badge && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#f97518]">
                    {badge}
                </span>
            )}
        </div>
        <p className="text-2xl font-bold text-gray-900 tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
);

// ─── Wide Stat Card ───────────────────────────────────────────────────────────
const WideCard = ({ label, a, aLabel, b, bLabel, icon, color }: {
    label: string; a: number; aLabel: string; b: number; bLabel: string; icon: React.ReactNode; color: string;
}) => {
    const pct = a + b > 0 ? Math.round((a / (a + b)) * 100) : 0;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-2">
            <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
                <p className="font-semibold text-gray-800">{label}</p>
            </div>
            <div className="flex items-end gap-6 mb-4">
                <div>
                    <p className="text-3xl font-bold text-gray-900 tabular-nums">{a.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{aLabel}</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-400 tabular-nums">{b.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{bLabel}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-[#f97518] tabular-nums">{pct}%</p>
                    <p className="text-xs text-gray-400 mt-0.5">approval rate</p>
                </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#f97518] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const { stats, fetchStats } = useAdminStore();
    const loading = !stats;

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const s = stats ?? {};

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#f97518] animate-pulse" />
                    <span className="text-xs font-semibold text-[#f97518] uppercase tracking-widest">Live Dashboard</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Platform-wide metrics and activity</p>
            </div>

            {/* Primary Stats Row */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        label="Total Users"
                        value={s.totalUsers ?? 0}
                        icon={<Users size={18} />}
                        accent="bg-orange-50 text-[#f97518]"
                    />
                    <StatCard
                        label="Approved Users"
                        value={s.approvedUsers ?? 0}
                        icon={<UserCheck size={18} />}
                        accent="bg-green-50 text-green-600"
                    />
                    <StatCard
                        label="Pending Approval"
                        value={s.pendingUsers ?? 0}
                        icon={<Clock size={18} />}
                        accent="bg-yellow-50 text-yellow-600"
                        badge={s.pendingUsers > 0 ? "Action needed" : undefined}
                    />
                    <StatCard
                        label="Total Domains"
                        value={s.totalDomains ?? 0}
                        icon={<Globe size={18} />}
                        accent="bg-blue-50 text-blue-600"
                    />
                </div>
            )}

            {/* Second Row */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        label="Total Conversations"
                        value={s.totalConversations ?? 0}
                        icon={<MessageSquare size={18} />}
                        accent="bg-purple-50 text-purple-600"
                    />
                    <StatCard
                        label="Active Conversations"
                        value={s.activeConversations ?? 0}
                        icon={<Activity size={18} />}
                        accent="bg-emerald-50 text-emerald-600"
                        badge="Live"
                    />
                    <StatCard
                        label="Total Leads"
                        value={s.totalLeads ?? 0}
                        icon={<TrendingUp size={18} />}
                        accent="bg-rose-50 text-rose-600"
                    />
                    <StatCard
                        label="Conv. Active Rate"
                        value={
                            s.totalConversations > 0
                                ? `${Math.round((s.activeConversations / s.totalConversations) * 100)}%`
                                : "0%"
                        }
                        icon={<Zap size={18} />}
                        accent="bg-orange-50 text-[#f97518]"
                    />
                </div>
            )}

            {/* Wide Cards */}
            {loading ? (
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-40" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    <WideCard
                        label="User Approval Overview"
                        a={s.approvedUsers ?? 0}
                        aLabel="Approved"
                        b={s.pendingUsers ?? 0}
                        bLabel="Pending"
                        icon={<CheckCircle size={18} />}
                        color="bg-green-50 text-green-600"
                    />
                    <WideCard
                        label="Conversation Activity"
                        a={s.activeConversations ?? 0}
                        aLabel="Active"
                        b={(s.totalConversations ?? 0) - (s.activeConversations ?? 0)}
                        bLabel="Closed"
                        icon={<Layers size={18} />}
                        color="bg-purple-50 text-purple-600"
                    />
                </div>
            )}
        </div>
    );
}