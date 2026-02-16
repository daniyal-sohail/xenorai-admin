"use client";

import { FC } from "react";
import { Package, Plus, SlidersHorizontal } from "lucide-react";

interface ProductEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
    onCreateClick: () => void;
}

export const ProductEmptyState: FC<ProductEmptyStateProps> = ({
    hasFilters,
    onClearFilters,
    onCreateClick,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{
                    background: "rgba(249,117,24,0.08)",
                    border: "1px solid rgba(249,117,24,0.15)",
                    boxShadow: "0 0 24px rgba(249,117,24,0.1)",
                }}
            >
                {hasFilters ? (
                    <SlidersHorizontal size={28} style={{ color: "#f97518" }} />
                ) : (
                    <Package size={28} style={{ color: "#f97518" }} />
                )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1.5 tracking-tight">
                {hasFilters ? "No Products Found" : "No Products Yet"}
            </h3>

            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-7">
                {hasFilters
                    ? "No products match your current filters. Try adjusting your search or clear the filters."
                    : "Get started by adding your first product. Your chatbot can recommend products to visitors."}
            </p>

            {hasFilters ? (
                <button
                    onClick={onClearFilters}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)", boxShadow: "0 4px 16px rgba(249,117,24,0.25)" }}
                >
                    <SlidersHorizontal size={14} />
                    Clear Filters
                </button>
            ) : (
                <button
                    onClick={onCreateClick}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)", boxShadow: "0 4px 16px rgba(249,117,24,0.25)" }}
                >
                    <Plus size={15} />
                    Add Your First Product
                </button>
            )}
        </div>
    );
};