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
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, search: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleStatusChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            onFilterChange({
                ...filters,
                status: value ? (value as any) : undefined,
            });
        },
        [filters, onFilterChange]
    );

    const handleDateFromChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, startDate: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleDateToChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, endDate: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleClearFilters = useCallback(() => {
        onFilterChange({});
    }, [onFilterChange]);

    const hasActiveFilters = !!(
        filters.search ||
        filters.status ||
        filters.startDate ||
        filters.endDate
    );

    return (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex flex-col gap-3">
                {/* Search */}
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={filters.search || ""}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-3 gap-2">
                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={filters.status || ""}
                            onChange={handleStatusChange}
                            className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="handoff">Handoff</option>
                            <option value="closed">Closed</option>
                        </select>
                        <Filter
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={14}
                        />
                    </div>

                    {/* Date From */}
                    <div className="relative">
                        <Calendar
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={14}
                        />
                        <input
                            type="date"
                            value={filters.startDate || ""}
                            onChange={handleDateFromChange}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Date To */}
                    <div className="relative">
                        <Calendar
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={14}
                        />
                        <input
                            type="date"
                            value={filters.endDate || ""}
                            onChange={handleDateToChange}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 self-start"
                    >
                        <X size={14} />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export const ConversationFilters = memo(ConversationFiltersComponent);