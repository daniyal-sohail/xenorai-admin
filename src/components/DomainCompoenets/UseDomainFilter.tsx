import { useMemo, useState, useCallback } from "react";
import { DomainFilters, IDomain } from "./DomainTypes";

export const useDomainFilters = (domains: IDomain[]) => {
    const [filters, setFilters] = useState<DomainFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 3x3 grid

    const filteredDomains = useMemo(() => {
        let result = [...domains];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (d) =>
                    d.domainName.toLowerCase().includes(searchLower) ||
                    d.botName.toLowerCase().includes(searchLower)
            );
        }

        // Tone filter
        if (filters.tone) {
            result = result.filter((d) => d.tone === filters.tone);
        }

        // Industry filter
        if (filters.industry) {
            result = result.filter((d) => d.industryType === filters.industry);
        }

        // Status filter
        if (filters.status) {
            const isEnabled = filters.status === "enabled";
            result = result.filter((d) => d.botEnabled === isEnabled);
        }

        return result;
    }, [domains, filters]);

    const paginatedDomains = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDomains.slice(startIndex, endIndex);
    }, [filteredDomains, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);

    const handleFilterChange = useCallback((newFilters: DomainFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    return {
        filters,
        filteredDomains,
        paginatedDomains,
        currentPage,
        totalPages,
        itemsPerPage,
        handleFilterChange,
        handlePageChange,
    };
};