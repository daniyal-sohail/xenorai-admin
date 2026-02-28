"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    Search,
    Filter,
    CheckCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    UserCheck,
    X,
    Eye,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const RowSkeleton = () => (
    <tr className="border-b border-gray-50">
        {[...Array(6)].map((_, i) => (
            <td key={i} className="px-4 py-3.5">
                <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
            </td>
        ))}
    </tr>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ approved }: { approved: boolean }) =>
    approved ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">
            <CheckCircle size={11} /> Approved
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700">
            <Clock size={11} /> Pending
        </span>
    );

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
    const { users, usersPagination, loading, fetchUsers, approveUser, approveBulk } = useAdminStore();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"" | "approved" | "pending">("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [actionUserId, setActionUserId] = useState<string | null>(null);
    const [approving, setApproving] = useState<Set<string>>(new Set());
    const debouncedSearch = useDebounce(search);
    const menuRef = useRef<HTMLDivElement>(null);

    const load = useCallback(() => {
        fetchUsers({
            page,
            limit: 20,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(status ? { status } : {}),
        });
    }, [page, debouncedSearch, status, fetchUsers]);

    useEffect(() => {
        load();
    }, [load]);

    // reset page on filter change
    useEffect(() => { setPage(1); }, [debouncedSearch, status]);

    // close action menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActionUserId(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const allIds = users.map((u) => u._id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

    const toggleAll = () => {
        if (allSelected) setSelected(new Set());
        else setSelected(new Set(allIds));
    };

    const toggleOne = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleApproveOne = async (userId: string) => {
        setApproving((p) => new Set(p).add(userId));
        setActionUserId(null);
        try { await approveUser(userId); } finally {
            setApproving((p) => { const n = new Set(p); n.delete(userId); return n; });
        }
    };

    const handleBulkApprove = async () => {
        const ids = [...selected];
        setSelected(new Set());
        await approveBulk(ids);
    };

    const { total = 0, pages = 1 } = usersPagination ?? {};

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and approve platform users</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or email…"
                            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#f97518] focus:ring-2 focus:ring-orange-100 transition"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1">
                        {(["", "approved", "pending"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${status === s
                                    ? "bg-[#f97518] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Bulk actions */}
                    {selected.size > 0 && (
                        <button
                            onClick={handleBulkApprove}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f97518] hover:bg-[#ea5a00] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            <UserCheck size={15} />
                            Approve {selected.size} selected
                        </button>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{total.toLocaleString()} total</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                <th className="px-4 py-3 text-left w-10">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        className="rounded border-gray-300 accent-[#f97518] cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? [...Array(8)].map((_, i) => <RowSkeleton key={i} />)
                                : users.length === 0
                                    ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-16 text-center text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search size={28} className="opacity-30" />
                                                    <p className="font-medium">No users found</p>
                                                    <p className="text-xs">Try adjusting your filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                    : users.map((user) => (
                                        <tr key={user._id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selected.has(user._id) ? "bg-orange-50/40" : ""}`}>
                                            <td className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(user._id)}
                                                    onChange={() => toggleOne(user._id)}
                                                    className="rounded border-gray-300 accent-[#f97518] cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                        {(user.fullName ?? user.email ?? "?")[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.fullName || "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-gray-500">{user.email}</td>
                                            <td className="px-4 py-3.5">
                                                <Badge approved={user.isApproved} />
                                            </td>
                                            <td className="px-4 py-3.5 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center justify-end gap-2" ref={actionUserId === user._id ? menuRef : undefined}>
                                                    {!user.isApproved && (
                                                        <button
                                                            onClick={() => handleApproveOne(user._id)}
                                                            disabled={approving.has(user._id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f97518] hover:bg-[#ea5a00] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                                                        >
                                                            {approving.has(user._id) ? (
                                                                <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <CheckCircle size={12} />
                                                            )}
                                                            Approve
                                                        </button>
                                                    )}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActionUserId(actionUserId === user._id ? null : user._id)}
                                                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            <MoreHorizontal size={15} />
                                                        </button>
                                                        {actionUserId === user._id && (
                                                            <div ref={menuRef} className="absolute right-0 top-8 z-10 w-40 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                                                                <button
                                                                    onClick={() => {
                                                                        setActionUserId(null);
                                                                        // navigate to user detail — hook up with your router
                                                                    }}
                                                                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <Eye size={13} /> View Details
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/40">
                        <p className="text-xs text-gray-400">
                            Page <span className="font-semibold text-gray-600">{page}</span> of <span className="font-semibold text-gray-600">{pages}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                                const pg = page <= 3 ? i + 1 : page - 2 + i;
                                if (pg < 1 || pg > pages) return null;
                                return (
                                    <button
                                        key={pg}
                                        onClick={() => setPage(pg)}
                                        className={`w-7 h-7 text-xs font-semibold rounded-lg transition-all ${pg === page ? "bg-[#f97518] text-white shadow-sm" : "text-gray-500 hover:bg-white hover:shadow-sm"
                                            }`}
                                    >
                                        {pg}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                                disabled={page === pages}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}