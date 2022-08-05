import { IBusinessCategory } from "./business-category.interface";
import {IPreviewImage} from "./preview-image.interface";

export interface ICommonTemplate {
    id?: string;
    usedAt?: string;
    templateId: number;
    url: string;
    name: string;
    maxParticipants: number;
    description: string;
    previewUrls: IPreviewImage[];
    type: string;
    businessCategories?: IBusinessCategory[];
    usersPosition: { bottom: number; left: number }[];
    links?: { item: string; position: { top: number; left: number } }[];
    isAudioAvailable: boolean;
}