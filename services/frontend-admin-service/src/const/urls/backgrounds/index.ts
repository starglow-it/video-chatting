import { HttpMethods } from 'shared-types';
import { authScope } from 'shared-const';
import { serverUrl } from '../common';

const adminMediaUrl = 'admin-medias';

export const getCategoriesUrl = ({
    type = 'background',
    skip = 0,
    limit = 0,
}) => ({
    url: `${serverUrl}/${adminMediaUrl}/categories?type=${type}&skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const getMediasUrl = ({ categoryId = '', skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/${adminMediaUrl}/${categoryId}?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const addCategoryUrl = {
    url: `${serverUrl}/${adminMediaUrl}/category`,
    method: HttpMethods.Post,
};

export const updateCategoryUrl = ({ categoryId = '' }) => ({
    url: `${serverUrl}/${adminMediaUrl}/category/${categoryId}`,
    method: HttpMethods.Patch,
});

export const deleteCategoryUrl = {
    url: `${serverUrl}/${adminMediaUrl}/categories`,
    method: HttpMethods.Delete,
};

export const addMediaUrl = {
    url: `${serverUrl}/${adminMediaUrl}`,
    method: HttpMethods.Post,
};

export const deleteMediaUrl = ({ categoryId = '' }) => ({
    url: `${serverUrl}/${authScope}/${adminMediaUrl}/${categoryId}`,
    method: HttpMethods.Delete,
});
