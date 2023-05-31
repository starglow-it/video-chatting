import {
    ErrorState,
    ICommonUser,
    IUserTemplate,
    QueryParams,
} from 'shared-types';
import { EntityList, Profile } from '../types';

export type UpdateProfileEmailPayload = { email: string };
export type UpdateProfilePasswordPayload = {
    currentPassword: string;
    newPassword: string;
    newPasswordRepeat: string;
};
export type UpdateProfilePayload = Partial<Profile>;
export type SendResetPasswordLinkEmailPayload = { email: string };
export type ResetPasswordPayload = {
    newPassword: string;
    newPasswordRepeat: string;
    token: string;
};
export type CheckResetPasswordLinkPayload = { token: string };
export type GetProfileTemplatePayload = {
    templateId: IUserTemplate['id'];
    userId: Profile['id'];
};
export type UpdateTemplatePayload = {
    templateId: IUserTemplate['id'];
    userId: ICommonUser['id'];
    data: Partial<IUserTemplate>;
};
export type GetProfileTemplatesPayload = QueryParams & {
    userId: string;
    businessCategories: string[];
};
export type GetProfileTemplatesCountPayload = QueryParams & {
    userId: string;
    templateType?: string;
};
export type DeleteProfileTemplatesPayload = { templateId: IUserTemplate['id'] };

export type CheckResetPasswordLinkResponse = {
    isUserConfirmed: boolean;
    error?: ErrorState;
};
export type CommonProfileResponse = Profile | null | undefined;
export type GetProfileTemplatesResponse = EntityList<IUserTemplate> | undefined;
export type GetProfileTemplatesCountResponse = { count: number };
