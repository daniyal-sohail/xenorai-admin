"use client";

import { FC, memo } from "react";
import { Mail, Phone, Calendar, Edit2, Trash2, Globe } from "lucide-react";
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

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const getInitials = (lead: ILead) => {
    if (lead.name) return lead.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    return lead.email.charAt(0).toUpperCase();
};

const ActionBtn: FC<{
    onClick: () => void;
    title: string;
    variant: "edit" | "delete";
    children: React.ReactNode;
}> = ({ onClick, title, variant, children }) => {
    const style = variant === "edit"
        ? { color: "#6b7280", hoverColor: "#f97518", hoverBg: "rgba(249,117,24,0.08)" }
        : { color: "#6b7280", hoverColor: "#ef4444", hoverBg: "rgba(239,68,68,0.08)" };

    return (
        <button
            onClick={onClick}
            title={title}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: style.color }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color = style.hoverColor;
                e.currentTarget.style.background = style.hoverBg;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = style.color;
                e.currentTarget.style.background = "transparent";
            }}
        >
            {children}
        </button>
    );
};

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
    const getDomainName = (domainId: string) =>
        domains.find(d => d._id === domainId)?.domainName || "Unknown Domain";

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    const pageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push("...");
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push("...");
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div
            className="rounded-2xl overflow-hidden bg-white"
            style={{ border: "1px solid #e5e7eb" }}
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
                            {[
                                { label: "Lead", cls: "px-6 text-left" },
                                { label: "Contact", cls: "px-6 text-left" },
                                { label: "Domain", cls: "px-6 text-left hidden md:table-cell" },
                                { label: "Date Added", cls: "px-6 text-left hidden lg:table-cell" },
                                { label: "Tags", cls: "px-6 text-left hidden xl:table-cell" },
                                { label: "Actions", cls: "px-6 text-right" },
                            ].map(({ label, cls }) => (
                                <th
                                    key={label}
                                    className={`${cls} py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400`}
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j} className="px-6 py-3.5">
                                            <div
                                                className="h-3 rounded animate-pulse"
                                                style={{
                                                    background: "linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)",
                                                    backgroundSize: "200% 100%",
                                                    animation: "shimmer 1.6s infinite",
                                                    width: j === 0 ? "60%" : "80%",
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            leads.map((lead, idx) => (
                                <tr
                                    key={lead._id}
                                    className="group transition-colors hover:bg-gray-50/80"
                                    style={{ borderBottom: idx < leads.length - 1 ? "1px solid #f3f4f6" : "none" }}
                                >
                                    {/* Lead info */}
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #f97518, #ea5a00)" }}
                                            >
                                                {getInitials(lead)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                                                    {lead.name || "Anonymous Lead"}
                                                </p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Mail size={10} className="text-gray-400" />
                                                    <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-6 py-3.5">
                                        {lead.phone ? (
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="text-sm text-gray-700 hover:text-[#f97518] flex items-center gap-1.5 transition-colors"
                                            >
                                                <Phone size={13} />
                                                {lead.phone}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">No phone</span>
                                        )}
                                    </td>

                                    {/* Domain */}
                                    <td className="px-6 py-3.5 hidden md:table-cell">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                            <Globe size={12} style={{ color: "#f97518" }} />
                                            <span className="font-medium truncate max-w-[150px]">{getDomainName(lead.domainId)}</span>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-3.5 hidden lg:table-cell">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Calendar size={12} />
                                            {formatDate(lead.createdAt)}
                                        </div>
                                    </td>

                                    {/* Tags */}
                                    <td className="px-6 py-3.5 hidden xl:table-cell">
                                        {lead.tags && lead.tags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {lead.tags.slice(0, 2).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                                                        style={{ background: "rgba(249,117,24,0.08)", color: "#ea5a00", border: "1px solid rgba(249,117,24,0.15)" }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {lead.tags.length > 2 && (
                                                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500">
                                                        +{lead.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center justify-end gap-0.5">
                                            <ActionBtn onClick={() => onEdit(lead)} title="Edit lead" variant="edit">
                                                <Edit2 size={14} />
                                            </ActionBtn>
                                            <ActionBtn onClick={() => onDelete(lead._id)} title="Delete lead" variant="delete">
                                                <Trash2 size={14} />
                                            </ActionBtn>
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
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #f3f4f6" }}>
                    <div className="text-xs text-gray-500">
                        Showing <span className="font-semibold text-gray-700">{startIndex}</span> –{" "}
                        <span className="font-semibold text-gray-700">{endIndex}</span> of{" "}
                        <span className="font-semibold text-gray-700">{totalItems}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {pageNumbers().map((page, idx) =>
                            page === "..." ? (
                                <span key={`e${idx}`} className="px-2 text-xs text-gray-400">…</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page as number)}
                                    className="min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all hover:bg-gray-100"
                                    style={
                                        currentPage === page
                                            ? { background: "#f97518", color: "#fff", boxShadow: "0 0 12px rgba(249,117,24,0.3)" }
                                            : { color: "#6b7280" }
                                    }
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
        </div>
    );
};

export const LeadTable = memo(LeadTableComponent);