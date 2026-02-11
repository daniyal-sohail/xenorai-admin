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
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for store to hydrate from localStorage
        const timer = setTimeout(() => {
            setIsChecking(false);

            // Check if user is authenticated
            if (!isAuthenticated || !user) {
                console.log("🔒 Not authenticated, redirecting to sign-in...");
                router.push("/sign-in");
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, user, router]);

    // Listen for storage changes (e.g., auth cleared in another tab or by API interceptor)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "auth-storage" && e.newValue === null) {
                console.log("🔒 Auth cleared, redirecting to sign-in...");
                clearAuth();
                router.push("/sign-in");
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [clearAuth, router]);

    // Show loading while checking authentication
    if (isChecking || !isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary))] mx-auto"></div>
                    <p className="mt-4 text-[rgb(var(--text-muted))]">Loading...</p>
                </div>
            </div>
        );
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
