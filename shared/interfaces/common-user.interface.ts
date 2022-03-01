import {IBusinessCategory} from "./business-category.interface";
import {ILanguage} from "./common-language.interface";
import {ISocialLink} from "./common-social-link.interface";

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
    businessCategories: IBusinessCategory[];
    languages: ILanguage[];
    socials: ISocialLink[];
}