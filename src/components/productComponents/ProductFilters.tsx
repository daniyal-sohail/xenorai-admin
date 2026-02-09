"use client";

import { FC, memo, useCallback } from "react";
import { Search, Filter, X, DollarSign } from "lucide-react";
import { ProductFilters as IFilters } from "./ProductTypes";

interface ProductFiltersProps {
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
    categories: string[];
}

const ProductFiltersComponent: FC<ProductFiltersProps> = ({
    filters,
    onFilterChange,
    categories,
}) => {
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, search: e.target.value });
        },
        [filters, onFilterChange]
    );

    const handleCategoryChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onFilterChange({
                ...filters,
                category: e.target.value || undefined,
            });
        },
        [filters, onFilterChange]
    );

    const handleStatusChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            onFilterChange({
                ...filters,
                isActive: value === "" ? undefined : value === "true",
            });
        },
        [filters, onFilterChange]
    );

    const handlePriceMinChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            onFilterChange({
                ...filters,
                priceMin: value ? parseFloat(value) : undefined,
            });
        },
        [filters, onFilterChange]
    );

    const handlePriceMaxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            onFilterChange({
                ...filters,
                priceMax: value ? parseFloat(value) : undefined,
            });
        },
        [filters, onFilterChange]
    );

    const handleClearFilters = useCallback(() => {
        onFilterChange({});
    }, [onFilterChange]);

    const hasActiveFilters = !!(
        filters.search ||
        filters.category ||
        filters.isActive !== undefined ||
        filters.priceMin !== undefined ||
        filters.priceMax !== undefined
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
                        placeholder="Search products by name or description..."
                        value={filters.search || ""}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Row 2: Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={filters.category || ""}
                            onChange={handleCategoryChange}
                            className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer text-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <Filter
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={
                                filters.isActive === undefined
                                    ? ""
                                    : filters.isActive
                                        ? "true"
                                        : "false"
                            }
                            onChange={handleStatusChange}
                            className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <Filter
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                    </div>

                    {/* Min Price */}
                    <div className="relative">
                        <DollarSign
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Min Price"
                            value={filters.priceMin || ""}
                            onChange={handlePriceMinChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Max Price */}
                    <div className="relative">
                        <DollarSign
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Max Price"
                            value={filters.priceMax || ""}
                            onChange={handlePriceMaxChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
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

export const ProductFilters = memo(ProductFiltersComponent);