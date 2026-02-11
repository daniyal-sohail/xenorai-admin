"use client";

import { FC, memo, useCallback } from "react";
import { Search, Globe, TrendingUp, Package, CheckCircle, XCircle, DollarSign } from "lucide-react";
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
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFilterChange({ ...filters, search: e.target.value });
        },
        [filters, onFilterChange]
    );

    // Calculate stats
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const inactiveProducts = totalProducts - activeProducts;
    const averagePrice =
        totalProducts > 0
            ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
            : 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (domains.length === 0) {
        return (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Globe className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No Domains Found
                        </h3>
                        <p className="text-gray-700">
                            You need to create a domain first to start managing products.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mb-8">
            {/* Search & Domain Bar */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Domain Selector */}
                    <div className="relative flex-shrink-0 lg:w-72">
                        <Globe
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 z-10"
                            size={20}
                        />
                        <select
                            value={selectedDomainId || ""}
                            onChange={(e) => onDomainChange(e.target.value)}
                            className="appearance-none w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white cursor-pointer transition-all text-sm font-semibold"
                        >
                            <option value="">Select Domain</option>
                            {domains.map((domain) => (
                                <option key={domain._id} value={domain._id}>
                                    {domain.domainName}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
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
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search products by name or description..."
                            value={filters.search || ""}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {selectedDomainId && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Products */}
                    <div className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Package size={24} />
                            </div>
                            <TrendingUp className="opacity-50" size={20} />
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Total Products</p>
                        <p className="text-4xl font-bold">{totalProducts}</p>
                    </div>

                    {/* Active Products */}
                    <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <CheckCircle size={24} />
                            </div>
                            <TrendingUp className="opacity-50" size={20} />
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Active</p>
                        <p className="text-4xl font-bold">{activeProducts}</p>
                    </div>

                    {/* Inactive Products */}
                    <div className="group bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <XCircle size={24} />
                            </div>
                            <TrendingUp className="opacity-50 rotate-180" size={20} />
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Inactive</p>
                        <p className="text-4xl font-bold">{inactiveProducts}</p>
                    </div>

                    {/* Average Price */}
                    <div className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <DollarSign size={24} />
                            </div>
                            <TrendingUp className="opacity-50" size={20} />
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Avg Price</p>
                        <p className="text-4xl font-bold">{formatPrice(averagePrice)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ProductFilters = memo(ProductFiltersComponent);