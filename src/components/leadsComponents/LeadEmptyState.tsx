"use client";

import { FC } from "react";
import { Users, Filter } from "lucide-react";

interface LeadEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

export const LeadEmptyState: FC<LeadEmptyStateProps> = ({
    hasFilters,
    onClearFilters,
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center justify-center py-20 px-6">
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "rgb(var(--primary-light-3))" }}
                >
                    {hasFilters ? (
                        <Filter style={{ color: "rgb(var(--primary))" }} size={40} />
                    ) : (
                        <Users style={{ color: "rgb(var(--primary))" }} size={40} />
                    )}
                </div>

                {hasFilters ? (
                    <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            No Leads Found
                        </h3>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            No leads match your current filters. Try adjusting your search
                            criteria or clear the filters to see all leads.
                        </p>
                        <button
                            onClick={onClearFilters}
                            className="px-6 py-3 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
                            style={{ background: "rgb(var(--primary))" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgb(var(--primary-hover))";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgb(var(--primary))";
                            }}
                        >
                            Clear All Filters
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            No Leads Yet
                        </h3>
                        <p className="text-gray-600 text-center max-w-md mb-6">
                            Start collecting leads from your chatbot conversations. When visitors
                            share their contact information, they'll appear here.
                        </p>
                        <div
                            className="px-4 py-2.5 rounded-lg text-sm font-medium"
                            style={{
                                background: "rgb(var(--primary-light-3))",
                                color: "rgb(var(--primary))",
                            }}
                        >
                            💡 Install your chatbot to start collecting leads
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};