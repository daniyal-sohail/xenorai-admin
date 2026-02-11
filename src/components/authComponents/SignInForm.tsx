import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn'
import { Popup, PopupType } from '@/components/common/PopUp'

interface SignInFormValues {
    email: string;
    password: string;
}

function SignInForm() {
    const router = useRouter();
    const loginUser = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

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
                message: "Login successful! Redirecting...",
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
    } = useForm<SignInFormValues>();

    const onSubmit = async (data: SignInFormValues) => {
        try {
            console.log("📝 Login data received:", data);
            await loginUser(data.email, data.password);

            console.log("✅ Login successful!");
            setPopup({
                open: true,
                type: "success",
                message: "Login successful! Redirecting...",
            });

            // Redirect to dashboard after successful login
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (err) {
            console.error("❌ Login error:", err);
            setPopup({
                open: true,
                type: "error",
                message: err instanceof Error ? err.message : "Login failed",
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-left text-[rgb(var(--foreground))]">Sign in to your account</h1>
                <p className="mt-2 text-[rgb(var(--text-muted))] text-left mb-6">
                    Enter your email below to login to your account
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block font-medium text-[rgb(var(--foreground))]">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-[rgb(var(--primary))] hover:text-[rgb(var(--primary-hover))] font-medium text-sm hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            placeholder="Your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 mt-2 cursor-pointer bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
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
                        Don't have an account? <Link href="/sign-up" className="text-[rgb(var(--primary))] hover:underline text-sm font-medium hover:text-[rgb(var(--primary-hover))]">Sign up</Link>
                    </p>
                </div>
            </div>

            {/* Popup Component */}
            <Popup
                open={popup.open}
                type={popup.type}
                title="Login"
                message={popup.message}
                onClose={() => setPopup((p) => ({ ...p, open: false }))}
            />
        </div>
    )
}

export default SignInForm