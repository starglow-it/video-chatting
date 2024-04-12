import {
    IUserTemplate,
    MeetingAccessStatusEnum,
    MeetingReactionKind,
    MeetingRole,
} from 'shared-types';
import {
    Meeting,
    MeetingChat,
    MeetingChatReaction,
    MeetingQuestionAnswer,
    MeetingQuestionAnswerReaction,
    MeetingUser,
    Profile,
    userLocation,
} from '../../../types';
import { MeetingPayment } from '../meetingPayment/type';
import { MeetingRecordVideo, RecordingVideo } from '../../../types';

export type JoinWaitingRoomPayload = {
    userData: {
        profileId: Profile['id'];
        profileUserName: Profile['fullName'];
        profileAvatar: Profile['profileAvatar']['url'];
        templateId: IUserTemplate['id'];
        meetingRole: MeetingRole;
        accessStatus: MeetingAccessStatusEnum;
        isAuraActive: boolean;
        maxParticipants: number;
    },
    previousMeetingUserId: string;
    isScheduled: boolean;
};

export type EndMeetingPayload = { meetingId: Meeting['id']; reason: string };
export type LeaveMeetingPayload = { meetingId: Meeting['id'] };
export type GetMeetingUsersStatisticsPayload = {
    meetingId?: Meeting['id'];
    userId: MeetingUser['id'];
};
export type StartMeetingPayload = {
    meetingId: Meeting['id'];
    user: MeetingUser;
};
export type ClickMeetingLinkPayload = {
    meetingId: Meeting['id'];
    url: string;
    userId: MeetingUser['id'];
};
export type EnterMeetingRequestPayload = {
    meetingId: Meeting['id'];
    user: MeetingUser;
    userLocation: userLocation;
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
export type GetMeetingUsersStatisticsResponse = {
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
    message: MeetingChat;
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

export type JoinAudienceMeetingPayload = {
    meetingId: string;
    username: string;
    meetingAvatarId?: string;
    userLocation: userLocation
};

export type SendMessageChatPayload = {
    body: string;
};

export type SendReactionMessagePayload = {
    meetingChatId: string;
    kind: MeetingReactionKind;
};

export type SendReactionMessageReponse = {
    reaction: MeetingChatReaction;
};

export type SendUnReactionMessagePayload = {
    meetingChatId: string;
    kind: MeetingReactionKind;
};

export type SendUnReactionMessageResponse = {
    message: MeetingChat;
};

export type SendUpdatePaymentsMeetingPayload = MeetingPayment;

export type SendUpdatePaymentsMeetingRespone = MeetingPayment;


export type SendQuestionPayload = {
    meetingId: string,
    body: string;
};


export type SendQuestionResponse = {
    question: MeetingQuestionAnswer;
};

export type SendReactionQuestionPayload = {
    meetingQuestionId: string;
    kind: MeetingReactionKind;
};

export type SendUnReactionQuestionPayload = {
    meetingQuestionId: string;
    kind: MeetingReactionKind;
};

export type SendReactionQuestionReponse = {
    reaction: MeetingQuestionAnswerReaction;
};

export type SendUnReactionQuestionResponse = {
    question: MeetingQuestionAnswer;
};


export type RequestRecordingEventPayload = {
    meetingId: string;
    recordingUrl: string;
};

export type GetRecordingUrlsPayload = {
    profileId: string;
};

export type GetRecordingVideoPayload = {
    id: string;
};

export type GetRecordingVideoResponse = {
    message: RecordingVideo
};

export type GetRecordingUrlResponse = {
    message: string
};

export type SendRequestToHostWhenDndPayload = {
    meetingId: string;
    username: string;
};

export type StartRecordingPayload = {
    id: string;
    meetingId: string;
    url: string;
};

export type SaveRecordingEventPayload = {
    id: string;
    meetingId: string;
    url: string;
};

export type SetIsMeetingRecordingPayload = {
    meetingId: string;
    isMeetingRecording: boolean;
    recordingUrl: string;
};

export type RequestRecordingResponse = {
    userId: string;
    username: string;
};

export type StartRecordingResponse = {
    message: string
};

export type ReceiveRecordingUrls = {
    urls: string[]
};

export type AnswerRequestRecordingResponse = {
    message: string
};

export type SendRequestToHostWhenDndResponse = {
    message: string,
};

export type RecodingAnswerResponse = {
    isRecordingStart: Boolean
};

export type DeleteRecordingVideoPayload = {
    id: string;
};

export type UpdateRecordingVideoPricePayload = {
    id: string;
    price: number;
};

export type UpdateRecordingVideoPriceResponse = {
    message: string;
    video: MeetingRecordVideo;
};

export type PaywalPrePayment = {
    isCodeNeeded: boolean
};

export type GeneratePrePaymentCodePayload = {
    email?: string;
    templateId: string;
};

export type GeneratePrePaymentCodeResponse = {
    code: string;
    email: string;
};

export type CheckPrePaymentCodePayload = {
    code: string;
};

export type sendAiTranscriptionPayload = {
    script: string[]
};

export type isAiTranscriptionTurnedOnPayload = {
    meetingId: string
};