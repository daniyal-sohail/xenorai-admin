"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    Globe,
    MessageCircle,
    Users,
    Settings,
    Cpu,
    LifeBuoy,
    FileText,
    X
} from "lucide-react";
import { useUIStore } from "@/store/sidebar.store";

type NavItem = { path: string; label: string; icon: LucideIcon };


export const navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },       // Overview
    { path: "/domains", label: "Domains", icon: Globe },           // Domain management
    { path: "/conversations", label: "Conversations", icon: MessageCircle }, // Chats
    { path: "/leads", label: "Leads", icon: Users },               // Leads
    { path: "/products", label: "Products", icon: Users },               // Leads
    { path: "/bot-settings", label: "Bot Settings", icon: Cpu },   // Bot config
    { path: "/support", label: "Support", icon: LifeBuoy },        // Help/support
    { path: "/account", label: "Account", icon: Settings },        // Account/profile
    { path: "/plans", label: "Plans", icon: FileText },            // Plan info / limits
];

export default function Sidebar() {
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLinkClick = (path: string) => {
        router.push(path);
        if (window.innerWidth < 1280) setSidebarOpen(false);
    };

    return (
        <>
            <aside
                className={`fixed left-0 top-0 h-screen w-64 bg-[rgb(var(--surface))] border-r border-[rgb(var(--border))] z-40 transition-transform duration-300 overflow-y-auto hide-scrollbar
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
            >
                {/* Header */}
                <div className="px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[rgb(var(--primary))] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">DX</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[rgb(var(--foreground))]">DevXcript</h1>
                                <p className="text-xs text-[rgb(var(--text-muted))]">Student Portal</p>
                            </div>
                        </div>
                        <button
                            className="p-1 rounded hover:bg-[rgb(var(--surface-muted))] xl:hidden transition-colors"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={16} className="text-[rgb(var(--text-muted))]" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3">
                    <div className="space-y-1">
                        {navItems.map(({ path, label, icon: Icon }) => {
                            const isActive = pathname === path;
                            return (
                                <button
                                    key={path}
                                    onClick={() => handleLinkClick(path)}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-left relative
                    ${isActive
                                            ? "bg-[rgb(var(--primary-light-3))] text-[rgb(var(--primary))] border border-[rgb(var(--border))]"
                                            : "text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-muted))] hover:text-[rgb(var(--foreground))]"
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--text-muted))]"} />
                                    <span className="font-medium text-base">{label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-[rgb(var(--primary))] rounded-full"></div>}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 py-2 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
                    <div className="text-xs text-[rgb(var(--text-muted))] text-center">Developed By DevXcript</div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
