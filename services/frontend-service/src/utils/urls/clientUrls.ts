import frontendConfig from '../../const/config';
import {
    roomRoute,
    createRoomRoute,
    editRoomRoute,
} from '../../const/client-routes';

export const getClientMeetingUrl = (token: string): string => {
    if (window.location.origin === frontendConfig.frontendUrl) {
        return `${roomRoute}/${token}`;
    }
    return `/${token}`;
};

export const getClientMeetingUrlWithDomain = (token: string): string => {
    return `${window.location.origin}${getClientMeetingUrl(token)}`;
};

export const getCreateRoomUrl = (id: string): string =>
    `${createRoomRoute}/${id}`;

export const getEditRoomUrl = (id: string): string => `${editRoomRoute}/${id}`;
