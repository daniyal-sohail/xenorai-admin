"use client";

import { FC } from "react";

export const LeadSkeleton: FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
            {/* Avatar & Name Skeleton */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
            </div>

            {/* Contact Info Skeleton */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-40" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <div className="h-6 bg-gray-200 rounded-full w-16" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
        </div>
    );
};

export const LeadSkeletonGrid: FC<{ count?: number }> = ({ count = 9 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <LeadSkeleton key={i} />
            ))}
        </div>
    );
};