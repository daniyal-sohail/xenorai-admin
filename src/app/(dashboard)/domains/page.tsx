"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Globe } from "lucide-react";
import { useDomainStore } from "@/store/domain.store";
import { IDomain } from "@/api/DomainApi";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useDomainFilters } from "@/components/DomainCompoenets/UseDomainFilter";
import { CreateDomainModal, DomainFormData } from "@/components/DomainCompoenets/CreateDomainModal";
import { EditDomainModal, UpdateDomainData } from "@/components/DomainCompoenets/EditDomainModal";
import { DomainFilters } from "@/components/DomainCompoenets/DomainFilter";
import { DomainTable } from "@/components/DomainCompoenets/DomainTable";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";
import { DomainSkeletonGrid } from "@/components/DomainCompoenets/DomainSkeleton";
import { EmptyState } from "@/components/DomainCompoenets/EmptyState";
import { Pagination } from "@/components/DomainCompoenets/Pagination";

export default function DomainsPage() {
    const router = useRouter();
    const {
        domains, loading, error,
        fetchDomains, createDomain, updateDomain, deleteDomain,
        toggleBotStatus,
    } = useDomainStore();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<IDomain | null>(null);
    const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

    const [toast, setToast] = useState<{ open: boolean; type: PopupType; message: string }>({
        open: false, type: "info", message: "",
    });
    const showToast = useCallback(
        (type: PopupType, message: string) => setToast({ open: true, type, message }),
        []
    );

    const { filters, filteredDomains, paginatedDomains, currentPage, totalPages, itemsPerPage, handleFilterChange, handlePageChange } =
        useDomainFilters(domains);

    useEffect(() => { fetchDomains(); }, [fetchDomains]);
    useEffect(() => { if (error) showToast("error", error); }, [error, showToast]);

    const handleCreate = useCallback(async (data: DomainFormData) => {
        await createDomain(data);
        showToast("success", "Domain created!");
        setCreateModalOpen(false);
    }, [createDomain, showToast]);

    const handleEdit = useCallback(async (id: string, data: UpdateDomainData) => {
        await updateDomain(id, data);
        showToast("success", "Domain updated!");
        setEditModalOpen(false);
        setSelectedDomain(null);
    }, [updateDomain, showToast]);

    const handleDelete = useCallback(async () => {
        if (!domainToDelete) return;
        await deleteDomain(domainToDelete);
        showToast("success", "Domain deleted.");
        setDeleteModalOpen(false);
        setDomainToDelete(null);
    }, [deleteDomain, domainToDelete, showToast]);

    const handleToggle = useCallback(async (id: string) => {
        await toggleBotStatus(id);
        const d = domains.find((x) => x._id === id);
        showToast("success", `Bot ${!d?.botEnabled ? "enabled" : "disabled"}.`);
    }, [toggleBotStatus, domains, showToast]);

    const handleViewDetail = useCallback((domain: IDomain) => {
        router.push(`/domains/${domain._id}`);
    }, [router]);

    const openEdit = useCallback((domain: IDomain) => {
        setSelectedDomain(domain);
        setEditModalOpen(true);
    }, []);

    const openDelete = useCallback((id: string) => {
        setDomainToDelete(id);
        setDeleteModalOpen(true);
    }, []);

    // ── List view ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[rgb(var(--background))]">
            {/* Header */}
            <div className="bg-[rgb(var(--surface))] border-b border-[rgb(var(--border))]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] flex items-center justify-center shadow-sm shadow-orange-200">
                            <Globe size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[rgb(var(--foreground))] leading-tight">Domains</h1>
                            {!loading && (
                                <p className="text-xs text-[rgb(var(--text-muted))]">
                                    {domains.length} domain{domains.length !== 1 ? "s" : ""} configured
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-orange-200/50 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus size={15} />
                        New Domain
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto py-8">
                {/* Filters */}
                {domains.length > 0 && (
                    <DomainFilters filters={filters} onFilterChange={handleFilterChange} />
                )}

                {/* Loading */}
                {loading && <DomainSkeletonGrid rows={6} />}

                {/* Empty – no domains */}
                {!loading && domains.length === 0 && (
                    <EmptyState onCreateClick={() => setCreateModalOpen(true)} />
                )}

                {/* Empty – filter no results */}
                {!loading && domains.length > 0 && filteredDomains.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[rgb(var(--text-muted))] mb-3">No domains match your search.</p>
                        <button
                            onClick={() => handleFilterChange({})}
                            className="text-sm font-medium text-[rgb(var(--primary))] hover:text-[rgb(var(--primary-hover))] transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Table */}
                {!loading && paginatedDomains.length > 0 && (
                    <>
                        <DomainTable
                            domains={paginatedDomains}
                            onToggle={handleToggle}
                            onEdit={openEdit}
                            onDelete={openDelete}
                            onViewDetail={handleViewDetail}
                        />
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
                onSubmit={handleCreate}
            />
            <EditDomainModal
                isOpen={editModalOpen}
                domain={selectedDomain}
                onClose={() => { setEditModalOpen(false); setSelectedDomain(null); }}
                onSubmit={handleEdit}
            />
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                domainName={domains.find((d) => d._id === domainToDelete)?.domainName || ""}
                onClose={() => { setDeleteModalOpen(false); setDomainToDelete(null); }}
                onConfirm={handleDelete}
            />
            <Popup open={toast.open} type={toast.type} message={toast.message}
                onClose={() => setToast((t) => ({ ...t, open: false }))} />
        </div>
    );
}