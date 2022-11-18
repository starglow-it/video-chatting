import { HttpMethods } from '../../store/types';
import { serverUrl, usersScope } from './baseData';

export const sendInviteEmailUrl = {
    url: `${serverUrl}/${usersScope}/invite/email`,
    method: HttpMethods.Post,
};

export const sendScheduleInviteUrl = {
    url: `${serverUrl}/${usersScope}/schedule`,
    method: HttpMethods.Post,
};

export const sendContactFormUrl = {
    url: `${serverUrl}/${usersScope}/contacts`,
    method: HttpMethods.Post,
};
