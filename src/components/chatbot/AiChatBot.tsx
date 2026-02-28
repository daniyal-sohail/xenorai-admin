"use client";

import React, { useCallback, useEffect } from "react";
import { BotWindow } from "./BotWindow";
import { BotIcon } from "./BotIcon";
import { useChatBot } from "@/hooks/useChatBot";

interface AiChatBotProps {
    domainKey: string;
}

function postToParent(type: "DEVXCRIPT_OPEN" | "DEVXCRIPT_CLOSE") {
    try { window.parent.postMessage({ type }, "*"); } catch (_) { }
}

const AiChatBot: React.FC<AiChatBotProps> = ({ domainKey }) => {
    const {
        onOpenChatBot,
        botOpened,
        onChats,
        register,
        onStartChatting,
        onAiTyping,
        messageWindowRef,
        currentBot,
        loading,
        errors,
    } = useChatBot(domainKey);

    useEffect(() => {
        postToParent("DEVXCRIPT_CLOSE");
    }, []);

    // Only ONE useEffect fires postMessage
    useEffect(() => {
        if (botOpened) {
            postToParent("DEVXCRIPT_OPEN");
        } else {
            postToParent("DEVXCRIPT_CLOSE");
        }
    }, [botOpened]);

    // handleFab ONLY toggles — no postMessage here
    const handleFab = useCallback(() => {
        onOpenChatBot();
    }, [onOpenChatBot]);

    /* ─────────────────────────────────────────────────
     * CLOSED / LOADING state
     * iframe wrapper is 68×68 fixed bottom-right already.
     * html/body must also be 68×68 with no margin/padding
     * so the FAB sits flush inside.
     * ───────────────────────────────────────────────── */
    if (loading || !botOpened) {
        const icon = loading ? (
            <>
                <style>{`@keyframes _sp { to { transform:rotate(360deg); } }`}</style>
                <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: "2.5px solid rgba(255,255,255,0.3)",
                    borderTop: "2.5px solid #fff",
                    animation: "_sp 0.7s linear infinite",
                }} />
            </>
        ) : !currentBot ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ) : currentBot.botAvatar ? (
            <img
                src={currentBot.botAvatar}
                alt="bot"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
        ) : (
            <BotIcon />
        );

        return (
            <>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    html, body { width: 68px; height: 68px; overflow: hidden; background: transparent; }
                    @keyframes fabPop {
                        0%   { transform: scale(0);    opacity: 0; }
                        70%  { transform: scale(1.18); opacity: 1; }
                        100% { transform: scale(1);    opacity: 1; }
                    }
                    @keyframes fabRing {
                        0%   { box-shadow: 0 0 0 0    rgba(249,117,24,0.6),  0 4px 16px rgba(249,117,24,0.35); }
                        70%  { box-shadow: 0 0 0 14px rgba(249,117,24,0),    0 4px 16px rgba(249,117,24,0.35); }
                        100% { box-shadow: 0 0 0 0    rgba(249,117,24,0),    0 4px 16px rgba(249,117,24,0.35); }
                    }
                    .devx-fab-closed {
                        animation: fabPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both,
                                   fabRing 2.5s ease-out 0.5s 3;
                        transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
                    }
                    .devx-fab-closed:hover  { transform: scale(1.14) !important; box-shadow: 0 8px 26px rgba(249,117,24,0.52) !important; }
                    .devx-fab-closed:active { transform: scale(0.88) !important; }
                `}</style>

                {/* Fill the 68x68 iframe completely — wrapper script handles positioning */}
                <div style={{
                    width: 68,
                    height: 68,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                }}>
                    <button
                        onClick={loading || !currentBot ? undefined : handleFab}
                        className="devx-fab-closed"
                        aria-label="Open chat"
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            border: "none",
                            cursor: loading || !currentBot ? "default" : "pointer",
                            background: "linear-gradient(135deg, #f97518 0%, #ea5a00 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(249,117,24,0.38)",
                            overflow: "hidden",
                            padding: 0,
                            position: "relative",
                            flexShrink: 0,
                        }}
                    >
                        <div style={{
                            position: "absolute", top: 6, left: 9,
                            width: 16, height: 4, borderRadius: 10,
                            background: "rgba(255,255,255,0.28)",
                            transform: "rotate(-30deg)", pointerEvents: "none",
                        }} />
                        {icon}
                    </button>
                </div>
            </>
        );
    }

    /* ─────────────────────────────────────────────────
     * OPEN state — parent wrapper is now 420×640
     * ───────────────────────────────────────────────── */
    if (!currentBot) return null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body { width: 420px; height: 640px; overflow: hidden; background: transparent; }
                .devx-fab-open {
                    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
                }
                .devx-fab-open:hover  { transform: scale(1.12) !important; box-shadow: 0 8px 24px rgba(249,117,24,0.50) !important; }
                .devx-fab-open:active { transform: scale(0.88) !important; }
            `}</style>

            <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "transparent",
            }}>
                <div style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    bottom: 76,
                }}>
                    <BotWindow
                        errors={errors}
                        domainName={currentBot.domainName}
                        botName={currentBot.botName}
                        botAvatar={currentBot.botAvatar}
                        ref={messageWindowRef}
                        chats={onChats}
                        register={register}
                        onChat={onStartChatting}
                        onResponding={onAiTyping}
                    />
                </div>

                {/* Close FAB */}
                <button
                    onClick={handleFab}
                    className="devx-fab-open"
                    aria-label="Close chat"
                    style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        background: "linear-gradient(135deg, #f97518 0%, #ea5a00 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(249,117,24,0.40)",
                        overflow: "hidden",
                        padding: 0,
                    }}
                >
                    <div style={{
                        position: "absolute", top: 6, left: 9,
                        width: 16, height: 4, borderRadius: 10,
                        background: "rgba(255,255,255,0.28)",
                        transform: "rotate(-30deg)", pointerEvents: "none",
                    }} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12"
                            stroke="white" strokeWidth="2.4"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </>
    );
};

export default AiChatBot;