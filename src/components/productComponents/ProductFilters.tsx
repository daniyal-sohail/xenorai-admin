"use client";

import { FC, memo, useCallback } from "react";
import { Search, Globe, X } from "lucide-react";
import { ProductFilters as IFilters } from "./ProductTypes";
import { IDomain } from "@/api/DomainApi";
import { IProduct } from "./ProductTypes";

interface ProductFiltersProps {
    domains: IDomain[];
    selectedDomainId: string | null;
    onDomainChange: (domainId: string) => void;
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
    products: IProduct[];
}

const ProductFiltersComponent: FC<ProductFiltersProps> = ({
    domains,
    selectedDomainId,
    onDomainChange,
    filters,
    onFilterChange,
    products,
}) => {
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterChange({ ...filters, search: e.target.value }),
        [filters, onFilterChange]
    );

    const clearSearch = useCallback(
        () => onFilterChange({ ...filters, search: "" }),
        [filters, onFilterChange]
    );

    if (domains.length === 0) {
        return (
            <div
                className="rounded-2xl p-5 mb-6 flex items-start gap-4"
                style={{ background: "rgba(249,117,24,0.05)", border: "1px solid rgba(249,117,24,0.15)" }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(249,117,24,0.1)", border: "1px solid rgba(249,117,24,0.2)" }}
                >
                    <Globe size={18} style={{ color: "#f97518" }} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">No Domains Found</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        You need to create a domain first before managing products.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            {/* Domain selector */}
            <div className="relative flex-shrink-0 sm:w-64">
                <Globe
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#f97518" }}
                />
                <select
                    value={selectedDomainId || ""}
                    onChange={(e) => onDomainChange(e.target.value)}
                    className="appearance-none w-full pl-9 pr-8 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none cursor-pointer bg-white border border-gray-200 text-gray-900 hover:border-gray-300 focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)]"
                >
                    <option value="">Select Domain</option>
                    {domains.map((d) => (
                        <option key={d._id} value={d._id}>{d.domainName}</option>
                    ))}
                </select>
                <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5 text-gray-400"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Search */}
            <div className="relative flex-1">
                <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search products by name or description…"
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
        </div>
    );
};

export const ProductFilters = memo(ProductFiltersComponent);