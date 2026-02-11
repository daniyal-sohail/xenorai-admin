"use client";

import { FC, useState, useCallback, useRef } from "react";
import { X, Upload, Sparkles, Image as ImageIcon } from "lucide-react";
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
                if (file.size > 5 * 1024 * 1024) {
                    setErrors((prev) => ({
                        ...prev,
                        image: "Image size must be less than 5MB",
                    }));
                    return;
                }

                if (!file.type.startsWith("image/")) {
                    setErrors((prev) => ({
                        ...prev,
                        image: "Please upload a valid image file",
                    }));
                    return;
                }

                handleChange("image", file);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Gradient Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Sparkles className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Create Product</h2>
                                <p className="text-indigo-100 text-sm">Add a new product to your catalog</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all flex items-center justify-center"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                            Product Image
                        </label>
                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-56 object-cover rounded-2xl border-4 border-indigo-100"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all flex items-center justify-center shadow-lg"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group border-3 border-dashed border-indigo-200 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload className="text-white" size={32} />
                                </div>
                                <p className="text-base font-semibold text-gray-700 mb-1">
                                    Click to upload product image
                                </p>
                                <p className="text-sm text-gray-500">
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
                            <p className="text-xs text-red-600 mt-2 font-medium">{errors.image}</p>
                        )}
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Premium Wireless Headphones"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium ${errors.name
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-2 font-medium">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe your product features and benefits..."
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
                        />
                    </div>

                    {/* Price & Category Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                                    $
                                </span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="99.99"
                                    value={formData.price || ""}
                                    onChange={(e) =>
                                        handleChange("price", parseFloat(e.target.value) || 0)
                                    }
                                    className={`w-full pl-10 pr-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium ${errors.price
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
                                        }`}
                                />
                            </div>
                            {errors.price && (
                                <p className="text-xs text-red-600 mt-2 font-medium">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Electronics"
                                value={formData.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Checkout Link */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Checkout Link
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/product/checkout"
                            value={formData.checkoutLink}
                            onChange={(e) => handleChange("checkoutLink", e.target.value)}
                            className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};