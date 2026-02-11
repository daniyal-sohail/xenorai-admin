"use client";

import { FC, useState, useCallback, useEffect } from "react";
import { X, Mail, User, Phone } from "lucide-react";
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
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name || "",
                phone: lead.phone || "",
            });
            setErrors({});
            setFormError(null);
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
            if (errors[field]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
            if (formError) {
                setFormError(null);
            }
        },
        [errors, formError]
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

            if (Object.keys(dataToSubmit).length === 0) {
                setFormError("Please update at least one field before saving.");
                return;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-slide-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Edit Lead</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="email"
                                disabled
                                value={lead.email}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Email cannot be modified
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.name
                                    ? "border-red-500 focus:ring-red-100"
                                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                                    }`}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-2">{errors.name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.phone
                                    ? "border-red-500 focus:ring-red-100"
                                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                                    }`}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-xs text-red-600 mt-2">{errors.phone}</p>
                        )}
                    </div>

                    {formError && (
                        <p className="text-xs text-red-600">{formError}</p>
                    )}

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
                            className="flex-1 px-6 py-3 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            style={{ background: "rgb(var(--primary))" }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.background = "rgb(var(--primary-hover))";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgb(var(--primary))";
                            }}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};