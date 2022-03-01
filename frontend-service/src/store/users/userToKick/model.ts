import { MeetingUser } from '../../types';
import { meetingUsersDomain } from '../domain';

export const $userToKick = meetingUsersDomain.store<MeetingUser['id'] | null>(null);

export const setUserToKickEvent = meetingUsersDomain.event<MeetingUser['id'] | null>(
    'setUserToKickEvent',
);
export const resetUserToKickEvent = meetingUsersDomain.event<MeetingUser['id'] | null>(
    'resetUserToKickEvent',
);
