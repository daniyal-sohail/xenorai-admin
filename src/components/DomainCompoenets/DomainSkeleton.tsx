"use client";

import { FC } from "react";

const shimmer: React.CSSProperties = {
    background:
        "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "rowShimmer 1.4s infinite",
    borderRadius: 6,
};

export const DomainRowSkeleton: FC = () => {
    return (
        <>
            <style>{`
        @keyframes rowShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>

            <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-white">
                {/* Bot Avatar */}
                <div style={{ ...shimmer, width: 40, height: 40, borderRadius: 10 }} />

                {/* Bot + Domain Info */}
                <div className="ml-4 flex-1 space-y-2">
                    <div style={{ ...shimmer, width: "35%", height: 12 }} />
                    <div style={{ ...shimmer, width: "50%", height: 10 }} />
                </div>

                {/* Tone */}
                <div style={{ ...shimmer, width: 70, height: 24, borderRadius: 999 }} />

                {/* Status */}
                <div className="ml-6">
                    <div style={{ ...shimmer, width: 80, height: 24, borderRadius: 999 }} />
                </div>

                {/* Actions */}
                <div className="ml-8 flex gap-3">
                    <div style={{ ...shimmer, width: 28, height: 28, borderRadius: 8 }} />
                    <div style={{ ...shimmer, width: 28, height: 28, borderRadius: 8 }} />
                </div>
            </div>
        </>
    );
};

export const DomainSkeletonGrid: FC<{ rows?: number }> = ({
    rows = 6,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {Array.from({ length: rows }).map((_, i) => (
                <DomainRowSkeleton key={i} />
            ))}
        </div>
    );
};
