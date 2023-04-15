import { serverUrl } from './baseData';
import { HttpMethods } from '../../store/types';

export const getBusinessCategoriesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/categories?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

