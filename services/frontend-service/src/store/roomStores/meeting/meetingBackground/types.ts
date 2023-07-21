import { IMedia, IMediaCategory } from 'shared-types';

export interface IMediaItem extends IMedia {
    id: string;
}

export type UploadBackgroundPayload = {
    file: File;
    userTemplateId: string;
    categoryId: string;
};

export type ParamsDeleteMedia = {
    categoryId: string;
    userTemplateId: string;
    deleteId: string;
};

export type ResultDeleteMedia = {
    success: boolean;
    message: string;
};

export interface IMediaCategoryItem extends IMediaCategory {
    id: string;
}
