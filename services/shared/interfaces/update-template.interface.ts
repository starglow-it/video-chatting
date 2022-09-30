export interface IUpdateTemplate {
    companyName: string;
    contactEmail: string;
    name?: string;
    description: string;
    url?: string;
    previewUrls?: string[];
    fullName: string;
    position: string;
    signBoard: string;
    customLink?: string;
    businessCategories?: string[];
    usersPosition?: { bottom: number; left: number }[];
    maxParticipants?: number;
    languages?: string[];
    isMonetizationEnabled?: boolean;
    isPublic?: boolean;
    templatePrice?: number;
    templateCurrency?: string;
    socials: {
        youtube?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
        custom?: string;
    }
}