import { HttpMethods } from '../../store/types';
import { serverUrl, usersScope } from './baseData';

export const generateAgoraTokenUrl = (meetingId: string, uid: number, isPublisher: boolean) => ({
    url: `${serverUrl}/agora/token/${meetingId}/${uid}?isPublisher=${isPublisher}`,
    method: HttpMethods.Get,
});

export const sendInviteEmailUrl = {
    url: `${serverUrl}/${usersScope}/invite/email`,
    method: HttpMethods.Post,
};

export const sendScheduleInviteUrl = {
    url: `${serverUrl}/${usersScope}/templates/schedule`,
    method: HttpMethods.Post,
};
