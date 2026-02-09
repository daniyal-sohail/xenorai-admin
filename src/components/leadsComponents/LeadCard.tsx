"use client";

import { FC, memo, useCallback, useState } from "react";
import { Mail, Phone, User, Calendar, MoreVertical, Edit2, Trash2, MessageSquare } from "lucide-react";
import { ILead } from "./LeadsTypes";
interface LeadCardProps {
    lead: ILead;
    onEdit: (lead: ILead) => void;
    onDelete: (id: string) => void;
    onViewConversation?: (conversationId: string) => void;
}

const LeadCardComponent: FC<LeadCardProps> = ({
    lead,
    onEdit,
    onDelete,
    onViewConversation,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleEdit = useCallback(() => {
        onEdit(lead);
        setMenuOpen(false);
    }, [lead, onEdit]);

    const handleDelete = useCallback(() => {
        onDelete(lead._id);
        setMenuOpen(false);
    }, [lead._id, onDelete]);

    const handleViewConversation = useCallback(() => {
        if (lead.conversationId && onViewConversation) {
            onViewConversation(lead.conversationId);
        }
        setMenuOpen(false);
    }, [lead.conversationId, onViewConversation]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getInitials = () => {
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

    return (
        <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 relative">
            {/* Menu Button */}
            <div className="absolute top-4 right-4">
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MoreVertical size={18} className="text-gray-600" />
                    </button>

                    {menuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setMenuOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                >
                                    <Edit2 size={16} />
                                    Edit Lead
                                </button>
                                {lead.conversationId && onViewConversation && (
                                    <button
                                        onClick={handleViewConversation}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                    >
                                        <MessageSquare size={16} />
                                        View Conversation
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={16} />
                                    Delete Lead
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Avatar & Name */}
            <div className="flex items-start gap-4 mb-4 pr-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {lead.name || "Anonymous Lead"}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <Calendar size={14} />
                        <span>{formatDate(lead.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <a
                        href={`mailto:${lead.email}`}
                        className="text-sm text-indigo-600 hover:text-indigo-700 truncate"
                    >
                        {lead.email}
                    </a>
                </div>

                {/* Phone */}
                {lead.phone ? (
                    <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400 flex-shrink-0" />
                        <a
                            href={`tel:${lead.phone}`}
                            className="text-sm text-gray-700 hover:text-indigo-600 truncate"
                        >
                            {lead.phone}
                        </a>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={16} className="flex-shrink-0" />
                        <span className="text-sm italic">No phone number</span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    {lead.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                    {lead.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{lead.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Products Interested */}
            {lead.productsInterested && lead.productsInterested.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Interested in products</p>
                    <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded font-medium">
                            {lead.productsInterested.length} product{lead.productsInterested.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const LeadCard = memo(LeadCardComponent);