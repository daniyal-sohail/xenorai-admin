"use client";

import { useState, useRef } from "react";
import { Bell, LogOut, Menu, User2 } from "lucide-react";
import { useUIStore } from "@/store/sidebar.store";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuthStore } from "@/store/auth.store";

export default function Header() {
    const { toggleSidebar } = useUIStore();
    const { user, logout } = useAuthStore();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const bellRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    useClickOutside(bellRef, () => setShowNotifications(false));
    useClickOutside(userRef, () => setShowUserMenu(false));

    const getUserInitials = () => {
        if (!user) return "";
        const parts = user.name.split(" ");
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : user.name.slice(0, 2).toUpperCase();
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))]">
            {/* Left: Hamburger + Title */}
            <div className="flex items-center gap-4">
                <button
                    className="xl:hidden p-1.5 rounded-md hover:bg-[rgb(var(--surface-muted))] transition-colors"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <Menu size={18} />
                </button>
                <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>

            {/* Right: Notifications + User */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={bellRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-muted))] rounded-md transition-colors"
                    >
                        <Bell size={18} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[rgb(var(--primary))] rounded-full"></span>
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] shadow-lg rounded-lg p-3 z-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Notifications</span>
                                <span className="text-xs text-[rgb(var(--text-muted))] bg-[rgb(var(--surface-muted))] px-1.5 py-0.5 rounded">2</span>
                            </div>
                            <div className="space-y-2">
                                <div className="p-2 bg-[rgb(var(--surface-muted))] rounded border border-[rgb(var(--border))]">
                                    <p className="text-xs text-[rgb(var(--foreground))]">Register for next semester</p>
                                    <p className="text-xs text-[rgb(var(--text-muted))]">2 min ago</p>
                                </div>
                                <div className="p-2 bg-[rgb(var(--surface-muted))] rounded">
                                    <p className="text-xs text-[rgb(var(--foreground))]">Fee challan available</p>
                                    <p className="text-xs text-[rgb(var(--text-muted))]">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User menu */}
                <div className="relative" ref={userRef}>
                    <div
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-[rgb(var(--surface-muted))] rounded-md cursor-pointer transition-colors"
                    >
                        <div className="w-7 h-7 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{getUserInitials()}</span>
                        </div>

                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium max-w-[120px] truncate">{user?.name}</p>
                            <p className="text-xs text-[rgb(var(--text-muted))] max-w-[120px] truncate">{user?.email}</p>
                        </div>

                        <div className="sm:hidden">
                            <p className="text-sm font-medium">{user?.name.split(" ")[0]}</p>
                        </div>
                    </div>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] shadow-lg rounded-lg py-1 z-50">
                            <div className="sm:hidden px-3 py-2 border-b border-[rgb(var(--border))]">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-[rgb(var(--text-muted))] truncate">{user?.email}</p>
                            </div>

                            <button className="flex items-center w-full px-3 py-2 text-sm text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-muted))] transition-colors">
                                <User2 size={14} className="mr-2 text-[rgb(var(--text-muted))]" />
                                View Profile
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center w-full px-3 py-2 text-sm text-[rgb(var(--primary))] hover:bg-[rgb(var(--surface-muted))] transition-colors"
                            >
                                <LogOut size={14} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
