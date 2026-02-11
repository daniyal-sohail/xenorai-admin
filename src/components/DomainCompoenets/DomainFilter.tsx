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

    return (
        <div className="flex items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
                <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Search domains or bots…"
                    value={filters.search || ""}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-9 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/25 focus:border-[rgb(var(--primary))] transition-all"
                />
                {filters.search && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--foreground))] transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Status toggle pills */}
            <div className="flex items-center gap-1 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-1">
                <button
                    onClick={() => setStatus(undefined)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${!filters.status
                            ? "bg-[rgb(var(--foreground))] text-[rgb(var(--surface))] shadow-sm"
                            : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--foreground))]"
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setStatus("enabled")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.status === "enabled"
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--foreground))]"
                        }`}
                >
                    Active
                </button>
                <button
                    onClick={() => setStatus("disabled")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.status === "disabled"
                            ? "bg-[rgb(var(--surface-muted))] text-[rgb(var(--foreground))] shadow-sm border border-[rgb(var(--border))]"
                            : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--foreground))]"
                        }`}
                >
                    Inactive
                </button>
            </div>
        </div>
    );
};

export const DomainFilters = memo(DomainFiltersComponent);