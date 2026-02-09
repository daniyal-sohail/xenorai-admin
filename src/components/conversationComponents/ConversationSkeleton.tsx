"use client";

import { FC } from "react";

export const ConversationListSkeleton: FC<{ count?: number }> = ({ count = 5 }) => {
    return (
        <div className="divide-y divide-gray-200">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24" />
                                <div className="h-3 bg-gray-200 rounded w-32" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="h-3 bg-gray-200 rounded w-16" />
                            <div className="h-3 bg-gray-200 rounded w-20" />
                        </div>
                    </div>
                    <div className="space-y-2 mt-3">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ChatMessageSkeleton: FC<{ count?: number }> = ({ count = 5 }) => {
    return (
        <div className="space-y-4 p-6">
            {Array.from({ length: count }).map((_, i) => {
                const isRight = i % 2 === 0;
                return (
                    <div
                        key={i}
                        className={`flex gap-2 animate-pulse ${isRight ? "justify-end" : ""}`}
                    >
                        {!isRight && <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />}
                        <div className="max-w-[70%] space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-20" />
                            <div className={`rounded-2xl p-4 ${isRight ? "bg-gray-200" : "bg-gray-200"}`}>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-300 rounded w-full" />
                                    <div className="h-3 bg-gray-300 rounded w-3/4" />
                                </div>
                            </div>
                        </div>
                        {isRight && <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />}
                    </div>
                );
            })}
        </div>
    );
};