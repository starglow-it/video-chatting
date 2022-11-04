import { UserTemplate } from '../types';
import { ParsedTimeStamp } from '../../types';
import { ICommonTemplate } from 'shared-types';

export type EditUserTemplatePayload = {
    templateId: UserTemplate['id'];
    data: Omit<Partial<UserTemplate>, 'id' | 'previewUrls'>;
};
export type EditUserTemplateResponse = UserTemplate | null;
export type EditTemplatePayload = {
    templateId: ICommonTemplate['id'];
    data: Omit<Partial<ICommonTemplate>, 'id' | 'previewUrls'>;
};
export type EditTemplateResponse = ICommonTemplate | null;
export type CreateTemplateResponse = ICommonTemplate | null | undefined;
export type UploadTemplateFilePayload = { templateId: ICommonTemplate['id']; file: File };
export type UploadUserTemplateFilePayload = { templateId: UserTemplate['id']; file: File };
export type UploadTemplateFileResponse = ICommonTemplate | null;
export type UploadUserTemplateFileResponse = UserTemplate | null;
export type GetEditingTemplatePayload = {
    templateId: UserTemplate['id'];
    withCredentials: boolean;
};
export type GetEditingTemplateResponse = UserTemplate | undefined | null;
export type SendScheduleInvitePayload = {
    templateId: string;
    timeZone: string;
    comment: string;
    startAt: ParsedTimeStamp;
    endAt: ParsedTimeStamp;
    userEmails: string[];
};

export type PurchaseTemplatePayload = { templateId: ICommonTemplate['id'] };
export type GetUserTemplatePayload = { templateId: ICommonTemplate['id']; withCredentials: false };
export type AddTemplateToUserEffectPayload = {
    templateId: ICommonTemplate['id'];
};
export type AddTemplateToUserEffectResponse = UserTemplate | null;

export type DeleteCommonTemplatePayload = { templateId: Template['id'] };
