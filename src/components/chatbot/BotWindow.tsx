"use client";

import React, { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { IMessage } from "@/api/ConversationsApi";

export interface BotWindowProps {
    errors: any;
    register: UseFormRegister<{ content: string }>;
    chats: IMessage[];
    onChat: (e: React.FormEvent) => void;
    onResponding: boolean;
    domainName: string;
    botName: string;
    botAvatar?: string | null;
    theme?: string | null;
    textColor?: string | null;
}

const Bubble = ({ message }: { message: IMessage }) => {
    const isUser = message.sender === "visitor";
    return (
        <div style={{
            display: "flex",
            justifyContent: isUser ? "flex-end" : "flex-start",
            alignItems: "flex-end",
            gap: 8,
            animation: "bubbleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
            {!isUser && (
                <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#f97518,#ea5a00)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(249,117,24,0.28)",
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
            <div style={{
                maxWidth: "75%", padding: "10px 14px",
                borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: isUser ? "linear-gradient(135deg,#f97518,#ea5a00)" : "#fff",
                color: isUser ? "#fff" : "#1a1a1a",
                boxShadow: isUser ? "0 4px 14px rgba(249,117,24,0.28)" : "0 2px 10px rgba(0,0,0,0.07)",
                border: isUser ? "none" : "1px solid #f0ece6",
            }}>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                    {message.content}
                </p>
                {message.meta?.link && (
                    <a href={message.meta.link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: isUser ? "rgba(255,255,255,0.8)" : "#f97518", textDecoration: "underline", marginTop: 4, display: "block" }}>
                        View Link →
                    </a>
                )}
            </div>
        </div>
    );
};

const Responding = () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <div style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#f97518,#ea5a00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(249,117,24,0.28)",
        }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <div style={{
            padding: "11px 15px", borderRadius: "18px 18px 18px 4px",
            background: "#fff", border: "1px solid #f0ece6",
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            display: "flex", gap: 5, alignItems: "center",
        }}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#f97518", display: "block",
                    animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
            ))}
        </div>
    </div>
);

