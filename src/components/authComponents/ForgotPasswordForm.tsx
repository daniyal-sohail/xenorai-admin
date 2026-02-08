// app/forgot-password/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
    const [step, setStep] = useState(1);

    return (
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
                            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${s === step
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
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full py-2 mt-2 bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
                        >
                            Send OTP
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="otp" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                placeholder="Enter OTP"
                                className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="w-full py-2 mt-2 bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="newPassword" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            />
                        </div>
                        <button
                            type="button"
                            className="w-full py-2 mt-2 bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                <div className="text-center mt-6">
                    <p className="text-[rgb(var(--foreground))]">
                        Remember your password? <Link href="/login" className="text-[rgb(var(--primary))] hover:underline font-medium hover:text-[rgb(var(--primary-hover))]">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
