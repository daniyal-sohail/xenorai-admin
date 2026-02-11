"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Lock, User, Mail, Calendar, Shield } from "lucide-react";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/user.store";

export default function AccountPage() {
    const { user: authUser } = useAuthStore();
    const { user, loading, updateProfile } = useUserStore();
    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

    // Profile state
    const [fullName, setFullName] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Security state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Toast state
    const [toast, setToast] = useState<{
        open: boolean;
        type: PopupType;
        message: string;
    }>({
        open: false,
        type: "info",
        message: "",
    });

    const isGoogleUser = authUser?.authProvider === "google";
    const currentUser = user || authUser;

    useEffect(() => {
        if (currentUser) {
            setFullName(currentUser.fullName || "");
            setPreviewUrl(currentUser.profileImage || null);
        }
    }, [currentUser]);

    const showToast = (type: PopupType, message: string) => {
        setToast({ open: true, type, message });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast("error", "Image size must be less than 5MB");
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            showToast("error", "Full name is required");
            return;
        }

        try {
            await updateProfile({
                fullName: fullName.trim(),
                profileImage: profileImage || undefined,
            });
            showToast("success", "Profile updated successfully!");
            setProfileImage(null);
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Failed to update profile");
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            showToast("error", "Please fill all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("error", "Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            showToast("error", "Password must be at least 6 characters");
            return;
        }

        try {
            if (isGoogleUser) {
                // Set password for Google users
                await useAuthStore.getState().setPassword({
                    newPassword,
                    confirmPassword,
                });
                showToast("success", "Password set successfully!");
            } else {
                // Update password for local users
                if (!currentPassword) {
                    showToast("error", "Current password is required");
                    return;
                }
                await useAuthStore.getState().updatePassword({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                });
                showToast("success", "Password updated successfully!");
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Failed to update password");
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                        Account Settings
                    </h1>
                    <p className="text-gray-600">Manage your profile and security settings</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 p-2 flex gap-2">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${activeTab === "profile"
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <User className="inline-block mr-2 mb-1" size={18} />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${activeTab === "security"
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Lock className="inline-block mr-2 mb-1" size={18} />
                        Security
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <form onSubmit={handleProfileUpdate}>
                            {/* Profile Image */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            currentUser.fullName?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
                                    >
                                        <Camera size={18} />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-3">
                                    Click camera to upload new photo
                                </p>
                            </div>

                            {/* Account Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <Mail className="text-white" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-600 font-medium">Email</p>
                                            <p className="text-sm text-gray-700 font-medium">{currentUser.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <Shield className="text-white" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-purple-600 font-medium">Auth Provider</p>
                                            <p className="text-sm text-gray-700 font-medium capitalize">
                                                {isGoogleUser ? "Google" : "Local"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Full Name Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Update Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {isGoogleUser ? "Set Password" : "Change Password"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {isGoogleUser
                                        ? "Create a password to enable local login"
                                        : "Update your account password"}
                                </p>
                            </div>

                            {/* Current Password - Only for local users */}
                            {!isGoogleUser && (
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* New Password */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            {/* Update Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Updating..."
                                    : isGoogleUser
                                        ? "Set Password"
                                        : "Update Password"}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Toast Notifications */}
            <Popup
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
}