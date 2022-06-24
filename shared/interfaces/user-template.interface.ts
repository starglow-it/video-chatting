import { IBusinessCategory } from "./business-category.interface";
import {ILanguage} from "./common-language.interface";
import {ISocialLink} from "./common-social-link.interface";
import {ITemplateUserDTO} from "./template-user.interface";

export interface IUserTemplate {
    id: string;
    usedAt?: string;
    templateId: number;
    url: string;
    name: string;
    maxParticipants: number;
    description: string;
    previewUrl: string;
    type: string;
    fullName: string;
    companyName: string;
    position: string;
    contactEmail: string;
    isMonetizationEnabled: boolean;
    templatePrice: string;
    templateCurrency: string;
    businessCategories: IBusinessCategory[];
    languages: ILanguage[];
    socials: ISocialLink[];
    user: ITemplateUserDTO;
    usersPosition: { top: number; left: number }[];
}