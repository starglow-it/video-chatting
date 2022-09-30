import { meetingUsersDomain } from '../domain/model';

import { MeetingUser } from '../../../types';
import {
    RemoveUsersPayload,
    UpdateMeetingUserPayload,
    UpdateMeetingUsersPayload,
} from '../../meetingSocket/types';

export const $meetingUsersStore = meetingUsersDomain.store<MeetingUser[]>([]);

export const updateMeetingUsersEvent =
    meetingUsersDomain.event<UpdateMeetingUsersPayload>('updateMeetingUsersEvent');
export const removeMeetingUsersEvent =
    meetingUsersDomain.event<RemoveUsersPayload>('removeMeetingUsersEvent');
export const updateMeetingUserEvent =
    meetingUsersDomain.event<UpdateMeetingUserPayload>('updateMeetingUserEvent');
