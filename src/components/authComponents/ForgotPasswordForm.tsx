"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthApi } from '@/api/AuthApi';
import { Popup, PopupType } from '@/components/common/PopUp';

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
        <div style={{ padding: "0 2px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        style={{
                            flex: 1,
                            height: "3px",
                            borderRadius: "99px",
                            background: level <= strength ? colors[strength] : "rgb(var(--border, 235 235 235))",
                            transition: "background 0.3s ease",
                        }}
                    />
                ))}
            </div>
            {strength > 0 && (
                <p style={{
                    fontSize: "11px",
                    color: colors[strength],
                    fontWeight: 500,
                    margin: 0,
                    textAlign: "right"
                }}>
                    {labels[strength]}
                </p>
            )}
        </div>
    );
};

/* ============================
   STEP INDICATOR
============================ */
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { number: 1, label: "Email" },
        { number: 2, label: "Verify" },
        { number: 3, label: "Reset" },
    ];

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
            position: "relative",
        }}>
            {/* Progress line */}
            <div style={{
                position: "absolute",
                top: "16px",
                left: "20px",
                right: "20px",
                height: "2px",
                background: "rgb(var(--border, 235 235 235))",
                zIndex: 0,
            }}>
                <div style={{
                    height: "100%",
                    background: "linear-gradient(90deg, rgb(var(--primary, 169 199 227)), rgb(var(--primary-dark, 122 174 203)))",
                    width: `${((currentStep - 1) / 2) * 100}%`,
                    transition: "width 0.3s ease",
                }} />
            </div>

            {steps.map((step) => {
                const isActive = currentStep >= step.number;
                const isCurrent = currentStep === step.number;

                return (
                    <div key={step.number} style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        flex: 1,
                        position: "relative",
                        zIndex: 1,
                    }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive
                                ? "linear-gradient(135deg, rgb(var(--primary, 169 199 227)), rgb(var(--primary-dark, 122 174 203)))"
                                : "rgb(var(--surface, 255 255 255))",
                            border: isActive ? "none" : "2px solid rgb(var(--border, 229 229 229))",
                            color: isActive ? "#FFFFFF" : "rgb(var(--text-muted, 153 153 153))",
                            fontSize: "13px",
                            fontWeight: 600,
                            transition: "all 0.3s ease",
                            boxShadow: isCurrent ? "0 0 0 4px rgba(var(--primary, 169 199 227), 0.15)" : "none",
                        }}>
                            {isActive && currentStep > step.number ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>
                        <span style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: isActive ? "rgb(var(--foreground, 17 17 17))" : "rgb(var(--text-muted, 153 153 153))",
                            letterSpacing: "0.02em",
                            transition: "color 0.3s ease",
                        }}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

