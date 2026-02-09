"use client";

import { FC, memo, useCallback, useState } from "react";
import { MoreVertical, Copy, Settings, Trash2, Power, Check } from "lucide-react";
import { IDomain } from "./DomainTypes";


interface DomainCardProps {
    domain: IDomain;
    onToggle: (id: string) => void;
    onEdit: (domain: IDomain) => void;
    onDelete: (id: string) => void;
    onViewScript: (domain: IDomain) => void;
}

const DomainCardComponent: FC<DomainCardProps> = ({
    domain,
    onToggle,
    onEdit,
    onDelete,
    onViewScript,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyKey = useCallback(async () => {
        await navigator.clipboard.writeText(domain.domainKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [domain.domainKey]);

    const handleToggle = useCallback(() => {
        onToggle(domain._id);
    }, [domain._id, onToggle]);

    const handleEdit = useCallback(() => {
        onEdit(domain);
        setMenuOpen(false);
    }, [domain, onEdit]);

    const handleDelete = useCallback(() => {
        onDelete(domain._id);
        setMenuOpen(false);
    }, [domain._id, onDelete]);

    const handleViewScript = useCallback(() => {
        onViewScript(domain);
        setMenuOpen(false);
    }, [domain, onViewScript]);

    return (
        <div className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${domain.botEnabled
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {domain.botEnabled ? "Active" : "Disabled"}
                </span>

                {/* Menu Button */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MoreVertical size={18} className="text-gray-600" />
                    </button>

                    {menuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setMenuOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                >
                                    <Settings size={16} />
                                    Edit Settings
                                </button>
                                <button
                                    onClick={handleViewScript}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                >
                                    <Copy size={16} />
                                    View Script
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={16} />
                                    Delete Domain
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bot Avatar & Name */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {domain.botAvatar ? (
                        <img
                            src={domain.botAvatar}
                            alt={domain.botName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        domain.botName.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {domain.botName}
                    </h3>
                    <p className="text-sm text-gray-500">{domain.domainName}</p>
                </div>
            </div>

            {/* Domain Info */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Domain Key</span>
                    <button
                        onClick={handleCopyKey}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        {copied ? (
                            <>
                                <Check size={14} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={14} />
                                Copy
                            </>
                        )}
                    </button>
                </div>
                <code className="block text-xs bg-gray-50 px-3 py-2 rounded-lg text-gray-700 font-mono break-all">
                    {domain.domainKey}
                </code>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                    {domain.tone}
                </span>
                <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                    {domain.industryType}
                </span>
            </div>

            {/* Toggle Button */}
            <button
                onClick={handleToggle}
                className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${domain.botEnabled
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                    }`}
            >
                <Power size={16} />
                {domain.botEnabled ? "Disable Bot" : "Enable Bot"}
            </button>
        </div>
    );
};

export const DomainCard = memo(DomainCardComponent);