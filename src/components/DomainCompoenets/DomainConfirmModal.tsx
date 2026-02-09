"use client";

import { FC, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    domainName: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
    isOpen,
    domainName,
    onClose,
    onConfirm,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="text-red-600" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Delete Domain</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-2">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-gray-900">{domainName}</span>?
                    </p>
                    <p className="text-sm text-gray-600">
                        This action cannot be undone. All chatbot data, conversations, and settings
                        will be permanently deleted.
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting..." : "Delete Domain"}
                    </button>
                </div>
            </div>
        </div>
    );
};