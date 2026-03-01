import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

/**
 * HOC that wraps a dashboard page and ensures auth is valid before rendering
 * Redirects to sign-in if session expires during API calls
 */
export function withAuthGuard<P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> {
    return function AuthGuardedComponent(props: P) {
        const router = useRouter();
        const { isAuthenticated, user, clearAuth, isHydrated } = useAuthStore();
        const isAdmin = String(user?.role || "").toLowerCase() === "admin";

        useEffect(() => {
            // Wait for store to hydrate from localStorage before checking auth
            if (!isHydrated) {
                return;
            }

            // If auth becomes invalid during page rendering, redirect immediately
            if (!isAuthenticated || !user || !isAdmin) {
                console.log("🔒 Auth lost during page load, redirecting");
                clearAuth();
                router.replace("/sign-in?session=expired");
            }
        }, [isAuthenticated, user, isAdmin, router, clearAuth, isHydrated]);

        // Listen for auth expiration
        useEffect(() => {
            const handleAuthExpired = () => {
                console.log("🔒 Session expired during page use");
                router.replace("/sign-in?session=expired");
            };

            window.addEventListener("auth-expired", handleAuthExpired);
            return () => window.removeEventListener("auth-expired", handleAuthExpired);
        }, [router]);

        // Don't render until we confirm auth is still valid and store is hydrated
        if (!isHydrated || !isAuthenticated || !user || !isAdmin) {
            return null;
        }

        return <Component {...props} />;
    };
}
