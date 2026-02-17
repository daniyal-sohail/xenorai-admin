import { useMemo, useState, useCallback } from "react";
import { IConversation, ConversationFilters } from "./ConversationTypes";

export const useConversationFilters = (conversations: IConversation[]) => {
    const [filters, setFilters] = useState<ConversationFilters>({});

    const filteredConversations = useMemo(() => {
        let result = [...conversations];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (conv) =>
                    conv.visitorId.toLowerCase().includes(searchLower) ||
                    (conv.lastMessage?.content &&
                        conv.lastMessage.content.toLowerCase().includes(searchLower))
            );
        }

        if (filters.status) {
            result = result.filter((conv) => conv.status === filters.status);
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            result = result.filter((conv) => new Date(conv.lastMessageAt) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            result = result.filter((conv) => new Date(conv.lastMessageAt) <= endDate);
        }

        result.sort(
            (a, b) =>
                new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );

        return result;
    }, [conversations, filters]);

    const handleFilterChange = useCallback((newFilters: ConversationFilters) => {
        setFilters(newFilters);
    }, []);

    const hasActiveFilters = !!(
        filters.search ||
        filters.status ||
        filters.startDate ||
        filters.endDate
    );

    return {
        filters,
        filteredConversations,
        handleFilterChange,
        hasActiveFilters,
    };
};