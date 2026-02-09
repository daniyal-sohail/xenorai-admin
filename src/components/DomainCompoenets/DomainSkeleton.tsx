"use client";

import { FC } from "react";

export const DomainSkeleton: FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
            {/* Status Badge Skeleton */}
            <div className="flex justify-end mb-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>

            {/* Avatar & Name Skeleton */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-48" />
                </div>
            </div>

            {/* Domain Key Skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-100 rounded-lg" />
            </div>

            {/* Metadata Skeleton */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-20" />
            </div>

            {/* Button Skeleton */}
            <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
    );
};

export const DomainSkeletonGrid: FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <DomainSkeleton key={i} />
            ))}
        </div>
    );
};