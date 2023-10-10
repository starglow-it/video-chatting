import {
    IUserTemplate,
    MeetingAccessStatusEnum,
    MeetingRole,
} from 'shared-types';
import { Meeting, MeetingChat, MeetingUser, Profile } from '../../../types';

export type JoinWaitingRoomPayload = {
    profileId: Profile['id'];
    profileUserName: Profile['fullName'];
    profileAvatar: Profile['profileAvatar']['url'];
    templateId: IUserTemplate['id'];
    meetingRole: MeetingRole;
    accessStatus: MeetingAccessStatusEnum;
    isAuraActive: boolean;
    maxParticipants: number;
};

export type EndMeetingPayload = { meetingId: Meeting['id']; reason: string };
export type LeaveMeetingPayload = { meetingId: Meeting['id'] };
export type StartMeetingPayload = {
    meetingId: Meeting['id'];
    user: MeetingUser;
};
export type EnterMeetingRequestPayload = {
    meetingId: Meeting['id'];
    user: MeetingUser;
};
export type AnswerAccessMeetingRequestPayload = {
    meetingId: Meeting['id'];
    isUserAccepted: boolean;
    userId: MeetingUser['id'];
};
export type CancelAccessMeetingRequestPayload = {
    meetingId: Meeting['id'];
};
export type UpdateMeetingTemplatePayload = {
    templateId: IUserTemplate['customLink'] | IUserTemplate['id'];
};

export type JoinWaitingRoomResponse = {
    user?: MeetingUser;
    meeting?: Meeting;
    users?: MeetingUser[];
};
export type StartMeetingResponse = {
    user?: MeetingUser;
    meeting?: Meeting;
    users?: MeetingUser[];
};
export type EnterMeetingRequestResponse = {
    user?: MeetingUser;
    meeting?: Meeting;
    users?: MeetingUser[];
};

export type SendMessageChatResponse = {
    message: MeetingChat
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
    templateId: IUserTemplate['id'];
    username: MeetingUser['username'];
};

export type SendReconnectMeetingPayload = {
    meetingUserId: string;
};

export type JoinLurkerMeetingPayload = {
    meetingId: string;
    username: string;
    meetingAvatarId?: string;
};

export type SendMessageChatPayload = {
    body: string;
};
