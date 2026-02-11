"use client";

import { FC, memo, useCallback, useState } from "react";
import {
    Copy, Check, Settings, Trash2, Power, Code2, ExternalLink, MoreVertical,
} from "lucide-react";
import { IDomain } from "./DomainTypes";

interface DomainTableProps {
    domains: IDomain[];
    onToggle: (id: string) => void;
    onEdit: (domain: IDomain) => void;
    onDelete: (id: string) => void;
    onViewDetail: (domain: IDomain) => void;
}

const toneStyles: Record<string, string> = {
    professional: "bg-blue-50 text-blue-700",
    friendly: "bg-emerald-50 text-emerald-700",
    salesy: "bg-amber-50 text-amber-700",
};

const industryEmoji: Record<string, string> = {
    ecommerce: "🛍️",
    services: "🔧",
    saas: "💻",
    other: "🌐",
};

// ── Row component ──────────────────────────────────────────────────────────────
const DomainRow: FC<{
    domain: IDomain;
    onToggle: (id: string) => void;
    onEdit: (domain: IDomain) => void;
    onDelete: (id: string) => void;
    onViewDetail: (domain: IDomain) => void;
}> = ({ domain, onToggle, onEdit, onDelete, onViewDetail }) => {
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const copyKey = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(domain.domainKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [domain.domainKey]);

    return (
        <tr
            onClick={() => onViewDetail(domain)}
            className="group border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--surface-muted))]/60 cursor-pointer transition-colors"
        >
            {/* Bot + domain name */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold ${domain.botEnabled
                                ? "bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] text-white"
                                : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))] border border-[rgb(var(--border))]"
                            }`}
                    >
                        {domain.botAvatar ? (
                            <img src={domain.botAvatar} alt="" className="w-full h-full rounded-xl object-cover" />
                        ) : (
                            domain.botName.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-[rgb(var(--foreground))] truncate leading-tight">
                            {domain.botName}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <ExternalLink size={10} className="text-[rgb(var(--text-muted))] flex-shrink-0" />
                            <p className="text-xs text-[rgb(var(--text-muted))] truncate">{domain.domainName}</p>
                        </div>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5">
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${domain.botEnabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))]"
                        }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${domain.botEnabled ? "bg-emerald-500" : "bg-gray-400"}`}
                    />
                    {domain.botEnabled ? "Active" : "Inactive"}
                </span>
            </td>

            {/* Tone */}
            <td className="px-4 py-3.5 hidden sm:table-cell">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${toneStyles[domain.tone] || "bg-gray-100 text-gray-600"}`}>
                    {domain.tone}
                </span>
            </td>

            {/* Industry */}
            <td className="px-4 py-3.5 hidden md:table-cell">
                <span className="text-sm text-[rgb(var(--text-muted))] capitalize">
                    {industryEmoji[domain.industryType] || "🌐"} {domain.industryType}
                </span>
            </td>

            {/* Domain key (truncated + copy) */}
            <td className="px-4 py-3.5 hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 max-w-[180px]">
                    <code className="text-xs font-mono text-[rgb(var(--text-muted))] truncate">
                        {domain.domainKey}
                    </code>
                    <button
                        onClick={copyKey}
                        className={`flex-shrink-0 p-1 rounded-md transition-colors ${copied ? "text-emerald-600" : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--primary))]"
                            }`}
                    >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                    {/* Toggle */}
                    <button
                        onClick={() => onToggle(domain._id)}
                        title={domain.botEnabled ? "Disable" : "Enable"}
                        className={`p-2 rounded-lg transition-colors ${domain.botEnabled
                                ? "text-[rgb(var(--text-muted))] hover:bg-red-50 hover:text-red-500"
                                : "text-[rgb(var(--text-muted))] hover:bg-emerald-50 hover:text-emerald-600"
                            }`}
                    >
                        <Power size={15} />
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => onEdit(domain)}
                        title="Edit"
                        className="p-2 rounded-lg text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))] transition-colors"
                    >
                        <Settings size={15} />
                    </button>

                    {/* View detail */}
                    <button
                        onClick={() => onViewDetail(domain)}
                        title="View details"
                        className="p-2 rounded-lg text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--primary))] transition-colors"
                    >
                        <Code2 size={15} />
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => onDelete(domain._id)}
                        title="Delete"
                        className="p-2 rounded-lg text-[rgb(var(--text-muted))] hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

// ── Table wrapper ──────────────────────────────────────────────────────────────
const DomainTableComponent: FC<DomainTableProps> = ({
    domains,
    onToggle,
    onEdit,
    onDelete,
    onViewDetail,
}) => {
    return (
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-muted))]/50">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide">
                                Bot / Domain
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide hidden sm:table-cell">
                                Tone
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide hidden md:table-cell">
                                Industry
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide hidden lg:table-cell">
                                Domain Key
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {domains.map((domain) => (
                            <DomainRow
                                key={domain._id}
                                domain={domain}
                                onToggle={onToggle}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewDetail={onViewDetail}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const DomainTable = memo(DomainTableComponent);