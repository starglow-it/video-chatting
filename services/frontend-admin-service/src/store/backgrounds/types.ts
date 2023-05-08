import { IMedia, IMediaCategory } from 'shared-types';

export interface IBackgroundCategory extends IMediaCategory {
    id: string;
}

export interface IBackgroundMedia extends IMedia {
    id: string;
}

export type GetMediasParams = {
    categoryId: string;
    skip: number;
    limit: number;
};

export type UploadMediaParams = {
    file: File;
    categoryId: string;
};

export type DeleteMediaParams = {
    categoryId: string;
    ids: string[];
};
