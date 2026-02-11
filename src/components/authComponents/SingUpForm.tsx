// app/sign-up/page.js
'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth.store";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { Popup, PopupType } from "../common/PopUp";

interface SignUpFormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    profileImg?: FileList;
}

export default function SignUpForm() {
    const router = useRouter();
    const registerUser = useAuthStore((state) => state.register);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);

    const [popup, setPopup] = useState<{
        open: boolean;
        type: PopupType;
        message: string;
    }>({ open: false, type: "info", message: "" });

    // Initialize Google Sign-In
    useGoogleSignIn({
        onSuccess: () => {
            setPopup({
                open: true,
                type: "success",
                message: "Account created with Google! Redirecting...",
            });
        },
        onError: (errorMessage) => {
            setPopup({
                open: true,
                type: "error",
                message: errorMessage,
            });
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignUpFormValues>();

    const passwordValue = watch("password");

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            console.log("📝 Form data received:", data);
            await registerUser({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                profileImg: data.profileImg?.[0],
            });

            console.log("✅ Registration successful!");
            setPopup({
                open: true,
                type: "success",
                message: "Account created successfully! Redirecting to login...",
            });

            // Redirect to sign-in page after 2 seconds
            setTimeout(() => {
                router.push("/sign-in");
            }, 2000);
        } catch (err) {
            console.error("❌ Registration error:", err);
            setPopup({
                open: true,
                type: "error",
                message: err instanceof Error ? err.message : "Signup failed",
            });
        }
    };

    return (

        <>
            <Popup
                open={popup.open}
                type={popup.type}
                message={popup.message}
                onClose={() => setPopup((p) => ({ ...p, open: false }))}
            />

            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto py-6 px-3">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-left text-[rgb(var(--foreground))]">Create your account</h1>
                    <p className="mt-2 text-[rgb(var(--text-muted))] text-left mb-6">
                        Sign up to get started with your new account
                    </p>


                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Row: Full Name + Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fullName" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    Full Name
                                </label>
                                <input
                                    {...register("fullName", { required: "Full name is required" })}
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                    placeholder="John Doe"
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    Email
                                </label>
                                <input
                                    {...register("email", { required: "Email is required" })}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                    placeholder="you@example.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Row: Password + Profile Image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div>
                                <label htmlFor="password" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    Password
                                </label>
                                <input
                                    {...register("password", { required: "Password is required" })}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    {...register("confirmPassword", {
                                        required: "Confirm your password",
                                        validate: (value) =>
                                            value === passwordValue || "Passwords don't match",
                                    })}
                                    id="confirmPassword"
                                    type="password"
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                        </div>

                        <div>
                            <label htmlFor="profileImg" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                Profile Image <span className="text-[rgb(var(--text-muted))]">(Optional)</span>
                            </label>
                            <div className="flex flex-col items-start gap-3">
                                <input
                                    {...register("profileImg")}
                                    id="profileImg"
                                    type="file"
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] file:bg-[rgb(var(--primary))] file:text-white file:border-0 file:px-3 file:py-1 file:rounded"
                                />
                                <p className="text-xs text-[rgb(var(--text-muted))]">Supported formats: JPG, PNG, GIF, WebP</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 mt-2 cursor-pointer bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[rgb(var(--border))]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))]">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button Container */}
                    <div
                        id="googleSignInDiv"
                        className="w-full flex justify-center"
                        style={{ minHeight: "44px" }}
                    />

                    <div className="text-center mt-6">
                        <p className="text-[rgb(var(--foreground))]">
                            Already have an account? <Link href="/sign-in" className="text-[rgb(var(--primary))] hover:underline text-sm font-medium hover:text-[rgb(var(--primary-hover))]">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
