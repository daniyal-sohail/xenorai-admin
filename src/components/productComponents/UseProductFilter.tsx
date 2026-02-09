import { useMemo, useState, useCallback } from "react";
import { IProduct, ProductFilters } from "./ProductTypes";

export const useProductFilters = (products: IProduct[]) => {
    const [filters, setFilters] = useState<ProductFilters>({});

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter (name or description)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchLower) ||
                    (product.description &&
                        product.description.toLowerCase().includes(searchLower))
            );
        }

        // Category filter
        if (filters.category) {
            result = result.filter(
                (product) =>
                    product.category &&
                    product.category.toLowerCase() === filters.category?.toLowerCase()
            );
        }

        // Status filter
        if (filters.isActive !== undefined) {
            result = result.filter((product) => product.isActive === filters.isActive);
        }

        // Price range filter
        if (filters.priceMin !== undefined) {
            result = result.filter((product) => product.price >= filters.priceMin!);
        }

        if (filters.priceMax !== undefined) {
            result = result.filter((product) => product.price <= filters.priceMax!);
        }

        return result;
    }, [products, filters]);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = products
            .map((p) => p.category)
            .filter((cat): cat is string => !!cat);
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