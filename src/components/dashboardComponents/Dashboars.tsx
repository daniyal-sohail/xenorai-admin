// src/pages/Dashboard.tsx
import { useEffect } from "react";
import {
    MessageSquare,
    Users,
    Calendar,
    Globe,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
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
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-3 bg-[rgb(var(--surface-muted))] rounded w-24 mb-4"></div>
                        <div className="h-8 bg-[rgb(var(--surface-muted))] rounded w-28"></div>
                    </div>
                    <div className="w-12 h-12 bg-[rgb(var(--surface-muted))] rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-6 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-[rgb(var(--text-muted))] mb-2">
                        {title}
                    </p>
                    <p className="text-3xl font-semibold text-[rgb(var(--foreground))] mb-3">
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                    {trend && (
                        <div className="flex items-center gap-1.5">
                            {trend.isPositive ? (
                                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                            )}
                            <span
                                className={`text-sm font-semibold ${trend.isPositive ? "text-emerald-600" : "text-rose-600"
                                    }`}
                            >
                                {trend.isPositive ? "+" : ""}
                                {trend.value}
                            </span>
                            <span className="text-sm text-[rgb(var(--text-muted))]">
                                vs last week
                            </span>
                        </div>
                    )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--primary-light-3))] to-[rgb(var(--primary-light-2))] flex items-center justify-center text-[rgb(var(--primary))]">
                    {icon}
                </div>
            </div>
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
        <div className="group flex items-center justify-between py-4 px-5 hover:bg-[rgb(var(--surface-muted))] rounded-lg transition-colors duration-200">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[rgb(var(--primary-light-3))] to-[rgb(var(--primary-light-2))] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <Globe className="w-5 h-5 text-[rgb(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[rgb(var(--foreground))] truncate mb-0.5">
                        {domain.domainName}
                    </p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                        {domain.conversations.toLocaleString()} total conversations
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-lg font-bold text-[rgb(var(--foreground))]">
                        {domain.active}
                    </p>
                    <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
                        Active
                    </p>
                </div>
                <div className="w-20 text-right">
                    <span
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[60px] ${activePercentage > 70
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : activePercentage > 40
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))]"
                            }`}
                    >
                        {activePercentage}%
                    </span>
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

    const totalConversations = dashboard?.byDomain?.reduce(
        (sum, domain) => sum + domain.conversations,
        0
    ) ?? 0;

    if (error) {
        return (
            <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-0">
                <div className="bg-[rgb(var(--surface))] border border-rose-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-5">
                        <Activity className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-2">
                        Unable to load dashboard
                    </h3>
                    <p className="text-sm text-[rgb(var(--text-muted))] mb-6">{error}</p>
                    <button
                        onClick={() => fetchDashboardStats()}
                        className="btn px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[rgb(var(--background))]">
            <div className="max-w-7xl mx-auto  ">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
                            {getGreeting()}
                            {user?.fullName && (
                                <span className="text-[rgb(var(--text-muted))]">
                                    , {user.fullName.split(" ")[0]}
                                </span>
                            )}
                        </h1>
                        <p className="text-base text-[rgb(var(--text-muted))]">
                            Here's what's happening with your chatbots today
                        </p>
                    </div>


                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard
                        title="Total Conversations"
                        value={totalConversations}
                        icon={<MessageSquare className="w-6 h-6" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Active Conversations"
                        value={dashboard?.activeConversations ?? 0}
                        icon={<Activity className="w-6 h-6" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Today's Chats"
                        value={dashboard?.todaysChats ?? 0}
                        icon={<Calendar className="w-6 h-6" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Leads"
                        value={dashboard?.totalLeads ?? 0}
                        icon={<Users className="w-6 h-6" />}
                        trend={{
                            value: "12%",
                            isPositive: true,
                        }}
                        loading={loading}
                    />
                </div>

                {/* Domain Performance */}
                <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-[rgb(var(--border))]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[rgb(var(--foreground))] mb-1">
                                    Domain Performance
                                </h2>
                                <p className="text-sm text-[rgb(var(--text-muted))]">
                                    Active conversations across all domains
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--surface-muted))] rounded-lg">
                                <TrendingUp className="w-4 h-4 text-[rgb(var(--primary))]" />
                                <span className="text-sm font-semibold text-[rgb(var(--foreground))]">
                                    {dashboard?.byDomain?.length ?? 0}
                                </span>
                                <span className="text-xs text-[rgb(var(--text-muted))]">
                                    domains
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-3">
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-20 bg-[rgb(var(--surface-muted))] rounded-lg animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        ) : dashboard?.byDomain && dashboard.byDomain.length > 0 ? (
                            <div className="space-y-1">
                                {dashboard.byDomain.map((domain) => (
                                    <DomainRow key={domain.domainId} domain={domain} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--surface-muted))] flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-[rgb(var(--text-muted))]" />
                                </div>
                                <p className="text-base font-semibold text-[rgb(var(--foreground))] mb-2">
                                    No domains configured yet
                                </p>
                                <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
                                    Add your first domain to start tracking conversations
                                </p>
                                <button className="btn px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all duration-200">
                                    Add Domain
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Summary */}
                {dashboard && !loading && (
                    <div className="mt-6 bg-gradient-to-br from-[rgb(var(--primary-light-3))] to-[rgb(var(--primary-light-2))] border border-[rgb(var(--primary-light-2))] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-6 h-6 text-[rgb(var(--primary))]" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[rgb(var(--foreground))] mb-2">
                                    Performance Summary
                                </h3>
                                <p className="text-sm text-[rgb(var(--foreground))]/80 leading-relaxed">
                                    You have{" "}
                                    <span className="font-bold text-[rgb(var(--primary))]">
                                        {dashboard.activeConversations} active conversations
                                    </span>{" "}
                                    across{" "}
                                    <span className="font-bold text-[rgb(var(--primary))]">
                                        {dashboard.byDomain.length} domains
                                    </span>
                                    . Your chatbots handled{" "}
                                    <span className="font-bold text-[rgb(var(--primary))]">
                                        {dashboard.todaysChats} chats today
                                    </span>{" "}
                                    and generated{" "}
                                    <span className="font-bold text-[rgb(var(--primary))]">
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