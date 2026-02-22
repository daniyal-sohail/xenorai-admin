"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, Lock, User, Mail, Shield, Check, AlertCircle, X } from "lucide-react";
import { Popup, PopupType } from "@/components/common/PopUp";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/user.store";
import { getProfileImageUrl } from "@/lib/imageUrl";

/* ============================
   FLOATING LABEL INPUT
============================ */
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

const FloatingInput = ({ label, error, icon, id, ...props }: FloatingInputProps) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === "password";

    return (
        <div style={{ marginBottom: "20px" }}>
            <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgb(var(--foreground, 17 17 17))",
                marginBottom: "8px",
            }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                {icon && (
                    <div style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgb(var(--text-muted, 153 153 153))",
                        pointerEvents: "none",
                    }}>
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    {...props}
                    type={isPassword ? (showPassword ? "text" : "password") : props.type}
                    onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
                    style={{
                        width: "100%",
                        background: "rgb(var(--surface, 255 255 255))",
                        border: error
                            ? "1.5px solid #DC2626"
                            : focused
                                ? "1.5px solid rgb(var(--primary, 169 199 227))"
                                : "1.5px solid rgb(var(--border, 229 229 229))",
                        borderRadius: "8px",
                        padding: icon ? "11px 14px 11px 44px" : "11px 14px",
                        fontSize: "14px",
                        color: "rgb(var(--foreground, 17 17 17))",
                        outline: "none",
                        transition: "all 0.2s ease",
                        paddingRight: isPassword ? "48px" : "14px",
                        fontFamily: "inherit",
                    }}
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            color: "rgb(var(--text-muted, 153 153 153))",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px 6px",
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "rgb(var(--foreground, 17 17 17))")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgb(var(--text-muted, 153 153 153))")}
                    >
                        {showPassword ? "HIDE" : "SHOW"}
                    </button>
                )}
            </div>
            {error && (
                <p style={{
                    margin: "6px 0 0",
                    fontSize: "12px",
                    color: "#DC2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                }}>
                    <AlertCircle size={14} /> {error}
                </p>
            )}
        </div>
    );
};

/* ============================
   PASSWORD STRENGTH BAR
============================ */
const PasswordStrength = ({ password }: { password: string }) => {
    const strength = Math.min(
        4,
        (password.length >= 8 ? 1 : 0) +
        (/[A-Z]/.test(password) ? 1 : 0) +
        (/[0-9]/.test(password) ? 1 : 0) +
        (/[^A-Za-z0-9]/.test(password) ? 1 : 0)
    );
    const colors = ["#E5E5E5", "#EF4444", "#F97316", "#EAB308", "#22C55E"];
    const labels = ["", "Weak", "Fair", "Good", "Strong"];

    return (
        <div style={{ marginTop: "-12px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "2px",
                            background: level <= strength ? colors[strength] : "#E5E5E5",
                            transition: "background 0.3s ease",
                        }}
                    />
                ))}
            </div>
            {strength > 0 && (
                <p style={{
                    fontSize: "12px",
                    color: colors[strength],
                    fontWeight: 500,
                    margin: 0,
                }}>
                    Password strength: {labels[strength]}
                </p>
            )}
        </div>
    );
};

/* ============================
   SKELETON LOADER
============================ */
const SkeletonLoader = () => (
    <div style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(var(--background, 250 250 250))",
        padding: "24px",
    }}>
        <div style={{
            width: "100%",
            maxWidth: "1200px",
            background: "rgb(var(--surface, 255 255 255))",
            borderRadius: "12px",
            border: "1px solid rgb(var(--border, 229 229 229))",
            padding: "32px",
        }}>
            <div style={{ marginBottom: "32px" }}>
                <div style={{
                    height: "32px",
                    width: "200px",
                    background: "linear-gradient(90deg, #F0F0F0 0%, #F8F8F8 50%, #F0F0F0 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    borderRadius: "6px",
                    marginBottom: "8px",
                }} />
                <div style={{
                    height: "18px",
                    width: "300px",
                    background: "linear-gradient(90deg, #F0F0F0 0%, #F8F8F8 50%, #F0F0F0 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    borderRadius: "4px",
                }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "32px" }}>
                <div>
                    <div style={{
                        width: "160px",
                        height: "160px",
                        borderRadius: "50%",
                        background: "linear-gradient(90deg, #F0F0F0 0%, #F8F8F8 50%, #F0F0F0 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s infinite",
                        margin: "0 auto 24px",
                    }} />
                </div>
                <div>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                            height: "48px",
                            background: "linear-gradient(90deg, #F0F0F0 0%, #F8F8F8 50%, #F0F0F0 100%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                            borderRadius: "8px",
                            marginBottom: "16px",
                        }} />
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    </div>
);

