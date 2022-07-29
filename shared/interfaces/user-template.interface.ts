import { IBusinessCategory } from "./business-category.interface";
import {ILanguage} from "./common-language.interface";
import {ISocialLink} from "./common-social-link.interface";
import {ITemplateUserDTO} from "./template-user.interface";
import {IPreviewImage} from "./preview-image.interface";

export interface IUserTemplate {
    id: string;
    usedAt?: string;
    templateId: number;
    url: string;
    name: string;
    maxParticipants: number;
    description: string;
    previewUrls: IPreviewImage[];
    type: string;
    fullName: string;
    companyName: string;
    position: string;
    contactEmail: string;
    isMonetizationEnabled: boolean;
    templatePrice: number;
    templateCurrency: string;
    customLink: string;
    businessCategories: IBusinessCategory[];
    languages: ILanguage[];
    socials: ISocialLink[];
    user: ITemplateUserDTO;
    usersPosition: { top: number; left: number }[];
    links?: { item: string; position: { top: number; left: number } }[];
}