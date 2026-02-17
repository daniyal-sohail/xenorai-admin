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
            const headers = ["Email", "Name", "Phone", "Created At", "Updated At"];
            const csvRows = [headers.join(",")];

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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        >
            <Download size={14} />
            {isExporting ? "Exporting…" : "Export CSV"}
        </button>
    );
};