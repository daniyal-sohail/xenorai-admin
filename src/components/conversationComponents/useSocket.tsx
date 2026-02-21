import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IMessage, IConversation } from "./ConversationTypes";

interface UseSocketOptions {
    token: string;
    domainId?: string;
    onNewMessage?: (message: IMessage) => void;
    onConversationsList?: (data: any) => void;
    onUnreadCounts?: (counts: Record<string, number>) => void;
    onHandoffRequest?: (data: any) => void;
    onVisitorMessageReceived?: (data: any) => void;
    onAiResponseSent?: (data: any) => void;
    onError?: (error: string) => void;
}

export const useSocket = ({
    token,
    domainId,
    onNewMessage,
    onConversationsList,
    onUnreadCounts,
    onHandoffRequest,
    onVisitorMessageReceived,
    onAiResponseSent,
    onError,
}: UseSocketOptions) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false); // useState so UI re-renders

    useEffect(() => {
        if (!token) return;

        const socket = io(
            process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
            {
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                auth: { token },
            }
        );

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            if (domainId) {
                socket.emit("owner_join", { domainId });
            }
        });

        socket.on("disconnect", () => setIsConnected(false));
        socket.on("connect_error", () => setIsConnected(false));

        socket.on("error", (data: { message: string }) => {
            console.error("Socket error:", data.message);
            onError?.(data.message);
        });

        socket.on("conversations_list", (data: any) => onConversationsList?.(data));
        socket.on("unread_counts", (counts: Record<string, number>) => onUnreadCounts?.(counts));
        socket.on("visitor_message_received", (data: any) => {
            onVisitorMessageReceived?.(data);
            if (onNewMessage) onNewMessage(data.message);
        });
        socket.on("ai_response_sent", (data: any) => {
            onAiResponseSent?.(data);
            if (onNewMessage) onNewMessage(data.message);
        });
        socket.on("handoff_request", (data: any) => onHandoffRequest?.(data));
        socket.on("message_sent", (message: IMessage) => { if (onNewMessage) onNewMessage(message); });
        socket.on("ai_enabled", (data: any) => console.log("AI enabled:", data));
        socket.on("ai_disabled", (data: any) => console.log("AI disabled:", data));

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        };
    }, [token, domainId]);

    const sendMessage = useCallback(
        (conversationId: string, visitorId: string, content: string, domainId: string) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit("owner_message", { conversationId, domainId, visitorId, content });
            }
        }, []
    );

    const toggleAI = useCallback(
        (conversationId: string, domainId: string, visitorId: string, enableAI: boolean) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit("toggle_ai", { conversationId, domainId, visitorId, enableAI });
            }
        }, []
    );

    return { socket: socketRef.current, sendMessage, toggleAI, isConnected };
};