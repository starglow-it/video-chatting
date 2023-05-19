import { IMedia, IUserTemplate, IUserTemplateMedia } from "../api-interfaces";
import { QueryParams } from "../common";

export type GetMediaCategoriesPayload = QueryParams;

export type GetMediasPayload = {
    mediaCategoryId: string;
} & QueryParams;

export type GetUserTemplateMediasPayload = {
    userTemplateId: IUserTemplate['id']
} & GetMediasPayload;

export type CreateMediaPayload = {
    mediaCategoryId: string;
}

export type CreateUserTemplateMediaPayload = {
    userTemplateId:  IUserTemplate['id'];
} & CreateMediaPayload;

export type UploadUserTemplateMediaFilePayload = {
    url: IUserTemplateMedia['url'];
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