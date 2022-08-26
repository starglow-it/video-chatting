import frontendConfig from '../../const/config';
import { roomRoute } from '../../const/client-routes';

export const getClientMeetingUrl = (token: string): string => `${roomRoute}/${token}`;

export const getClientMeetingUrlWithDomain = (token: string): string =>
    `${frontendConfig.frontendUrl}${getClientMeetingUrl(token)}`;
