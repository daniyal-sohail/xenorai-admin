"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Users, TrendingUp, Phone, UserCheck } from "lucide-react";
import { useLeadStore } from "@/store/leads.store";
import { useDomainStore } from "@/store/domain.store";
import { ILead } from "@/api/LeadsApi";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useLeadFilters } from "@/components/leadsComponents/UseLeadFilters";
import { LeadFormData } from "@/components/leadsComponents/LeadsTypes";
import { LeadFilters } from "@/components/leadsComponents/LeadFilters";
import { LeadEmptyState } from "@/components/leadsComponents/LeadEmptyState";
import { EditLeadModal } from "@/components/leadsComponents/EditLeadModel";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";
import { ExportLeadsButton } from "@/components/leadsComponents/ExportLeadButton";
import { LeadTable } from "@/components/leadsComponents/LeadTable";

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
    const itemsPerPage = 10;
    const paginatedLeads = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredLeads.slice(startIndex, endIndex);
    }, [filteredLeads, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

    // Stats calculations
    const stats = useMemo(() => {
        const leadsWithPhone = leads.filter((l) => l.phone).length;
        const leadsWithName = leads.filter((l) => l.name).length;
        const leadsWithProducts = leads.filter(
            (l) => l.productsInterested && l.productsInterested.length > 0
        ).length;

        return [
            {
                label: "Total Leads",
                value: pagination?.total || 0,
                icon: Users,
                gradient: "from-orange-500 to-red-500",
            },
            {
                label: "With Contact",
                value: leadsWithPhone,
                icon: Phone,
                gradient: "from-emerald-500 to-teal-500",
            },
            {
                label: "Identified",
                value: leadsWithName,
                icon: UserCheck,
                gradient: "from-purple-500 to-pink-500",
            },
            {
                label: "Product Interest",
                value: leadsWithProducts,
                icon: TrendingUp,
                gradient: "from-blue-500 to-indigo-500",
            },
        ];
    }, [leads, pagination]);

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

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const selectedDomain = domains.find((d) => d._id === selectedDomainId);

    return (
        <div className="" style={{ background: "rgb(var(--background))" }}>
            <div className="text-black mb-6">
                <div className="max-w-7xl flex items-center justify-between mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Lead Management</h1>
                        <p className="text-gray-700">
                            Track and manage leads collected from your chatbot
                        </p>
                    </div>
                    <ExportLeadsButton
                        leads={filteredLeads}
                        domainName={selectedDomain?.domainName}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                {/* Unified Filters Bar */}
                <LeadFilters
                    domains={domains}
                    selectedDomainId={selectedDomainId}
                    onDomainChange={handleDomainChange}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {selectedDomainId && (
                    <>
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

                        {/* Leads Table */}
                        {paginatedLeads.length > 0 && (
                            <LeadTable
                                leads={paginatedLeads}
                                loading={loading}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredLeads.length}
                                domains={domains}
                                onPageChange={handlePageChange}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
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