import { HttpMethods } from 'shared-types';
import { medias, serverUrl } from './baseData';

export const getMediasCategory = ({
    skip = 0,
    limit = 12,
    categoryId = '',
    userTemplateId = '',
}) => ({
    url: `${serverUrl}/${medias}/${categoryId}?skip=${skip}&limit=${limit}&userTemplateId=${userTemplateId}`,
    method: HttpMethods.Get,
});

export const getBackgroundCategories = ({
    skip = 0,
    limit = 10,
    type = 'background',
    userTemplateId = '',
}) => ({
    url: `${serverUrl}/${medias}/categories?skip=${skip}&limit=${limit}&type=${type}&userTemplateId=${userTemplateId}`,
    method: HttpMethods.Get,
});

export const uploadBackgroundToCategory = () => ({
    url: `${serverUrl}/${medias}/user-template`,
    method: HttpMethods.Post,
});
