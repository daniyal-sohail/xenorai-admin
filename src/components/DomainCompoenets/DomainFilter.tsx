"use client";

import { FC, memo, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { DomainFilters as IFilters } from "./DomainTypes";


interface DomainFiltersProps {
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
}

const DomainFiltersComponent: FC<DomainFiltersProps> = ({
    filters,
    onFilterChange,
}) => {
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, search: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleToneChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onFilterChange({
                ...filters,
                tone: e.target.value ? (e.target.value as any) : undefined,
            });
        },
        [filters, onFilterChange]
    );

    const handleIndustryChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onFilterChange({
                ...filters,
                industry: e.target.value ? (e.target.value as any) : undefined,
            });
        },
        [filters, onFilterChange]
    );

    const handleStatusChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onFilterChange({
                ...filters,
                status: e.target.value ? (e.target.value as any) : undefined,
            });
        },
        [filters, onFilterChange]
    );

    const handleClearFilters = useCallback(() => {
        onFilterChange({});
    }, [onFilterChange]);

    const hasActiveFilters = !!(
        filters.search ||
        filters.tone ||
        filters.industry ||
        filters.status
    );

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search domains..."
                        value={filters.search || ""}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Tone Filter */}
                <div className="relative">
                    <select
                        value={filters.tone || ""}
                        onChange={handleToneChange}
                        className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer min-w-[140px]"
                    >
                        <option value="">All Tones</option>
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="salesy">Salesy</option>
                    </select>
                    <Filter
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={16}
                    />
                </div>

                {/* Industry Filter */}
                <div className="relative">
                    <select
                        value={filters.industry || ""}
                        onChange={handleIndustryChange}
                        className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer min-w-[140px]"
                    >
                        <option value="">All Industries</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="services">Services</option>
                        <option value="saas">SaaS</option>
                        <option value="other">Other</option>
                    </select>
                    <Filter
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={16}
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={filters.status || ""}
                        onChange={handleStatusChange}
                        className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer min-w-[140px]"
                    >
                        <option value="">All Status</option>
                        <option value="enabled">Active</option>
                        <option value="disabled">Disabled</option>
                    </select>
                    <Filter
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={16}
                    />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 whitespace-nowrap"
                    >
                        <X size={16} />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export const DomainFilters = memo(DomainFiltersComponent);