/* ============================
   TOAST NOTIFICATION
============================ */
interface ToastProps {
    open: boolean;
    type: "success" | "error" | "info";
    message: string;
    onClose: () => void;
}

const Toast = ({ open, type, message, onClose }: ToastProps) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    const config = {
        success: { bg: "#ECFDF5", border: "#10B981", icon: "#059669" },
        error: { bg: "#FEF2F2", border: "#EF4444", icon: "#DC2626" },
        info: { bg: "#EFF6FF", border: "#3B82F6", icon: "#2563EB" },
    };

    const style = config[type];

    return (
        <div style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            maxWidth: "420px",
            animation: "slideIn 0.3s ease-out",
        }}>
            <div style={{
                background: style.bg,
                border: `2px solid ${style.border}`,
                borderRadius: "10px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
                <div style={{ color: style.icon, flexShrink: 0 }}>
                    {type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
                </div>
                <p style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "rgb(var(--foreground, 17 17 17))",
                    fontWeight: 500,
                    flex: 1,
                }}>
                    {message}
                </p>
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        color: "rgb(var(--text-muted, 153 153 153))",
                        cursor: "pointer",
                        padding: "2px",
                        display: "flex",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgb(var(--foreground, 17 17 17))")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgb(var(--text-muted, 153 153 153))")}
                >
                    <X size={18} />
                </button>
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

