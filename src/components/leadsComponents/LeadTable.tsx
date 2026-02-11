"use client";

import { FC, memo } from "react";
import { Mail, Phone, Calendar, Edit2, Trash2, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { ILead } from "./LeadsTypes";
import { IDomain } from "@/api/DomainApi";

interface LeadTableProps {
    leads: ILead[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    domains?: IDomain[];
    onPageChange: (page: number) => void;
    onEdit: (lead: ILead) => void;
    onDelete: (id: string) => void;
}

const LeadTableComponent: FC<LeadTableProps> = ({
    leads,
    loading,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    domains = [],
    onPageChange,
    onEdit,
    onDelete,
}) => {
    const getDomainName = (domainId: string) => {
        return domains.find(d => d._id === domainId)?.domainName || "Unknown Domain";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getInitials = (lead: ILead) => {
        if (lead.name) {
            return lead.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return lead.email.charAt(0).toUpperCase();
    };

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Lead
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Domain
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date Added
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Tags
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-32" />
                                                <div className="h-3 bg-gray-200 rounded w-24" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-200 rounded w-40" />
                                            <div className="h-3 bg-gray-200 rounded w-32" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-3 bg-gray-200 rounded w-28" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-3 bg-gray-200 rounded w-24" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div className="h-6 bg-gray-200 rounded-full w-16" />
                                            <div className="h-6 bg-gray-200 rounded-full w-20" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                                            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            leads.map((lead) => (
                                <tr
                                    key={lead._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Lead Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                                style={{ background: "rgb(var(--primary))" }}
                                            >
                                                {getInitials(lead)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {lead.name || "Anonymous Lead"}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} />
                                                    {lead.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact Info */}
                                    <td className="px-6 py-4">
                                        {lead.phone ? (
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="text-sm text-gray-700 hover:text-orange-600 flex items-center gap-2 transition-colors"
                                            >
                                                <Phone size={14} />
                                                {lead.phone}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">
                                                No phone
                                            </span>
                                        )}
                                    </td>

                                    {/* Domain */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Globe size={14} className="text-orange-500" />
                                            <span className="font-medium">{getDomainName(lead.domainId)}</span>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} />
                                            {formatDate(lead.createdAt)}
                                        </div>
                                    </td>

                                    {/* Tags */}
                                    <td className="px-6 py-4">
                                        {lead.tags && lead.tags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {lead.tags.slice(0, 2).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 text-xs rounded-full font-medium"
                                                        style={{
                                                            background: "rgb(var(--primary-light-3))",
                                                            color: "rgb(var(--primary))",
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {lead.tags.length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                        +{lead.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">-</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(lead)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-orange-600"
                                                title="Edit lead"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(lead._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-600 hover:text-red-600"
                                                title="Delete lead"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{startIndex}</span> to{" "}
                        <span className="font-medium">{endIndex}</span> of{" "}
                        <span className="font-medium">{totalItems}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((page) => {
                                    // Show first, last, current, and adjacent pages
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    );
                                })
                                .map((page, index, array) => {
                                    // Add ellipsis if there's a gap
                                    const prevPage = array[index - 1];
                                    const showEllipsis = prevPage && page - prevPage > 1;

                                    return (
                                        <div key={page} className="flex items-center gap-1">
                                            {showEllipsis && (
                                                <span className="px-2 text-gray-400">...</span>
                                            )}
                                            <button
                                                onClick={() => onPageChange(page)}
                                                className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                    ? "text-white"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                style={
                                                    currentPage === page
                                                        ? { background: "rgb(var(--primary))" }
                                                        : {}
                                                }
                                            >
                                                {page}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const LeadTable = memo(LeadTableComponent);