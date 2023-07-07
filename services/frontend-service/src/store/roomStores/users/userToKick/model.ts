import { MeetingUser } from '../../../types';
import { meetingUsersDomain } from '../domain/model';

export const $userToKick = meetingUsersDomain.store<MeetingUser['id'] | null>(
    null,
);

export const setUserToKickEvent = meetingUsersDomain.event<
    MeetingUser['id'] | null
>('setUserToKickEvent');
