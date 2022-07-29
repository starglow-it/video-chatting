import { BusinessCategory, Language, ProfileAvatarT, SocialLink, PreviewImage } from './profile';
import { MeetingInstance } from './meeting';

export interface Template {
    id: string;
    usedAt: string;
    templateId: number;
    url: string;
    name: string;
    maxParticipants: number;
    businessCategories: BusinessCategory[];
    description: string;
    previewUrls: PreviewImage[];
    type: string;
    companyName: string;
    contactEmail: string;
    fullName: string;
    position: string;
    languages: Language[];
    socials: SocialLink[];
    customLink: string;
    links?: { id: string; item: string; position: { top: number; left: number } }[];
    usersPosition: { top: number; left: number }[];
}

export interface UserTemplate extends Template {
    signBoard: string;
    isMonetizationEnabled: boolean;
    templatePrice: number;
    templateCurrency: 'USD' | 'CAD';
    meetingInstance?: MeetingInstance;
    user?: {
        profileAvatar: ProfileAvatarT;
    };
}
