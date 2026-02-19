"use client";

import AiChatBot from "@/components/chatbot/AiChatBot";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/* When there's no key, still show a FAB-sized placeholder so iframe stays small */
function NoKeyFab() {
    return (
        <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent",
        }}>
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #f97518, #ea5a00)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 18px rgba(249,117,24,0.38)",
                cursor: "not-allowed", opacity: 0.6,
            }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

function LoadingFab() {
    return (
        <>
            <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent",
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97518, #ea5a00)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 18px rgba(249,117,24,0.38)",
                }}>
                    <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        border: "2.5px solid rgba(255,255,255,0.3)",
                        borderTop: "2.5px solid white",
                        animation: "_spin 0.75s linear infinite",
                    }} />
                </div>
            </div>
        </>
    );
}

function ChatContent() {
    const searchParams = useSearchParams();
    const domainKey = searchParams.get("key");

    if (!domainKey) return <NoKeyFab />;
    return <AiChatBot domainKey={domainKey} />;
}

export default function ChatPage() {
    return (
        /*
         * This div fills the iframe (which starts at 68×68).
         * NO flex centering here — AiChatBot handles its own layout.
         */
        <div style={{ width: "100%", height: "100%", background: "transparent" }}>
            <Suspense fallback={<LoadingFab />}>
                <ChatContent />
            </Suspense>
        </div>
    );
}