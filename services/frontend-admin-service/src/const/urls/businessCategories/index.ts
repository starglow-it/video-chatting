import { HttpMethods } from 'shared-types';

import { serverUrl } from '../common';

export const getBusinessCategoriesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/categories?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const getUrlUpdateBusiness = (id: string) => ({
    url: `${serverUrl}/categories/${id}`,
    method: HttpMethods.Patch,
});

export const getUrlDeleteBusiness = () => ({
    url: `${serverUrl}/categories`,
    method: HttpMethods.Delete,
});

export const getUrlAddBusiness = () => ({
    url: `${serverUrl}/categories`,
    method: HttpMethods.Post,
});
