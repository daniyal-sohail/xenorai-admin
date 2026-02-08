// src/api/UserApi.ts
import API from "@/config/ApiConfig";
import { AxiosError } from "axios";
import { IUser } from "./AuthApi";

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data;

        if (responseData?.details && Array.isArray(responseData.details)) {
            const detailMessages = responseData.details
                .map((detail: any) => detail.message || detail.msg)
                .filter(Boolean)
                .join(", ");

            throw new Error(detailMessages || responseData.message || "Validation error");
        }

        const message =
            responseData?.message || error.message || "Something went wrong";

        throw new Error(message);
    }

    throw new Error("Something went wrong");
};

export const UserApi = {
    getProfile: async (): Promise<IUser> => {
        try {
            const res = await API.get("/users/profile");
            return res.data.data.user;
        } catch (error) {
            return handleError(error);
        }
    },

    updateProfile: async (data: {
        fullName?: string;
        profileImg?: File;
    }): Promise<IUser> => {
        try {
            const formData = new FormData();

            if (data.fullName) {
                formData.append("fullName", data.fullName);
            }

            if (data.profileImg) {
                formData.append("profileImg", data.profileImg);
            }

            // Don't set Content-Type for FormData - axios will set it automatically with boundary
            const res = await API.patch("/users/profile", formData);

            return res.data.data.user;
        } catch (error) {
            return handleError(error);
        }
    },
};
