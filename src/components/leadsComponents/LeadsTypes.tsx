export interface ILead {
    _id: string;
    domainId: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    productsInterested?: string[];
    recommendedProduct?: string | null;
    tags?: string[];
    conversationId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface ILeadStats {
    total: number;
    byDomain: Array<{
        _id: string;
        total: number;
    }>;
}

export interface LeadFilters {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    hasPhone?: boolean;
    hasName?: boolean;
}

export interface LeadFormData {
    name?: string;
    phone?: string;
    email?: string;
}