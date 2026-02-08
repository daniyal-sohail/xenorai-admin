"use client";

import { FC, ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export type PopupType = "success" | "error" | "info";

interface PopupProps {
    open: boolean;
    type?: PopupType;
    title?: string;
    message: string | ReactNode;
    onClose: () => void;
    autoClose?: number; // in ms, optional
}

const typeColors: Record<PopupType, { bg: string; text: string }> = {
    success: { bg: "bg-green-50", text: "text-green-700" },
    error: { bg: "bg-red-50", text: "text-red-700" },
    info: { bg: "bg-blue-50", text: "text-blue-700" },
};

export const Popup: FC<PopupProps> = ({
    open,
    type = "info",
    title,
    message,
    onClose,
    autoClose = 5000,
}) => {
    useEffect(() => {
        if (open && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoClose);
            return () => clearTimeout(timer);
        }
    }, [open, autoClose, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-start sm:justify-end p-4 pointer-events-none">
            <div
                className={`pointer-events-auto w-full sm:max-w-sm rounded-lg shadow-lg border border-gray-200 ${typeColors[type].bg} overflow-hidden animate-slide-in`}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4">
                    <div>
                        {title && <h3 className={`text-sm font-semibold ${typeColors[type].text}`}>{title}</h3>}
                        <p className="mt-1 text-sm text-gray-700">{message}</p>
                    </div>
                    <button
                        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
