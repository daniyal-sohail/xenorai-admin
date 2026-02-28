import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        throw new Error(
            error.response?.data?.message || error.message || "Something went wrong"
        );
    }
    throw new Error("Something went wrong");
};

export const AdminApi = {
    // USERS
    getUsers: async (params?: any) => {
        try {
            const res = await API.get("/admin/users", { params });
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    getUserDetails: async (userId: string) => {
        try {
            const res = await API.get(`/admin/users/${userId}`);
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    approveUser: async (userId: string) => {
        try {
            const res = await API.post(`/admin/users/${userId}/approve`);
            return res.data.data.user;
        } catch (error) {
            return handleError(error);
        }
    },

    approveBulk: async (userIds: string[]) => {
        try {
            const res = await API.post(`/admin/users/approve-bulk`, { userIds });
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // STATS
    getStats: async () => {
        try {
            const res = await API.get("/admin/stats/overview");
            return res.data.data.stats;
        } catch (error) {
            return handleError(error);
        }
    },

    // DOMAINS
    getDomains: async (params?: any) => {
        try {
            const res = await API.get("/admin/domains", { params });
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },
};