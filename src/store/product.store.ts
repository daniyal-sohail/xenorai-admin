// src/stores/product.store.ts
import { create } from "zustand";
import { ProductApi, IProduct } from "@/api/ProductApi";

/* =======================
   STATE
======================= */

interface ProductState {
    products: IProduct[];
    selectedProduct: IProduct | null;

    loading: boolean;
    error: string | null;

    fetchProducts: (domainId: string, params?: any) => Promise<void>;
    fetchProductById: (domainId: string, productId: string) => Promise<void>;

    createProduct: (domainId: string, data: any) => Promise<void>;
    updateProduct: (domainId: string, productId: string, data: any) => Promise<void>;
    deleteProduct: (domainId: string, productId: string) => Promise<void>;
    toggleProductStatus: (domainId: string, productId: string) => Promise<void>;

    clearSelectedProduct: () => void;
}

/* =======================
   STORE
======================= */

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,

    fetchProducts: async (domainId, params) => {
        try {
            set({ loading: true, error: null });
            const products = await ProductApi.getProducts(domainId, params);
            set({ products });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to fetch products" });
        } finally {
            set({ loading: false });
        }
    },

    fetchProductById: async (domainId, productId) => {
        try {
            set({ loading: true, error: null });
            const product = await ProductApi.getProductById(domainId, productId);
            set({ selectedProduct: product });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to fetch product" });
        } finally {
            set({ loading: false });
        }
    },

    createProduct: async (domainId, data) => {
        try {
            set({ loading: true, error: null });
            const product = await ProductApi.createProduct(domainId, data);

            // append without refetch (important for SaaS UX)
            set((state) => ({
                products: [product, ...state.products]
            }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Product creation failed" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (domainId, productId, data) => {
        try {
            set({ loading: true, error: null });
            const updated = await ProductApi.updateProduct(domainId, productId, data);

            set((state) => ({
                products: state.products.map((p) =>
                    p._id === productId ? updated : p
                ),
                selectedProduct:
                    state.selectedProduct?._id === productId
                        ? updated
                        : state.selectedProduct
            }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Product update failed" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (domainId, productId) => {
        try {
            set({ loading: true, error: null });
            await ProductApi.deleteProduct(domainId, productId);

            set((state) => ({
                products: state.products.filter((p) => p._id !== productId),
                selectedProduct:
                    state.selectedProduct?._id === productId
                        ? null
                        : state.selectedProduct
            }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Delete failed" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    toggleProductStatus: async (domainId, productId) => {
        try {
            const updated = await ProductApi.toggleProductStatus(domainId, productId);

            set((state) => ({
                products: state.products.map((p) =>
                    p._id === productId ? updated : p
                ),
                selectedProduct:
                    state.selectedProduct?._id === productId
                        ? updated
                        : state.selectedProduct
            }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Toggle failed" });
            throw err;
        }
    },

    clearSelectedProduct: () => set({ selectedProduct: null })
}));
