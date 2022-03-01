import { IBusinessCategory } from "./business-category.interface";

export interface ICommonTemplate {
    id?: string;
    usedAt?: string;
    templateId: number;
    url: string;
    name: string;
    maxParticipants: number;
    description: string;
    previewUrl: string;
    type: string;
    businessCategories?: IBusinessCategory[];
}