import { IMedia, IMediaCategory, IUserTemplate } from "../api-interfaces";
import { QueryParams } from "../common";

export type GetMediaCategoriesPayload = QueryParams;
export type GetAdminMediaCategoriesPayload = QueryParams;

export type GetMediasPayload = {
    categoryId: string;
    userTemplateId?: IUserTemplate['id']
} & QueryParams;

export type CreateMediaCategoryPayload = {
    key: IMediaCategory['key'];
    value: IMediaCategory['value'];
    type: IMediaCategory['type'];
    emojiUrl: IMediaCategory['emojiUrl'];
}

export type CreateMediaPayload = {
    categoryId: string;
    userTemplateId?:  IUserTemplate['id'];
}

export type UploadMediaCategoryFile = {
    url: IMediaCategory['emojiUrl'];
    id: string;
    mimeType: string;
}

export type UploadMediaFilePayload = {
    url: IMedia['url'];
    id: string;
    mimeType: string;
};

export type UpdateMediaPayload = {
    id: string;
    data: Partial<IMedia>
}

export type UpdateMediaCategoryPayload = {
    id: string;
    data: Partial<IMediaCategory>
}

export type DeleteMediaCategoriesPayload = {
    ids: string[];
}

export type DeleteMediasPayload = {
    ids: string[];
    categoryId: string;
}