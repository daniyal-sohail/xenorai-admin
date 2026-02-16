"use client";

import { FC, memo, useCallback, useState } from "react";
import {
    Copy,
    Check,
    Settings,
    Trash2,
    Power,
    Code2,
    ExternalLink,
} from "lucide-react";
import { IDomain } from "./DomainTypes";

interface DomainTableProps {
    domains: IDomain[];
    onToggle: (id: string) => void;
    onEdit: (domain: IDomain) => void;
    onDelete: (id: string) => void;
    onViewDetail: (domain: IDomain) => void;
}

const toneStyles: Record<string, React.CSSProperties> = {
    professional: {
        background: "rgba(59,130,246,0.08)",
        color: "#2563eb",
        border: "1px solid rgba(59,130,246,0.2)",
    },
    friendly: {
        background: "rgba(16,185,129,0.08)",
        color: "#059669",
        border: "1px solid rgba(16,185,129,0.2)",
    },
    salesy: {
        background: "rgba(245,158,11,0.08)",
        color: "#d97706",
        border: "1px solid rgba(245,158,11,0.2)",
    },
};

const industryEmoji: Record<string, string> = {
    ecommerce: "🛍️",
    services: "🔧",
    saas: "💻",
    other: "🌐",
};

/* ───────────── Action Button ───────────── */

const ActionBtn: FC<{
    onClick: () => void;
    title: string;
    hoverStyle?: React.CSSProperties;
    children: React.ReactNode;
}> = ({ onClick, title, hoverStyle, children }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            title={title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="p-2 rounded-lg transition-all text-gray-400 hover:bg-gray-100"
            style={hovered && hoverStyle ? hoverStyle : {}}
        >
            {children}
        </button>
    );
};

/* ───────────── Row ───────────── */

