"use client";

import { FC, useState, useCallback, useEffect } from "react";
import { X, Save, Mail, User, Phone } from "lucide-react";
import { ILead, LeadFormData } from "./LeadsTypes";

interface EditLeadModalProps {
    isOpen: boolean;
    lead: ILead | null;
    onClose: () => void;
    onSubmit: (id: string, data: LeadFormData) => Promise<void>;
}

const labelCls = "block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-500";

const inputCls =
    "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)] hover:border-gray-300";

const errorInputCls =
    "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none bg-red-50 border border-red-300 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100";

export const EditLeadModal: FC<EditLeadModalProps> = ({
    isOpen,
    lead,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<LeadFormData>({ name: "", phone: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (lead) {
            setFormData({ name: lead.name || "", phone: lead.phone || "" });
            setErrors({});
            setFormError(null);
        }
    }, [lead]);

    const validate = useCallback(() => {
        const e: Record<string, string> = {};
        if (formData.name && formData.name.trim().length < 2) e.name = "Name must be at least 2 characters";
        if (formData.name && !/^[a-zA-Z\s'-]+$/.test(formData.name)) e.name = "Name can only contain letters, spaces, hyphens and apostrophes";
        if (formData.phone && formData.phone.trim().length < 7) e.phone = "Phone number must be at least 7 characters";
        if (formData.phone && !/^[\d\s+\-\(\)]+$/.test(formData.phone)) e.phone = "Please enter a valid phone number";
        setErrors(e);
        return Object.keys(e).length === 0;
    }, [formData]);

    const handleChange = useCallback(
        (field: keyof LeadFormData, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
            if (formError) setFormError(null);
        },
        [errors, formError]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lead || !validate()) return;
        setIsSubmitting(true);
        try {
            const dataToSubmit: LeadFormData = {};
            if (formData.name?.trim()) dataToSubmit.name = formData.name.trim();
            if (formData.phone?.trim()) dataToSubmit.phone = formData.phone.trim();
            if (Object.keys(dataToSubmit).length === 0) {
                setFormError("Please update at least one field before saving.");
                return;
            }
            await onSubmit(lead._id, dataToSubmit);
            onClose();
        } catch {
            // handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !lead) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
        >
            <div
                className="w-full sm:rounded-2xl sm:max-w-md max-h-[95vh] flex flex-col overflow-hidden bg-white"
                style={{ border: "1px solid #e5e7eb", boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}
            >
                {/* Top orange line */}
                <div style={{ background: "linear-gradient(90deg, transparent, #f97518, transparent)", height: 2, flexShrink: 0 }} />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.2)" }}
                        >
                            <Save size={14} style={{ color: "#f97518" }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold tracking-tight text-gray-900">Edit Lead</h2>
                            <p className="text-[11px] text-gray-500 truncate max-w-[200px]">{lead.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all"
                    >
                        <X size={13} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
                    {/* Email (read-only) */}
                    <div>
                        <label className={labelCls}>Email Address</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="email"
                                disabled
                                value={lead.email}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 ml-0.5">Email cannot be modified</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelCls}>Full Name <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                        <div className="relative">
                            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={errors.name ? errorInputCls : inputCls}
                            />
                        </div>
                        {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={labelCls}>Phone Number <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={errors.phone ? errorInputCls : inputCls}
                            />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.phone}</p>}
                    </div>

                    {formError && (
                        <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                            <p className="text-xs text-red-600 font-medium">{formError}</p>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0 border-t border-gray-100 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)", boxShadow: "0 4px 16px rgba(249,117,24,0.25)" }}
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
                </div>
            </div>
        </div>
    );
};