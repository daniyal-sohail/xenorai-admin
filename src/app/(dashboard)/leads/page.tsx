"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import { RefreshCw } from "lucide-react";
import { useLeadStore } from "@/store/leads.store";
import { useDomainStore } from "@/store/domain.store";
import { ILead } from "@/api/LeadsApi";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useLeadFilters } from "@/components/leadsComponents/UseLeadFilters";
import { LeadFormData } from "@/components/leadsComponents/LeadsTypes";
import { DomainSelector } from "@/components/leadsComponents/DomainSelector";
import { LeadStatsCard } from "@/components/leadsComponents/LeadStatsCard";
import { LeadFilters } from "@/components/leadsComponents/LeadFilters";
import { LeadSkeletonGrid } from "@/components/leadsComponents/LeadSkeleton";
import { LeadEmptyState } from "@/components/leadsComponents/LeadEmptyState";
import { LeadCard } from "@/components/leadsComponents/LeadCard";
import { Pagination } from "@/components/DomainCompoenets/Pagination";
import { EditLeadModal } from "@/components/leadsComponents/EditLeadModel";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";
import { ExportLeadsButton } from "@/components/leadsComponents/ExportLeadButton";

export default function LeadsPage() {
    const {
        leads,
        loading,
        error,
        pagination,
        fetchLeads,
        updateLead,
        deleteLead,
    } = useLeadStore();

    const { domains, fetchDomains } = useDomainStore();

    // Local state
    const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
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
    const { filters, filteredLeads, handleFilterChange, hasActiveFilters } =
        useLeadFilters(leads);

    // Pagination
    const itemsPerPage = 9;
    const paginatedLeads = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredLeads.slice(startIndex, endIndex);
    }, [filteredLeads, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

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

    // Fetch leads when domain changes
    useEffect(() => {
        if (selectedDomainId) {
            setCurrentPage(1);
            fetchLeads({ domainId: selectedDomainId, page: 1, limit: 100 });
        }
    }, [selectedDomainId, fetchLeads]);

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

    const handleEditLead = useCallback(
        async (id: string, data: LeadFormData) => {
            try {
                await updateLead(id, data);
                showToast("success", "Lead updated successfully!");
                setEditModalOpen(false);
                setSelectedLead(null);
            } catch (err) {
                // Error already handled by store
            }
        },
        [updateLead, showToast]
    );

    const handleDeleteLead = useCallback(async () => {
        if (!leadToDelete) return;
        try {
            await deleteLead(leadToDelete);
            showToast("success", "Lead deleted successfully!");
            setDeleteModalOpen(false);
            setLeadToDelete(null);
        } catch (err) {
            // Error already handled by store
        }
    }, [deleteLead, leadToDelete, showToast]);

    const handleEdit = useCallback((lead: ILead) => {
        setSelectedLead(lead);
        setEditModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setLeadToDelete(id);
        setDeleteModalOpen(true);
    }, []);

    const handleRefresh = useCallback(() => {
        if (selectedDomainId) {
            fetchLeads({ domainId: selectedDomainId, page: 1, limit: 100 });
            showToast("success", "Leads refreshed!");
        }
    }, [selectedDomainId, fetchLeads, showToast]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const selectedDomain = domains.find((d) => d._id === selectedDomainId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Lead Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and manage leads collected from your chatbot
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
                            <ExportLeadsButton
                                leads={filteredLeads}
                                domainName={selectedDomain?.domainName}
                            />
                        </div>
                    </div>
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
                        {!loading && leads.length > 0 && (
                            <LeadStatsCard
                                leads={leads}
                                totalLeads={pagination?.total || 0}
                            />
                        )}

                        {/* Filters */}
                        {!loading && leads.length > 0 && (
                            <LeadFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                            />
                        )}

                        {/* Loading State */}
                        {loading && <LeadSkeletonGrid count={9} />}

                        {/* Empty State */}
                        {!loading && leads.length === 0 && (
                            <LeadEmptyState
                                hasFilters={false}
                                onClearFilters={() => handleFilterChange({})}
                            />
                        )}

                        {/* No Results */}
                        {!loading &&
                            leads.length > 0 &&
                            filteredLeads.length === 0 && (
                                <LeadEmptyState
                                    hasFilters={hasActiveFilters}
                                    onClearFilters={() => handleFilterChange({})}
                                />
                            )}

                        {/* Leads Grid */}
                        {!loading && paginatedLeads.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {paginatedLeads.map((lead) => (
                                        <LeadCard
                                            key={lead._id}
                                            lead={lead}
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
                                        totalItems={filteredLeads.length}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <EditLeadModal
                isOpen={editModalOpen}
                lead={selectedLead}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedLead(null);
                }}
                onSubmit={handleEditLead}
            />

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                domainName={
                    leads.find((l) => l._id === leadToDelete)?.email || "this lead"
                }
                onClose={() => {
                    setDeleteModalOpen(false);
                    setLeadToDelete(null);
                }}
                onConfirm={handleDeleteLead}
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