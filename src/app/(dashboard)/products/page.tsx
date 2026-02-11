"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useProductStore } from "@/store/product.store";
import { useDomainStore } from "@/store/domain.store";
import { IProduct } from "@/api/ProductApi";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useProductFilters } from "@/components/productComponents/UseProductFilter";
import { ProductFormData } from "@/components/productComponents/ProductTypes";
import { ProductFilters } from "@/components/productComponents/ProductFilters";
import { CreateProductModal } from "@/components/productComponents/CreateProductModal";
import { EditProductModal } from "@/components/productComponents/EditProductModal";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";
import { ProductTable } from "@/components/productComponents/ProductTable";

export default function ProductsPage() {
    const {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
    } = useProductStore();

    const { domains, fetchDomains } = useDomainStore();

    const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const [toast, setToast] = useState<{
        open: boolean;
        type: PopupType;
        message: string;
    }>({
        open: false,
        type: "info",
        message: "",
    });

    const { filters, filteredProducts, handleFilterChange } =
        useProductFilters(products);

    useEffect(() => {
        fetchDomains();
    }, [fetchDomains]);

    useEffect(() => {
        if (domains.length > 0 && !selectedDomainId) {
            setSelectedDomainId(domains[0]._id);
        }
    }, [domains, selectedDomainId]);

    useEffect(() => {
        if (selectedDomainId) {
            fetchProducts(selectedDomainId);
        }
    }, [selectedDomainId, fetchProducts]);

    useEffect(() => {
        if (error) {
            showToast("error", error);
        }
    }, [error]);

    const showToast = useCallback((type: PopupType, message: string) => {
        setToast({ open: true, type, message });
    }, []);

    const handleDomainChange = useCallback((domainId: string) => {
        setSelectedDomainId(domainId || null);
    }, []);

    const handleCreateProduct = useCallback(
        async (data: ProductFormData) => {
            if (!selectedDomainId) return;
            try {
                await createProduct(selectedDomainId, data);
                showToast("success", "Product created successfully!");
                setCreateModalOpen(false);
            } catch (err) {
                // Error handled by store
            }
        },
        [selectedDomainId, createProduct, showToast]
    );

    const handleEditProduct = useCallback(
        async (id: string, data: Partial<ProductFormData>) => {
            if (!selectedDomainId) return;
            try {
                await updateProduct(selectedDomainId, id, data);
                showToast("success", "Product updated successfully!");
                setEditModalOpen(false);
                setSelectedProduct(null);
            } catch (err) {
                // Error handled by store
            }
        },
        [selectedDomainId, updateProduct, showToast]
    );

    const handleDeleteProduct = useCallback(async () => {
        if (!selectedDomainId || !productToDelete) return;
        try {
            await deleteProduct(selectedDomainId, productToDelete);
            showToast("success", "Product deleted successfully!");
            setDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (err) {
            // Error handled by store
        }
    }, [selectedDomainId, deleteProduct, productToDelete, showToast]);

    const handleToggle = useCallback(
        async (id: string) => {
            if (!selectedDomainId) return;
            try {
                await toggleProductStatus(selectedDomainId, id);
                const product = products.find((p) => p._id === id);
                const newStatus = !product?.isActive;
                showToast(
                    "success",
                    `Product ${newStatus ? "activated" : "deactivated"} successfully!`
                );
            } catch (err) {
                // Error handled by store
            }
        },
        [selectedDomainId, toggleProductStatus, products, showToast]
    );

    const handleEdit = useCallback((product: IProduct) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setProductToDelete(id);
        setDeleteModalOpen(true);
    }, []);

    const canCreateProduct = products.filter((p) => p.isActive).length < 3;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-b-4 border-indigo-700">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptLTQgMjhjLTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNC0xLjc5LTQtNC00em0yMC0yMGMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTAgMjBjLTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNC0xLjc5LTQtNC00ek0xMiAyNGMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTAgMjBjLTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNC0xLjc5LTQtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                                <Sparkles className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white mb-1">
                                    Product Catalog
                                </h1>
                                <p className="text-indigo-100 text-lg">
                                    Manage products for your AI chatbot
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            disabled={!selectedDomainId || !canCreateProduct}
                            className="px-8 py-4 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all duration-200 font-bold flex items-center gap-3 shadow-2xl hover:shadow-indigo-900/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            title={
                                !canCreateProduct
                                    ? "Free plan limited to 3 active products"
                                    : ""
                            }
                        >
                            <Plus size={24} />
                            Add Product
                        </button>
                    </div>

                    {!canCreateProduct && selectedDomainId && (
                        <div className="mt-6 bg-yellow-400/20 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl p-4">
                            <p className="text-sm text-white font-semibold">
                                ⚠️ <strong>Product Limit Reached:</strong> Free plan is limited to 3
                                active products. Upgrade to add more.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters with Stats */}
                <ProductFilters
                    domains={domains}
                    selectedDomainId={selectedDomainId}
                    onDomainChange={handleDomainChange}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    products={products}
                />

                {/* Products Table */}
                {selectedDomainId && (
                    <ProductTable
                        products={filteredProducts}
                        loading={loading}
                        onToggle={handleToggle}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modals */}
            <CreateProductModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateProduct}
            />

            <EditProductModal
                isOpen={editModalOpen}
                product={selectedProduct}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSubmit={handleEditProduct}
            />

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                domainName={
                    products.find((p) => p._id === productToDelete)?.name || "this product"
                }
                onClose={() => {
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                }}
                onConfirm={handleDeleteProduct}
            />

            {/* Toast */}
            <Popup
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
}