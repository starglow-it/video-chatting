import {
    IBusinessCategory,
    ILanguage,
    ISocialLink,
    IProfileAvatar,
} from "./common";

export interface ICommonUser {
    id: string;
    email: string;
    country: string;
    role: string;
    password: string;
    isConfirmed: boolean;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    position: string;
    companyName: string;
    contactEmail: string;
    description: string;
    isResetPasswordActive: boolean;
    businessCategories: IBusinessCategory[];
    languages: ILanguage[];
    socials: ISocialLink[];
    profileAvatar: IProfileAvatar;
    signBoard: string;
    stripeAccountId: string;
    stripeSessionId?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionPlanKey?: string;
    isSubscriptionActive?: boolean;
    stripeEmail: string;
    isStripeEnabled: boolean;
    wasSuccessNotificationShown: boolean;
    shouldShowTrialExpiredNotification: boolean;
    maxTemplatesNumber: number;
    maxMeetingTime: number;
    renewSubscriptionTimestampInSeconds: number;
    isProfessionalTrialAvailable: boolean;
}

export interface IUpdateProfile {
    email?: string;
    country?: string;
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
    stripeSessionId?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionPlanKey?: string;
    isSubscriptionActive?: boolean;
    maxTemplatesNumber?: number;
    maxMeetingTime?: number;
    isStripeEnabled?: boolean;
    wasSuccessNotificationShown?: boolean;
    renewSubscriptionTimestampInSeconds?: number;
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

export interface IUpdateProfileAvatar {
    profileAvatar: string;
    size: number;
    mimeType: string;
}

export interface ITemplateUser {
    id: string;
    profileAvatar: IProfileAvatar;
    maxMeetingTime: ICommonUser["maxMeetingTime"];
}