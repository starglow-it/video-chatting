import {
    EntityList,
    ICommonTemplate,
    IUserTemplate,
    QueryParams,
} from 'shared-types';
import { ParsedTimeStamp } from '../../types';

export type EditUserTemplatePayload = {
    templateId: IUserTemplate['id'];
    data: Omit<Partial<IUserTemplate>, 'id' | 'previewUrls'>;
};
export type EditUserTemplateResponse = IUserTemplate | null | undefined;
export type EditTemplatePayload = {
    templateId: ICommonTemplate['id'];
    data: Omit<Partial<ICommonTemplate>, 'id' | 'previewUrls'>;
};
export type EditTemplateResponse = ICommonTemplate | null;
export type CreateTemplateResponse = ICommonTemplate | null | undefined;
export type UploadTemplateFilePayload = {
    templateId: ICommonTemplate['id'];
    file: File;
};
export type UploadUserTemplateFilePayload = {
    templateId: IUserTemplate['id'];
    file: File;
};
export type UploadTemplateFileResponse = ICommonTemplate | null;
export type UploadUserTemplateFileResponse = IUserTemplate | null;
export type GetEditingTemplatePayload = {
    templateId: IUserTemplate['id'];
    withCredentials: boolean;
};
export type GetEditingTemplateResponse = IUserTemplate | undefined | null;
export type SendScheduleInvitePayload = {
    templateId: string;
    timeZone: string;
    comment: string;
    startAt: ParsedTimeStamp;
    endAt: ParsedTimeStamp;
    userEmails: string[];
};

export type PurchaseTemplatePayload = { templateId: ICommonTemplate['id'] };
export type GetUserTemplatePayload = {
    templateId: ICommonTemplate['id'];
    withCredentials: false;
};
export type GetUserTemplateByIdPayload = { templateId: ICommonTemplate['id'] };
export type AddTemplateToUserEffectPayload = {
    templateId: ICommonTemplate['id'];
};
export type AddTemplateToUserEffectResponse = IUserTemplate | null;

export type DeleteCommonTemplatePayload = { templateId: ICommonTemplate['id'] };

export type QueryGetTemplates = QueryParams & {
    draft?: boolean;
    isPublic?: boolean;
    businessCategories?: string[];
};

export type ResultGetTemplates = EntityList<ICommonTemplate> & {
    isReset: boolean;
};
