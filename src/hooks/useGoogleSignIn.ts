import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

declare global {
    interface Window {
        google?: {
            accounts?: {
                id?: {
                    initialize: (config: any) => void;
                    renderButton: (element: HTMLElement, options: any) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

interface GoogleSignInOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    elementId?: string;
}

export const useGoogleSignIn = (options: GoogleSignInOptions = {}) => {
    const router = useRouter();
    const googleLogin = useAuthStore((state) => state.googleLogin);
    const setError = useAuthStore((state) => state.error);

    const { onSuccess, onError, elementId = "googleSignInDiv" } = options;

    const handleCredentialResponse = useCallback(
        async (response: any) => {
            try {
                if (!response.credential) {
                    throw new Error("No credential received from Google");
                }

                console.log("🔐 Google credential received, sending to backend...");

                // Send the ID token to backend
                await googleLogin(response.credential);

                console.log("✅ Google authentication successful!");

                if (onSuccess) {
                    onSuccess();
                }

                // Redirect to dashboard
                setTimeout(() => {
                    router.push("/dashboard");
                }, 500);
            } catch (err) {
                console.error("❌ Google authentication error:", err);
                const errorMessage =
                    err instanceof Error ? err.message : "Google authentication failed";

                if (onError) {
                    onError(errorMessage);
                }
            }
        },
        [googleLogin, onSuccess, onError, router]
    );

    useEffect(() => {
        const loadGoogleScript = () => {
            // Check if Google Sign-In library is already loaded
            if (window.google?.accounts?.id) {
                initializeGoogleSignIn();
                return;
            }

            // Load the Google Sign-In script
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;

            script.onload = () => {
                console.log("✅ Google Sign-In library loaded");
                initializeGoogleSignIn();
            };

            script.onerror = () => {
                console.error("❌ Failed to load Google Sign-In library");
                if (onError) {
                    onError("Failed to load Google Sign-In library");
                }
            };

            document.head.appendChild(script);
        };

        const initializeGoogleSignIn = () => {
            if (!window.google?.accounts?.id) {
                console.error("Google Sign-In library not loaded");
                return;
            }

            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            if (!clientId) {
                console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
                if (onError) {
                    onError("Google Sign-In is not properly configured");
                }
                return;
            }

            try {
                // Initialize Google Sign-In
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                });

                // Render the button if element exists
                const element = document.getElementById(elementId);
                if (element) {
                    window.google.accounts.id.renderButton(element, {
                        theme: "outline",
                        size: "large",
                        width: "400",
                        text: "signin_with",
                    });

                    console.log("✅ Google Sign-In button rendered");
                }

                // Optional: Show the One Tap prompt
                // window.google.accounts.id.prompt();
            } catch (err) {
                console.error("❌ Failed to initialize Google Sign-In:", err);
                if (onError) {
                    onError("Failed to initialize Google Sign-In");
                }
            }
        };

        loadGoogleScript();
    }, [elementId, onError, handleCredentialResponse]);
};
