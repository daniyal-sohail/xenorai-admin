"use client";

import { FC, useState, useCallback, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { ILead, LeadFormData } from "./LeadsTypes";

interface EditLeadModalProps {
    isOpen: boolean;
    lead: ILead | null;
    onClose: () => void;
    onSubmit: (id: string, data: LeadFormData) => Promise<void>;
}

export const EditLeadModal: FC<EditLeadModalProps> = ({
    isOpen,
    lead,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<LeadFormData>({
        name: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name || "",
                phone: lead.phone || "",
            });
            setErrors({});
        }
    }, [lead]);

    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        if (formData.name && formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (formData.name && !/^[a-zA-Z\s'-]+$/.test(formData.name)) {
            newErrors.name = "Name can only contain letters, spaces, hyphens and apostrophes";
        }

        if (formData.phone && formData.phone.trim().length < 7) {
            newErrors.phone = "Phone number must be at least 7 characters";
        }

        if (formData.phone && !/^[\d\s+\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = useCallback(
        (field: keyof LeadFormData, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            // Clear error for this field when user starts typing
            if (errors[field]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        },
        [errors]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lead || !validateForm()) return;

        setIsSubmitting(true);
        try {
            const dataToSubmit: LeadFormData = {};

            if (formData.name?.trim()) {
                dataToSubmit.name = formData.name.trim();
            }

            if (formData.phone?.trim()) {
                dataToSubmit.phone = formData.phone.trim();
            }

            await onSubmit(lead._id, dataToSubmit);
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !lead) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Lead</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="email"
                                disabled
                                value={lead.email}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Email cannot be modified
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                        )}
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