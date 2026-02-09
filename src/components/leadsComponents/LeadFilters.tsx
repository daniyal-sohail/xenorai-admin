"use client";

import { FC, memo, useCallback } from "react";
import { Search, Filter, X, Calendar } from "lucide-react";
import { LeadFilters as IFilters } from "./LeadsTypes";

interface LeadFiltersProps {
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
}

const LeadFiltersComponent: FC<LeadFiltersProps> = ({
    filters,
    onFilterChange,
}) => {
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, search: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleDateFromChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, dateFrom: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleDateToChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, dateTo: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleHasPhoneChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            onFilterChange({
                ...filters,
                hasPhone: value === "" ? undefined : value === "true",
            });
        },
        [filters, onFilterChange]
    );

    const handleHasNameChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            onFilterChange({
                ...filters,
                hasName: value === "" ? undefined : value === "true",
            });
        },
        [filters, onFilterChange]
    );

    const handleClearFilters = useCallback(() => {
        onFilterChange({});
    }, [onFilterChange]);

    const hasActiveFilters = !!(
        filters.search ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.hasPhone !== undefined ||
        filters.hasName !== undefined
    );

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-col gap-4">
                {/* Row 1: Search */}
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={filters.search || ""}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Row 2: Date Filters and Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Date From */}
                    <div className="relative">
                        <Calendar
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                        <input
                            type="date"
                            value={filters.dateFrom || ""}
                            onChange={handleDateFromChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            placeholder="From date"
                        />
                    </div>

                    {/* Date To */}
                    <div className="relative">
                        <Calendar
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                        <input
                            type="date"
                            value={filters.dateTo || ""}
                            onChange={handleDateToChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            placeholder="To date"
                        />
                    </div>

                    {/* Has Phone Filter */}
                    <div className="relative">
                        <select
                            value={
                                filters.hasPhone === undefined
                                    ? ""
                                    : filters.hasPhone
                                        ? "true"
                                        : "false"
                            }
                            onChange={handleHasPhoneChange}
                            className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer text-sm"
                        >
                            <option value="">All Leads</option>
                            <option value="true">With Phone</option>
                            <option value="false">Without Phone</option>
                        </select>
                        <Filter
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                    </div>

                    {/* Has Name Filter */}
                    <div className="relative">
                        <select
                            value={
                                filters.hasName === undefined
                                    ? ""
                                    : filters.hasName
                                        ? "true"
                                        : "false"
                            }
                            onChange={handleHasNameChange}
                            className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer text-sm"
                        >
                            <option value="">All Names</option>
                            <option value="true">With Name</option>
                            <option value="false">Anonymous</option>
                        </select>
                        <Filter
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 text-sm"
                        >
                            <X size={16} />
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const LeadFilters = memo(LeadFiltersComponent);