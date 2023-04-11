import {IMediaCategory, IPreviewImage } from "./common";

export interface IMedia {
    mediaCategory: IMediaCategory;
    url: string;
    previewUrls: IPreviewImage[];
    type: string;
}