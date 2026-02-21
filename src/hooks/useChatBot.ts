"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { io, Socket } from "socket.io-client";
import { DomainApi, IDomain } from "@/api/DomainApi";
import { useConversationStore } from "@/store/conversations.store";
import { IMessage } from "@/api/ConversationsApi";

interface BotConfig {
    domainName: string;
    botName: string;
    botAvatar?: string | null;
    tone: string;
    fallbackMessage: string;
    botEnabled: boolean;
}

// Persists across hot-reloads in dev, and survives component remounts
const getOrCreateVisitorId = (): string => {
    let id = localStorage.getItem("chatbot-visitor-id");
    if (!id) {
        id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("chatbot-visitor-id", id);
    }
    return id;
};

export const useChatBot = (domainKey: string) => {
    const [botOpened, setBotOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentBot, setCurrentBot] = useState<BotConfig | null>(null);
    const [domainId, setDomainId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messageWindowRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const visitorIdRef = useRef<string>("");

    const {
        publicMessages,
        publicConversation,
        setPublicMessages,
        setPublicConversation,
        addPublicMessage,
        setVisitorId,
        requestHandoff,
    } = useConversationStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<{ content: string }>();

    // ── Step 1: Fetch domain config ──────────────────────────────────────────
    useEffect(() => {
        if (!domainKey) return;

        const fetchDomainConfig = async () => {
            try {
                setLoading(true);
                const domain: IDomain & { _id: string } = await DomainApi.getByKey(domainKey);

                if (!domain.botEnabled) {
                    setCurrentBot(null);
                    return;
                }

                setDomainId(domain._id);
                setCurrentBot({
                    domainName: domain.domainName,
                    botName: domain.botName,
                    botAvatar: domain.botAvatar,
                    tone: domain.tone,
                    fallbackMessage: domain.fallbackMessage,
                    botEnabled: domain.botEnabled,
                });
            } catch (error) {
                console.error("Failed to load chatbot config:", error);
                setCurrentBot(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDomainConfig();
    }, [domainKey]);

    // ── Step 2: Connect socket + join conversation once domainId is ready ────
    useEffect(() => {
        if (!domainId) return;

        const visitorId = getOrCreateVisitorId();
        visitorIdRef.current = visitorId;
        setVisitorId(visitorId);

        // Visitors connect without a JWT token
        const socket = io(
            process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
            {
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                // No auth.token — visitor connections are unauthenticated
            }
        );

        socketRef.current = socket;

        socket.on("connect", () => {
            // Join conversation — server returns history or creates new one
            socket.emit("join_conversation", {
                domainId,
                visitorId,
                // No conversationId — server handles get-or-create
            });
        });

        // Server returns full conversation history
        socket.on("conversation_history", (data: {
            conversation: any;
            messages: IMessage[];
        }) => {
            setPublicConversation(data.conversation);

            if (data.messages.length > 0) {
                // Restore history from server
                setPublicMessages(data.messages);
            } else if (currentBot) {
                // Fresh conversation — show welcome message
                setPublicMessages([{
                    _id: `welcome-${Date.now()}`,
                    conversationId: data.conversation._id,
                    sender: "bot",
                    content: `Hi! I'm ${currentBot.botName}. How can I help you today?`,
                    isRead: true,
                    createdAt: new Date().toISOString(),
                }]);
            }
        });

        // Incoming message (bot reply, human agent reply)
        socket.on("new_message", (message: IMessage) => {
            if (message.sender !== "visitor") {
                setIsTyping(false);
                addPublicMessage(message);
            }
        });

        // Human handoff acknowledged
        socket.on("handoff_requested", () => {
            setIsTyping(false);
        });

        socket.on("error", (data: { message: string }) => {
            console.error("Socket error:", data.message);
            setIsTyping(false);
        });

        socket.on("disconnect", () => {
            console.log("Widget socket disconnected");
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [domainId]); // only reconnect if domainId changes

    // ── Step 3: Set welcome message when bot config arrives (fresh chat) ──────
    // This handles the edge case where conversation_history fires before currentBot is set
    useEffect(() => {
        if (!currentBot || publicMessages.length > 0) return;
        if (!publicConversation) return;

        setPublicMessages([{
            _id: `welcome-${Date.now()}`,
            conversationId: publicConversation._id,
            sender: "bot",
            content: `Hi! I'm ${currentBot.botName}. How can I help you today?`,
            isRead: true,
            createdAt: new Date().toISOString(),
        }]);
    }, [currentBot, publicConversation]);

    // ── Auto-scroll ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (messageWindowRef.current) {
            setTimeout(() => {
                if (messageWindowRef.current) {
                    messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
                }
            }, 0);
        }
    }, [publicMessages, isTyping]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const onOpenChatBot = useCallback(() => {
        setBotOpened((prev) => !prev);
    }, []);

    const onStartChatting = handleSubmit(async (values) => {
        const content = values.content.trim();
        if (!content || !socketRef.current?.connected || !publicConversation) return;

        // Optimistically add visitor message
        const optimisticMsg: IMessage = {
            _id: `temp-${Date.now()}`,
            conversationId: publicConversation._id,
            sender: "visitor",
            content,
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        addPublicMessage(optimisticMsg);
        setIsTyping(true);
        reset();

        // Send via socket — AI response comes back as "new_message" event
        socketRef.current.emit("visitor_message", {
            domainId,
            visitorId: visitorIdRef.current,
            content,
        });
    });

    const onRequestHandoff = useCallback(() => {
        if (!socketRef.current?.connected || !domainId) return;

        socketRef.current.emit("request_handoff", {
            domainId,
            visitorId: visitorIdRef.current,
        });
    }, [domainId]);

    return {
        botOpened,
        onOpenChatBot,
        onChats: publicMessages,
        onAiTyping: isTyping,
        messageWindowRef,
        currentBot,
        loading,
        register,
        onStartChatting,
        errors,
        onRequestHandoff,
        conversation: publicConversation,
    };
};