import { HttpMethods } from '../../store/types';
import { authScope, profileScope, serverUrl, uploadScope } from './baseData';

export const PROFILE_URL = `${profileScope}`;

export const baseProfileUrl = `${serverUrl}/${PROFILE_URL}`;

export const postProfileUrl = {
    url: baseProfileUrl,
    method: HttpMethods.Post,
};

export const profilePasswordUrl = {
    url: `${baseProfileUrl}/password`,
    method: HttpMethods.Post,
};

export const deleteProfileAvatarUrl = {
    url: `${baseProfileUrl}/avatar`,
    method: HttpMethods.Delete,
};

export const postProfileAvatarUrl = {
    url: `${baseProfileUrl}/avatar`,
    method: HttpMethods.Post,
};

export const profileTemplatesUrl = ({ skip, limit }: { skip?: number; limit?: number }) => ({
    url: `${baseProfileUrl}/templates?skip=${skip}&limit=${limit}`,
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
