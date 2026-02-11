"use client";

import { FC, memo, useCallback } from "react";
import { Search, Globe, Calendar, X } from "lucide-react";
import { LeadFilters as IFilters } from "./LeadsTypes";
import { IDomain } from "@/api/DomainApi";

interface LeadFiltersProps {
    domains: IDomain[];
    selectedDomainId: string | null;
    onDomainChange: (domainId: string) => void;
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
}

const LeadFiltersComponent: FC<LeadFiltersProps> = ({
    domains,
    selectedDomainId,
    onDomainChange,
    filters,
    onFilterChange,
}) => {
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, search: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleDateChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, dateFrom: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleClearFilters = useCallback(() => {
        onFilterChange({});
    }, [onFilterChange]);

    const hasActiveFilters = !!(filters.search || filters.dateFrom);

    if (domains.length === 0) {
        return (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Globe className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-orange-900 mb-1">
                            No Domains Found
                        </h3>
                        <p className="text-orange-700 text-sm">
                            You don't have any domains yet. Create a domain first to start
                            collecting leads.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                {/* Domain Selector */}
                <div className="relative flex-shrink-0 lg:w-64">
                    <Globe
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                        size={18}
                    />
                    <select
                        value={selectedDomainId || ""}
                        onChange={(e) => onDomainChange(e.target.value)}
                        className="appearance-none w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white cursor-pointer transition-all text-sm font-medium"
                    >
                        <option value="">All Domains</option>
                        {domains.map((domain) => (
                            <option key={domain._id} value={domain._id}>
                                {domain.domainName}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Search Bar */}
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm"
                        onFocus={(e) => {
                            e.target.style.borderColor = "rgb(249, 117, 24)";
                            e.target.style.boxShadow =
                                "0 0 0 3px rgba(249, 117, 24, 0.1)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "";
                            e.target.style.boxShadow = "";
                        }}
                    />
                </div>

                {/* Date Filter */}
                <div className="relative flex-shrink-0 lg:w-48">
                    <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={16}
                    />
                    <input
                        type="date"
                        value={filters.dateFrom || ""}
                        onChange={handleDateChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
                        placeholder="Filter by date"
                    />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700 text-sm font-medium flex-shrink-0"
                        title="Clear all filters"
                    >
                        <X size={16} />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export const LeadFilters = memo(LeadFiltersComponent);