const DomainRow: FC<{
    domain: IDomain;
    onToggle: (id: string) => void;
    onEdit: (domain: IDomain) => void;
    onDelete: (id: string) => void;
    onViewDetail: (domain: IDomain) => void;
}> = ({ domain, onToggle, onEdit, onDelete, onViewDetail }) => {
    const [copied, setCopied] = useState(false);

    const copyKey = useCallback(
        async (e: React.MouseEvent) => {
            e.stopPropagation();
            await navigator.clipboard.writeText(domain.domainKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        },
        [domain.domainKey]
    );

    const tone = toneStyles[domain.tone];
    const initial = domain.botName.charAt(0).toUpperCase();

    return (
        <tr
            onClick={() => onViewDetail(domain)}
            className="cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
            {/* Bot / Domain */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={
                            domain.botEnabled
                                ? {
                                    background:
                                        "linear-gradient(135deg, #f97518, #ea5a00)",
                                    boxShadow:
                                        "0 0 10px rgba(249,117,24,0.25)",
                                    color: "#fff",
                                }
                                : {
                                    background: "#f3f4f6",
                                    border: "1px solid #e5e7eb",
                                    color: "#6b7280",
                                }
                        }
                    >
                        {domain.botAvatar ? (
                            <img
                                src={domain.botAvatar}
                                alt=""
                                className="w-full h-full rounded-xl object-cover"
                            />
                        ) : (
                            initial
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-gray-900">
                            {domain.botName}
                        </p>

                        <div className="flex items-center gap-1 mt-0.5">
                            <ExternalLink
                                size={10}
                                className="text-gray-400"
                            />
                            <p className="text-xs truncate text-gray-500">
                                {domain.domainName}
                            </p>
                        </div>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5">
                <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={
                        domain.botEnabled
                            ? {
                                background:
                                    "rgba(16,185,129,0.08)",
                                color: "#059669",
                                border:
                                    "1px solid rgba(16,185,129,0.2)",
                            }
                            : {
                                background: "#f3f4f6",
                                color: "#6b7280",
                                border: "1px solid #e5e7eb",
                            }
                    }
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            background: domain.botEnabled
                                ? "#10b981"
                                : "#9ca3af",
                        }}
                    />
                    {domain.botEnabled ? "Active" : "Inactive"}
                </span>
            </td>

            {/* Tone */}
            <td className="px-4 py-3.5 hidden sm:table-cell">
                <span
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                    style={
                        tone || {
                            background: "#f3f4f6",
                            color: "#6b7280",
                            border: "1px solid #e5e7eb",
                        }
                    }
                >
                    {domain.tone}
                </span>
            </td>

            {/* Industry */}
            <td className="px-4 py-3.5 hidden md:table-cell">
                <span className="text-sm capitalize text-gray-500">
                    {industryEmoji[domain.industryType] || "🌐"}{" "}
                    {domain.industryType}
                </span>
            </td>

            {/* Domain Key */}
            <td
                className="px-4 py-3.5 hidden lg:table-cell"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2 max-w-[180px]">
                    <code className="text-xs font-mono truncate text-gray-500">
                        {domain.domainKey}
                    </code>

                    <button
                        onClick={copyKey}
                        className={`flex-shrink-0 p-1 rounded-md transition-colors ${copied
                                ? "text-emerald-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {copied ? (
                            <Check size={12} />
                        ) : (
                            <Copy size={12} />
                        )}
                    </button>
                </div>
            </td>

            {/* Actions */}
            <td
                className="px-4 py-3.5 text-right"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-end gap-1">
                    <ActionBtn
                        onClick={() => onToggle(domain._id)}
                        title={
                            domain.botEnabled
                                ? "Disable"
                                : "Enable"
                        }
                        hoverStyle={
                            domain.botEnabled
                                ? {
                                    color: "#dc2626",
                                    background:
                                        "rgba(220,38,38,0.08)",
                                }
                                : {
                                    color: "#059669",
                                    background:
                                        "rgba(16,185,129,0.08)",
                                }
                        }
                    >
                        <Power size={14} />
                    </ActionBtn>

                    <ActionBtn
                        onClick={() => onEdit(domain)}
                        title="Edit"
                        hoverStyle={{
                            color: "#374151",
                            background: "#f3f4f6",
                        }}
                    >
                        <Settings size={14} />
                    </ActionBtn>

                    <ActionBtn
                        onClick={() => onViewDetail(domain)}
                        title="View details"
                        hoverStyle={{
                            color: "#f97518",
                            background:
                                "rgba(249,117,24,0.08)",
                        }}
                    >
                        <Code2 size={14} />
                    </ActionBtn>

                    <ActionBtn
                        onClick={() => onDelete(domain._id)}
                        title="Delete"
                        hoverStyle={{
                            color: "#dc2626",
                            background:
                                "rgba(220,38,38,0.08)",
                        }}
                    >
                        <Trash2 size={14} />
                    </ActionBtn>
                </div>
            </td>
        </tr>
    );
};

/* ───────────── Table ───────────── */

const DomainTableComponent: FC<
    DomainTableProps
> = ({
    domains,
    onToggle,
    onEdit,
    onDelete,
    onViewDetail,
}) => {
        return (
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {[
                                    {
                                        label: "Bot / Domain",
                                        cls: "px-5",
                                    },
                                    { label: "Status", cls: "px-4" },
                                    {
                                        label: "Tone",
                                        cls: "px-4 hidden sm:table-cell",
                                    },
                                    {
                                        label: "Industry",
                                        cls: "px-4 hidden md:table-cell",
                                    },
                                    {
                                        label: "Domain Key",
                                        cls: "px-4 hidden lg:table-cell",
                                    },
                                    {
                                        label: "Actions",
                                        cls: "px-4 text-right",
                                    },
                                ].map(({ label, cls }) => (
                                    <th
                                        key={label}
                                        className={`${cls} py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500`}
                                    >
                                        {label}
                                    </th>
                                ))}
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

export const DomainTable = memo(
    DomainTableComponent
);
