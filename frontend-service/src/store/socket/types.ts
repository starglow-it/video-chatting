import { MeetingUser, Profile, UserTemplate } from '../types';

export type RemoveUsersPayload = { users: MeetingUser['id'][] };
export type UpdateMeetingUsersPayload = { users: MeetingUser[] };
export type UpdateMeetingUserPayload = { user: MeetingUser };
export type UpdateUserTracksPayload = {
    userUid: MeetingUser['meetingUserId'];
    infoType: string;
};
export type EnterWaitingRoomPayload = {
    profileId: Profile['id'];
    meetingUserId: MeetingUser['meetingUserId'];
    templateId: UserTemplate['id'];
    username: MeetingUser['username'];
};
export type JoinDashboardPayload = { userId: Profile['id'] };
export type MeetingAvailablePayload = { templateId: UserTemplate['id'] };
export type JoinRoomBeforeMeetingPayload = { templateId: UserTemplate['id'] };
