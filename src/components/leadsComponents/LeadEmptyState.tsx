"use client";

import { FC } from "react";
import { Users, ArrowLeft } from "lucide-react";

interface LeadEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

export const LeadEmptyState: FC<LeadEmptyStateProps> = ({
    hasFilters,
    onClearFilters,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                <Users className="text-indigo-600" size={40} />
            </div>

            {hasFilters ? (
                <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No Leads Found
                    </h3>
                    <p className="text-gray-600 text-center max-w-md mb-8">
                        No leads match your current filters. Try adjusting your search
                        criteria or clear the filters.
                    </p>
                    <button
                        onClick={onClearFilters}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                    >
                        Clear Filters
                    </button>
                </>
            ) : (
                <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No Leads Yet
                    </h3>
                    <p className="text-gray-600 text-center max-w-md mb-8">
                        Start collecting leads from your chatbot conversations. When visitors
                        share their contact information, they'll appear here.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ArrowLeft size={16} />
                        <span>Install your chatbot to start collecting leads</span>
                    </div>
                </>
            )}
        </div>
    );
};