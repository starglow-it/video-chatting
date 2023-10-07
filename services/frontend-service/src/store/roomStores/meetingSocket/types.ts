import { AnswerSwitchRoleAction } from 'shared-types';
import { Meeting, MeetingUser } from '../../types';

export type RemoveUsersPayload = { users: MeetingUser['id'][] };
export type UpdateMeetingUsersPayload = { users: MeetingUser[] };
export type UpdateMeetingUserPayload = { user: MeetingUser };
export type RequestSwitchRolePayload = { user: MeetingUser; meeting: Meeting };
export type AnswerSwitchRolePayload = {
    meeting: Meeting;
    user: MeetingUser;
    users: MeetingUser[];
    action: AnswerSwitchRoleAction;
};
