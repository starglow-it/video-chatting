import { ICommonTemplate, QueryParams } from 'shared-types';
import { serverUrl, templatesScope, usersScope } from './baseData';
import { HttpMethods, UserTemplate } from '../../store/types';

import frontendConfig from '../../const/config';

export const templatesUrl = `${serverUrl}/${templatesScope}`;
export const userTemplatesUrl = `${serverUrl}/${usersScope}`;

export const usersTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/user-templates?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const userTemplateUrl = ({ templateId }: { templateId: ICommonTemplate['id'] }) => ({
    url: `${userTemplatesUrl}/templates/${templateId}`,
    method: HttpMethods.Get,
});

export const updateUserTemplateUrl = ({ templateId }: { templateId: UserTemplate['id'] }) => ({
    url: `${userTemplatesUrl}/templates/${templateId}`,
    method: HttpMethods.Put,
});

export const getCommonTemplateUrl = ({ templateId }: { templateId: ICommonTemplate['id'] }) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Get,
});

export const getTemplatesUrl = (data: QueryParams) => {
    const urlHref = new URL(`${frontendConfig.frontendUrl}${templatesUrl}`);

    Object.entries(data).forEach(entry => {
        urlHref.searchParams.append(entry[0], entry[1]);
    });

    return {
        url: urlHref.href,
        method: HttpMethods.Get,
    };
};

export const createTemplateUrl = {
    url: `${templatesUrl}`,
    method: HttpMethods.Post,
};

export const updateTemplateUrl = ({ templateId }: { templateId: ICommonTemplate['id'] }) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Put,
});

export const deleteTemplateUrl = ({ templateId }: { templateId: ICommonTemplate['id'] }) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Delete,
});

export const getUserTemplateUrl = ({ templateId }: { templateId: string }) => ({
    url: `${serverUrl}/user-templates/${templateId}`,
    method: HttpMethods.Get,
});
