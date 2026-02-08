"use client";

import React from "react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="bg-[rgb(var(--surface))] rounded-lg shadow-sm border border-[rgb(var(--border))] p-6">
                <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">Welcome to DevXcript</h1>
                <p className="text-[rgb(var(--text-muted))]">Your student portal dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[rgb(var(--surface))] rounded-lg shadow-sm border border-[rgb(var(--border))] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[rgb(var(--text-muted))]">Total Courses</p>
                            <p className="text-2xl font-bold text-[rgb(var(--foreground))]">12</p>
                        </div>
                        <div className="w-12 h-12 bg-[rgb(var(--surface-muted))] rounded-lg flex items-center justify-center">
                            <span className="text-[rgb(var(--primary))] font-bold">📚</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[rgb(var(--surface))] rounded-lg shadow-sm border border-[rgb(var(--border))] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[rgb(var(--text-muted))]">Assignments</p>
                            <p className="text-2xl font-bold text-[rgb(var(--foreground))]">8</p>
                        </div>
                        <div className="w-12 h-12 bg-[rgb(var(--surface-muted))] rounded-lg flex items-center justify-center">
                            <span className="text-[rgb(var(--primary))] font-bold">📝</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[rgb(var(--surface))] rounded-lg shadow-sm border border-[rgb(var(--border))] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[rgb(var(--text-muted))]">Attendance</p>
                            <p className="text-2xl font-bold text-[rgb(var(--foreground))]">85%</p>
                        </div>
                        <div className="w-12 h-12 bg-[rgb(var(--surface-muted))] rounded-lg flex items-center justify-center">
                            <span className="text-[rgb(var(--primary))] font-bold">📊</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[rgb(var(--surface))] rounded-lg shadow-sm border border-[rgb(var(--border))] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[rgb(var(--text-muted))]">GPA</p>
                            <p className="text-2xl font-bold text-[rgb(var(--foreground))]">3.8</p>
                        </div>
                        <div className="w-12 h-12 bg-[rgb(var(--surface-muted))] rounded-lg flex items-center justify-center">
                            <span className="text-[rgb(var(--primary))] font-bold">⭐</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[rgb(var(--surface))] rounded-lg shadow-sm border border-[rgb(var(--border))] p-6">
                <h2 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-[rgb(var(--surface-muted))] rounded-lg">
                        <div className="w-2 h-2 bg-[rgb(var(--primary))] rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[rgb(var(--foreground))]">Assignment submitted</p>
                            <p className="text-xs text-[rgb(var(--text-muted))]">Data Structures - 2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-[rgb(var(--surface-muted))] rounded-lg">
                        <div className="w-2 h-2 bg-[rgb(var(--primary))] rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[rgb(var(--foreground))]">New course available</p>
                            <p className="text-xs text-[rgb(var(--text-muted))]">Advanced Algorithms - 1 day ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-[rgb(var(--surface-muted))] rounded-lg">
                        <div className="w-2 h-2 bg-[rgb(var(--primary))] rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[rgb(var(--foreground))]">Exam scheduled</p>
                            <p className="text-xs text-[rgb(var(--text-muted))]">Database Systems - 3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
