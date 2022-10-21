import { Template, UserTemplate } from '../types';
import { ParsedTimeStamp } from '../../types';

export type EditUserTemplatePayload = {
    templateId: UserTemplate['id'];
    data: Omit<Partial<UserTemplate>, 'id' | 'previewUrls'>;
};
export type EditUserTemplateResponse = UserTemplate | null;
export type EditTemplatePayload = {
    templateId: Template['id'];
    data: Omit<Partial<Template>, 'id' | 'previewUrls'>;
};
export type EditTemplateResponse = Template | null;
export type CreateTemplateResponse = Template | null | undefined;
export type UploadTemplateFilePayload = { templateId: Template['id']; file: File };
export type UploadUserTemplateFilePayload = { templateId: UserTemplate['id']; file: File };
export type UploadTemplateFileResponse = Template | null;
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

export type PurchaseTemplatePayload = { templateId: Template['id'] };
export type GetUserTemplatePayload = { templateId: Template['id']; withCredentials: false };
export type AddTemplateToUserEffectPayload = {
    templateId: Template['id'];
};
export type AddTemplateToUserEffectResponse = UserTemplate | null;
