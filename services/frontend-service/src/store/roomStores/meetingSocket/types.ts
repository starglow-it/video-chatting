import { MeetingUser } from '../../types';

export type RemoveUsersPayload = { users: MeetingUser['id'][] };
export type UpdateMeetingUsersPayload = { users: MeetingUser[] };
export type UpdateMeetingUserPayload = { user: MeetingUser };
