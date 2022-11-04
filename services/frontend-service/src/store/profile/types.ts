import { EntityList, Profile, UserTemplate } from '../types';
import { ErrorState } from 'shared-types';

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
export type GetProfileTemplatesPayload = { limit: number; skip: number; userId: string };
export type DeleteProfileTemplatesPayload = { templateId: UserTemplate['id'] };

export type CheckResetPasswordLinkResponse = { isUserConfirmed: boolean; error?: ErrorState };
export type CommonProfileResponse = Profile | null | undefined;
export type GetProfileTemplatesResponse = EntityList<UserTemplate>;
