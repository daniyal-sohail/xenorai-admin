"use client";

import { FC, useState, useCallback } from "react";
import { X, Sparkles } from "lucide-react";
import { ToneType, IndustryType } from "./DomainTypes";

interface CreateDomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DomainFormData) => Promise<void>;
}

export interface DomainFormData {
    domainName: string;
    botName: string;
    botAvatar?: string;
    tone: ToneType;
    fallbackMessage: string;
    companyDescription?: string;
    industryType: IndustryType;
}

const TONES: { value: ToneType; label: string; emoji: string }[] = [
    { value: "professional", label: "Professional", emoji: "👔" },
    { value: "friendly", label: "Friendly", emoji: "😊" },
    { value: "salesy", label: "Salesy", emoji: "🚀" },
];

const INDUSTRIES: { value: IndustryType; label: string; emoji: string }[] = [
    { value: "ecommerce", label: "E-commerce", emoji: "🛍️" },
    { value: "services", label: "Services", emoji: "🔧" },
    { value: "saas", label: "SaaS", emoji: "💻" },
    { value: "other", label: "Other", emoji: "🌐" },
];

const DEFAULT: DomainFormData = {
    domainName: "",
    botName: "",
    botAvatar: "",
    tone: "friendly",
    fallbackMessage: "Sorry, I couldn't understand that. Could you please rephrase?",
    companyDescription: "",
    industryType: "other",
};

export const CreateDomainModal: FC<CreateDomainModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<DomainFormData>(DEFAULT);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const set = useCallback(
        (field: keyof DomainFormData, value: any) =>
            setFormData((prev) => ({ ...prev, [field]: value })),
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData(DEFAULT);
            onClose();
        } catch {
            // handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[rgb(var(--surface))] w-full sm:rounded-2xl sm:max-w-xl max-h-[95vh] sm:max-h-[88vh] flex flex-col shadow-2xl animate-slide-in overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--border))] flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[rgb(var(--primary-light-3))] flex items-center justify-center">
                            <Sparkles size={13} className="text-[rgb(var(--primary))]" />
                        </div>
                        <h2 className="text-base font-bold text-[rgb(var(--foreground))]">New Domain</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-[rgb(var(--surface-muted))] rounded-lg transition-colors"
                    >
                        <X size={16} className="text-[rgb(var(--text-muted))]" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                    {/* Domain name */}
                    <div>
                        <label className="block text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide mb-1.5">
                            Domain Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="example.com"
                            value={formData.domainName}
                            onChange={(e) => set("domainName", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[rgb(var(--surface-muted))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/25 focus:border-[rgb(var(--primary))] transition-all"
                        />
                    </div>

                    {/* Bot name */}
                    <div>
                        <label className="block text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide mb-1.5">
                            Bot Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Customer Support Bot"
                            value={formData.botName}
                            onChange={(e) => set("botName", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[rgb(var(--surface-muted))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/25 focus:border-[rgb(var(--primary))] transition-all"
                        />
                    </div>

                    {/* Bot avatar */}
                    <div>
                        <label className="block text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide mb-1.5">
                            Bot Avatar URL <span className="text-[rgb(var(--text-muted))] font-normal normal-case">(optional)</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/avatar.png"
                            value={formData.botAvatar}
                            onChange={(e) => set("botAvatar", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[rgb(var(--surface-muted))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/25 focus:border-[rgb(var(--primary))] transition-all"
                        />
                    </div>

                    {/* Tone */}
                    <div>
                        <label className="block text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide mb-2">
                            Tone
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {TONES.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => set("tone", t.value)}
                                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.tone === t.value
                                            ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary-light-3))] text-[rgb(var(--primary))]"
                                            : "border-[rgb(var(--border))] bg-[rgb(var(--surface-muted))] text-[rgb(var(--foreground))] hover:border-[rgb(var(--primary))]/40"
                                        }`}
                                >
                                    <span>{t.emoji}</span>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide mb-2">
                            Industry
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {INDUSTRIES.map((i) => (
                                <button
                                    key={i.value}
                                    type="button"
                                    onClick={() => set("industryType", i.value)}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${formData.industryType === i.value
                                            ? "bg-[rgb(var(--primary))] text-white border-[rgb(var(--primary))] shadow-sm"
                                            : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--foreground))] border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/40"
                                        }`}
                                >
                                    {i.emoji} {i.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Company description */}
                    <div>
                        <label className="block text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide mb-1.5">
                            Company Description <span className="text-[rgb(var(--text-muted))] font-normal normal-case">(optional)</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Tell us about your company…"
                            value={formData.companyDescription}
                            onChange={(e) => set("companyDescription", e.target.value)}
                            className="w-full px-4 py-3 bg-[rgb(var(--surface-muted))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/25 focus:border-[rgb(var(--primary))] transition-all resize-none"
                        />
                    </div>

                    {/* Fallback message */}
                    <div>
                        <label className="block text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wide mb-1.5">
                            Fallback Message
                        </label>
                        <textarea
                            rows={2}
                            value={formData.fallbackMessage}
                            onChange={(e) => set("fallbackMessage", e.target.value)}
                            className="w-full px-4 py-3 bg-[rgb(var(--surface-muted))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/25 focus:border-[rgb(var(--primary))] transition-all resize-none"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-4 border-t border-[rgb(var(--border))] flex-shrink-0 bg-[rgb(var(--surface))]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border border-[rgb(var(--border))] rounded-xl text-sm font-medium text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-muted))] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-orange-200/50"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating…
                            </>
                        ) : (
                            "Create Domain"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};