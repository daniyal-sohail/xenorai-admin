import { useMemo, useState, useCallback } from "react";
import { IProduct, ProductFilters } from "./ProductTypes";

export const useProductFilters = (products: IProduct[]) => {
    const [filters, setFilters] = useState<ProductFilters>({});

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (filters.search) {
            const s = filters.search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(s) ||
                    (p.description && p.description.toLowerCase().includes(s))
            );
        }

        if (filters.category) {
            result = result.filter(
                (p) => p.category && p.category.toLowerCase() === filters.category?.toLowerCase()
            );
        }

        if (filters.isActive !== undefined) {
            result = result.filter((p) => p.isActive === filters.isActive);
        }

        if (filters.priceMin !== undefined) {
            result = result.filter((p) => p.price >= filters.priceMin!);
        }

        if (filters.priceMax !== undefined) {
            result = result.filter((p) => p.price <= filters.priceMax!);
        }

        return result;
    }, [products, filters]);

    const categories = useMemo(() => {
        const cats = products.map((p) => p.category).filter((c): c is string => !!c);
        return Array.from(new Set(cats)).sort();
    }, [products]);

    const handleFilterChange = useCallback((newFilters: ProductFilters) => {
        setFilters(newFilters);
    }, []);

    const hasActiveFilters = !!(
        filters.search ||
        filters.category ||
        filters.isActive !== undefined ||
        filters.priceMin !== undefined ||
        filters.priceMax !== undefined
    );

    return {
        filters,
        filteredProducts,
        categories,
        handleFilterChange,
        hasActiveFilters,
    };
};