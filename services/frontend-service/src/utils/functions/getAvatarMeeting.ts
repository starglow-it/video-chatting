import { IMeetingAvatar } from 'shared-types';

export const getAvatarUrlMeeting = (id: string, list: IMeetingAvatar[]) =>
    list.find(item => item.id === id)?.resouce.url;
