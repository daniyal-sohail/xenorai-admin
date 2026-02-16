"use client";

import { FC, useState, useCallback } from "react";
import { X, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
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

const inputClass =
    "w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97518]/20 focus:border-[#f97518] transition-all";

const textareaClass =
    "w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97518]/20 focus:border-[#f97518] transition-all resize-none";

const labelClass =
    "block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-[#6b7280]";

export const CreateDomainModal: FC<CreateDomainModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<DomainFormData>(DEFAULT);
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const set = useCallback(
        (field: keyof DomainFormData, value: any) =>
            setFormData((prev) => ({ ...prev, [field]: value })),
        []
    );

    const handleClose = () => {
        setFormData(DEFAULT);
        setStep(0);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData(DEFAULT);
            setStep(0);
            onClose();
        } catch {
            // handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const step1Valid = formData.domainName.trim() && formData.botName.trim();

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        >
            <div
                className="w-full sm:rounded-2xl sm:max-w-xl flex flex-col overflow-hidden"
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 25px 80px rgba(0,0,0,0.15), 0 0 60px rgba(249,117,24,0.08)",
                    maxHeight: "92vh",
                }}
            >
                {/* Top accent line */}
                <div style={{ background: "linear-gradient(90deg, transparent, #f97518, transparent)", height: 2, flexShrink: 0 }} />

                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: "rgba(249,117,24,0.1)" }}
                        >
                            <Sparkles size={13} style={{ color: "#f97518" }} />
                        </div>
                        <h2 className="text-sm font-bold text-[#111827]">New Domain</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[#f3f4f6]"
                        style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}
                    >
                        <X size={13} />
                    </button>
                </div>

                {/* Step Indicator */}
                <div
                    className="flex items-center gap-2 px-6 py-2.5 flex-shrink-0"
                    style={{ borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}
                >
                    {/* Step 1 */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                            style={
                                step > 0
                                    ? { background: "#f97518", color: "#fff" }
                                    : { background: "rgba(249,117,24,0.12)", color: "#f97518", boxShadow: "0 0 0 2px #f97518" }
                            }
                        >
                            {step > 0 ? "✓" : "1"}
                        </div>
                        <span
                            className="text-[11px] font-semibold"
                            style={{ color: step > 0 ? "#6b7280" : "#f97518" }}
                        >
                            Identity
                        </span>
                    </div>

                    {/* Connector */}
                    <div className="flex-1 h-px" style={{ background: step > 0 ? "#f97518" : "#e5e7eb" }} />

                    {/* Step 2 */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                            style={
                                step === 1
                                    ? { background: "rgba(249,117,24,0.12)", color: "#f97518", boxShadow: "0 0 0 2px #f97518" }
                                    : { background: "#e5e7eb", color: "#9ca3af" }
                            }
                        >
                            2
                        </div>
                        <span
                            className="text-[11px] font-semibold"
                            style={{ color: step === 1 ? "#f97518" : "#9ca3af" }}
                        >
                            Behaviour
                        </span>
                    </div>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto flex-1 px-6 py-5 space-y-5"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
                >
                    {step === 0 ? (
                        <>
                            {/* Domain name */}
                            <div>
                                <label className={labelClass}>
                                    Domain Name <span className="text-red-500 normal-case tracking-normal font-normal">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="example.com"
                                    value={formData.domainName}
                                    onChange={(e) => set("domainName", e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Bot name */}
                            <div>
                                <label className={labelClass}>
                                    Bot Name <span className="text-red-500 normal-case tracking-normal font-normal">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Customer Support Bot"
                                    value={formData.botName}
                                    onChange={(e) => set("botName", e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Bot avatar */}
                            <div>
                                <label className={labelClass}>
                                    Bot Avatar URL{" "}
                                    <span className="text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/avatar.png"
                                    value={formData.botAvatar}
                                    onChange={(e) => set("botAvatar", e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className={labelClass}>Industry</label>
                                <div className="flex flex-wrap gap-2">
                                    {INDUSTRIES.map((i) => (
                                        <button
                                            key={i.value}
                                            type="button"
                                            onClick={() => set("industryType", i.value)}
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                                            style={
                                                formData.industryType === i.value
                                                    ? {
                                                        background: "#f97518",
                                                        color: "#ffffff",
                                                        border: "1px solid #f97518",
                                                        boxShadow: "0 0 16px rgba(249,117,24,0.25)",
                                                    }
                                                    : {
                                                        background: "#f9fafb",
                                                        color: "#111827",
                                                        border: "1px solid #e5e7eb",
                                                    }
                                            }
                                        >
                                            {i.emoji} {i.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Tone */}
                            <div>
                                <label className={labelClass}>Tone</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {TONES.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => set("tone", t.value)}
                                            className="flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all duration-200"
                                            style={
                                                formData.tone === t.value
                                                    ? {
                                                        background: "rgba(249,117,24,0.08)",
                                                        border: "1.5px solid #f97518",
                                                        color: "#f97518",
                                                        boxShadow: "0 0 12px rgba(249,117,24,0.15)",
                                                    }
                                                    : {
                                                        background: "#f9fafb",
                                                        border: "1.5px solid #e5e7eb",
                                                        color: "#111827",
                                                    }
                                            }
                                        >
                                            <span className="text-base">{t.emoji}</span>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Company description */}
                            <div>
                                <label className={labelClass}>
                                    Company Description{" "}
                                    <span className="text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Tell us about your company…"
                                    value={formData.companyDescription}
                                    onChange={(e) => set("companyDescription", e.target.value)}
                                    className={textareaClass}
                                />
                            </div>

                            {/* Fallback message */}
                            <div>
                                <label className={labelClass}>Fallback Message</label>
                                <textarea
                                    rows={3}
                                    value={formData.fallbackMessage}
                                    onChange={(e) => set("fallbackMessage", e.target.value)}
                                    className={textareaClass}
                                />
                            </div>
                        </>
                    )}
                </form>

                {/* Footer */}
                <div
                    className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
                    style={{ borderTop: "1px solid #e5e7eb", background: "#fafafa" }}
                >
                    {step === 0 ? (
                        <>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#f3f4f6]"
                                style={{ border: "1px solid #e5e7eb", color: "#374151" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!step1Valid}
                                onClick={() => setStep(1)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 hover:opacity-90"
                                style={{
                                    background: "linear-gradient(135deg, #f97518, #ea5a00)",
                                    boxShadow: "0 4px 20px rgba(249,117,24,0.25)",
                                }}
                            >
                                Next <ChevronRight size={15} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setStep(0)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#f3f4f6] flex items-center gap-1.5"
                                style={{ border: "1px solid #e5e7eb", color: "#374151" }}
                            >
                                <ChevronLeft size={14} /> Back
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                style={{
                                    background: "linear-gradient(135deg, #f97518, #ea5a00)",
                                    boxShadow: "0 4px 20px rgba(249,117,24,0.25)",
                                }}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};