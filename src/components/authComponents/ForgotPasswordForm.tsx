// app/forgot-password/page.js
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthApi } from '@/api/AuthApi';
import { Popup, PopupType } from '../common/PopUp';

interface Step1FormValues {
    email: string;
}

interface Step2FormValues {
    otp: string;
}

interface Step3FormValues {
    newPassword: string;
    confirmPassword: string;
}

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const [popup, setPopup] = useState<{
        open: boolean;
        type: PopupType;
        message: string;
    }>({ open: false, type: "info", message: "" });

    const step1Form = useForm<Step1FormValues>();
    const step2Form = useForm<Step2FormValues>();
    const step3Form = useForm<Step3FormValues>();

    const onStep1Submit = async (data: Step1FormValues) => {
        try {
            setLoading(true);
            console.log("📧 Sending OTP to:", data.email);
            await AuthApi.forgotPassword(data.email);

            setEmail(data.email);
            setPopup({
                open: true,
                type: "success",
                message: "OTP sent successfully! Check your email.",
            });
            setStep(2);
        } catch (err) {
            console.error("❌ Forgot password error:", err);
            setPopup({
                open: true,
                type: "error",
                message: err instanceof Error ? err.message : "Failed to send OTP",
            });
        } finally {
            setLoading(false);
        }
    };

    const onStep2Submit = async (data: Step2FormValues) => {
        if (!data.otp || data.otp.length < 4) {
            setPopup({
                open: true,
                type: "error",
                message: "Please enter a valid OTP",
            });
            return;
        }

        setOtp(data.otp);
        setStep(3);
    };

    const onStep3Submit = async (data: Step3FormValues) => {
        try {
            setLoading(true);
            console.log("🔐 Resetting password...");

            await AuthApi.resetPassword({
                email,
                otp,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            setPopup({
                open: true,
                type: "success",
                message: "Password reset successful! Redirecting to login...",
            });

            setTimeout(() => {
                router.push('/sign-in');
            }, 2000);
        } catch (err) {
            console.error("❌ Reset password error:", err);
            setPopup({
                open: true,
                type: "error",
                message: err instanceof Error ? err.message : "Failed to reset password",
            });
        } finally {
            setLoading(false);
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

            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-left mb-2 text-[rgb(var(--foreground))]">Forgot Password</h1>
                    <p className="text-[rgb(var(--text-muted))] text-left mb-6">
                        {step === 1 && "Enter your email to receive a verification code."}
                        {step === 2 && "Enter the OTP sent to your email."}
                        {step === 3 && "Set your new password."}
                    </p>

                    {/* Step Indicator */}
                    <div className="flex justify-between items-center mb-6">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${s <= step
                                    ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))] text-white'
                                    : 'border-[rgb(var(--border))] text-[rgb(var(--text-muted))]'
                                    } font-semibold`}
                            >
                                {s}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    Email
                                </label>
                                <input
                                    {...step1Form.register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                />
                                {step1Form.formState.errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {step1Form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 mt-2 bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                            <div>
                                <label htmlFor="otp" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    OTP
                                </label>
                                <input
                                    {...step2Form.register("otp", {
                                        required: "OTP is required",
                                        minLength: {
                                            value: 4,
                                            message: "OTP must be at least 4 characters"
                                        }
                                    })}
                                    id="otp"
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                />
                                {step2Form.formState.errors.otp && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {step2Form.formState.errors.otp.message}
                                    </p>
                                )}
                                <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                    Sent to: {email}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-2 mt-2 border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-medium rounded-md hover:bg-[rgb(var(--surface-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 mt-2 bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
                                >
                                    Verify OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    New Password
                                </label>
                                <input
                                    {...step3Form.register("newPassword", {
                                        required: "New password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                />
                                {step3Form.formState.errors.newPassword && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {step3Form.formState.errors.newPassword.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    {...step3Form.register("confirmPassword", {
                                        required: "Confirm password is required",
                                        validate: (value) =>
                                            value === step3Form.watch("newPassword") || "Passwords don't match"
                                    })}
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                                />
                                {step3Form.formState.errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {step3Form.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 mt-2 bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-6">
                        <p className="text-[rgb(var(--foreground))]">
                            Remember your password? <Link href="/sign-in" className="text-[rgb(var(--primary))] hover:underline font-medium hover:text-[rgb(var(--primary-hover))]">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
