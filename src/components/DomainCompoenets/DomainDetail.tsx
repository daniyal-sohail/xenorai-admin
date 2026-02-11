"use client";

import { FC, useState, useCallback } from "react";
import {
    ArrowLeft, Copy, Check, Power, Trash2, Settings,
    Globe, Code2, ExternalLink, Activity, MessageSquare, Building2,
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

const toneLabels: Record<string, { label: string; color: string }> = {
    professional: { label: "Professional", color: "bg-blue-50 text-blue-700 border-blue-100" },
    friendly: { label: "Friendly", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    salesy: { label: "Salesy", color: "bg-amber-50 text-amber-700 border-amber-100" },
};

const industryLabels: Record<string, { label: string; emoji: string }> = {
    ecommerce: { label: "E-commerce", emoji: "🛍️" },
    services: { label: "Services", emoji: "🔧" },
    saas: { label: "SaaS", emoji: "💻" },
    other: { label: "Other", emoji: "🌐" },
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

    const tone = toneLabels[domain.tone] || { label: domain.tone, color: "bg-gray-100 text-gray-600 border-gray-200" };
    const industry = industryLabels[domain.industryType] || { label: domain.industryType, emoji: "🌐" };

    return (
        <div className="min-h-screen bg-[rgb(var(--background))]">
            {/* Top nav */}
            <div className="bg-[rgb(var(--surface))] border-b border-[rgb(var(--border))] sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--text-muted))] hover:text-[rgb(var(--foreground))] transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                            Domains
                        </button>
                        <span className="text-[rgb(var(--border))]">/</span>
                        <span className="text-sm font-semibold text-[rgb(var(--foreground))] truncate max-w-[200px]">
                            {domain.domainName}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(domain)}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-[rgb(var(--border))] rounded-xl hover:bg-[rgb(var(--surface-muted))] transition-colors text-[rgb(var(--foreground))]"
                        >
                            <Settings size={14} />
                            Edit
                        </button>
                        <button
                            onClick={() => onToggle(domain._id)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${domain.botEnabled
                                    ? "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))] hover:bg-red-50 hover:text-red-600 border border-[rgb(var(--border))]"
                                    : "bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-hover))] shadow-sm shadow-orange-200"
                                }`}
                        >
                            <Power size={14} />
                            {domain.botEnabled ? "Disable" : "Enable"}
                        </button>
                        <button
                            onClick={() => onDelete(domain._id)}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Hero card */}
                <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
                    {/* Status stripe */}
                    <div
                        className={`h-1.5 ${domain.botEnabled
                                ? "bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--primary-light-1))]"
                                : "bg-[rgb(var(--border))]"
                            }`}
                    />
                    <div className="p-6 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm ${domain.botEnabled
                                        ? "bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))]"
                                        : "bg-[rgb(var(--surface-muted))] border border-[rgb(var(--border))]"
                                    }`}
                            >
                                {domain.botAvatar ? (
                                    <img src={domain.botAvatar} alt={domain.botName} className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                    <span className={domain.botEnabled ? "text-white" : "text-[rgb(var(--text-muted))]"}>
                                        {domain.botName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-[rgb(var(--foreground))]">{domain.botName}</h1>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <ExternalLink size={13} className="text-[rgb(var(--text-muted))]" />
                                    <a
                                        href={`https://${domain.domainName}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--primary))] transition-colors"
                                    >
                                        {domain.domainName}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 mt-2.5">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${domain.botEnabled
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))] border-[rgb(var(--border))]"
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${domain.botEnabled ? "bg-emerald-500" : "bg-gray-400"}`} />
                                        {domain.botEnabled ? "Active" : "Disabled"}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${tone.color}`}>
                                        {tone.label}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[rgb(var(--surface-muted))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))]">
                                        {industry.emoji} {industry.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Domain Key */}
                    <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Globe size={15} className="text-[rgb(var(--primary))]" />
                                <h2 className="text-sm font-semibold text-[rgb(var(--foreground))]">Domain Key</h2>
                            </div>
                            <button
                                onClick={copyKey}
                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${keyCopied
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))] border-[rgb(var(--border))] hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))]"
                                    }`}
                            >
                                {keyCopied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                            </button>
                        </div>
                        <div
                            onClick={copyKey}
                            className="cursor-pointer bg-[rgb(var(--surface-muted))] hover:bg-[rgb(var(--background))] rounded-xl px-4 py-3 transition-colors"
                        >
                            <code className="text-xs font-mono text-[rgb(var(--text-muted))] break-all leading-relaxed">
                                {domain.domainKey}
                            </code>
                        </div>
                    </div>

                    {/* Company info */}
                    <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 size={15} className="text-[rgb(var(--primary))]" />
                            <h2 className="text-sm font-semibold text-[rgb(var(--foreground))]">Company Description</h2>
                        </div>
                        {domain.companyDescription ? (
                            <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed">
                                {domain.companyDescription}
                            </p>
                        ) : (
                            <p className="text-sm text-[rgb(var(--text-muted))] italic">No description provided.</p>
                        )}
                    </div>

                    {/* Fallback message */}
                    <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare size={15} className="text-[rgb(var(--primary))]" />
                            <h2 className="text-sm font-semibold text-[rgb(var(--foreground))]">Fallback Message</h2>
                        </div>
                        <div className="bg-[rgb(var(--surface-muted))] rounded-xl px-4 py-3">
                            <p className="text-sm text-[rgb(var(--foreground))] leading-relaxed">
                                {domain.fallbackMessage}
                            </p>
                        </div>
                    </div>

                    {/* Status overview */}
                    <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity size={15} className="text-[rgb(var(--primary))]" />
                            <h2 className="text-sm font-semibold text-[rgb(var(--foreground))]">Configuration</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))]">
                                <span className="text-xs text-[rgb(var(--text-muted))]">Status</span>
                                <span className={`text-xs font-medium ${domain.botEnabled ? "text-emerald-600" : "text-gray-400"}`}>
                                    {domain.botEnabled ? "Active" : "Disabled"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))]">
                                <span className="text-xs text-[rgb(var(--text-muted))]">Tone</span>
                                <span className="text-xs font-medium text-[rgb(var(--foreground))] capitalize">{domain.tone}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-xs text-[rgb(var(--text-muted))]">Industry</span>
                                <span className="text-xs font-medium text-[rgb(var(--foreground))] capitalize">{domain.industryType}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Installation Script */}
                <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code2 size={15} className="text-[rgb(var(--primary))]" />
                            <h2 className="text-sm font-semibold text-[rgb(var(--foreground))]">Installation Script</h2>
                        </div>
                        <button
                            onClick={copyScript}
                            disabled={!script}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl border transition-all ${scriptCopied
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : "bg-[rgb(var(--primary))] text-white border-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                }`}
                        >
                            {scriptCopied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Script</>}
                        </button>
                    </div>

                    {/* How to install */}
                    <div className="px-6 py-4 bg-[rgb(var(--primary-light-3))] border-b border-[rgb(var(--primary-light-2))]">
                        <p className="text-xs font-semibold text-[rgb(var(--primary))] mb-2">How to install</p>
                        <ol className="text-xs text-[rgb(var(--foreground))] space-y-1 list-decimal list-inside">
                            <li>Copy the script below</li>
                            <li>Paste it into your website's HTML just before the closing <code className="font-mono bg-white/60 px-1 rounded">&lt;/body&gt;</code> tag</li>
                            <li>The chatbot widget will appear in the bottom-right corner of your site</li>
                        </ol>
                    </div>

                    {/* Script block */}
                    <div className="p-6">
                        {script ? (
                            <div
                                onClick={copyScript}
                                className="cursor-pointer group bg-[#0d1117] rounded-xl overflow-x-auto transition-all hover:ring-2 hover:ring-[rgb(var(--primary))]/30"
                            >
                                <pre className="p-5 text-xs font-mono text-[#e6edf3] leading-relaxed whitespace-pre-wrap break-all">
                                    <code>{script}</code>
                                </pre>
                            </div>
                        ) : (
                            <div className="bg-[rgb(var(--surface-muted))] rounded-xl p-6 flex items-center justify-center">
                                <p className="text-sm text-[rgb(var(--text-muted))]">Loading script…</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Danger zone */}
                <div className="bg-[rgb(var(--surface))] border border-red-200 rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-red-600 mb-1">Danger Zone</h2>
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-4">
                        Deleting this domain is irreversible. All chatbot data, conversations, and configurations will be permanently removed.
                    </p>
                    <button
                        onClick={() => onDelete(domain._id)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={14} />
                        Delete this domain
                    </button>
                </div>
            </div>
        </div>
    );
};