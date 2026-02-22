"use client";

import { FC, memo } from "react";
import { Globe, MessageSquare, Bot, AlertCircle, ChevronDown } from "lucide-react";
import { IDomain } from "@/api/DomainApi";
import { IConversationStats } from "./ConversationTypes";

interface ConversationHeaderProps {
    domains: IDomain[];
    selectedDomainId: string | null;
    onDomainChange: (domainId: string) => void;
    stats: IConversationStats | null;
}

const ConversationHeaderComponent: FC<ConversationHeaderProps> = ({
    domains,
    selectedDomainId,
    onDomainChange,
    stats,
}) => {
    if (domains.length === 0) {
        return (
            <div
                style={{
                    background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                    border: "1px solid #fed7aa",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    boxShadow: "0 1px 3px rgba(249, 117, 24, 0.08)",
                }}
            >
                <div
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #f97518, #ea580c)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(249, 117, 24, 0.3)",
                    }}
                >
                    <Globe color="white" size={20} />
                </div>
                <div>
                    <h3
                        style={{
                            fontWeight: 700,
                            color: "#9a3412",
                            margin: "0 0 4px 0",
                            fontSize: "15px",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        No Domains Found
                    </h3>
                    <p style={{ color: "#c2410c", fontSize: "13.5px", margin: 0, lineHeight: 1.5 }}>
                        Create a domain first to start receiving conversations.
                    </p>
                </div>
            </div>
        );
    }

    const statItems = stats
        ? [
            {
                label: "Total",
                value: stats.total,
                icon: MessageSquare,
                accent: "#f97518",
                bg: "rgba(249, 117, 24, 0.08)",
                border: "rgba(249, 117, 24, 0.18)",
                glow: "rgba(249, 117, 24, 0.15)",
            },
            {
                label: "AI Active",
                value: stats.active,
                icon: Bot,
                accent: "#059669",
                bg: "rgba(5, 150, 105, 0.08)",
                border: "rgba(5, 150, 105, 0.18)",
                glow: "rgba(5, 150, 105, 0.12)",
            },
            {
                label: "Manual",
                value: stats.handoff,
                icon: AlertCircle,
                accent: "#d97706",
                bg: "rgba(217, 119, 6, 0.08)",
                border: "rgba(217, 119, 6, 0.18)",
                glow: "rgba(217, 119, 6, 0.12)",
            },
        ]
        : [];

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
                padding: "14px 18px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
            }}
        >
            {/* Domain Selector */}
            <div style={{ flex: 1, minWidth: "240px" }}>

                <div style={{ position: "relative" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "26px",
                            height: "26px",
                            borderRadius: "7px",
                            background: "rgba(249, 117, 24, 0.1)",
                        }}
                    >
                        <Globe size={13} color="#f97518" />
                    </div>
                    <select
                        value={selectedDomainId || ""}
                        onChange={(e) => onDomainChange(e.target.value)}
                        style={{
                            appearance: "none",
                            width: "100%",
                            paddingLeft: "46px",
                            paddingRight: "38px",
                            paddingTop: "9px",
                            paddingBottom: "9px",
                            border: "1.5px solid #e5e7eb",
                            borderRadius: "10px",
                            outline: "none",
                            background: "#fafafa",
                            cursor: "pointer",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "#111827",
                            transition: "all 0.18s ease",
                            letterSpacing: "-0.01em",
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#f97518";
                            e.target.style.boxShadow = "0 0 0 3px rgba(249, 117, 24, 0.1)";
                            e.target.style.background = "#fff";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#e5e7eb";
                            e.target.style.boxShadow = "none";
                            e.target.style.background = "#fafafa";
                        }}
                    >
                        {domains.map((domain) => (
                            <option key={domain._id} value={domain._id}>
                                {domain.domainName} — {domain.botName}
                            </option>
                        ))}
                    </select>
                    <div
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                        }}
                    >
                        <ChevronDown size={14} color="#9ca3af" />
                    </div>
                </div>
            </div>

            {/* Divider */}
            {stats && (
                <div
                    style={{
                        width: "1px",
                        height: "54px",
                        background: "linear-gradient(to bottom, transparent, #e5e7eb, transparent)",
                        flexShrink: 0,
                    }}
                />
            )}

            {/* Stats */}
            {stats && (
                <div
                    style={{
                        display: "flex",
                        gap: "6px",
                        marginLeft: "auto",
                    }}
                >
                    {statItems.map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "10px 14px",
                                borderRadius: "12px",
                                background: stat.bg,
                                border: `1px solid ${stat.border}`,
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${stat.glow}`;
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                            }}
                        >
                            <div
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "9px",
                                    background: `linear-gradient(135deg, ${stat.accent}22, ${stat.accent}10)`,
                                    border: `1px solid ${stat.border}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <stat.icon size={14} color={stat.accent} />
                            </div>
                            <div>
                                <p
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        letterSpacing: "0.07em",
                                        textTransform: "uppercase",
                                        color: "#9ca3af",
                                        margin: "0 0 1px 0",
                                        lineHeight: 1,
                                    }}
                                >
                                    {stat.label}
                                </p>
                                <p
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: 800,
                                        color: stat.accent,
                                        margin: 0,
                                        lineHeight: 1.1,
                                        letterSpacing: "-0.03em",
                                    }}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const ConversationHeader = memo(ConversationHeaderComponent);