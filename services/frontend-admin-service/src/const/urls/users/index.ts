
import { usersScope } from 'shared-const';
import { HttpMethods, QueryParams } from 'shared-types';
import { serverUrl } from '../common';

export const usersListUrl = ({ skip = 0, limit = 0, search }: QueryParams) => ({
    url: `${serverUrl}/${usersScope}?skip=${skip}&limit=${limit}&search=${search}`,
    method: HttpMethods.Get,
});
