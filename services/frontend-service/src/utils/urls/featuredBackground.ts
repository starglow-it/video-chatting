import { HttpMethods } from 'shared-types';
import { serverUrl } from './baseData';

export const getFeatruedBackgroundUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/featured-background/list?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});
