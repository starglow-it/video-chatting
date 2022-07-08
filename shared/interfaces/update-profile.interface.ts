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
    stripeAccountId?: string;
    stripeEmail?: string;
    isStripeEnabled?: boolean;
    wasSuccessNotificationShown?: boolean;
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