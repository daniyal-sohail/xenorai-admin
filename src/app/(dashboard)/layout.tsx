"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SideBar";
import { useUIStore } from "@/store/sidebar.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, setSidebarOpen } = useUIStore();

    return (
        <div className="min-h-screen bg-[rgb(var(--background))]">
            <Sidebar />

            <div className="transition-all duration-300 ease-in-out xl:ml-64">
                <Header />

                <main className="p-4 sm:p-6 lg:p-8">
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
