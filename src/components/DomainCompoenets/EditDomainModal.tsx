"use client";

import { FC, useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { IDomain, ToneType, IndustryType } from "./DomainTypes";


interface EditDomainModalProps {
    isOpen: boolean;
    domain: IDomain | null;
    onClose: () => void;
    onSubmit: (id: string, data: UpdateDomainData) => Promise<void>;
}

export interface UpdateDomainData {
    botName?: string;
    botAvatar?: string | null;
    tone?: ToneType;
    fallbackMessage?: string;
    companyDescription?: string;
    industryType?: IndustryType;
}

export const EditDomainModal: FC<EditDomainModalProps> = ({
    isOpen,
    domain,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<UpdateDomainData>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (domain) {
            setFormData({
                botName: domain.botName,
                botAvatar: domain.botAvatar || "",
                tone: domain.tone,
                fallbackMessage: domain.fallbackMessage,
                companyDescription: domain.companyDescription || "",
                industryType: domain.industryType,
            });
        }
    }, [domain]);

    const handleChange = useCallback(
        (field: keyof UpdateDomainData, value: any) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domain) return;

        setIsSubmitting(true);
        try {
            await onSubmit(domain._id, formData);
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !domain) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Domain</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Domain Name (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domain Name
                        </label>
                        <input
                            type="text"
                            disabled
                            value={domain.domainName}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Bot Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bot Name
                        </label>
                        <input
                            type="text"
                            placeholder="Customer Support Bot"
                            value={formData.botName || ""}
                            onChange={(e) => handleChange("botName", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Bot Avatar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bot Avatar URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/avatar.png"
                            value={formData.botAvatar || ""}
                            onChange={(e) => handleChange("botAvatar", e.target.value || null)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Tone & Industry */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tone
                            </label>
                            <select
                                value={formData.tone || "friendly"}
                                onChange={(e) => handleChange("tone", e.target.value as ToneType)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                            >
                                <option value="professional">Professional</option>
                                <option value="friendly">Friendly</option>
                                <option value="salesy">Salesy</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry Type
                            </label>
                            <select
                                value={formData.industryType || "other"}
                                onChange={(e) =>
                                    handleChange("industryType", e.target.value as IndustryType)
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                            >
                                <option value="ecommerce">E-commerce</option>
                                <option value="services">Services</option>
                                <option value="saas">SaaS</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Company Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Tell us about your company..."
                            value={formData.companyDescription || ""}
                            onChange={(e) => handleChange("companyDescription", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Fallback Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fallback Message
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Message when bot can't understand..."
                            value={formData.fallbackMessage || ""}
                            onChange={(e) => handleChange("fallbackMessage", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};