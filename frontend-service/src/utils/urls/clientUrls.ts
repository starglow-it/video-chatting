import frontendConfig from '../../const/config';

export const getClientMeetingUrl = (token: string): string => `/room/${token}`;

export const getClientMeetingUrlWithDomain = (token: string): string =>
    `${frontendConfig.frontendUrl}${getClientMeetingUrl(token)}`;
