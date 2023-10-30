import {IMediaCategory, IPreviewImage } from "./common";
import { IUserTemplate } from "./templates";

export enum MediaCategoryType {
    Background = 'background',
    Sound = 'sound'
}

export interface IMedia {
    mediaCategory: IMediaCategory;
    url: string;
    name: string;
    previewUrls: IPreviewImage[];
    type: string;
    userTemplate: IUserTemplate;
    thumb: string;
}