export const BotWindow = forwardRef<HTMLDivElement, BotWindowProps>(
    ({ errors, register, chats, onChat, onResponding, domainName, botName, botAvatar, textColor, theme }, ref) => {
        return (
            <>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
                    @keyframes bubbleIn {
                        from { opacity:0; transform:scale(0.88) translateY(5px); }
                        to   { opacity:1; transform:scale(1) translateY(0); }
                    }
                    @keyframes typingDot {
                        0%,60%,100% { transform:translateY(0);    opacity:0.35; }
                        30%          { transform:translateY(-5px); opacity:1;    }
                    }
                    @keyframes windowIn {
                        from { opacity:0; transform:translateY(12px) scale(0.98); }
                        to   { opacity:1; transform:translateY(0) scale(1); }
                    }
                    @keyframes onlinePulse {
                        0%,100% { box-shadow:0 0 0 2px rgba(34,197,94,0.35); }
                        50%      { box-shadow:0 0 0 5px rgba(34,197,94,0.10); }
                    }
                    .bot-scroll::-webkit-scrollbar       { width:4px; }
                    .bot-scroll::-webkit-scrollbar-track  { background:transparent; }
                    .bot-scroll::-webkit-scrollbar-thumb  { background:#f0e8e0; border-radius:10px; }
                    .bot-input { outline:none !important; transition:border-color 0.2s,box-shadow 0.2s; }
                    .bot-input:focus {
                        border-color:rgba(249,117,24,0.55) !important;
                        box-shadow:0 0 0 3px rgba(249,117,24,0.12) !important;
                    }
                    .bot-send { transition:transform 0.15s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.15s; }
                    .bot-send:hover  { transform:scale(1.08); box-shadow:0 6px 20px rgba(249,117,24,0.42) !important; }
                    .bot-send:active { transform:scale(0.93); }
                `}</style>

                {/* Fills 100% of the absolute box that AiChatBot gives it */}
                <div style={{
                    width: "100%", height: "100%",
                    display: "flex", flexDirection: "column",
                    borderRadius: "20px 20px 0 0",
                    overflow: "hidden",
                    fontFamily: "'DM Sans',sans-serif",
                    background: "#f9f6f3",
                    border: "1px solid #ede8e2",
                    borderBottom: "none",
                    boxShadow: "0 -2px 20px rgba(0,0,0,0.07)",
                    animation: "windowIn 0.28s cubic-bezier(0.34,1.1,0.64,1) both",
                }}>

                    {/* ── Header ── */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "14px 16px", flexShrink: 0,
                        background: "linear-gradient(135deg,#f97518 0%,#ea5a00 100%)",
                        boxShadow: "0 2px 10px rgba(249,117,24,0.20)",
                        position: "relative", overflow: "hidden",
                    }}>
                        <div style={{ position: "absolute", top: -30, right: -20, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -35, right: 50, width: 75, height: 75, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: "50%",
                                background: "rgba(255,255,255,0.20)",
                                border: "2px solid rgba(255,255,255,0.40)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}>
                                {botAvatar
                                    ? <img src={botAvatar} alt={botName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>{botName.charAt(0).toUpperCase()}</span>
                                }
                            </div>
                            <div style={{
                                position: "absolute", bottom: 1, right: 1,
                                width: 9, height: 9, borderRadius: "50%",
                                background: "#22c55e", border: "1.5px solid #ea5a00",
                                animation: "onlinePulse 2s ease-in-out infinite",
                            }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{botName}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.72)" }}>{domainName}</p>
                        </div>

                        <div style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "4px 10px", borderRadius: 20,
                            background: "rgba(255,255,255,0.15)",
                            border: "1px solid rgba(255,255,255,0.25)",
                        }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#86efac" }} />
                            <span style={{ fontSize: 10.5, color: "#fff", fontWeight: 500, letterSpacing: "0.03em" }}>Online</span>
                        </div>
                    </div>

                    {/* ── Messages ── */}
                    <div ref={ref} className="bot-scroll" style={{
                        flex: 1, overflowY: "auto",
                        padding: "16px 14px",
                        display: "flex", flexDirection: "column", gap: 10,
                        background: theme || "#f9f6f3",
                        color: textColor || "#1a1a1a",
                    }}>
                        {chats.length === 0 && (
                            <div style={{ textAlign: "center", marginTop: 40, opacity: 0.55 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: "rgba(249,117,24,0.09)",
                                    border: "1px solid rgba(249,117,24,0.18)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 10px",
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            stroke="#f97518" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Say hi to get started!</p>
                            </div>
                        )}
                        {chats.map(chat => <Bubble key={chat._id} message={chat} />)}
                        {onResponding && <Responding />}
                    </div>

                    {/* ── Input ── */}
                    <form onSubmit={onChat} style={{
                        padding: "10px 12px 8px",
                        borderTop: "1px solid #ede8e2",
                        background: "#fff", flexShrink: 0,
                    }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                {...register("content")}
                                placeholder="Type your message..."
                                className="bot-input"
                                style={{
                                    flex: 1, padding: "10px 14px",
                                    borderRadius: 13,
                                    border: "1.5px solid #ede8e2",
                                    background: "#f9f6f3",
                                    color: "#1a1a1a", fontSize: 13.5,
                                    fontFamily: "'DM Sans',sans-serif",
                                }}
                            />
                            <button type="submit" className="bot-send" style={{
                                width: 40, height: 40, borderRadius: 12,
                                border: "none", cursor: "pointer", flexShrink: 0,
                                background: "linear-gradient(135deg,#f97518,#ea5a00)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(249,117,24,0.30)",
                            }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        {errors.content && (
                            <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5, marginLeft: 2 }}>
                                {errors.content.message}
                            </p>
                        )}
                    </form>

                    {/* ── Footer ── */}
                    <div style={{
                        padding: "4px 16px 8px", textAlign: "center",
                        background: "#fff", borderTop: "1px solid #f5f0eb", flexShrink: 0,
                    }}>
                        <p style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.05em", margin: 0 }}>
                            POWERED BY <span style={{ color: "#f97518", fontWeight: 600 }}>DEVXCRIPT</span>
                        </p>
                    </div>
                </div>
            </>
        );
    }
);

BotWindow.displayName = "BotWindow";