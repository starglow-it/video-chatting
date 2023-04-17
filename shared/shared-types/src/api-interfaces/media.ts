import {IMediaCategory, IPreviewImage } from "./common";
import { IUserTemplate } from "./templates";

export enum MediaCategoryType {
    BACKGROUND = 'background',
    SOUND = 'sound'
}

export interface IMedia {
    mediaCategory: IMediaCategory;
    url: string;
    previewUrls: IPreviewImage[];
    type: string;
}

export interface IUserTemplateMedia extends IMedia {
    userTemplate: IUserTemplate
}