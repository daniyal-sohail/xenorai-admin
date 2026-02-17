"use client";

import { FC } from "react";
import { Users, SlidersHorizontal } from "lucide-react";

interface LeadEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

export const LeadEmptyState: FC<LeadEmptyStateProps> = ({
    hasFilters,
    onClearFilters,
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
                    <Users size={28} style={{ color: "#f97518" }} />
                )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1.5 tracking-tight">
                {hasFilters ? "No Leads Found" : "No Leads Yet"}
            </h3>

            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-7">
                {hasFilters
                    ? "No leads match your current filters. Try adjusting your search criteria or clear the filters."
                    : "Start collecting leads from your chatbot conversations. When visitors share their contact information, they'll appear here."}
            </p>

            {hasFilters ? (
                <button
                    onClick={onClearFilters}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)", boxShadow: "0 4px 16px rgba(249,117,24,0.25)" }}
                >
                    <SlidersHorizontal size={14} />
                    Clear All Filters
                </button>
            ) : (
                <div
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(249,117,24,0.08)", color: "#ea5a00", border: "1px solid rgba(249,117,24,0.15)" }}
                >
                    💡 Install your chatbot to start collecting leads
                </div>
            )}
        </div>
    );
};