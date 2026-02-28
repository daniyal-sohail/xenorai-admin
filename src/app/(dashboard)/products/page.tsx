"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
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

function ProductsPageContent() {
    const router = useRouter();
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const isAdmin = String(user?.role || "").toLowerCase() === "admin";
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

    // Verify auth and listen for expiration
    useEffect(() => {
        if (!isAuthenticated || !user || !isAdmin) {
            console.log("🔒 Auth lost in products page");
            clearAuth();
            router.replace("/sign-in?session=expired");
            return;
        }

        const handleAuthExpired = () => {
            console.log("🔒 Session expired in products page");
            clearAuth();
            router.replace("/sign-in?session=expired");
        };

        window.addEventListener("auth-expired", handleAuthExpired);
        return () => window.removeEventListener("auth-expired", handleAuthExpired);
    }, [isAuthenticated, user, isAdmin, router, clearAuth]);

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
        <div className="min-h-screen bg-[rgb(var(--background))]">
            {/* Header */}
            <div className="bg-[rgb(var(--surface))] border-b border-[rgb(var(--border))]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] flex items-center justify-center shadow-sm shadow-orange-200">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[rgb(var(--foreground))] leading-tight">Products</h1>
                            {!loading && (
                                <p className="text-xs text-[rgb(var(--text-muted))]">
                                    {products.length} product{products.length !== 1 ? "s" : ""} configured
                                </p>
                            )}
                        </div>
                    </div>

                </div>
                {!canCreateProduct && selectedDomainId && (
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <p className="text-sm text-yellow-800 font-medium">
                                ⚠️ <strong>Product Limit Reached:</strong> Free plan is limited to 3 active products. Upgrade to add more.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default function ProductsPage() {
    const { isAuthenticated, user } = useAuthStore();
    const isAdmin = String(user?.role || "").toLowerCase() === "admin";

    // Don't render content until auth is confirmed
    if (!isAuthenticated || !user || !isAdmin) {
        return null;
    }

    return <ProductsPageContent />;
}