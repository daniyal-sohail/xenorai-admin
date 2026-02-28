"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SideBar";
import { useUIStore } from "@/store/sidebar.store";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const isAdmin = String(user?.role || "").toLowerCase() === "admin";
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Check if user is authenticated - redirect immediately if not
        const checkAuth = async () => {
            // Give store time to hydrate from localStorage
            await new Promise(resolve => setTimeout(resolve, 50));

            // If not authenticated, clear and redirect immediately
            if (!isAuthenticated || !user || !isAdmin) {
                console.log("🔒 Not authenticated, redirecting to sign-in");
                clearAuth();
                router.replace("/sign-in");
                return;
            }

            // Auth is valid, mark as ready to render
            console.log("✅ User authenticated, rendering dashboard");
            setIsReady(true);
        };

        checkAuth();
    }, [isAuthenticated, user, isAdmin, router, clearAuth]);

    // Listen for session expiration from API interceptor
    useEffect(() => {
        const handleAuthExpired = () => {
            console.log("🔒 Session expired detected");
            clearAuth();
            router.replace("/sign-in?session=expired");
        };

        window.addEventListener("auth-expired", handleAuthExpired);
        return () => window.removeEventListener("auth-expired", handleAuthExpired);
    }, [router, clearAuth]);

    // Don't render anything until auth is verified
    if (!isReady) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[rgb(var(--background))]">
            <Sidebar />

            <div className="transition-all duration-300 ease-in-out xl:ml-64">
                <Header />

                <main className="h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-full">{children}</div>
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
