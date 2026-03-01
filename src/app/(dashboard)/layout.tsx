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
    const { isAuthenticated, user, clearAuth, isHydrated } = useAuthStore();
    const isAdmin = String(user?.role || "").toLowerCase() === "admin";
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for Zustand persist hydration before auth checks
        if (!isHydrated) {
            return;
        }

        // If not authenticated after hydration, redirect
        if (!isAuthenticated || !user || !isAdmin) {
            console.log("🔒 Not authenticated, redirecting to sign-in");
            clearAuth();
            router.replace("/sign-in");
            return;
        }

        // Auth is valid, render dashboard
        console.log("✅ User authenticated, rendering dashboard");
        setIsReady(true);
    }, [isAuthenticated, user, isAdmin, router, clearAuth, isHydrated]);

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

    // Don't render anything until store is hydrated and auth is verified
    if (!isHydrated || !isReady) {
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
