"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
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

export const useChatBot = (domainKey: string) => {
    const [botOpened, setBotOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentBot, setCurrentBot] = useState<BotConfig | null>(null);
    const messageWindowRef = useRef<HTMLDivElement | null>(null);

    // Store methods
    const {
        publicConversation,
        publicMessages,
        publicLoading,
        visitorId,
        sendPublicMessage,
        requestHandoff,
        setVisitorId,
        setPublicMessages,
    } = useConversationStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<{ content: string }>();

    // Initialize visitor ID
    useEffect(() => {
        const getOrCreateVisitorId = () => {
            let id = localStorage.getItem("chatbot-visitor-id");
            if (!id) {
                id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            return id;
        };

        const id = getOrCreateVisitorId();
        setVisitorId(id);
    }, [setVisitorId]);

    // Fetch domain configuration
    useEffect(() => {
        const fetchDomainConfig = async () => {
            try {
                setLoading(true);
                const domain: IDomain = await DomainApi.getByKey(domainKey);

                if (!domain.botEnabled) {
                    setCurrentBot(null);
                    return;
                }

                setCurrentBot({
                    domainName: domain.domainName,
                    botName: domain.botName,
                    botAvatar: domain.botAvatar,
                    tone: domain.tone,
                    fallbackMessage: domain.fallbackMessage,
                    botEnabled: domain.botEnabled,
                });

                // Initialize with welcome message if no messages exist
                if (publicMessages.length === 0) {
                    setPublicMessages([
                        {
                            _id: `msg-${Date.now()}`,
                            conversationId: "",
                            sender: "bot",
                            content: `Hi! I'm ${domain.botName}. How can I help you today?`,
                            createdAt: new Date().toISOString(),
                        },
                    ]);
                }
            } catch (error) {
                console.error("Failed to load chatbot config:", error);
                setCurrentBot(null);
            } finally {
                setLoading(false);
            }
        };

        if (domainKey) {
            fetchDomainConfig();
        }
    }, [domainKey, publicMessages.length, setPublicMessages]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messageWindowRef.current) {
            setTimeout(() => {
                if (messageWindowRef.current) {
                    messageWindowRef.current.scrollTop =
                        messageWindowRef.current.scrollHeight;
                }
            }, 0);
        }
    }, [publicMessages, publicLoading]);

    const onOpenChatBot = useCallback(() => {
        setBotOpened((prev) => !prev);
    }, []);

    const onStartChatting = handleSubmit(async (values) => {
        if (!values.content.trim()) return;

        try {
            await sendPublicMessage(domainKey, values.content);
            reset();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    });

    const onRequestHandoff = useCallback(async () => {
        try {
            await requestHandoff(domainKey);
        } catch (error) {
            console.error("Failed to request handoff:", error);
        }
    }, [domainKey, requestHandoff]);

    return {
        botOpened,
        onOpenChatBot,
        onChats: publicMessages,
        onAiTyping: publicLoading,
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
