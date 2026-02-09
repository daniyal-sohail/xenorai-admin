import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { IMessage, IConversation } from "./ConversationTypes";

interface UseSocketOptions {
    userId: string;
    domainId?: string;
    onNewMessage?: (message: IMessage) => void;
    onConversationUpdate?: (conversation: IConversation) => void;
    onHandoffRequest?: (data: any) => void;
    onError?: (error: string) => void;
}

export const useSocket = ({
    userId,
    domainId,
    onNewMessage,
    onConversationUpdate,
    onHandoffRequest,
    onError,
}: UseSocketOptions) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to Socket.IO server
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);

            // Join owner room if domainId is provided
            if (domainId) {
                socket.emit("owner_join", { userId, domainId });
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        socket.on("error", (data: { message: string }) => {
            console.error("Socket error:", data.message);
            onError?.(data.message);
        });

        // Listen for new visitor messages
        socket.on("visitor_message_received", (data: any) => {
            console.log("Visitor message received:", data);
            if (onNewMessage) {
                onNewMessage(data.message);
            }
        });

        // Listen for AI responses
        socket.on("ai_response_sent", (data: any) => {
            console.log("AI response sent:", data);
            if (onNewMessage) {
                onNewMessage(data.message);
            }
        });

        // Listen for handoff requests
        socket.on("handoff_request", (data: any) => {
            console.log("Handoff request:", data);
            if (onHandoffRequest) {
                onHandoffRequest(data);
            }
        });

        // Listen for conversation updates
        socket.on("conversations_list", (data: any) => {
            console.log("Conversations list updated:", data);
        });

        // Listen for message confirmation
        socket.on("message_sent", (message: IMessage) => {
            console.log("Message sent confirmation:", message);
            if (onNewMessage) {
                onNewMessage(message);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, domainId, onNewMessage, onConversationUpdate, onHandoffRequest, onError]);

    const sendMessage = useCallback(
        (conversationId: string, visitorId: string, content: string, domainId: string) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit("owner_message", {
                    conversationId,
                    domainId,
                    visitorId,
                    content,
                    userId,
                });
            }
        },
        [userId]
    );

    const toggleAI = useCallback(
        (conversationId: string, domainId: string, visitorId: string, enableAI: boolean) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit("toggle_ai", {
                    conversationId,
                    domainId,
                    visitorId,
                    enableAI,
                });
            }
        },
        []
    );

    const closeConversation = useCallback(
        (conversationId: string, domainId: string, visitorId: string) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit("close_conversation", {
                    conversationId,
                    domainId,
                    visitorId,
                });
            }
        },
        []
    );

    return {
        socket: socketRef.current,
        sendMessage,
        toggleAI,
        closeConversation,
        isConnected: socketRef.current?.connected || false,
    };
};