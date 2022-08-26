import { serverUrl, templatesScope, usersScope } from './baseData';
import { HttpMethods, Template } from '../../store/types';

export const TEMPLATES_URL = `${templatesScope}`;

export const templatesUrl = `${serverUrl}/${TEMPLATES_URL}`;

export const usersTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/${usersScope}/templates?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const userTemplateUrl = ({ templateId }: { templateId: Template['id'] }) => ({
    url: `${serverUrl}/${usersScope}/templates/${templateId}`,
    method: HttpMethods.Get,
});

export const getCommonTemplateUrl = ({ templateId }: { templateId: string }) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Get,
});

export const getTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${templatesUrl}?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});
