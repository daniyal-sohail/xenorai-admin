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
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Globe className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-orange-900 mb-1">
                            No Domains Found
                        </h3>
                        <p className="text-orange-700 text-sm">
                            You don't have any domains yet. Create a domain first to start collecting leads.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Domain
            </label>
            <div className="relative">
                <Globe
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                />
                <select
                    value={selectedDomainId || ""}
                    onChange={(e) => onDomainChange(e.target.value)}
                    className="appearance-none w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white cursor-pointer font-medium transition-all"
                >
                    <option value="">All Domains</option>
                    {domains.map((domain) => (
                        <option key={domain._id} value={domain._id}>
                            {domain.domainName} - {domain.botName}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
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