import { medias, serverUrl } from './baseData';
import { HttpMethods } from '../../store/types';

export const getBusinessCategoriesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/categories?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const getMediasCategory = ({
    skip = 0,
    limit = 12,
    categoryId = '',
}) => ({
    url: `${serverUrl}/${medias}/${categoryId}?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const getBackgroundCategories = ({ skip = 0, limit = 10 }) => ({
    url: `${serverUrl}/${medias}/categories?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});
