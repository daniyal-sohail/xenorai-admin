import Link from 'next/link'
import React, { useState } from 'react'
import { Popup } from '@/components/common/PopUp'

function SignInForm() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState<'success' | 'error' | 'info'>('info');
    const [popupMessage, setPopupMessage] = useState('');

    const handleLogin = () => {
        // Dummy login action
        setPopupType('success');
        setPopupMessage('Login functionality will be implemented here!');
        setPopupOpen(true);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-left text-[rgb(var(--foreground))]">Sign in to your account</h1>
                <p className="mt-2 text-[rgb(var(--text-muted))] text-left mb-6">
                    Enter your email below to login to your account
                </p>



                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-medium text-[rgb(var(--foreground))] mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex items-center justify-between">
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
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full px-4 py-2 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                        placeholder="Your password"
                    />

                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full py-2 mt-2 cursor-pointer bg-[rgb(var(--primary))] text-white font-medium rounded-md hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2"
                    >
                        Login
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

                <button
                    type="button"
                    className="w-full flex justify-center cursor-pointer items-center gap-3 py-2 px-4 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-muted))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--primary))]"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <g fill="none">
                            <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4" />
                            <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853" />
                            <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05" />
                            <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335" />
                        </g>
                    </svg>
                    Sign in with Google
                </button>

                <div className="text-center mt-6">
                    <p className="text-[rgb(var(--foreground))]">
                        Don't have an account? <Link href="/sign-up" className="text-[rgb(var(--primary))] hover:underline text-sm font-medium hover:text-[rgb(var(--primary-hover))]">Sign up</Link>
                    </p>
                </div>
            </div>

            {/* Popup Component */}
            <Popup
                open={popupOpen}
                type={popupType}
                title="Login"
                message={popupMessage}
                onClose={() => setPopupOpen(false)}
            />
        </div>
    )
}

export default SignInForm