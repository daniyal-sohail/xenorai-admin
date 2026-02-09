"use client";

import { FC } from "react";

export const ProductSkeleton: FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200" />

            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
                {/* Title & Description */}
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>

                {/* Price & Category */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="h-8 bg-gray-200 rounded w-24" />
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                </div>

                {/* Button */}
                <div className="h-10 bg-gray-200 rounded-lg" />
            </div>
        </div>
    );
};

export const ProductSkeletonGrid: FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
};