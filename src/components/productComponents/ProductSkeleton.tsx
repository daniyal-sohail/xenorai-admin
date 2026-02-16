"use client";

import { FC } from "react";

const shimmerStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "productShimmer 1.6s infinite",
    borderRadius: 6,
};

export const ProductSkeleton: FC = () => {
    return (
        <>
            <style>{`
        @keyframes productShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
            <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: "1px solid #e5e7eb" }}
            >
                {/* Image */}
                <div style={{ ...shimmerStyle, height: 160, borderRadius: 0 }} />

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Title + desc */}
                    <div className="space-y-2">
                        <div style={{ ...shimmerStyle, height: 14, width: "65%" }} />
                        <div style={{ ...shimmerStyle, height: 11, width: "90%" }} />
                        <div style={{ ...shimmerStyle, height: 11, width: "75%" }} />
                    </div>

                    {/* Price + badge */}
                    <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <div style={{ ...shimmerStyle, height: 20, width: 80 }} />
                        <div style={{ ...shimmerStyle, height: 22, width: 72, borderRadius: 999 }} />
                    </div>

                    {/* Button */}
                    <div style={{ ...shimmerStyle, height: 36, borderRadius: 10 }} />
                </div>
            </div>
        </>
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