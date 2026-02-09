import { useMemo, useState, useCallback } from "react";
import { ILead, LeadFilters } from "./LeadsTypes";

export const useLeadFilters = (leads: ILead[]) => {
    const [filters, setFilters] = useState<LeadFilters>({});

    const filteredLeads = useMemo(() => {
        let result = [...leads];

        // Search filter (name or email)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (lead) =>
                    lead.email.toLowerCase().includes(searchLower) ||
                    (lead.name && lead.name.toLowerCase().includes(searchLower))
            );
        }

        // Date range filter
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            result = result.filter(
                (lead) => new Date(lead.createdAt) >= fromDate
            );
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(
                (lead) => new Date(lead.createdAt) <= toDate
            );
        }

        // Has phone filter
        if (filters.hasPhone !== undefined) {
            result = result.filter((lead) => {
                const hasPhone = !!(lead.phone && lead.phone.trim());
                return hasPhone === filters.hasPhone;
            });
        }

        // Has name filter
        if (filters.hasName !== undefined) {
            result = result.filter((lead) => {
                const hasName = !!(lead.name && lead.name.trim());
                return hasName === filters.hasName;
            });
        }

        return result;
    }, [leads, filters]);

    const handleFilterChange = useCallback((newFilters: LeadFilters) => {
        setFilters(newFilters);
    }, []);

    const hasActiveFilters = !!(
        filters.search ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.hasPhone !== undefined ||
        filters.hasName !== undefined
    );

    return {
        filters,
        filteredLeads,
        handleFilterChange,
        hasActiveFilters,
    };
};