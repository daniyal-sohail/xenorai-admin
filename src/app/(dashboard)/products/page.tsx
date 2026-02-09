"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useProductStore } from "@/store/product.store";
import { useDomainStore } from "@/store/domain.store";
import { IProduct } from "@/api/ProductApi";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useProductFilters } from "@/components/productComponents/UseProductFilter";
import { ProductFormData } from "@/components/productComponents/ProductTypes";
import { DomainSelector } from "@/components/leadsComponents/DomainSelector";
import { ProductStatsCard } from "@/components/productComponents/ProductStatsCard";
import { ProductFilters } from "@/components/productComponents/ProductFilters";
import { ProductSkeletonGrid } from "@/components/productComponents/ProductSkeleton";
import { ProductEmptyState } from "@/components/productComponents/ProductEmptyState";
import { ProductCard } from "@/components/productComponents/ProductCard";
import { Pagination } from "@/components/DomainCompoenets/Pagination";
import { CreateProductModal } from "@/components/productComponents/CreateProductModal";
import { EditProductModal } from "@/components/productComponents/EditProductModal";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";


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

    // Local state
    const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Toast state
    const [toast, setToast] = useState<{
        open: boolean;
        type: PopupType;
        message: string;
    }>({
        open: false,
        type: "info",
        message: "",
    });

    // Filters
    const {
        filters,
        filteredProducts,
        categories,
        handleFilterChange,
        hasActiveFilters,
    } = useProductFilters(products);

    // Pagination
    const itemsPerPage = 9;
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Fetch domains on mount
    useEffect(() => {
        fetchDomains();
    }, [fetchDomains]);

    // Auto-select first domain if available
    useEffect(() => {
        if (domains.length > 0 && !selectedDomainId) {
            setSelectedDomainId(domains[0]._id);
        }
    }, [domains, selectedDomainId]);

    // Fetch products when domain changes
    useEffect(() => {
        if (selectedDomainId) {
            setCurrentPage(1);
            fetchProducts(selectedDomainId);
        }
    }, [selectedDomainId, fetchProducts]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Show error toast
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
                // Error already handled by store
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
                // Error already handled by store
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
            // Error already handled by store
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
                // Error already handled by store
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

    const handleRefresh = useCallback(() => {
        if (selectedDomainId) {
            fetchProducts(selectedDomainId);
            showToast("success", "Products refreshed!");
        }
    }, [selectedDomainId, fetchProducts, showToast]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const selectedDomain = domains.find((d) => d._id === selectedDomainId);

    // Check product limit (free plan: 3 products)
    const canCreateProduct = products.filter((p) => p.isActive).length < 3;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Product Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage products that your chatbot can recommend
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading || !selectedDomainId}
                                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                                Refresh
                            </button>
                            <button
                                onClick={() => setCreateModalOpen(true)}
                                disabled={!selectedDomainId || !canCreateProduct}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={
                                    !canCreateProduct
                                        ? "Free plan limited to 3 active products"
                                        : ""
                                }
                            >
                                <Plus size={20} />
                                Add Product
                            </button>
                        </div>
                    </div>
                    {!canCreateProduct && selectedDomainId && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                <strong>Product Limit Reached:</strong> Free plan is limited to 3
                                active products. Upgrade to add more.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Domain Selector */}
                <DomainSelector
                    domains={domains}
                    selectedDomainId={selectedDomainId}
                    onDomainChange={handleDomainChange}
                />

                {selectedDomainId && (
                    <>
                        {/* Stats */}
                        {!loading && products.length > 0 && (
                            <ProductStatsCard products={products} />
                        )}

                        {/* Filters */}
                        {!loading && products.length > 0 && (
                            <ProductFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                categories={categories}
                            />
                        )}

                        {/* Loading State */}
                        {loading && <ProductSkeletonGrid count={9} />}

                        {/* Empty State */}
                        {!loading && products.length === 0 && (
                            <ProductEmptyState
                                hasFilters={false}
                                onClearFilters={() => handleFilterChange({})}
                                onCreateClick={() => setCreateModalOpen(true)}
                            />
                        )}

                        {/* No Results */}
                        {!loading &&
                            products.length > 0 &&
                            filteredProducts.length === 0 && (
                                <ProductEmptyState
                                    hasFilters={hasActiveFilters}
                                    onClearFilters={() => handleFilterChange({})}
                                    onCreateClick={() => setCreateModalOpen(true)}
                                />
                            )}

                        {/* Products Grid */}
                        {!loading && paginatedProducts.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onToggle={handleToggle}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={filteredProducts.length}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                            </>
                        )}
                    </>
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

            {/* Toast Notifications */}
            <Popup
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
}