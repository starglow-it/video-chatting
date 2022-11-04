import { Meeting, MeetingUser, Profile, UserTemplate } from '../../../types';
import { MeetingAccessStatusEnum } from 'shared-types';

export type JoinWaitingRoomPayload = {
    profileId: Profile['id'];
    profileUserName: Profile['fullName'];
    profileAvatar: Profile['profileAvatar']['url'];
    templateId: UserTemplate['id'];
    isOwner: boolean;
    accessStatus: MeetingAccessStatusEnum;
    isAuraActive: boolean;
    maxParticipants: number;
};

export type EndMeetingPayload = { meetingId: Meeting['id'] };
export type LeaveMeetingPayload = { meetingId: Meeting['id'] };
export type StartMeetingPayload = { meetingId: Meeting['id']; user: MeetingUser };
export type EnterMeetingRequestPayload = { meetingId: Meeting['id']; user: MeetingUser };
export type AnswerAccessMeetingRequestPayload = {
    meetingId: Meeting['id'];
    isUserAccepted: boolean;
    userId: MeetingUser['id'];
};
export type CancelAccessMeetingRequestPayload = {
    meetingId: Meeting['id'];
};
export type UpdateMeetingTemplatePayload = {
    templateId: UserTemplate['customLink'] | UserTemplate['id'];
};

export type JoinWaitingRoomResponse = {
    user?: MeetingUser;
    meeting?: Meeting;
    users?: MeetingUser[];
};
export type StartMeetingResponse = { user?: MeetingUser; meeting?: Meeting; users?: MeetingUser[] };
export type EnterMeetingRequestResponse = {
    user?: MeetingUser;
    meeting?: Meeting;
    users?: MeetingUser[];
};

export type CancelAccessMeetingRequestResponse = {
    user?: MeetingUser;
    meeting?: Meeting;
    users?: MeetingUser[];
};

export type SendAnswerMeetingRequestParams = {
    isUserAccepted: boolean;
    userId: MeetingUser['id'];
};

export type EnterWaitingRoomPayload = {
    profileId: Profile['id'];
    templateId: UserTemplate['id'];
    username: MeetingUser['username'];
};
