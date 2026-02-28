"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDomainStore } from "@/store/domain.store";
import { DomainDetail } from "@/components/DomainCompoenets/DomainDetail";
import { Popup, PopupType } from "@/components/common/PopUp";
import { EditDomainModal, UpdateDomainData } from "@/components/DomainCompoenets/EditDomainModal";
import { DeleteConfirmModal } from "@/components/DomainCompoenets/DomainConfirmModal";

export default function DomainDetailPage() {
    const params = useParams();
    const router = useRouter();
    const domainId = params.domainId as string;

    const {
        activeDomain,
        botScript,
        fetchDomainById,
        updateDomain,
        deleteDomain,
        toggleBotStatus,
        clearActiveDomain,
    } = useDomainStore();

    const [pageLoading, setPageLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; type: PopupType; message: string }>({
        open: false, type: "info", message: "",
    });

    const showToast = useCallback(
        (type: PopupType, message: string) => setToast({ open: true, type, message }),
        []
    );

    useEffect(() => {
        const load = async () => {
            setPageLoading(true);
            try {
                await fetchDomainById(domainId);
            } catch (err) {
                showToast("error", "Failed to load domain");
                router.push("/domains");
            } finally {
                setPageLoading(false);
            }
        };

        load();

        return () => { clearActiveDomain(); };
    }, [domainId]);

    const handleEdit = useCallback(async (id: string, data: UpdateDomainData) => {
        try {
            await updateDomain(id, data);
            showToast("success", "Domain updated!");
            setEditModalOpen(false);
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Update failed");
        }
    }, [updateDomain, showToast]);

    const handleDelete = useCallback(async () => {
        try {
            await deleteDomain(domainId);
            showToast("success", "Domain deleted");
            router.push("/domains");
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Delete failed");
        }
    }, [domainId, deleteDomain, showToast, router]);

    const handleToggle = useCallback(async (id: string) => {
        try {
            await toggleBotStatus(id);
            showToast("success", `Bot ${activeDomain?.botEnabled ? "disabled" : "enabled"}`);
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Toggle failed");
        }
    }, [toggleBotStatus, activeDomain, showToast]);

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f97518]" />
                    <p className="mt-4 text-gray-600">Loading domain details…</p>
                </div>
            </div>
        );
    }

    if (!activeDomain) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Domain not found.</p>
                    <button
                        onClick={() => router.push("/domains")}
                        className="px-4 py-2 bg-[#f97518] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
                    >
                        Back to Domains
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <DomainDetail
                domain={activeDomain}
                script={botScript}          // ← ye ab guaranteed set hai activeDomain ke saath
                onBack={() => router.push("/domains")}
                onEdit={() => setEditModalOpen(true)}
                onDelete={() => setDeleteModalOpen(true)}
                onToggle={handleToggle}
            />

            <EditDomainModal
                isOpen={editModalOpen}
                domain={activeDomain}
                onClose={() => setEditModalOpen(false)}
                onSubmit={handleEdit}
            />

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                domainName={activeDomain.domainName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />

            <Popup
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(t => ({ ...t, open: false }))}
            />
        </>
    );
}