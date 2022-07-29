import {IBusinessCategory} from "./business-category.interface";
import {ILanguage} from "./common-language.interface";
import {ISocialLink} from "./common-social-link.interface";
import {IProfileAvatar} from "./profile-avatar.interface";

export interface ICommonUserDTO {
    id: string;
    email: string;
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
    stripeSubscriptionId?: string;
    subscriptionPlanKey?: string;
    isSubscriptionActive?: boolean;
    stripeEmail: string;
    isStripeEnabled: boolean;
    wasSuccessNotificationShown: boolean;
    maxTemplatesNumber: number;
    maxMeetingTime: number;
}