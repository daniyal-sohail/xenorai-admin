"use client";

import { FC } from "react";
import { Globe, Plus } from "lucide-react";

interface EmptyStateProps {
    onCreateClick: () => void;
}

export const EmptyState: FC<EmptyStateProps> = ({ onCreateClick }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                <Globe className="text-indigo-600" size={40} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Domains Yet
            </h3>

            <p className="text-gray-600 text-center max-w-md mb-8">
                Get started by creating your first domain. Add a chatbot to your website in just a few clicks.
            </p>

            <button
                onClick={onCreateClick}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30"
            >
                <Plus size={20} />
                Create Your First Domain
            </button>
        </div>
    );
};