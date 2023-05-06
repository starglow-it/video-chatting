import { HttpMethods } from 'shared-types';
import { authScope } from 'shared-const';
import { serverUrl } from '../common';

export const getCategoriesUrl = {
    url: `${serverUrl}/${authScope}/admin`,
    method: HttpMethods.Get,
};

export const getMediasUrl = {
    url: `${serverUrl}/${authScope}/admin`,
    method: HttpMethods.Get,
};

export const addCategoryUrl = {
    url: `${serverUrl}/${authScope}/admin`,
    method: HttpMethods.Post,
};

export const updateCategoryUrl = {
    url: `${serverUrl}/${authScope}/admin`,
    method: HttpMethods.Put,
};

export const deleteCategoryUrl = {
    url: `${serverUrl}/${authScope}/admin`,
    method: HttpMethods.Delete,
};

export const addMediaUrl = {
    url: `${serverUrl}/${authScope}/admin`,
    method: HttpMethods.Put,
};

export const deleteMediaUrl = {
    url: `${serverUrl}/${authScope}/admin`,
    method: HttpMethods.Delete,
};
