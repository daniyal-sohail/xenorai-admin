"use client";

import { FC } from "react";
import { Package, Plus } from "lucide-react";

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
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                <Package className="text-indigo-600" size={40} />
            </div>

            {hasFilters ? (
                <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No Products Found
                    </h3>
                    <p className="text-gray-600 text-center max-w-md mb-8">
                        No products match your current filters. Try adjusting your search
                        criteria or clear the filters.
                    </p>
                    <button
                        onClick={onClearFilters}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Clear Filters
                    </button>
                </>
            ) : (
                <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No Products Yet
                    </h3>
                    <p className="text-gray-600 text-center max-w-md mb-8">
                        Get started by adding your first product. Your chatbot can recommend
                        products to visitors based on their interests.
                    </p>
                    <button
                        onClick={onCreateClick}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30"
                    >
                        <Plus size={20} />
                        Add Your First Product
                    </button>
                </>
            )}
        </div>
    );
};