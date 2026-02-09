export type ToneType = "professional" | "friendly" | "salesy";
export type IndustryType = "ecommerce" | "services" | "saas" | "other";

export interface IDomain {
    _id: string;
    domainName: string;
    domainKey: string;
    botName: string;
    botAvatar?: string | null;
    tone: ToneType;
    botEnabled: boolean;
    fallbackMessage: string;
    companyDescription?: string | null;
    industryType: IndustryType;
    createdAt: string;
    updatedAt: string;
}

export interface DomainFilters {
    search?: string;
    tone?: ToneType;
    industry?: IndustryType;
    status?: "enabled" | "disabled";
}

export interface PaginationState {
    page: number;
    limit: number;
    total: number;
}