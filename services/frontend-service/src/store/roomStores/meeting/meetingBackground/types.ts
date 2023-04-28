import {  IMedia } from "shared-types";

export interface IMediaItem extends IMedia  {
    id: string;
}

export type UploadBackgroundPayload = {
    file: File,
    userTemplateId: string;
}