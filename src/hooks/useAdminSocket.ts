// src/hooks/useAdminSocket.ts
import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IChatMessage } from "@/api/AdminChatApi";

interface UseAdminSocketOptions {
    token: string;
    userId: string | null;
    onChatHistory?: (data: {
        chat: any;
        messages: IChatMessage[];
        pagination: any;
    }) => void;
    onNewMessage?: (message: IChatMessage) => void;
    onError?: (error: string) => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
}

export const useAdminSocket = ({
    token,
    userId,
    onChatHistory,
    onNewMessage,
    onError,
    onConnected,
    onDisconnected,
}: UseAdminSocketOptions) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const currentUserIdRef = useRef<string | null>(null);

    // Use refs to keep callbacks up to date
    const onChatHistoryRef = useRef(onChatHistory);
    const onNewMessageRef = useRef(onNewMessage);
    const onErrorRef = useRef(onError);
    const onConnectedRef = useRef(onConnected);
    const onDisconnectedRef = useRef(onDisconnected);

    // Keep callback refs in sync
    useEffect(() => {
        onChatHistoryRef.current = onChatHistory;
        onNewMessageRef.current = onNewMessage;
        onErrorRef.current = onError;
        onConnectedRef.current = onConnected;
        onDisconnectedRef.current = onDisconnected;
    });

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
            console.log("Admin socket connected");
            setIsConnected(true);
            onConnectedRef.current?.();

            // If we have a userId selected, rejoin that chat
            if (currentUserIdRef.current) {
                socket.emit("admin_join", { userId: currentUserIdRef.current });
            }
        });

        socket.on("disconnect", () => {
            console.log("Admin socket disconnected");
            setIsConnected(false);
            onDisconnectedRef.current?.();
        });

        socket.on("connect_error", (err) => {
            console.error("Admin socket connection error:", err);
            setIsConnected(false);
            onDisconnectedRef.current?.();
        });

        // Listen for chat history when joining
        socket.on("admin_chat_history", (data: {
            chat: any;
            messages: IChatMessage[];
            pagination: any;
        }) => {
            console.log("Received admin chat history:", data);
            onChatHistoryRef.current?.(data);
        });

        // Listen for incoming messages
        socket.on("admin_chat_message", (message: IChatMessage) => {
            console.log("Received admin chat message:", message);
            onNewMessageRef.current?.(message);
        });

        // Listen for errors
        socket.on("error", (data: { message: string }) => {
            console.error("Admin socket error:", data.message);
            onErrorRef.current?.(data.message);
        });

        return () => {
            console.log("Cleaning up admin socket");
            socket.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        };
    }, [token]);

    /**
     * Join a specific user's support chat
     */
    const joinChat = useCallback((userId: string) => {
        if (socketRef.current?.connected) {
            currentUserIdRef.current = userId;
            socketRef.current.emit("admin_join", { userId });
        } else {
            console.error("Socket not connected, cannot join chat");
        }
    }, []);

    /**
     * Send a message to a user's support chat via socket
     */
    const sendMessage = useCallback((userId: string, content: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("admin_message", { userId, content });
        } else {
            console.error("Socket not connected, cannot send message");
            onErrorRef.current?.("Not connected to chat");
        }
    }, []);

    return {
        socket: socketRef.current,
        sendMessage,
        joinChat,
        isConnected,
    };
};
