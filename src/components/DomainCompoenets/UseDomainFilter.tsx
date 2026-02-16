import { useMemo, useState, useCallback } from "react";
import { DomainFilters, IDomain } from "./DomainTypes";

export const useDomainFilters = (domains: IDomain[]) => {
    const [filters, setFilters] = useState<DomainFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const filteredDomains = useMemo(() => {
        let result = [...domains];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (d) =>
                    d.domainName.toLowerCase().includes(searchLower) ||
                    d.botName.toLowerCase().includes(searchLower)
            );
        }

        if (filters.tone) {
            result = result.filter((d) => d.tone === filters.tone);
        }

        if (filters.industry) {
            result = result.filter((d) => d.industryType === filters.industry);
        }

        if (filters.status) {
            const isEnabled = filters.status === "enabled";
            result = result.filter((d) => d.botEnabled === isEnabled);
        }

        return result;
    }, [domains, filters]);

    const paginatedDomains = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDomains.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDomains, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);

    const handleFilterChange = useCallback((newFilters: DomainFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
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