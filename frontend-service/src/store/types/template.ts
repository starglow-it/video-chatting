import {BusinessCategory, Language, ProfileAvatar, SocialLink} from './profile';
import {MeetingInstance} from "./meeting";

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
    position: string;
    languages: Language[];
    socials: SocialLink[];
    meetingInstance?: MeetingInstance;
    user?: {
        profileAvatar: ProfileAvatar
    },
    usersPosition: { top: number; left: number }[]
}
