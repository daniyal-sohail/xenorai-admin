"use client";

import { FC, memo } from "react";
import { Globe } from "lucide-react";
import { IDomain } from "@/api/DomainApi";

interface DomainSelectorProps {
    domains: IDomain[];
    selectedDomainId: string | null;
    onDomainChange: (domainId: string) => void;
}

const DomainSelectorComponent: FC<DomainSelectorProps> = ({
    domains,
    selectedDomainId,
    onDomainChange,
}) => {
    if (domains.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                    You don't have any domains yet. Create a domain first to start collecting leads.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Domain
            </label>
            <div className="relative">
                <Globe
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                />
                <select
                    value={selectedDomainId || ""}
                    onChange={(e) => onDomainChange(e.target.value)}
                    className="appearance-none w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer font-medium"
                >
                    <option value="">All Domains</option>
                    {domains.map((domain) => (
                        <option key={domain._id} value={domain._id}>
                            {domain.domainName} - {domain.botName}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export const DomainSelector = memo(DomainSelectorComponent);