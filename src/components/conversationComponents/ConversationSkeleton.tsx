"use client";

import { FC } from "react";

const shimmerStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "convShimmer 1.6s infinite",
    borderRadius: 6,
};

export const ConversationListSkeleton: FC<{ count?: number }> = ({ count = 5 }) => {
    return (
        <>
            <style>{`
        @keyframes convShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
            <div>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="p-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2.5 flex-1">
                                <div style={{ ...shimmerStyle, width: 36, height: 36, borderRadius: 12, flexShrink: 0 }} />
                                <div className="flex-1 space-y-2">
                                    <div style={{ ...shimmerStyle, height: 12, width: "60%" }} />
                                    <div style={{ ...shimmerStyle, height: 10, width: "80%" }} />
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <div style={{ ...shimmerStyle, height: 10, width: 48 }} />
                                <div style={{ ...shimmerStyle, height: 16, width: 56, borderRadius: 6 }} />
                            </div>
                        </div>
                        <div className="space-y-2 mt-3">
                            <div style={{ ...shimmerStyle, height: 10, width: "90%" }} />
                            <div style={{ ...shimmerStyle, height: 10, width: "70%" }} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const ChatMessageSkeleton: FC<{ count?: number }> = ({ count = 5 }) => {
    return (
        <>
            <style>{`
        @keyframes convShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
            <div className="space-y-4 p-5">
                {Array.from({ length: count }).map((_, i) => {
                    const isRight = i % 2 === 0;
                    return (
                        <div key={i} className={`flex gap-2.5 ${isRight ? "justify-end" : ""}`}>
                            {!isRight && <div style={{ ...shimmerStyle, width: 32, height: 32, borderRadius: 12, flexShrink: 0 }} />}
                            <div className="max-w-[70%] space-y-2">
                                <div style={{ ...shimmerStyle, height: 10, width: 60 }} />
                                <div className="rounded-2xl p-4" style={{ background: "#f9fafb", border: "1px solid #f3f4f6" }}>
                                    <div className="space-y-2">
                                        <div style={{ ...shimmerStyle, height: 10, width: 200 }} />
                                        <div style={{ ...shimmerStyle, height: 10, width: 150 }} />
                                    </div>
                                </div>
                            </div>
                            {isRight && <div style={{ ...shimmerStyle, width: 32, height: 32, borderRadius: 12, flexShrink: 0 }} />}
                        </div>
                    );
                })}
            </div>
        </>
    );
};