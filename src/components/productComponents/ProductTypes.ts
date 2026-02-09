export interface IProduct {
    _id: string;
    domainId: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    checkoutLink?: string;
    image?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    isActive?: boolean;
    priceMin?: number;
    priceMax?: number;
}

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
    category?: string;
    checkoutLink?: string;
    image?: File | null;
}

export interface ProductPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}