/* ============================
   FORGOT PASSWORD FORM
============================ */
export default function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [popup, setPopup] = useState<{
        open: boolean;
        type: PopupType;
        message: string;
    }>({ open: false, type: "info", message: "" });

    const step1Form = useForm<Step1FormValues>();
    const step2Form = useForm<Step2FormValues>();
    const step3Form = useForm<Step3FormValues>();

    const emailValue = step1Form.watch("email");
    const otpValue = step2Form.watch("otp");
    const newPasswordValue = step3Form.watch("newPassword");
    const confirmPasswordValue = step3Form.watch("confirmPassword");

    useEffect(() => {
        setTimeout(() => setMounted(true), 40);
    }, []);

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
                    maxWidth: "440px",
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
                            Reset your password
                        </h1>
                        <p style={{
                            fontSize: "13px",
                            color: "rgb(var(--text-muted, 136 136 136))",
                            margin: 0,
                            lineHeight: 1.5
                        }}>
                            {step === 1 && "Enter your email to receive a verification code"}
                            {step === 2 && "Enter the OTP sent to your email"}
                            {step === 3 && "Create a new secure password"}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator currentStep={step} />

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <form onSubmit={step1Form.handleSubmit(onStep1Submit)} style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <FloatingInput
                                id="email"
                                type="email"
                                label="Email address"
                                autoComplete="email"
                                error={step1Form.formState.errors.email?.message}
                                {...step1Form.register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                value={emailValue}
                            />

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
                                    marginTop: "8px",
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
                                        Sending…
                                    </>
                                ) : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <form onSubmit={step2Form.handleSubmit(onStep2Submit)} style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <div>
                                <FloatingInput
                                    id="otp"
                                    type="text"
                                    label="Verification code"
                                    autoComplete="one-time-code"
                                    error={step2Form.formState.errors.otp?.message}
                                    {...step2Form.register("otp", {
                                        required: "OTP is required",
                                        minLength: {
                                            value: 4,
                                            message: "OTP must be at least 4 characters"
                                        }
                                    })}
                                    value={otpValue}
                                />
                                <p style={{
                                    fontSize: "12px",
                                    color: "rgb(var(--text-muted, 170 170 170))",
                                    margin: "6px 0 0 2px"
                                }}>
                                    Sent to: <strong style={{ color: "rgb(var(--foreground, 51 51 51))" }}>{email}</strong>
                                </p>
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "12px",
                                marginTop: "8px"
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    style={{
                                        flex: 1,
                                        padding: "12px 16px",
                                        background: "rgb(var(--surface, 255 255 255))",
                                        border: "1.5px solid rgb(var(--border, 224 224 224))",
                                        borderRadius: "10px",
                                        fontSize: "13.5px",
                                        fontWeight: 600,
                                        color: "rgb(var(--foreground, 17 17 17))",
                                        cursor: "pointer",
                                        letterSpacing: "-0.01em",
                                        transition: "all 0.18s ease",
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--surface-hover, 250 250 250))";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(var(--border-hover, 197 197 197))";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--surface, 255 255 255))";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(var(--border, 224 224 224))";
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: "12px 16px",
                                        background: "rgb(var(--primary, 17 17 17))",
                                        border: "none",
                                        borderRadius: "10px",
                                        fontSize: "13.5px",
                                        fontWeight: 600,
                                        color: "#FFFFFF",
                                        cursor: "pointer",
                                        letterSpacing: "-0.01em",
                                        transition: "all 0.18s ease",
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--foreground-dark, 34 34 34))";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = "rgb(var(--primary, 17 17 17))";
                                    }}
                                >
                                    Verify OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={step3Form.handleSubmit(onStep3Submit)} style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px"
                            }}>
                                <FloatingInput
                                    id="newPassword"
                                    type="password"
                                    label="New password"
                                    autoComplete="new-password"
                                    error={step3Form.formState.errors.newPassword?.message}
                                    {...step3Form.register("newPassword", {
                                        required: "New password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters"
                                        }
                                    })}
                                    value={newPasswordValue}
                                />
                                {newPasswordValue && <PasswordStrength password={newPasswordValue} />}
                            </div>

                            <FloatingInput
                                id="confirmPassword"
                                type="password"
                                label="Confirm password"
                                autoComplete="new-password"
                                error={step3Form.formState.errors.confirmPassword?.message}
                                {...step3Form.register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === step3Form.watch("newPassword") || "Passwords don't match"
                                })}
                                value={confirmPasswordValue}
                            />

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
                                    marginTop: "8px",
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
                                        Resetting…
                                    </>
                                ) : "Reset password"}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <p style={{
                        textAlign: "center",
                        fontSize: "12.5px",
                        color: "rgb(var(--text-muted, 153 153 153))",
                        marginTop: "24px",
                        marginBottom: 0,
                    }}>
                        Remember your password?{" "}
                        <Link
                            href="/sign-in"
                            style={{
                                color: "rgb(var(--primary, 17 17 17))",
                                fontWeight: 600,
                                textDecoration: "none",
                                borderBottom: "1px solid rgb(var(--primary, 17 17 17))",
                                paddingBottom: "1px",
                                transition: "opacity 0.15s",
                            }}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Popup Component */}
            <Popup
                open={popup.open}
                type={popup.type}
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