"use client";

import { FC, useState, useCallback } from "react";
import {
    ArrowLeft,
    Copy,
    Check,
    Power,
    Trash2,
    Settings,
    Globe,
    Code2,
    ExternalLink,
    Activity,
    MessageSquare,
    Building2,
} from "lucide-react";
import { IDomain } from "./DomainTypes";

interface DomainDetailProps {
    domain: IDomain;
    script: string | null;
    onBack: () => void;
    onEdit: (domain: IDomain) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
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

export const DomainDetail: FC<DomainDetailProps> = ({
    domain,
    script,
    onBack,
    onEdit,
    onDelete,
    onToggle,
}) => {
    const [keyCopied, setKeyCopied] = useState(false);
    const [scriptCopied, setScriptCopied] = useState(false);

    const copyKey = useCallback(async () => {
        await navigator.clipboard.writeText(domain.domainKey);
        setKeyCopied(true);
        setTimeout(() => setKeyCopied(false), 2000);
    }, [domain.domainKey]);

    const copyScript = useCallback(async () => {
        if (!script) return;
        await navigator.clipboard.writeText(script);
        setScriptCopied(true);
        setTimeout(() => setScriptCopied(false), 2000);
    }, [script]);

    const tone = toneStyles[domain.tone];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
                        >
                            <ArrowLeft size={14} />
                            Domains
                        </button>

                        <span className="text-gray-300">/</span>

                        <span className="text-sm font-semibold text-gray-800 truncate max-w-[220px]">
                            {domain.domainName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(domain)}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition"
                        >
                            <Settings size={14} />
                            Edit
                        </button>

                        <button
                            onClick={() => onToggle(domain._id)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition ${domain.botEnabled
                                    ? "border border-gray-200 text-gray-600 bg-white hover:bg-gray-100"
                                    : "bg-[#f97518] text-white shadow-sm hover:opacity-90"
                                }`}
                        >
                            <Power size={14} />
                            {domain.botEnabled ? "Disable" : "Enable"}
                        </button>

                        <button
                            onClick={() => onDelete(domain._id)}
                            className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
                {/* Hero Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex gap-5">
                    <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${domain.botEnabled
                                ? "bg-gradient-to-br from-[#f97518] to-[#ea5a00] text-white shadow-md"
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                    >
                        {domain.botName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {domain.botName}
                        </h1>

                        <div className="flex items-center gap-2 mt-1">
                            <ExternalLink size={13} className="text-gray-400" />
                            <a
                                href={`https://${domain.domainName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-500 hover:text-[#f97518] transition"
                            >
                                {domain.domainName}
                            </a>
                        </div>

                        <div className="flex gap-2 mt-4 flex-wrap">
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${domain.botEnabled
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : "bg-gray-100 text-gray-500 border border-gray-200"
                                    }`}
                            >
                                {domain.botEnabled ? "Active" : "Disabled"}
                            </span>

                            <span
                                className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
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
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Domain Key */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-800">
                                Domain Key
                            </h2>

                            <button
                                onClick={copyKey}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${keyCopied
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {keyCopied ? <Check size={12} /> : <Copy size={12} />}
                                {keyCopied ? "Copied" : "Copy"}
                            </button>
                        </div>

                        <code className="block bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-600 break-all">
                            {domain.domainKey}
                        </code>
                    </div>

                    {/* Company Description */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-sm font-semibold text-gray-800 mb-4">
                            Company Description
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {domain.companyDescription || (
                                <span className="italic text-gray-400">
                                    No description provided.
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Installation Script */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-gray-800">
                            Installation Script
                        </h2>

                        <button
                            onClick={copyScript}
                            disabled={!script}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition ${scriptCopied
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "bg-[#f97518] text-white hover:opacity-90"
                                }`}
                        >
                            {scriptCopied ? <Check size={12} /> : <Copy size={12} />}
                            {scriptCopied ? "Copied!" : "Copy Script"}
                        </button>
                    </div>

                    <div className="p-6">
                        {script ? (
                            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap break-all">
                                {script}
                            </pre>
                        ) : (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                Loading script…
                            </div>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl border border-red-200 p-6">
                    <h2 className="text-sm font-semibold text-red-600 mb-2">
                        Danger Zone
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Deleting this domain is irreversible.
                    </p>
                    <button
                        onClick={() => onDelete(domain._id)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
                    >
                        <Trash2 size={14} />
                        Delete this domain
                    </button>
                </div>
            </div>
        </div>
    );
};
