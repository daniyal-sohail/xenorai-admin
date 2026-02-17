"use client";

import { FC, memo, useCallback } from "react";
import { Search, Filter, X, Calendar } from "lucide-react";
import { ConversationFilters as IFilters } from "./ConversationTypes";

interface ConversationFiltersProps {
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
}

const ConversationFiltersComponent: FC<ConversationFiltersProps> = ({
    filters,
    onFilterChange,
}) => {
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterChange({ ...filters, search: e.target.value }),
        [filters, onFilterChange]
    );

    const handleStatus = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) =>
            onFilterChange({ ...filters, status: e.target.value ? (e.target.value as any) : undefined }),
        [filters, onFilterChange]
    );

    const handleDateFrom = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterChange({ ...filters, startDate: e.target.value }),
        [filters, onFilterChange]
    );

    const handleDateTo = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterChange({ ...filters, endDate: e.target.value }),
        [filters, onFilterChange]
    );

    const clearSearch = useCallback(
        () => onFilterChange({ ...filters, search: "" }),
        [filters, onFilterChange]
    );

    const clearFilters = useCallback(
        () => onFilterChange({}),
        [onFilterChange]
    );

    const hasActiveFilters = !!(filters.search || filters.status || filters.startDate || filters.endDate);

    return (
        <div className="p-4 space-y-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
            {/* Search */}
            <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search conversations…"
                    value={filters.search || ""}
                    onChange={handleSearch}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm transition-all focus:outline-none bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)]"
                />
                {filters.search && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={13} />
                    </button>
                )}
            </div>

            {/* Filters row */}
            <div className="grid grid-cols-3 gap-2">
                {/* Status */}
                <div className="relative">
                    <select
                        value={filters.status || ""}
                        onChange={handleStatus}
                        className="appearance-none w-full px-3 py-2 pr-7 rounded-xl text-xs font-semibold transition-all focus:outline-none cursor-pointer bg-white border border-gray-200 text-gray-700 hover:border-gray-300 focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)]"
                    >
                        <option value="">All Status</option>
                        <option value="active">AI Active</option>
                        <option value="handoff">Manual</option>
                        <option value="closed">Closed</option>
                    </select>
                    <Filter size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Date from */}
                <div className="relative">
                    <Calendar size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="date"
                        value={filters.startDate || ""}
                        onChange={handleDateFrom}
                        className="w-full pl-7 pr-2 py-2 rounded-xl text-xs transition-all focus:outline-none bg-white border border-gray-200 text-gray-700 hover:border-gray-300 focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)]"
                    />
                </div>

                {/* Date to */}
                <div className="relative">
                    <Calendar size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="date"
                        value={filters.endDate || ""}
                        onChange={handleDateTo}
                        className="w-full pl-7 pr-2 py-2 rounded-xl text-xs transition-all focus:outline-none bg-white border border-gray-200 text-gray-700 hover:border-gray-300 focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)]"
                    />
                </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="text-xs font-semibold flex items-center gap-1 transition-colors"
                    style={{ color: "#f97518" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#ea5a00"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#f97518"}
                >
                    <X size={12} />
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export const ConversationFilters = memo(ConversationFiltersComponent);