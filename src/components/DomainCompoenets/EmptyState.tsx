"use client";

import { FC } from "react";
import { Globe, Plus } from "lucide-react";

interface EmptyStateProps {
    onCreateClick: () => void;
}

export const EmptyState: FC<EmptyStateProps> = ({ onCreateClick }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            {/* Glow orb */}
            <div
                className="flex items-center justify-center mb-6"
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(249,117,24,0.12) 0%, transparent 70%)",
                    border: "1px solid rgba(249,117,24,0.15)",
                    boxShadow: "0 0 40px rgba(249,117,24,0.12)",
                }}
            >
                <Globe size={40} style={{ color: "#f97518" }} />
            </div>

            <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "#f0f0f5" }}>
                No Domains Yet
            </h3>
            <p className="text-sm max-w-xs leading-relaxed mb-8" style={{ color: "#6b6b80" }}>
                Create your first domain to start deploying intelligent chatbots on your websites.
            </p>

            <button
                onClick={onCreateClick}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                    background: "linear-gradient(135deg, #f97518, #ea5a00)",
                    boxShadow: "0 4px 24px rgba(249,117,24,0.3)",
                }}
            >
                <Plus size={16} />
                Create Your First Domain
            </button>
        </div>
    );
};