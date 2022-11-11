import { ICommonTemplate, QueryParams } from 'shared-types';
import { HttpMethods } from '../../store/types';
import { authScope, profileScope, serverUrl, uploadScope } from './baseData';

export const baseProfileUrl = `${serverUrl}/${profileScope}`;

export const postProfileUrl = {
    url: baseProfileUrl,
    method: HttpMethods.Post,
};

export const getProfileUrl = {
    url: baseProfileUrl,
    method: HttpMethods.Get,
};

export const profilePasswordUrl = {
    url: `${baseProfileUrl}/password`,
    method: HttpMethods.Post,
};

export const deleteProfileAvatarUrl = {
    url: `${baseProfileUrl}/avatar`,
    method: HttpMethods.Delete,
};

export const deleteProfileUrl = {
    url: `${baseProfileUrl}`,
    method: HttpMethods.Delete,
};

export const postProfileAvatarUrl = {
    url: `${baseProfileUrl}/avatar`,
    method: HttpMethods.Post,
};

export const profileTemplatesUrl = ({ skip, limit }: QueryParams) => ({
    url: `${baseProfileUrl}/templates?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const profileTemplatesCountUrl = ({ skip, limit, templateType }: QueryParams) => ({
    url: `${baseProfileUrl}/templates/count?skip=${skip}&limit=${limit}&templateType=${templateType}`,
    method: HttpMethods.Get,
});

export const profileTemplateByTemplateIdUrl = ({
    templateId,
}: {
    templateId: ICommonTemplate['templateId'];
}) => ({
    url: `${baseProfileUrl}/templates/id/${templateId}`,
    method: HttpMethods.Get,
});

export const getProfileTemplateUrl = ({ templateId }: { templateId?: string }) => ({
    url: `${baseProfileUrl}/templates/${templateId || ''}`,
    method: HttpMethods.Get,
});

export const postProfileTemplatesUrl = ({ templateId }: { templateId?: string }) => ({
    url: `${baseProfileUrl}/templates/${templateId || ''}`,
    method: HttpMethods.Post,
});

export const deleteProfileTemplatesUrl = ({ templateId }: { templateId?: string }) => ({
    url: `${baseProfileUrl}/templates/${templateId || ''}`,
    method: HttpMethods.Delete,
});

export const profileEmailUrl = {
    url: `${baseProfileUrl}/email`,
    method: HttpMethods.Post,
};

export const uploadProfileAvatarUrl = {
    url: `${serverUrl}/${uploadScope}/avatar`,
    method: HttpMethods.Post,
};

export const registerUserUrl = {
    url: `${serverUrl}/${authScope}/register`,
    method: HttpMethods.Post,
};

export const confirmRegisterUserUrl = {
    url: `${serverUrl}/${authScope}/confirm-registration`,
    method: HttpMethods.Post,
};

export const passwordVerificationUrl = {
    url: `${baseProfileUrl}/verify/password`,
    method: HttpMethods.Post,
};

export const codeVerificationUrl = {
    url: `${baseProfileUrl}/verify/code`,
    method: HttpMethods.Post,
};

export const emailVerificationUrl = {
    url: `${baseProfileUrl}/verify/email`,
    method: HttpMethods.Post,
};

export const sendResetPasswordLinkUrl = {
    url: `${serverUrl}/${authScope}/reset-link`,
    method: HttpMethods.Post,
};

export const resetPasswordUrl = {
    url: `${serverUrl}/${authScope}/reset-password`,
    method: HttpMethods.Post,
};

export const checkResetPasswordLinkUrl = {
    url: `${serverUrl}/${authScope}/verify-reset-link`,
    method: HttpMethods.Post,
};

export const resetTrialNotificationUrl = {
    url: `${baseProfileUrl}/reset-trial-notification`,
    method: HttpMethods.Post,
};
