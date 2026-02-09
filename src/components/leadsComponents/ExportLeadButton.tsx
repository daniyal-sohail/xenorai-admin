"use client";

import { FC, useState, useCallback } from "react";
import { Download } from "lucide-react";
import { ILead } from "./LeadsTypes";

interface ExportLeadsButtonProps {
    leads: ILead[];
    domainName?: string;
}

export const ExportLeadsButton: FC<ExportLeadsButtonProps> = ({
    leads,
    domainName,
}) => {
    const [isExporting, setIsExporting] = useState(false);

    const exportToCSV = useCallback(() => {
        setIsExporting(true);

        try {
            // Create CSV header
            const headers = ["Email", "Name", "Phone", "Created At", "Updated At"];
            const csvRows = [headers.join(",")];

            // Add data rows
            leads.forEach((lead) => {
                const row = [
                    `"${lead.email}"`,
                    `"${lead.name || "N/A"}"`,
                    `"${lead.phone || "N/A"}"`,
                    `"${new Date(lead.createdAt).toLocaleString()}"`,
                    `"${new Date(lead.updatedAt).toLocaleString()}"`,
                ];
                csvRows.push(row.join(","));
            });

            // Create blob and download
            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);

            const fileName = domainName
                ? `leads-${domainName}-${Date.now()}.csv`
                : `leads-${Date.now()}.csv`;

            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    }, [leads, domainName]);

    if (leads.length === 0) return null;

    return (
        <button
            onClick={exportToCSV}
            disabled={isExporting}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
            <Download size={18} />
            {isExporting ? "Exporting..." : "Export CSV"}
        </button>
    );
};