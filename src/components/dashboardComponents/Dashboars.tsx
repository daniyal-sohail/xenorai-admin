// src/pages/Dashboard.tsx
import { useEffect, memo, useState, useRef } from "react";
import {
    MessageSquare,
    Users,
    Calendar,
    Globe,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Plus,
    Sparkles,
    Zap,
    BarChart2,
    Clock,
    RefreshCw,
} from "lucide-react";
import { useStatsStore } from "@/store/stats.store";
import { useUserStore } from "@/store/user.store";

// ─── Animated Number ──────────────────────────────────────────────────────────
const AnimatedNumber = ({ value }: { value: number }) => {
    const [display, setDisplay] = useState(0);
    const raf = useRef<number>(0);
    useEffect(() => {
        const start = Date.now();
        const duration = 900;
        const from = display;
        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(from + (value - from) * ease));
            if (progress < 1) raf.current = requestAnimationFrame(animate);
        };
        raf.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf.current);
    }, [value]);
    return <>{display.toLocaleString()}</>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: { value: string; isPositive: boolean };
    subtitle?: string;
    iconBg: string;
    iconColor: string;
    loading?: boolean;
}

const StatCard = memo(({ title, value, icon, trend, subtitle, iconBg, iconColor, loading }: StatCardProps) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 min-h-[120px] flex flex-col justify-center gap-3">
                <div className="h-2.5 bg-gray-100 rounded-full w-3/5 animate-pulse" />
                <div className="h-7 bg-gray-100 rounded-full w-2/5 animate-pulse" />
                <div className="h-2 bg-gray-100 rounded-full w-1/2 animate-pulse" />
            </div>
        );
    }
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                    <span className={iconColor}>{icon}</span>
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        {trend.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {trend.value}
                    </span>
                )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
                <AnimatedNumber value={value} />
            </p>
        </div>
    );
});
StatCard.displayName = "StatCard";

// ─── Domain Row ───────────────────────────────────────────────────────────────
interface DomainRowProps {
    domain: { domainId: string; domainName: string; conversations: number; active: number };
    maxConversations: number;
    rank: number;
}

