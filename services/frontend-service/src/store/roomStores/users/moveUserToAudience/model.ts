import { MeetingUser } from '../../../types';
import { meetingUsersDomain } from '../domain/model';

export const $moveUserToAudience = meetingUsersDomain.createStore<
    MeetingUser['id'] | null
>(null);

export const setMoveUserToAudienceEvent = meetingUsersDomain.event<
    MeetingUser['id'] | null
>('setUserToKickEvent');