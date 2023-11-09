import { BusinessCategoryTypeEnum } from 'shared-types';
import { serverUrl } from './baseData';
import { HttpMethods } from '../../store/types';

export const getBusinessCategoriesUrl = ({
    skip = 0,
    limit = 0,
    type = BusinessCategoryTypeEnum.Freeze,
}) => ({
    url: `${serverUrl}/categories?skip=${skip}&limit=${limit}&type=${type}`,
    method: HttpMethods.Get,
});
