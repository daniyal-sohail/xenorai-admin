// src/api/ProductApi.ts
import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

/* =======================
   TYPES
======================= */

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

export interface IListProductsResponse {
    products: IProduct[];
}

/* =======================
   ERROR HANDLER
======================= */

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data;

        if (responseData?.details && Array.isArray(responseData.details)) {
            const detailMessages = responseData.details
                .map((d: any) => d.message || d.msg)
                .filter(Boolean)
                .join(", ");
            throw new Error(detailMessages || "Validation error");
        }

        throw new Error(
            responseData?.message ||
            error.message ||
            "Something went wrong"
        );
    }

    throw new Error("Something went wrong");
};

/* =======================
   API
======================= */

export const ProductApi = {
    createProduct: async (
        domainId: string,
        data: {
            name: string;
            description?: string;
            price: number;
            category?: string;
            checkoutLink?: string;
            image?: File;
        }
    ): Promise<IProduct> => {
        try {
            const formData = new FormData();
            formData.append("domainId", domainId);
            formData.append("name", data.name);
            formData.append("price", String(data.price));

            if (data.description) formData.append("description", data.description);
            if (data.category) formData.append("category", data.category);
            if (data.checkoutLink) formData.append("checkoutLink", data.checkoutLink);
            if (data.image) formData.append("image", data.image);

            const res = await API.post(
                `/products/${domainId}/products`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            return res.data.data.product;
        } catch (error) {
            return handleError(error);
        }
    },

    getProducts: async (
        domainId: string,
        params?: {
            page?: number;
            limit?: number;
            sort?: string;
            search?: string;
            category?: string;
            isActive?: boolean;
            priceMin?: number;
            priceMax?: number;
        }
    ): Promise<IProduct[]> => {
        try {
            const res = await API.get(
                `/products/${domainId}/products`,
                { params }
            );
            return res.data.data.products;
        } catch (error) {
            return handleError(error);
        }
    },

    getProductById: async (
        domainId: string,
        productId: string
    ): Promise<IProduct> => {
        try {
            const res = await API.get(
                `/products/${domainId}/products/${productId}`
            );
            return res.data.data.product;
        } catch (error) {
            return handleError(error);
        }
    },

    updateProduct: async (
        domainId: string,
        productId: string,
        data: Partial<{
            name: string;
            description: string;
            price: number;
            category: string;
            checkoutLink: string;
            image: File;
        }>
    ): Promise<IProduct> => {
        try {
            const formData = new FormData();
            formData.append("domainId", domainId);
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as any);
                }
            });

            const res = await API.put(
                `/products/${domainId}/products/${productId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            return res.data.data.product;
        } catch (error) {
            return handleError(error);
        }
    },

    deleteProduct: async (
        domainId: string,
        productId: string
    ): Promise<void> => {
        try {
            await API.delete(`/products/${domainId}/products/${productId}`);
        } catch (error) {
            return handleError(error);
        }
    },

    toggleProductStatus: async (
        domainId: string,
        productId: string
    ): Promise<IProduct> => {
        try {
            const res = await API.patch(
                `/products/${domainId}/products/${productId}/toggle`,
                { domainId }
            );
            return res.data.data.product;
        } catch (error) {
            return handleError(error);
        }
    }
};
