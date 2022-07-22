export interface IUpdateTemplate {
    companyName: string;
    contactEmail: string;
    description: string;
    fullName: string;
    position: string;
    signBoard: string;
    customLink?: string;
    businessCategories?: string[];
    languages?: string[];
    isMonetizationEnabled?: boolean;
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