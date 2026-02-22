"use client";

import { FC, memo, useCallback } from "react";
import { Search, SlidersHorizontal, X, Calendar } from "lucide-react";
import { ConversationFilters as IFilters } from "./ConversationTypes";

interface ConversationFiltersProps {
    filters: IFilters;
    onFilterChange: (filters: IFilters) => void;
}

const inputBase: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 13,
    color: "#111827",
    background: "#fafafa",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
    fontFamily: "inherit",
};

const ConversationFiltersComponent: FC<ConversationFiltersProps> = ({ filters, onFilterChange }) => {
    const hasActiveFilters = !!(filters.search || filters.status || filters.startDate || filters.endDate);

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({ ...filters, search: e.target.value }),
        [filters, onFilterChange]
    );
    const handleStatus = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) =>
            onFilterChange({ ...filters, status: e.target.value ? (e.target.value as any) : undefined }),
        [filters, onFilterChange]
    );
    const handleDateFrom = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({ ...filters, startDate: e.target.value }),
        [filters, onFilterChange]
    );
    const handleDateTo = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({ ...filters, endDate: e.target.value }),
        [filters, onFilterChange]
    );
    const clearSearch = useCallback(() => onFilterChange({ ...filters, search: "" }), [filters, onFilterChange]);
    const clearFilters = useCallback(() => onFilterChange({}), [onFilterChange]);

    const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.borderColor = "#f97518";
        e.target.style.boxShadow = "0 0 0 3px rgba(249,117,24,0.1)";
        e.target.style.background = "#fff";
    };
    const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.boxShadow = "none";
        e.target.style.background = "#fafafa";
    };

    return (
        <div
            style={{
                padding: "14px 16px",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#fff",
            }}
        >
            {/* Search */}
            <div style={{ position: "relative" }}>
                <Search
                    size={14}
                    style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        pointerEvents: "none",
                    }}
                />
                <input
                    type="text"
                    placeholder="Search conversations…"
                    value={filters.search || ""}
                    onChange={handleSearch}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                    style={{ ...inputBase, padding: "9px 34px 9px 36px", fontWeight: 500 }}
                />
                {filters.search && (
                    <button
                        onClick={clearSearch}
                        style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "#e5e7eb",
                            border: "none",
                            borderRadius: 50,
                            width: 18,
                            height: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            padding: 0,
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#d1d5db")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#e5e7eb")}
                    >
                        <X size={10} color="#6b7280" />
                    </button>
                )}
            </div>

            {/* Second row: Status + Dates */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {/* Status */}
                <div style={{ position: "relative" }}>
                    <SlidersHorizontal
                        size={11}
                        style={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: filters.status ? "#f97518" : "#9ca3af",
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    />
                    <select
                        value={filters.status || ""}
                        onChange={handleStatus}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                        style={{
                            ...inputBase,
                            appearance: "none",
                            padding: "8px 8px 8px 26px",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                            color: filters.status ? "#111827" : "#6b7280",
                        }}
                    >
                        <option value="">All</option>
                        <option value="active">AI Active</option>
                        <option value="handoff">Manual</option>
                    </select>
                </div>

                {/* Date From */}
                <div style={{ position: "relative" }}>
                    <Calendar
                        size={11}
                        style={{
                            position: "absolute",
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: filters.startDate ? "#f97518" : "#9ca3af",
                            pointerEvents: "none",
                        }}
                    />
                    <input
                        type="date"
                        value={filters.startDate || ""}
                        onChange={handleDateFrom}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                        style={{ ...inputBase, padding: "8px 4px 8px 24px", fontSize: 11, color: filters.startDate ? "#111827" : "#9ca3af" }}
                    />
                </div>

                {/* Date To */}
                <div style={{ position: "relative" }}>
                    <Calendar
                        size={11}
                        style={{
                            position: "absolute",
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: filters.endDate ? "#f97518" : "#9ca3af",
                            pointerEvents: "none",
                        }}
                    />
                    <input
                        type="date"
                        value={filters.endDate || ""}
                        onChange={handleDateTo}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                        style={{ ...inputBase, padding: "8px 4px 8px 24px", fontSize: 11, color: filters.endDate ? "#111827" : "#9ca3af" }}
                    />
                </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "rgba(249,117,24,0.07)",
                        border: "1px solid rgba(249,117,24,0.2)",
                        borderRadius: 8,
                        padding: "5px 10px",
                        cursor: "pointer",
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: "#f97518",
                        alignSelf: "flex-start",
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(249,117,24,0.13)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(249,117,24,0.07)")}
                >
                    <X size={11} />
                    Clear filters
                </button>
            )}
        </div>
    );
};

export const ConversationFilters = memo(ConversationFiltersComponent);