const DomainRow = memo(({ domain, maxConversations, rank }: DomainRowProps) => {
    const pct = domain.conversations > 0 ? Math.round((domain.active / domain.conversations) * 100) : 0;
    const barWidth = maxConversations > 0 ? (domain.conversations / maxConversations) * 100 : 0;
    const statusCls = pct > 70
        ? "text-emerald-600 bg-emerald-50 border-emerald-200"
        : pct > 40
            ? "text-amber-600 bg-amber-50 border-amber-200"
            : "text-gray-400 bg-gray-50 border-gray-200";
    const dotCls = pct > 70 ? "bg-emerald-500" : pct > 40 ? "bg-amber-500" : "bg-gray-300";

    return (
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <span className="text-[11px] font-bold text-gray-300 w-5 flex-shrink-0 tabular-nums">#{rank}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 border border-orange-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Globe size={14} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate mb-1.5">{domain.domainName}</p>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-400 rounded-full transition-all duration-700"
                        style={{ width: `${barWidth}%` }}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 tabular-nums">{domain.conversations.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">total</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${statusCls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
                    {pct}%
                </span>
            </div>
        </div>
    );
});
DomainRow.displayName = "DomainRow";

// ─── Donut ────────────────────────────────────────────────────────────────────
const Donut = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(max > 0 ? value / max : 0, 1);
    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <svg width="68" height="68" viewBox="0 0 68 68">
                <circle cx="34" cy="34" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
                <circle
                    cx="34" cy="34" r={r} fill="none"
                    stroke={color} strokeWidth="5"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct)}
                    strokeLinecap="round"
                    transform="rotate(-90 34 34)"
                    style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
                />
                <text x="34" y="38" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">
                    {Math.round(pct * 100)}%
                </text>
            </svg>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">{label}</p>
        </div>
    );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const { dashboard, loading, error, fetchDashboardStats } = useStatsStore();
    const { user, fetchProfile } = useUserStore();
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        fetchDashboardStats();
        fetchProfile();
    }, [fetchDashboardStats, fetchProfile]);

    useEffect(() => {
        if (!loading && dashboard) setLastUpdated(new Date());
    }, [loading, dashboard]);

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 18) return "Good afternoon";
        return "Good evening";
    };

    const totalConversations = dashboard?.byDomain?.reduce((s, d) => s + d.conversations, 0) ?? 0;
    const totalActive = dashboard?.activeConversations ?? 0;
    const totalLeads = dashboard?.totalLeads ?? 0;
    const todaysChats = dashboard?.todaysChats ?? 0;
    const maxConversations = dashboard?.byDomain?.reduce((m, d) => Math.max(m, d.conversations), 1) ?? 1;
    const topDomain = dashboard?.byDomain?.[0];
    const domainsWithActive = dashboard?.byDomain?.filter(d => d.active > 0).length ?? 0;
    const totalDomains = dashboard?.byDomain?.length ?? 0;
    const activeRate = totalConversations > 0 ? Math.round((totalActive / totalConversations) * 100) : 0;
    const leadRate = totalConversations > 0 ? Math.round((totalLeads / totalConversations) * 100) : 0;

    const distColors = ["#f97518", "#6366f1", "#10b981", "#f59e0b", "#ec4899"];

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                        <Activity size={26} className="text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Unable to load dashboard</h3>
                    <p className="text-sm text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => fetchDashboardStats()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-200 hover:opacity-90 transition-opacity"
                    >
                        <RefreshCw size={13} /> Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 rounded-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                            <Sparkles size={20} className="text-orange-500" />
                            {getGreeting()}
                            {user?.fullName && (
                                <span className="text-orange-500">, {user.fullName.split(" ")[0]}</span>
                            )}
                        </h1>
                        <p className="text-sm text-gray-400">Here's your chatbot performance overview</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-full">
                            <Clock size={11} />
                            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>

                    </div>
                </div>

                {/* Insight Pills */}
                {!loading && dashboard && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-500 shadow-sm">
                            <Zap size={11} className="text-orange-500" />
                            <strong className="text-gray-800 font-bold">{totalActive}</strong> live right now
                        </div>
                        <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-500 shadow-sm">
                            <BarChart2 size={11} className="text-orange-500" />
                            <strong className="text-gray-800 font-bold">{totalDomains}</strong> active domains
                        </div>
                        {topDomain && (
                            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-500 shadow-sm">
                                <TrendingUp size={11} className="text-orange-500" />
                                Top: <strong className="text-gray-800 font-bold">{topDomain.domainName}</strong>
                            </div>
                        )}
                    </div>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Conversations"
                        value={totalConversations}
                        icon={<MessageSquare size={17} />}
                        subtitle={`Across ${totalDomains} domain${totalDomains !== 1 ? "s" : ""}`}
                        iconBg="bg-orange-50 border border-orange-100"
                        iconColor="text-orange-500"
                        loading={loading}
                    />
                    <StatCard
                        title="Active Now"
                        value={totalActive}
                        icon={<Activity size={17} />}
                        subtitle={`${activeRate}% engagement rate`}
                        iconBg="bg-emerald-50 border border-emerald-100"
                        iconColor="text-emerald-500"
                        trend={{ value: "Live", isPositive: true }}
                        loading={loading}
                    />
                    <StatCard
                        title="Today's Chats"
                        value={todaysChats}
                        icon={<Calendar size={17} />}
                        subtitle="Conversations started today"
                        iconBg="bg-indigo-50 border border-indigo-100"
                        iconColor="text-indigo-500"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Leads"
                        value={totalLeads}
                        icon={<Users size={17} />}
                        subtitle={`${leadRate}% conversion rate`}
                        iconBg="bg-orange-50 border border-orange-100"
                        iconColor="text-orange-500"
                        trend={{ value: "+12%", isPositive: true }}
                        loading={loading}
                    />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-5">

                    {/* Domain Performance */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Domain Performance</p>
                                <p className="text-xs text-gray-400 mt-0.5">Conversations & engagement per domain</p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                                <Globe size={11} />
                                {totalDomains} domains
                            </div>
                        </div>
                        <div className="p-3">
                            {loading ? (
                                <div className="flex flex-col gap-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : dashboard?.byDomain && dashboard.byDomain.length > 0 ? (
                                <div>
                                    {dashboard.byDomain.map((d, i) => (
                                        <DomainRow key={d.domainId} domain={d} maxConversations={maxConversations} rank={i + 1} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-4">
                                        <Globe size={20} className="text-orange-500" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 mb-1">No domains yet</p>
                                    <p className="text-xs text-gray-400 mb-5">Add a domain to start tracking</p>
                                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md shadow-orange-200 hover:opacity-90 transition-opacity">
                                        <Plus size={13} /> Add Domain
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-5">



                        {/* Engagement Donuts */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-900">Engagement Rates</p>
                                <p className="text-xs text-gray-400 mt-0.5">Real-time health metrics</p>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                                <Donut value={totalActive} max={Math.max(totalConversations, 1)} label="Active rate" color="#f97518" />
                                <Donut value={totalLeads} max={Math.max(totalConversations, 1)} label="Lead rate" color="#6366f1" />
                                <Donut value={todaysChats} max={Math.max(Math.round(totalConversations / 7), 1)} label="Daily vs avg" color="#10b981" />
                                <Donut value={domainsWithActive} max={Math.max(totalDomains, 1)} label="Domains live" color="#f59e0b" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Banner */}
                {dashboard && !loading && dashboard.byDomain.length > 0 && (
                    <div className="flex items-start gap-4 bg-orange-50 border border-orange-100 rounded-2xl px-6 py-5">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
                            <TrendingUp size={18} className="text-orange-500" />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            You have{" "}
                            <strong className="text-orange-500">{totalActive} active conversations</strong>{" "}
                            across <strong className="text-orange-500">{totalDomains} domains</strong>.
                            Your chatbots handled{" "}
                            <strong className="text-orange-500">{todaysChats} chats today</strong>{" "}
                            and generated{" "}
                            <strong className="text-orange-500">{totalLeads} leads</strong> in total.
                            {topDomain && (
                                <> Top performer: <strong className="text-orange-500">{topDomain.domainName}</strong>.</>
                            )}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;