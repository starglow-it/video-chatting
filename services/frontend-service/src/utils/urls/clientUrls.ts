import frontendConfig from '../../const/config';
import {
    roomRoute,
    createRoomRoute,
    editRoomRoute,
} from '../../const/client-routes';

export const getClientMeetingUrl = (token: string): string =>
    `${roomRoute}/${token}`;

export const getSubdomainMeetingUrl = (token: string): string => `/${token}`;

export const getClientMeetingUrlWithDomain = (token: string): string =>
    `${frontendConfig.frontendUrl}${getClientMeetingUrl(token)}`;

export const getCreateRoomUrl = (id: string): string =>
    `${createRoomRoute}/${id}`;

export const getEditRoomUrl = (id: string): string => `${editRoomRoute}/${id}`;
