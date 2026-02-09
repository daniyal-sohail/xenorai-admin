"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useDomainStore } from "@/store/domain.store";
import { IDomain } from "@/api/DomainApi";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useDomainFilters } from "@/components/DomainCompoenets/UseDomainFilter";
import { CreateDomainModal, DomainFormData } from "@/components/DomainCompoenets/CreateDomainModal";
import { EditDomainModal, UpdateDomainData } from "@/components/DomainCompoenets/EditDomainModal";
import { DomainFilters } from "@/components/DomainCompoenets/DomainFilter";
import { DomainSkeletonGrid } from "@/components/DomainCompoenets/DomainSkeleton";
import { EmptyState } from "@/components/DomainCompoenets/EmptyState";
import { DomainCard } from "@/components/DomainCompoenets/DomainCard";
import { Pagination } from "@/components/DomainCompoenets/Pagination";
import { ScriptModal } from "@/components/DomainCompoenets/ScriptModal";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";


export default function DashboardPage() {
    const {
        domains,
        loading,
        error,
        fetchDomains,
        createDomain,
        updateDomain,
        deleteDomain,
        toggleBotStatus,
        fetchDomainById,
        botScript,
    } = useDomainStore();

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [scriptModalOpen, setScriptModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<IDomain | null>(null);
    const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

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

    // Filters and pagination
    const {
        filters,
        filteredDomains,
        paginatedDomains,
        currentPage,
        totalPages,
        itemsPerPage,
        handleFilterChange,
        handlePageChange,
    } = useDomainFilters(domains);

    // Fetch domains on mount
    useEffect(() => {
        fetchDomains();
    }, [fetchDomains]);

    // Show error toast
    useEffect(() => {
        if (error) {
            showToast("error", error);
        }
    }, [error]);

    const showToast = useCallback((type: PopupType, message: string) => {
        setToast({ open: true, type, message });
    }, []);

    const handleCreateDomain = useCallback(
        async (data: DomainFormData) => {
            try {
                await createDomain(data);
                showToast("success", "Domain created successfully!");
                setCreateModalOpen(false);
            } catch (err) {
                // Error already handled by store
            }
        },
        [createDomain, showToast]
    );

    const handleEditDomain = useCallback(
        async (id: string, data: UpdateDomainData) => {
            try {
                await updateDomain(id, data);
                showToast("success", "Domain updated successfully!");
                setEditModalOpen(false);
                setSelectedDomain(null);
            } catch (err) {
                // Error already handled by store
            }
        },
        [updateDomain, showToast]
    );

    const handleDeleteDomain = useCallback(async () => {
        if (!domainToDelete) return;
        try {
            await deleteDomain(domainToDelete);
            showToast("success", "Domain deleted successfully!");
            setDeleteModalOpen(false);
            setDomainToDelete(null);
        } catch (err) {
            // Error already handled by store
        }
    }, [deleteDomain, domainToDelete, showToast]);

    const handleToggle = useCallback(
        async (id: string) => {
            try {
                await toggleBotStatus(id);
                const domain = domains.find((d) => d._id === id);
                const newStatus = !domain?.botEnabled;
                showToast(
                    "success",
                    `Bot ${newStatus ? "enabled" : "disabled"} successfully!`
                );
            } catch (err) {
                // Error already handled by store
            }
        },
        [toggleBotStatus, domains, showToast]
    );

    const handleViewScript = useCallback(
        async (domain: IDomain) => {
            setSelectedDomain(domain);
            await fetchDomainById(domain._id);
            setScriptModalOpen(true);
        },
        [fetchDomainById]
    );

    const handleEdit = useCallback((domain: IDomain) => {
        setSelectedDomain(domain);
        setEditModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setDomainToDelete(id);
        setDeleteModalOpen(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Domain Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage your chatbot domains and configurations
                            </p>
                        </div>
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                        >
                            <Plus size={20} />
                            Create Domain
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                {domains.length > 0 && (
                    <DomainFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                )}

                {/* Loading State */}
                {loading && <DomainSkeletonGrid count={6} />}

                {/* Empty State */}
                {!loading && domains.length === 0 && (
                    <EmptyState onCreateClick={() => setCreateModalOpen(true)} />
                )}

                {/* No Results */}
                {!loading &&
                    domains.length > 0 &&
                    filteredDomains.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-600 text-lg">
                                No domains found matching your filters.
                            </p>
                            <button
                                onClick={() => handleFilterChange({})}
                                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                {/* Domain Grid */}
                {!loading && paginatedDomains.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedDomains.map((domain) => (
                                <DomainCard
                                    key={domain._id}
                                    domain={domain}
                                    onToggle={handleToggle}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onViewScript={handleViewScript}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={filteredDomains.length}
                            itemsPerPage={itemsPerPage}
                        />
                    </>
                )}
            </div>

            {/* Modals */}
            <CreateDomainModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateDomain}
            />

            <EditDomainModal
                isOpen={editModalOpen}
                domain={selectedDomain}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedDomain(null);
                }}
                onSubmit={handleEditDomain}
            />

            <ScriptModal
                isOpen={scriptModalOpen}
                script={botScript}
                domainName={selectedDomain?.domainName || ""}
                onClose={() => {
                    setScriptModalOpen(false);
                    setSelectedDomain(null);
                }}
            />

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                domainName={
                    domains.find((d) => d._id === domainToDelete)?.domainName || ""
                }
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDomainToDelete(null);
                }}
                onConfirm={handleDeleteDomain}
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