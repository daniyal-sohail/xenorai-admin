"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { Popup, PopupType } from '@/components/common/PopUp';

interface SignInFormValues {
    email: string;
    password: string;
}

/* ============================
   GOOGLE ICON
============================ */
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

/* ============================
   FLOATING LABEL INPUT
============================ */
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FloatingInput = ({ label, error, id, ...props }: FloatingInputProps) => {
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean(props.value);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === "password";

    return (
        <div className="relative">
            <input
                id={id}
                {...props}
                type={isPassword ? (showPassword ? "text" : "password") : props.type}
                onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
                onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
                placeholder=" "
                style={{
                    width: "100%",
                    background: focused ? "rgb(var(--surface-hover, 250 250 250))" : "rgb(var(--surface, 245 245 245))",
                    border: error
                        ? "1.5px solid #DC2626"
                        : focused
                            ? "1.5px solid rgb(var(--primary, 169 199 227))"
                            : "1.5px solid rgb(var(--border, 229 229 229))",
                    borderRadius: "10px",
                    padding: "22px 16px 8px",
                    fontSize: "14px",
                    color: "rgb(var(--foreground, 17 17 17))",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focused ? "0 0 0 3px rgba(var(--primary, 169 199 227), 0.18)" : "none",
                    paddingRight: isPassword ? "52px" : "16px",
                }}
            />
            <label
                htmlFor={id}
                style={{
                    position: "absolute",
                    left: "16px",
                    pointerEvents: "none",
                    transition: "all 0.18s ease",
                    ...(focused || hasValue
                        ? {
                            top: "7px",
                            fontSize: "10px",
                            fontWeight: 600,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase" as const,
                            color: error ? "#DC2626" : focused ? "rgb(var(--primary-dark, 90 138 176))" : "rgb(var(--text-muted, 153 153 153))"
                        }
                        : {
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "13.5px",
                            color: "rgb(var(--text-muted, 153 153 153))"
                        }
                    ),
                }}
            >
                {label}
            </label>

            {isPassword && (
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "rgb(var(--text-muted, 153 153 153))",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgb(var(--foreground, 17 17 17))")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgb(var(--text-muted, 153 153 153))")}
                >
                    {showPassword ? "HIDE" : "SHOW"}
                </button>
            )}

            {error && (
                <p style={{
                    margin: "5px 0 0 2px",
                    fontSize: "11px",
                    color: "#DC2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                }}>
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
};

/* ============================
   SIGN IN FORM
============================ */
function SignInForm() {
    const router = useRouter();
    const loginUser = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

    const [popup, setPopup] = useState<{
        open: boolean;
        type: PopupType;
        message: string;
    }>({ open: false, type: "info", message: "" });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 40);
    }, []);

    // Initialize Google Sign-In
    useGoogleSignIn({
        onSuccess: () => {
            setPopup({
                open: true,
                type: "success",
                message: "Login successful! Redirecting...",
            });
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
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
    } = useForm<SignInFormValues>();

    const emailValue = watch("email");
    const passwordValue = watch("password");

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
        <div style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgb(var(--background, 255 255 255))",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Subtle background accents */}
            <div style={{
                position: "absolute",
                top: "-120px",
                right: "-120px",
                width: "480px",
                height: "480px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgb(var(--primary-light, 207 230 247)) 0%, transparent 70%)",
                opacity: 0.45,
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute",
                bottom: "-80px",
                left: "-80px",
                width: "320px",
                height: "320px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgb(var(--primary, 169 199 227)) 0%, transparent 70%)",
                opacity: 0.22,
                pointerEvents: "none",
            }} />

            {/* Card */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    maxWidth: "400px",
                    margin: "0 16px",
                    background: "rgb(var(--surface, 255 255 255))",
                    borderRadius: "16px",
                    border: "1px solid rgb(var(--border-light, 232 232 232))",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.07)",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    overflow: "hidden",
                }}
            >
                {/* Top accent line */}
                <div style={{
                    height: "3px",
                    background: "linear-gradient(90deg, rgb(var(--primary-light, 207 230 247)), rgb(var(--primary, 169 199 227)), rgb(var(--primary-dark, 122 174 203)))",
                }} />

                <div style={{ padding: "40px 36px 36px" }}>
                    {/* Header */}
                    <div style={{ marginBottom: "32px" }}>
                        <h1 style={{
                            fontSize: "22px",
                            fontWeight: 700,
                            color: "rgb(var(--foreground, 17 17 17))",
                            margin: "0 0 6px",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.2,
                        }}>
                            Welcome back
                        </h1>
                        <p style={{
                            fontSize: "13px",
                            color: "rgb(var(--text-muted, 136 136 136))",
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={() => {
                            const googleBtn = document.querySelector<HTMLElement>("#googleSignInDiv [role='button']");
                            googleBtn?.click();
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            padding: "11px 16px",
                            background: "rgb(var(--surface, 255 255 255))",
                            border: "1.5px solid rgb(var(--border, 224 224 224))",
                            borderRadius: "10px",
                            fontSize: "13.5px",
                            fontWeight: 500,
                            color: "rgb(var(--foreground-dark, 34 34 34))",
                            cursor: "pointer",
                            marginBottom: "20px",
                            transition: "all 0.18s ease",
                            letterSpacing: "-0.01em",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--surface-hover, 250 250 250))";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(var(--border-hover, 197 197 197))";
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--surface, 255 255 255))";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(var(--border, 224 224 224))";
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        }}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>

                    {/* Hidden Google SDK div */}
                    <div id="googleSignInDiv" style={{ display: "none" }} />

                    {/* Divider */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "20px"
                    }}>
                        <div style={{
                            flex: 1,
                            height: "1px",
                            background: "rgb(var(--border, 235 235 235))"
                        }} />
                        <span style={{
                            fontSize: "11px",
                            color: "rgb(var(--text-muted, 187 187 187))",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase"
                        }}>
                            or
                        </span>
                        <div style={{
                            flex: 1,
                            height: "1px",
                            background: "rgb(var(--border, 235 235 235))"
                        }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}>
                        <FloatingInput
                            id="email"
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            value={emailValue}
                        />

                        <div>
                            <FloatingInput
                                id="password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                error={errors.password?.message}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                value={passwordValue}
                            />
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "6px"
                            }}>
                                <Link
                                    href="/forgot-password"
                                    style={{
                                        fontSize: "12px",
                                        color: "rgb(var(--text-muted, 136 136 136))",
                                        textDecoration: "none",
                                        fontWeight: 500,
                                        transition: "color 0.15s",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "rgb(var(--foreground, 17 17 17))")}
                                    onMouseLeave={e => (e.currentTarget.style.color = "rgb(var(--text-muted, 136 136 136))")}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: loading ? "rgb(var(--foreground-dark, 51 51 51))" : "rgb(var(--primary, 17 17 17))",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "13.5px",
                                fontWeight: 600,
                                color: "#FFFFFF",
                                cursor: loading ? "not-allowed" : "pointer",
                                letterSpacing: "-0.01em",
                                transition: "all 0.18s ease",
                                marginTop: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                opacity: loading ? 0.75 : 1,
                            }}
                            onMouseEnter={e => {
                                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--foreground-dark, 34 34 34))";
                            }}
                            onMouseLeave={e => {
                                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--primary, 17 17 17))";
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg style={{
                                        animation: "spin 1s linear infinite",
                                        width: "14px",
                                        height: "14px"
                                    }}
                                        viewBox="0 0 24 24"
                                        fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3.5" />
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : "Sign in"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p style={{
                        textAlign: "center",
                        fontSize: "12.5px",
                        color: "rgb(var(--text-muted, 153 153 153))",
                        marginTop: "24px",
                        marginBottom: 0,
                    }}>
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            style={{
                                color: "rgb(var(--primary, 17 17 17))",
                                fontWeight: 600,
                                textDecoration: "none",
                                borderBottom: "1px solid rgb(var(--primary, 17 17 17))",
                                paddingBottom: "1px",
                                transition: "opacity 0.15s",
                            }}
                        >
                            Create one
                        </Link>
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

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default SignInForm;