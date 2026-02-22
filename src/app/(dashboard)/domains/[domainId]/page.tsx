"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDomainStore } from "@/store/domain.store";
import { IDomain } from "@/api/DomainApi";
import { DomainDetail } from "@/components/DomainCompoenets/DomainDetail";
import { Popup, PopupType } from "@/components/common/PopUp";
import { EditDomainModal, UpdateDomainData } from "@/components/DomainCompoenets/EditDomainModal";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";

export default function DomainDetailPage() {
    const params = useParams();
    const router = useRouter();
    const domainId = params.domainId as string;

    const {
        domains,
        loading,
        error,
        fetchDomains,
        fetchDomainById,
        updateDomain,
        deleteDomain,
        toggleBotStatus,
        botScript,
    } = useDomainStore();

    const [selectedDomain, setSelectedDomain] = useState<IDomain | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [toast, setToast] = useState<{ open: boolean; type: PopupType; message: string }>({
        open: false,
        type: "info",
        message: "",
    });

    const showToast = useCallback(
        (type: PopupType, message: string) => setToast({ open: true, type, message }),
        []
    );

    // Fetch domain on mount
    useEffect(() => {
        const loadDomain = async () => {
            try {
                await fetchDomainById(domainId);
            } catch (err) {
                showToast("error", "Failed to load domain");
                router.push("/domains");
            }
        };
        loadDomain();
    }, [domainId, fetchDomainById, showToast, router]);

    // Set selected domain when fetched
    useEffect(() => {
        const domain = domains.find((d) => d._id === domainId);
        if (domain) {
            setSelectedDomain(domain);
        }
    }, [domains, domainId]);

    // Show error toast
    useEffect(() => {
        if (error) showToast("error", error);
    }, [error, showToast]);

    const handleEdit = useCallback(
        async (id: string, data: UpdateDomainData) => {
            try {
                await updateDomain(id, data);
                showToast("success", "Domain updated!");
                setEditModalOpen(false);
            } catch (err) {
                showToast("error", err instanceof Error ? err.message : "Update failed");
            }
        },
        [updateDomain, showToast]
    );

    const handleDelete = useCallback(async () => {
        try {
            await deleteDomain(domainId);
            showToast("success", "Domain deleted successfully");
            router.push("/domains");
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Delete failed");
        }
    }, [domainId, deleteDomain, showToast, router]);

    const handleToggle = useCallback(
        async (id: string) => {
            try {
                await toggleBotStatus(id);
                const domain = domains.find((d) => d._id === id);
                showToast("success", `Bot ${!domain?.botEnabled ? "enabled" : "disabled"}`);
            } catch (err) {
                showToast("error", err instanceof Error ? err.message : "Toggle failed");
            }
        },
        [toggleBotStatus, domains, showToast]
    );

    if (loading || !selectedDomain) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f97518]"></div>
                    <p className="mt-4 text-gray-600">Loading domain details…</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <DomainDetail
                domain={selectedDomain}
                script={botScript}
                onBack={() => router.push("/domains")}
                onEdit={(domain) => {
                    setSelectedDomain(domain);
                    setEditModalOpen(true);
                }}
                onDelete={(id) => setDeleteModalOpen(true)}
                onToggle={handleToggle}
            />

            {selectedDomain && (
                <>
                    <EditDomainModal
                        isOpen={editModalOpen}
                        domain={selectedDomain}
                        onClose={() => setEditModalOpen(false)}
                        onSubmit={handleEdit}
                    />

                    <DeleteConfirmModal
                        isOpen={deleteModalOpen}
                        domainName={selectedDomain.domainName}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                    />
                </>
            )}

            <Popup
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
}
