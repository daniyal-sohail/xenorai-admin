"use client";

import { FC, memo, useCallback } from "react";
import { Search, X } from "lucide-react";
import { DomainFilters as IFilters } from "./DomainTypes";

interface DomainFiltersProps {
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
}

const DomainFiltersComponent: FC<DomainFiltersProps> = ({ filters, onFilterChange }) => {
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterChange({ ...filters, search: e.target.value }),
        [filters, onFilterChange]
    );

    const clearSearch = useCallback(
        () => onFilterChange({ ...filters, search: "" }),
        [filters, onFilterChange]
    );

    const setStatus = useCallback(
        (status: "enabled" | "disabled" | undefined) =>
            onFilterChange({ ...filters, status }),
        [filters, onFilterChange]
    );

    const statusOptions: { val: "enabled" | "disabled" | undefined; label: string }[] = [
        { val: undefined, label: "All" },
        { val: "enabled", label: "Active" },
        { val: "disabled", label: "Inactive" },
    ];

    return (
        <div className="flex items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
                <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search domains or bots…"
                    value={filters.search || ""}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm 
                   bg-white border border-gray-200 text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-orange-500/20 
                   focus:border-orange-500 transition-all"
                />

                {filters.search && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 
                     text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={13} />
                    </button>
                )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 rounded-xl p-1 bg-gray-100 border border-gray-200">
                {statusOptions.map(({ val, label }) => {
                    const isActive = filters.status === val;

                    return (
                        <button
                            key={String(val)}
                            onClick={() => setStatus(val)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
              ${isActive
                                    ? val === "enabled"
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : val === "disabled"
                                            ? "bg-gray-200 text-gray-700 border border-gray-300"
                                            : "bg-orange-500 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 border border-transparent"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

};

export const DomainFilters = memo(DomainFiltersComponent);