import { BusinessCategory, Language, ProfileAvatarT, SocialLink } from './profile';
import { MeetingInstance } from './meeting';

export type Template = {
    id: string;
    usedAt: string;
    templateId: number;
    url: string;
    name: string;
    maxParticipants: number;
    businessCategories: BusinessCategory[];
    description: string;
    previewUrl: string;
    type: string;
    companyName: string;
    contactEmail: string;
    fullName: string;
    position: string;
    languages: Language[];
    socials: SocialLink[];
};

export type UserTemplate = {
    id: string;
    usedAt: string;
    templateId: number;
    url: string;
    name: string;
    maxParticipants: number;
    businessCategories: BusinessCategory[];
    description: string;
    previewUrl: string;
    type: string;
    companyName: string;
    contactEmail: string;
    fullName: string;
    signBoard: string;
    isMonetizationEnabled: boolean;
    templatePrice: number;
    templateCurrency: "USD" | "CAD";
    position: string;
    customLink: string;
    languages: Language[];
    socials: SocialLink[];
    meetingInstance?: MeetingInstance;
    user?: {
        profileAvatar: ProfileAvatarT;
    };
    usersPosition: { top: number; left: number }[];
    links?: { id: string; item: string; position: { top: number; left: number } }[];
};
