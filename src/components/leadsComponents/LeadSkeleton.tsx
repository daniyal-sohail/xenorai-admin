"use client";

import { FC } from "react";

const shimmerStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "leadShimmer 1.6s infinite",
    borderRadius: 6,
};

export const LeadSkeleton: FC = () => {
    return (
        <>
            <style>{`
        @keyframes leadShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
            <div
                className="bg-white rounded-2xl p-5"
                style={{ border: "1px solid #e5e7eb" }}
            >
                {/* Avatar + name */}
                <div className="flex items-start gap-4 mb-4">
                    <div style={{ ...shimmerStyle, width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
                    <div className="flex-1 space-y-2">
                        <div style={{ ...shimmerStyle, height: 14, width: "55%" }} />
                        <div style={{ ...shimmerStyle, height: 11, width: "70%" }} />
                    </div>
                </div>

                {/* Contact info */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div style={{ ...shimmerStyle, width: 14, height: 14, borderRadius: 3 }} />
                        <div style={{ ...shimmerStyle, height: 11, width: "60%" }} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div style={{ ...shimmerStyle, width: 14, height: 14, borderRadius: 3 }} />
                        <div style={{ ...shimmerStyle, height: 11, width: "50%" }} />
                    </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ ...shimmerStyle, height: 22, width: 64, borderRadius: 999 }} />
                    <div style={{ ...shimmerStyle, height: 22, width: 72, borderRadius: 999 }} />
                </div>
            </div>
        </>
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