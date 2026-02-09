// src/pages/Dashboard.tsx
import { useEffect } from "react";

import {
    MessageSquare,
    Users,
    TrendingUp,
    Calendar,
    Globe,
    Activity,
} from "lucide-react";
import { useStatsStore } from "@/store/stats.store";
import { useUserStore } from "@/store/user.store";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    loading?: boolean;
}

const StatCard = ({ title, value, icon, trend, loading }: StatCardProps) => {
    if (loading) {
        return (
            <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-6 animate-pulse">
                <div className="h-4 w-24 bg-[rgb(var(--surface-muted))] rounded mb-4" />
                <div className="h-8 w-32 bg-[rgb(var(--surface-muted))] rounded" />
            </div>
        );
    }

    return (
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-[rgb(var(--primary-light-3))]">
                    <div className="text-[rgb(var(--primary))]">{icon}</div>
                </div>
                {trend && (
                    <span
                        className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {trend.isPositive ? "+" : ""}
                        {trend.value}
                    </span>
                )}
            </div>
            <h3 className="text-[rgb(var(--text-muted))] text-sm font-medium mb-1">
                {title}
            </h3>
            <p className="text-[rgb(var(--foreground))] text-3xl font-bold">
                {typeof value === "number" ? value.toLocaleString() : value}
            </p>
        </div>
    );
};

interface DomainRowProps {
    domain: {
        domainId: string;
        domainName: string;
        conversations: number;
        active: number;
    };
}

const DomainRow = ({ domain }: DomainRowProps) => {
    const activePercentage =
        domain.conversations > 0
            ? Math.round((domain.active / domain.conversations) * 100)
            : 0;

    return (
        <div className="flex items-center justify-between py-4 border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface-muted))] px-4 -mx-4 rounded-lg transition-colors">
            <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary-light-3))] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[rgb(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[rgb(var(--foreground))] font-medium truncate">
                        {domain.domainName}
                    </p>
                    <p className="text-[rgb(var(--text-muted))] text-sm">
                        {domain.conversations} conversations
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-[rgb(var(--foreground))] font-semibold">
                        {domain.active}
                    </p>
                    <p className="text-[rgb(var(--text-muted))] text-xs">Active</p>
                </div>
                <div className="w-16">
                    <div className="h-2 bg-[rgb(var(--surface-muted))] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[rgb(var(--primary))] rounded-full transition-all duration-300"
                            style={{ width: `${activePercentage}%` }}
                        />
                    </div>
                    <p className="text-[rgb(var(--text-muted))] text-xs mt-1 text-right">
                        {activePercentage}%
                    </p>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { dashboard, loading, error, fetchDashboardStats } = useStatsStore();
    const { user, fetchProfile } = useUserStore();

    useEffect(() => {
        fetchDashboardStats();
        fetchProfile();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const getUserInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
                    <p className="text-red-800 font-medium">Error loading dashboard</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <button
                        onClick={() => fetchDashboardStats()}
                        className="mt-4 px-4 py-2 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[rgb(var(--background))] p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
                            {getGreeting()}
                            {user?.fullName && (
                                <span className="text-[rgb(var(--primary))]">
                                    , {user.fullName.split(" ")[0]}
                                </span>
                            )}
                        </h1>
                        <p className="text-[rgb(var(--text-muted))]">
                            Here's what's happening with your chatbots today
                        </p>
                    </div>

                    {/* User Profile */}
                    {user && (
                        <div className="flex items-center gap-3 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-3 pr-5">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.fullName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-white font-semibold">
                                    {getUserInitials(user.fullName)}
                                </div>
                            )}
                            <div>
                                <p className="text-[rgb(var(--foreground))] font-medium">
                                    {user.fullName}
                                </p>
                                <p className="text-[rgb(var(--text-muted))] text-sm">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Conversations"
                        value={dashboard?.totalChats ?? 0}
                        icon={<MessageSquare className="w-5 h-5" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Leads"
                        value={dashboard?.totalLeads ?? 0}
                        icon={<Users className="w-5 h-5" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Active Conversations"
                        value={dashboard?.activeConversations ?? 0}
                        icon={<Activity className="w-5 h-5" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Today's Chats"
                        value={dashboard?.todaysChats ?? 0}
                        icon={<Calendar className="w-5 h-5" />}
                        trend={{
                            value: "12%",
                            isPositive: true,
                        }}
                        loading={loading}
                    />
                </div>

                {/* Domain Performance */}
                <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-[rgb(var(--foreground))]">
                                Domain Performance
                            </h2>
                            <p className="text-[rgb(var(--text-muted))] text-sm mt-1">
                                Active conversations by domain
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[rgb(var(--text-muted))]">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {dashboard?.byDomain.length ?? 0} domains
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-16 bg-[rgb(var(--surface-muted))] rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : dashboard?.byDomain && dashboard.byDomain.length > 0 ? (
                        <div className="space-y-1">
                            {dashboard.byDomain.map((domain) => (
                                <DomainRow key={domain.domainId} domain={domain} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Globe className="w-12 h-12 text-[rgb(var(--text-muted))] mx-auto mb-3" />
                            <p className="text-[rgb(var(--text-muted))]">
                                No domains configured yet
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Stats Summary */}
                {dashboard && !loading && (
                    <div className="bg-gradient-to-br from-[rgb(var(--primary-light-3))] to-[rgb(var(--primary-light-2))] border border-[rgb(var(--primary-light-1))] rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg">
                                <TrendingUp className="w-6 h-6 text-[rgb(var(--primary))]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[rgb(var(--foreground))] font-semibold text-lg mb-2">
                                    Performance Summary
                                </h3>
                                <p className="text-[rgb(var(--text-muted))] text-sm leading-relaxed">
                                    You have{" "}
                                    <span className="font-semibold text-[rgb(var(--foreground))]">
                                        {dashboard.activeConversations} active conversations
                                    </span>{" "}
                                    across{" "}
                                    <span className="font-semibold text-[rgb(var(--foreground))]">
                                        {dashboard.byDomain.length} domains
                                    </span>
                                    . Your chatbots handled{" "}
                                    <span className="font-semibold text-[rgb(var(--foreground))]">
                                        {dashboard.todaysChats} chats today
                                    </span>{" "}
                                    and generated{" "}
                                    <span className="font-semibold text-[rgb(var(--foreground))]">
                                        {dashboard.totalLeads} leads
                                    </span>{" "}
                                    in total.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;