import { Template } from '../types';

export type BusinessCategory = {
    key: string;
    value: string;
    color: string;
};

export type SocialLink = {
    value: string;
    key: string;
};

export enum SocialLinkKeysEnum {
    Youtube = 'youtube',
    Facebook = 'facebook',
    Instagram = 'instagram',
    LinkedIn = 'linkedin',
    Twitter = 'twitter',
    Custom = 'custom',
}

export type Language = {
    value: string;
    key: string;
};

export type ProfileAvatarT = {
    id?: string;
    url: string;
    size: number;
    mimeType: string;
};

export type Profile = {
    id: string;
    fullName: string;
    position: string;
    profileAvatar: ProfileAvatarT;
    companyName: string;
    email: string;
    contactEmail: string;
    signBoard: string;
    stripeAccountId: string;
    stripeEmail: string;
    isStripeEnabled: boolean;
    wasSuccessNotificationShown: boolean;
    description: string;
    socials: SocialLink[];
    languages: Language[];
    businessCategories: BusinessCategory[];
    templates: Template[];
};

export type UpdateProfileInfo = {
    companyName?: Profile['companyName'];
    fullName?: Profile['fullName'];
    signBoard?: Profile['signBoard'];
    wasSuccessNotificationShown?: Profile['wasSuccessNotificationShown'];
};

export type UpdateProfileAvatar = {
    file: File;
};
