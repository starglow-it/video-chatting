import { IMediaCategory, IPreviewImage } from './common';
import { IUserTemplate } from './templates';

export enum MediaCategoryType {
  Background = 'background',
  Sound = 'sound',
}

export enum MediaStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export interface IMedia {
  mediaCategory: IMediaCategory;
  url: string;
  name: string;
  previewUrls: IPreviewImage[];
  type: string;
  userTemplate: IUserTemplate;
  thumb: string;
  status: MediaStatus;
}
