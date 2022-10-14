import { serverUrl, templatesScope, usersScope } from './baseData';
import { HttpMethods, Template, UserTemplate } from '../../store/types';

export const templatesUrl = `${serverUrl}/${templatesScope}`;
export const userTemplatesUrl = `${serverUrl}/${usersScope}`;

export const usersTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/${usersScope}/templates?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const userTemplateUrl = ({ templateId }: { templateId: Template['id'] }) => ({
    url: `${userTemplatesUrl}/templates/${templateId}`,
    method: HttpMethods.Get,
});

export const updateUserTemplateUrl = ({ templateId }: { templateId: UserTemplate['id'] }) => ({
    url: `${userTemplatesUrl}/templates/${templateId}`,
    method: HttpMethods.Put,
});

export const getCommonTemplateUrl = ({ templateId }: { templateId: string }) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Get,
});

export const getTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${templatesUrl}?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const createTemplateUrl = {
    url: `${templatesUrl}`,
    method: HttpMethods.Post,
};

export const updateTemplateUrl = ({ templateId }: { templateId: Template['id'] }) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Put,
});

export const addTemplateToUserUrl = ({ templateId }: { templateId: string }) => ({
    url: `${userTemplatesUrl}/templates/add/${templateId}`,
    method: HttpMethods.Post,
});
