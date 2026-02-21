export interface IMessage {
    _id: string;
    conversationId: string;
    sender: "visitor" | "bot" | "human";
    content: string;
    isRead: boolean;
    meta?: Record<string, any>;
    createdAt: string;
    updatedAt?: string;
}

export interface IConversation {
    _id: string;
    domainId: string | {
        _id: string;
        domainName: string;
        domainKey: string;
    };
    userId: string;
    visitorId: string;
    status: "active" | "handoff";
    aiEnabled: boolean;
    lastMessageAt: string;
    createdAt: string;
    lastMessage?: IMessage | null;
    messages?: IMessage[];
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface IConversationStats {
    total: number;
    active: number;
    handoff: number;
}

export interface ConversationFilters {
    domainId?: string;
    status?: "active" | "handoff";
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface SocketMessage {
    conversationId: string;
    message: IMessage;
    isNewConversation?: boolean;
}

export interface TypingIndicator {
    conversationId: string;
    visitorId: string;
    isTyping: boolean;
}