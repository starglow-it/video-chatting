import { ErrorState, QueryParams } from 'shared-types';
import { EntityList, Profile, UserTemplate } from '../types';

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
export type GetProfileTemplatePayload = { templateId: UserTemplate['id']; userId: Profile['id'] };
export type UpdateTemplatePayload = {
    templateId: UserTemplate['id'];
    userId: Profile['id'];
    data: Partial<UserTemplate>;
};
export type GetProfileTemplatesPayload = QueryParams & { userId: string };
export type GetProfileTemplatesCountPayload = QueryParams & {
    userId: string;
    templateType?: string;
};
export type DeleteProfileTemplatesPayload = { templateId: UserTemplate['id'] };

export type CheckResetPasswordLinkResponse = { isUserConfirmed: boolean; error?: ErrorState };
export type CommonProfileResponse = Profile | null | undefined;
export type GetProfileTemplatesResponse = EntityList<UserTemplate> | undefined;
export type GetProfileTemplatesCountResponse = { count: number };
