// src/api/AuthApi.ts
import API from "@/config/ApiConfig";
import { AxiosError } from "axios";

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
    role?: string;
}

export interface IAuthResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data;

        // If there are validation details, format them
        if (responseData?.details && Array.isArray(responseData.details)) {
            const detailMessages = responseData.details
                .map((detail: any) => detail.message || detail.msg)
                .filter(Boolean)
                .join(', ');

            throw new Error(detailMessages || responseData.message || "Validation Error");
        }

        // Otherwise use the general message
        const message = responseData?.message || error.message || "Something went wrong";
        throw new Error(message);
    }
    throw new Error("Something went wrong");
};

export const AuthApi = {
    register: async (data: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
        profileImg?: File;
    }): Promise<IAuthResponse> => {
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("confirmPassword", data.confirmPassword);
            if (data.profileImg) formData.append("profileImg", data.profileImg);

            // Debug logging
            console.log("📤 Sending registration data:", {
                fullName: data.fullName,
                email: data.email,
                password: "***",
                confirmPassword: "***",
                hasProfileImg: !!data.profileImg
            });

            const res = await API.post("/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    login: async (email: string, password: string): Promise<IAuthResponse> => {
        try {
            const res = await API.post("/auth/login", { email, password });
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    googleLogin: async (code: string): Promise<IAuthResponse> => {
        try {
            const res = await API.post("/auth/google", { code });
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    verifyEmail: async (token: string): Promise<IUser> => {
        try {
            const res = await API.post("/auth/verify-email", { token });
            return res.data.data.user;
        } catch (error) {
            return handleError(error);
        }
    },

    refreshToken: async (): Promise<{ accessToken: string }> => {
        try {
            const res = await API.post("/auth/refresh-token");
            return res.data.data;
        } catch (error) {
            return handleError(error);
        }
    },

    logout: async (): Promise<boolean> => {
        try {
            await API.post("/auth/logout");
            return true;
        } catch (error) {
            return handleError(error);
        }
    },

    forgotPassword: async (email: string): Promise<boolean> => {
        try {
            await API.post("/auth/forgot-password", { email });
            return true;
        } catch (error) {
            return handleError(error);
        }
    },

    resetPassword: async (data: {
        email: string;
        otp: string;
        newPassword: string;
        confirmPassword: string;
    }): Promise<boolean> => {
        try {
            await API.post("/auth/reset-password", data);
            return true;
        } catch (error) {
            return handleError(error);
        }
    },

    updatePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<boolean> => {
        try {
            await API.post("/auth/update-password", data);
            return true;
        } catch (error) {
            return handleError(error);
        }
    },

    setPassword: async (data: { newPassword: string; confirmPassword: string }): Promise<boolean> => {
        try {
            await API.post("/auth/set-password", data);
            return true;
        } catch (error) {
            return handleError(error);
        }
    },
};