/* ============================
   ACCOUNT PAGE
============================ */
export default function AccountPage() {
    const { user: authUser } = useAuthStore();
    const { user, loading, updateProfile, fetchProfile } = useUserStore();
    const [mounted, setMounted] = useState(false);

    // Profile state
    const [fullName, setFullName] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageFailedToLoad, setImageFailedToLoad] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Security state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Form errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Toast state
    const [toast, setToast] = useState<{
        open: boolean;
        type: "success" | "error" | "info";
        message: string;
    }>({
        open: false,
        type: "info",
        message: "",
    });

    const isGoogleUser = authUser?.authProvider === "google";
    const currentUser = user || authUser;

    // Fetch fresh profile data on mount
    useEffect(() => {
        fetchProfile();
        setTimeout(() => setMounted(true), 40);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (currentUser) {
            setFullName(currentUser.fullName || "");
            // Use the proper URL construction for existing profile images
            setPreviewUrl(getProfileImageUrl(currentUser.profileImage) || null);
            setImageFailedToLoad(false);
        }
    }, [currentUser]);

    const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
        setToast({ open: true, type, message });
    }, []);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast("error", "Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast("error", "Image size must be less than 5MB");
            return;
        }

        setProfileImage(file);
        setImageFailedToLoad(false);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [showToast]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!fullName.trim()) {
            setErrors({ fullName: "Full name is required" });
            return;
        }

        try {
            await updateProfile({
                fullName: fullName.trim(),
                profileImage: profileImage || undefined,
            });

            // After successful update, clear the file input and update preview from store
            setProfileImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Update preview URL from the updated user data
            const updatedUser = useUserStore.getState().user;
            if (updatedUser?.profileImage) {
                setPreviewUrl(getProfileImageUrl(updatedUser.profileImage));
            }
            setImageFailedToLoad(false);

            showToast("success", "Profile updated successfully!");
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Failed to update profile");
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: Record<string, string> = {};

        if (!isGoogleUser && !currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }
        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (isGoogleUser) {
                await useAuthStore.getState().setPassword({
                    newPassword,
                    confirmPassword,
                });
                showToast("success", "Password set successfully!");
            } else {
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
        return <SkeletonLoader />;
    }

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            background: "rgb(var(--background, 250 250 250))",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            padding: "48px 24px",
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.5s ease",
            }}>
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "rgb(var(--foreground, 17 17 17))",
                        margin: "0 0 6px",
                        letterSpacing: "-0.02em",
                    }}>
                        Account Settings
                    </h1>
                    <p style={{
                        fontSize: "14px",
                        color: "rgb(var(--text-muted, 136 136 136))",
                        margin: 0,
                    }}>
                        Manage your profile information and security settings
                    </p>
                </div>

                {/* Main Content */}
                <div style={{
                    background: "rgb(var(--surface, 255 255 255))",
                    borderRadius: "12px",
                    border: "1px solid rgb(var(--border, 229 229 229))",
                    overflow: "hidden",
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "320px 1fr",
                        minHeight: "600px",
                    }}>
                        {/* Left Sidebar - Profile */}
                        <div style={{
                            padding: "40px 32px",
                            borderRight: "1px solid rgb(var(--border, 229 229 229))",
                            background: "rgb(var(--surface, 255 255 255))",
                        }}>
                            <h2 style={{
                                fontSize: "16px",
                                fontWeight: 700,
                                color: "rgb(var(--foreground, 17 17 17))",
                                margin: "0 0 24px",
                            }}>
                                Profile Information
                            </h2>

                            {/* Avatar */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginBottom: "28px",
                            }}>
                                <div style={{ position: "relative", marginBottom: "12px" }}>
                                    <div style={{
                                        width: "160px",
                                        height: "160px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        background: previewUrl
                                            ? "transparent"
                                            : "linear-gradient(135deg, rgb(var(--primary, 169 199 227)), rgb(var(--primary-dark, 122 174 203)))",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#FFFFFF",
                                        fontSize: "64px",
                                        fontWeight: 700,
                                        border: "4px solid rgb(var(--surface, 255 255 255))",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    }}>
                                        {previewUrl && !imageFailedToLoad ? (
                                            <img
                                                src={previewUrl}
                                                alt="Profile"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                                onError={() => {
                                                    // If image fails to load, show initials
                                                    setImageFailedToLoad(true);
                                                }}
                                            />
                                        ) : null}
                                        {(!previewUrl || imageFailedToLoad) && (
                                            <span style={{ fontSize: "64px", fontWeight: 700 }}>
                                                {currentUser.fullName?.charAt(0).toUpperCase() || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            position: "absolute",
                                            bottom: "4px",
                                            right: "4px",
                                            width: "44px",
                                            height: "44px",
                                            borderRadius: "50%",
                                            background: "rgb(var(--foreground, 17 17 17))",
                                            border: "3px solid rgb(var(--surface, 255 255 255))",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            color: "#FFFFFF",
                                            transition: "transform 0.2s ease",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                                    >
                                        <Camera size={20} />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                    />
                                </div>
                                <p style={{
                                    fontSize: "12px",
                                    color: "rgb(var(--text-muted, 136 136 136))",
                                    margin: 0,
                                    textAlign: "center",
                                }}>
                                    JPG, PNG or GIF • Max 5MB
                                </p>
                            </div>

                            {/* Account Info */}
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{
                                    padding: "14px 16px",
                                    background: "rgb(var(--surface, 250 250 250))",
                                    borderRadius: "8px",
                                    marginBottom: "12px",
                                }}>
                                    <div style={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        color: "rgb(var(--text-muted, 136 136 136))",
                                        marginBottom: "4px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}>
                                        Email
                                    </div>
                                    <div style={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "rgb(var(--foreground, 17 17 17))",
                                    }}>
                                        {currentUser.email}
                                    </div>
                                </div>

                                <div style={{
                                    padding: "14px 16px",
                                    background: "rgb(var(--surface, 250 250 250))",
                                    borderRadius: "8px",
                                }}>
                                    <div style={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        color: "rgb(var(--text-muted, 136 136 136))",
                                        marginBottom: "4px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}>
                                        Authentication
                                    </div>
                                    <div style={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "rgb(var(--foreground, 17 17 17))",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}>
                                        <Shield size={16} />
                                        {isGoogleUser ? "Google Account" : "Email & Password"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Forms */}
                        <div style={{
                            padding: "40px",
                            background: "rgb(var(--surface, 255 255 255))",
                        }}>
                            {/* Profile Form */}
                            <div style={{ marginBottom: "48px" }}>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    color: "rgb(var(--foreground, 17 17 17))",
                                    margin: "0 0 6px",
                                }}>
                                    Personal Details
                                </h3>
                                <p style={{
                                    fontSize: "13px",
                                    color: "rgb(var(--text-muted, 136 136 136))",
                                    margin: "0 0 24px",
                                }}>
                                    Update your personal information
                                </p>

                                <form onSubmit={handleProfileUpdate}>
                                    <FloatingInput
                                        id="fullName"
                                        label="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        error={errors.fullName}
                                        icon={<User size={18} />}
                                        autoComplete="name"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            padding: "11px 24px",
                                            background: loading
                                                ? "rgb(var(--text-muted, 153 153 153))"
                                                : "rgb(var(--foreground, 17 17 17))",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: "#FFFFFF",
                                            cursor: loading ? "not-allowed" : "pointer",
                                            transition: "all 0.2s ease",
                                            opacity: loading ? 0.6 : 1,
                                        }}
                                        onMouseEnter={e => {
                                            if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--foreground-dark, 34 34 34))";
                                        }}
                                        onMouseLeave={e => {
                                            if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--foreground, 17 17 17))";
                                        }}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </form>
                            </div>

                            {/* Divider */}
                            <div style={{
                                height: "1px",
                                background: "rgb(var(--border, 229 229 229))",
                                margin: "48px 0",
                            }} />

                            {/* Security Form */}
                            <div>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    color: "rgb(var(--foreground, 17 17 17))",
                                    margin: "0 0 6px",
                                }}>
                                    {isGoogleUser ? "Set Password" : "Change Password"}
                                </h3>
                                <p style={{
                                    fontSize: "13px",
                                    color: "rgb(var(--text-muted, 136 136 136))",
                                    margin: "0 0 24px",
                                }}>
                                    {isGoogleUser
                                        ? "Create a password to enable email login"
                                        : "Update your password to keep your account secure"}
                                </p>

                                <form onSubmit={handlePasswordUpdate}>
                                    {!isGoogleUser && (
                                        <FloatingInput
                                            id="currentPassword"
                                            type="password"
                                            label="Current Password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            error={errors.currentPassword}
                                            icon={<Lock size={18} />}
                                            autoComplete="current-password"
                                        />
                                    )}

                                    <FloatingInput
                                        id="newPassword"
                                        type="password"
                                        label="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        error={errors.newPassword}
                                        icon={<Lock size={18} />}
                                        autoComplete="new-password"
                                    />
                                    {newPassword && <PasswordStrength password={newPassword} />}

                                    <FloatingInput
                                        id="confirmPassword"
                                        type="password"
                                        label="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        error={errors.confirmPassword}
                                        icon={<Lock size={18} />}
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            padding: "11px 24px",
                                            background: loading
                                                ? "rgb(var(--text-muted, 153 153 153))"
                                                : "rgb(var(--foreground, 17 17 17))",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: "#FFFFFF",
                                            cursor: loading ? "not-allowed" : "pointer",
                                            transition: "all 0.2s ease",
                                            opacity: loading ? 0.6 : 1,
                                        }}
                                        onMouseEnter={e => {
                                            if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--foreground-dark, 34 34 34))";
                                        }}
                                        onMouseLeave={e => {
                                            if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--foreground, 17 17 17))";
                                        }}
                                    >
                                        {loading ? "Updating..." : (isGoogleUser ? "Set Password" : "Update Password")}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
}