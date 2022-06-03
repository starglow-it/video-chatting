export interface IUpdateProfile {
    email?: string;
    companyName: string;
    contactEmail: string;
    businessCategories?: string[];
    description: string;
    languages?: string[];
    fullName: string;
    position: string;
    signBoard?: string;
    isResetPasswordActive?: boolean;
    socials: {
        youtube?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
        custom?: string;
    }
}