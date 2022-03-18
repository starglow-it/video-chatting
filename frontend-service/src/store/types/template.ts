import { BusinessCategory, Language, SocialLink } from './profile';

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
}
