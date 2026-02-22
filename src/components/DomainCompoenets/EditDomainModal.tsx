"use client";

import { FC, useState, useCallback, useEffect, useRef } from "react";
import { X, Save, ChevronRight, ChevronLeft, Upload, Trash2 } from "lucide-react";
import { IDomain, ToneType, IndustryType } from "./DomainTypes";

interface EditDomainModalProps {
    isOpen: boolean;
    domain: IDomain | null;
    onClose: () => void;
    onSubmit: (id: string, data: UpdateDomainData) => Promise<void>;
}

export interface UpdateDomainData {
    botName?: string;
    botAvatar?: File | null;
    tone?: ToneType;
    fallbackMessage?: string;
    companyDescription?: string;
    industryType?: IndustryType;
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

const inputClass =
    "w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97518]/20 focus:border-[#f97518] transition-all";

const textareaClass =
    "w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97518]/20 focus:border-[#f97518] transition-all resize-none";

const labelClass =
    "block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-[#6b7280]";

export const EditDomainModal: FC<EditDomainModalProps> = ({
    isOpen,
    domain,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<UpdateDomainData>({});
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (domain) {
            setFormData({
                botName: domain.botName,
                botAvatar: undefined,
                tone: domain.tone,
                fallbackMessage: domain.fallbackMessage,
                companyDescription: domain.companyDescription || "",
                industryType: domain.industryType,
            });
            setExistingAvatarUrl(domain.botAvatar || null);
            setPreviewUrl(null);
            setStep(0);
        }
    }, [domain]);

    const handleChange = useCallback(
        (field: keyof UpdateDomainData, value: any) =>
            setFormData((prev) => ({ ...prev, [field]: value })),
        []
    );

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleChange("botAvatar", file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setExistingAvatarUrl(null); // Clear existing when new file is selected
        }
    }, [handleChange]);

    const handleRemoveFile = useCallback(() => {
        handleChange("botAvatar", null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setExistingAvatarUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [handleChange, previewUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domain) return;
        setIsSubmitting(true);
        try {
            await onSubmit(domain._id, formData);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            onClose();
        } catch {
            // handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !domain) return null;

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
                            <Save size={13} style={{ color: "#f97518" }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-[#111827]">Edit Domain</h2>
                            <p className="text-[11px] text-[#6b7280] mt-0.5 font-mono">{domain.domainName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
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
                            {/* Domain Name — read only */}
                            <div>
                                <label className={labelClass}>Domain Name</label>
                                <div
                                    className="w-full px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
                                    style={{
                                        background: "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                        color: "#374151",
                                    }}
                                >
                                    <span className="font-mono">{domain.domainName}</span>
                                    <span
                                        className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md ml-auto"
                                        style={{
                                            background: "#ffffff",
                                            color: "#9ca3af",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        Read-only
                                    </span>
                                </div>
                            </div>

                            {/* Bot Name */}
                            <div>
                                <label className={labelClass}>Bot Name</label>
                                <input
                                    type="text"
                                    placeholder="Customer Support Bot"
                                    value={formData.botName || ""}
                                    onChange={(e) => handleChange("botName", e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Bot Avatar */}
                            <div>
                                <label className={labelClass}>
                                    Bot Avatar{" "}
                                    <span className="text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                                </label>

                                {(previewUrl || existingAvatarUrl) ? (
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                                            style={{ border: "2px solid #e5e7eb" }}
                                        >
                                            <img
                                                src={previewUrl || existingAvatarUrl || ""}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 text-sm text-[#6b7280]">
                                            {previewUrl ? formData.botAvatar instanceof File ? formData.botAvatar.name : "New image" : "Current avatar"}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                            style={{ color: "#ef4444" }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="botAvatarEdit"
                                        />
                                        <label
                                            htmlFor="botAvatarEdit"
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm text-[#6b7280] hover:border-[#f97518] hover:bg-[#fff5ed] transition-all cursor-pointer"
                                        >
                                            <Upload size={16} />
                                            Choose Image
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Industry */}
                            <div>
                                <label className={labelClass}>Industry</label>
                                <div className="flex flex-wrap gap-2">
                                    {INDUSTRIES.map((i) => (
                                        <button
                                            key={i.value}
                                            type="button"
                                            onClick={() => handleChange("industryType", i.value)}
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
                                            onClick={() => handleChange("tone", t.value)}
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

                            {/* Company Description */}
                            <div>
                                <label className={labelClass}>
                                    Company Description{" "}
                                    <span className="text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Tell us about your company…"
                                    value={formData.companyDescription || ""}
                                    onChange={(e) => handleChange("companyDescription", e.target.value)}
                                    className={textareaClass}
                                />
                            </div>

                            {/* Fallback Message */}
                            <div>
                                <label className={labelClass}>Fallback Message</label>
                                <textarea
                                    rows={3}
                                    placeholder="Message when bot can't understand…"
                                    value={formData.fallbackMessage || ""}
                                    onChange={(e) => handleChange("fallbackMessage", e.target.value)}
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
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#f3f4f6]"
                                style={{ border: "1px solid #e5e7eb", color: "#374151" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
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
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Save size={14} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};