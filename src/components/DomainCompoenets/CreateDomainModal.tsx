"use client";

import { FC, useState, useCallback } from "react";
import { X } from "lucide-react";
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

export const CreateDomainModal: FC<CreateDomainModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<DomainFormData>({
        domainName: "",
        botName: "",
        botAvatar: "",
        tone: "friendly",
        fallbackMessage: "Sorry, I couldn't understand that. Could you please rephrase?",
        companyDescription: "",
        industryType: "other",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        (field: keyof DomainFormData, value: any) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({
                domainName: "",
                botName: "",
                botAvatar: "",
                tone: "friendly",
                fallbackMessage: "Sorry, I couldn't understand that. Could you please rephrase?",
                companyDescription: "",
                industryType: "other",
            });
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Domain</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Domain Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domain Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="example.com"
                            value={formData.domainName}
                            onChange={(e) => handleChange("domainName", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Bot Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bot Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Customer Support Bot"
                            value={formData.botName}
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
                            value={formData.botAvatar}
                            onChange={(e) => handleChange("botAvatar", e.target.value)}
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
                                value={formData.tone}
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
                                value={formData.industryType}
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
                            value={formData.companyDescription}
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
                            value={formData.fallbackMessage}
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
                            {isSubmitting ? "Creating..." : "Create Domain"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};