"use client";

import { FC, useState, useCallback, useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { ProductFormData } from "./ProductTypes";

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => Promise<void>;
}

export const CreateProductModal: FC<CreateProductModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        category: "",
        checkoutLink: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (field: keyof ProductFormData, value: any) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            // Clear error for this field
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

    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setErrors((prev) => ({
                        ...prev,
                        image: "Image size must be less than 5MB",
                    }));
                    return;
                }

                // Validate file type
                if (!file.type.startsWith("image/")) {
                    setErrors((prev) => ({
                        ...prev,
                        image: "Please upload a valid image file",
                    }));
                    return;
                }

                handleChange("image", file);

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        [handleChange]
    );

    const removeImage = useCallback(() => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (formData.price <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            // Reset form
            setFormData({
                name: "",
                description: "",
                price: 0,
                category: "",
                checkoutLink: "",
                image: null,
            });
            setImagePreview(null);
            setErrors({});
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
                    <h2 className="text-2xl font-bold text-gray-900">Create Product</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image
                        </label>
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                            >
                                <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                                <p className="text-sm text-gray-600">
                                    Click to upload product image
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG up to 5MB
                                </p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {errors.image && (
                            <p className="text-xs text-red-600 mt-1">{errors.image}</p>
                        )}
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Premium Widget"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Describe your product..."
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Price & Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="99.99"
                                value={formData.price || ""}
                                onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.price ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.price && (
                                <p className="text-xs text-red-600 mt-1">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                placeholder="Electronics"
                                value={formData.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Checkout Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Checkout Link
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/checkout"
                            value={formData.checkoutLink}
                            onChange={(e) => handleChange("checkoutLink", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};