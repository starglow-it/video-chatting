import { IBusinessCategory, IPreviewImage } from "./common";

export interface IBusinessMedia {
    businessCategory: IBusinessCategory;
    url: string;
    previewUrls: IPreviewImage[];
}