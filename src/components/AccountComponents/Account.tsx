"use client";

import { useUserStore } from "@/store/user.store";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Popup } from "../common/PopUp";


interface AccountFormValues {
    fullName: string;
    profileImage?: FileList;
}

function Account() {
    const { fetchProfile, updateProfile, loading } = useUserStore();
    const { user, setUser } = useAuthStore();
    const [popup, setPopup] = useState<{ open: boolean; type?: any; message?: string }>({
        open: false,
    });
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<AccountFormValues>({
        defaultValues: {
            fullName: "",
        },
    });

    const profileImageFile = watch("profileImage");

    useEffect(() => {
        // Initialize form with current user data from auth store
        if (user) {
            reset({ fullName: user.fullName });
            setPreview(user.profileImage || null);
        }
    }, [user, reset]);

    useEffect(() => {
        if (profileImageFile && profileImageFile.length > 0) {
            const file = profileImageFile[0];
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [profileImageFile]);

    const onSubmit = async (data: AccountFormValues) => {
        try {
            const updateData: { fullName?: string; profileImg?: File } = {
                fullName: data.fullName,
            };

            if (data.profileImage && data.profileImage.length > 0) {
                updateData.profileImg = data.profileImage[0];
            }

            // Update profile via API
            await updateProfile(updateData);

            // Fetch updated profile to get the latest data including the new image URL
            await fetchProfile();

            // Get the updated user from user store and sync with auth store
            const updatedUser = useUserStore.getState().user;
            if (updatedUser) {
                setUser(updatedUser);
            }

            setPopup({ open: true, type: "success", message: "Profile updated successfully" });
        } catch (err: any) {
            setPopup({ open: true, type: "error", message: err.message });
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">My Profile</h1>
                <p className="text-[rgb(var(--text-muted))]">Update your profile information</p>
            </div>

            <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Image */}
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-3">
                            Profile Image
                        </label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-[rgb(var(--surface-muted))] border-2 border-[rgb(var(--border))] rounded-full overflow-hidden flex items-center justify-center">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-[rgb(var(--text-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-[rgb(var(--border))] rounded-md text-sm font-medium text-[rgb(var(--foreground))] bg-[rgb(var(--background))] hover:bg-[rgb(var(--surface-muted))] transition-colors">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Choose Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register("profileImage")}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                    JPG, PNG or GIF (MAX. 2MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            {...register("fullName", { required: "Full name is required" })}
                            className={`w-full px-4 py-2.5 bg-[rgb(var(--background))] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-colors ${errors.fullName
                                ? "border-red-500 focus:ring-red-500"
                                : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]"
                                }`}
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full px-4 py-2.5 bg-[rgb(var(--surface-muted))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text-muted))] cursor-not-allowed"
                        />
                        <p className="text-xs text-[rgb(var(--text-muted))] mt-1.5">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Changes...
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Popup */}
            <Popup
                open={popup.open}
                type={popup.type}
                message={popup.message || ""}
                onClose={() => setPopup({ open: false })}
                autoClose={4000}
            />
        </div>
    );
}

export default Account
