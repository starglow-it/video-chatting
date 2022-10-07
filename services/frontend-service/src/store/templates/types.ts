import { Template, UploadTemplateFile, UserTemplate } from '../types';
import { ParsedTimeStamp } from '../../types';

export type EditUserTemplatePayload = {
    templateId: UserTemplate['id'];
    data: Omit<Partial<UserTemplate>, 'businessCategories'> & UploadTemplateFile;
};
export type EditUserTemplateResponse = UserTemplate | null;
export type EditTemplatePayload = Omit<Partial<Template>, 'businessCategories' | 'previewUrls'> &
    UploadTemplateFile;
export type EditTemplateResponse = Template | null;
export type CreateTemplateResponse = Template | null | undefined;
export type UploadTemplateFilePayload = { id: string; file: File };
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
