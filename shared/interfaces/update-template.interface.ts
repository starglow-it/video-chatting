export interface IUpdateTemplate {
    companyName: string;
    contactEmail: string;
    description: string;
    fullName: string;
    position: string;
    signBoard: string;
    businessCategories?: string[];
    languages?: string[];
    socials: {
        youtube?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
        custom?: string;
    }
}