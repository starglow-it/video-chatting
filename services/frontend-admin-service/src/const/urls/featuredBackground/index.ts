import { HttpMethods } from 'shared-types';
import { serverUrl } from '../common';

const featuredBackgroundUrl = `${serverUrl}/featured-background`;

export const getFeaturedBackgroundUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${featuredBackgroundUrl}/list?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const createFeaturedBackgroundUrl = () => ({
    url: `${featuredBackgroundUrl}`,
    method: HttpMethods.Post,
});

export const deleteFeaturedBackgroundUrl = () => ({
    url: `${featuredBackgroundUrl}`,
    method: HttpMethods.Delete,
});
