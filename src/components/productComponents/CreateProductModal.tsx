"use client";

import { FC, useState, useCallback, useRef } from "react";
import { X, Sparkles, Upload, ImageIcon } from "lucide-react";
import { ProductFormData } from "./ProductTypes";

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => Promise<void>;
}

const labelCls = "block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-500";

const inputCls =
    "w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#f97518] focus:ring-2 focus:ring-[rgba(249,117,24,0.12)] hover:border-gray-300";

const errorInputCls =
    "w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none bg-red-50 border border-red-300 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100";

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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (field: keyof ProductFormData, value: any) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
        },
        [errors]
    );

    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { setErrors((p) => ({ ...p, image: "Image must be less than 5MB" })); return; }
            if (!file.type.startsWith("image/")) { setErrors((p) => ({ ...p, image: "Please upload a valid image file" })); return; }
            handleChange("image", file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        },
        [handleChange]
    );

    const removeImage = useCallback(() => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const validate = useCallback(() => {
        const e: Record<string, string> = {};
        if (!formData.name.trim()) e.name = "Product name is required";
        if (formData.price <= 0) e.price = "Price must be greater than 0";
        setErrors(e);
        return Object.keys(e).length === 0;
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({ name: "", description: "", price: 0, category: "", checkoutLink: "", image: null });
            setImagePreview(null);
            setErrors({});
            onClose();
        } catch {
            // handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
        >
            <div
                className="w-full sm:rounded-2xl sm:max-w-xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden bg-white"
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
                            <Sparkles size={14} style={{ color: "#f97518" }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold tracking-tight text-gray-900">New Product</h2>
                            <p className="text-[11px] text-gray-500">Add to your catalog</p>
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
                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto flex-1 px-6 py-5 space-y-5"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
                >
                    {/* Image upload */}
                    <div>
                        <label className={labelCls}>Product Image <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 180 }}>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2.5 right-2.5 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#f97518] hover:bg-orange-50/40 transition-all"
                            >
                                <div
                                    className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                                    style={{ background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)" }}
                                >
                                    <Upload size={20} style={{ color: "#f97518" }} />
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mb-0.5">Click to upload product image</p>
                                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        {errors.image && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.image}</p>}
                    </div>

                    {/* Product name */}
                    <div>
                        <label className={labelCls}>Product Name <span style={{ color: "#f97518" }}>*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Premium Wireless Headphones"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={errors.name ? errorInputCls : inputCls}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelCls}>Description <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                        <textarea
                            rows={3}
                            placeholder="Describe your product features and benefits…"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className={inputCls + " resize-none"}
                        />
                    </div>

                    {/* Price + Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Price <span style={{ color: "#f97518" }}>*</span></label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">$</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="99.99"
                                    value={formData.price || ""}
                                    onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                                    className={(errors.price ? errorInputCls : inputCls) + " pl-8"}
                                />
                            </div>
                            {errors.price && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.price}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Category</label>
                            <input
                                type="text"
                                placeholder="e.g., Electronics"
                                value={formData.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Checkout link */}
                    <div>
                        <label className={labelCls}>Checkout Link <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                        <input
                            type="url"
                            placeholder="https://example.com/checkout"
                            value={formData.checkoutLink}
                            onChange={(e) => handleChange("checkoutLink", e.target.value)}
                            className={inputCls}
                        />
                    </div>
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
                                Creating…
                            </>
                        ) : (
                            <>
                                <Sparkles size={14} />
                                Create Product
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};