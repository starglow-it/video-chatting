import { meetingDomain } from '../../../domains';
import {
    DashboardSocketEmitters,
    MeetingSocketEmitters,
    TemplatesSocketEmitters,
} from '../../../../const/socketEvents/emitters';

import {
    AnswerAccessMeetingRequestPayload,
    CancelAccessMeetingRequestPayload,
    EndMeetingPayload,
    EnterMeetingRequestPayload,
    JoinWaitingRoomPayload,
    LeaveMeetingPayload,
    StartMeetingPayload,
    ClickMeetingLinkPayload,
    GetMeetingUsersStatisticsPayload,
    JoinWaitingRoomResponse,
    StartMeetingResponse,
    EnterMeetingRequestResponse,
    CancelAccessMeetingRequestResponse,
    UpdateMeetingTemplatePayload,
    EnterWaitingRoomPayload,
    SendReconnectMeetingPayload,
    JoinAudienceMeetingPayload,
    SendMessageChatPayload,
    SendMessageChatResponse,
    SendReactionMessagePayload,
    SendReactionMessageReponse,
    SendUnReactionMessagePayload,
    SendUnReactionMessageResponse,
    SendUpdatePaymentsMeetingPayload,
    SendUpdatePaymentsMeetingRespone,
    SendQuestionPayload,
    SendReactionQuestionPayload,
    SendUnReactionQuestionPayload,
    SendUnReactionQuestionResponse,
    SendQuestionResponse,
    SendReactionQuestionReponse,
    RequestRecordingEventPayload,
    RequestRecordingResponse,
    AnswerRequestRecordingResponse,
    SaveRecordingEventPayload
} from './types';
import { Meeting } from '../../../types';
import { createMeetingSocketEvent } from '../../meetingSocket/model';
import { createSocketEvent } from '../../../socket/model';

export const emitEnterMeetingEvent = meetingDomain.createEvent(
    'emitEnterMeetingEvent',
);
export const emitEnterWaitingRoom = meetingDomain.createEvent(
    'emitEnterWaitingRoom',
);

// socket events
export const joinWaitingRoomSocketEvent = createMeetingSocketEvent<
    JoinWaitingRoomPayload,
    JoinWaitingRoomResponse
>(MeetingSocketEmitters.JoinWaitingRoom);
export const endMeetingSocketEvent = createMeetingSocketEvent<
    EndMeetingPayload,
    void
>(MeetingSocketEmitters.EndMeeting);
export const leaveMeetingSocketEvent = createMeetingSocketEvent<
    LeaveMeetingPayload,
    void
>(MeetingSocketEmitters.LeaveMeeting);
export const getMeetingUserStatisticsSocketEvent = createMeetingSocketEvent<
    GetMeetingUsersStatisticsPayload,
    StartMeetingResponse
>(MeetingSocketEmitters.GetMeetingUserStatistics);
export const startMeetingSocketEvent = createMeetingSocketEvent<
    StartMeetingPayload,
    StartMeetingResponse
>(MeetingSocketEmitters.StartMeeting);
export const clickMeetingLinkSocketEvent = createMeetingSocketEvent<
    ClickMeetingLinkPayload,
    void
>(MeetingSocketEmitters.ClickMeetingLink);
export const updateMeetingSocketEvent = createMeetingSocketEvent<
    Partial<Meeting>,
    Meeting
>(MeetingSocketEmitters.UpdateMeeting);
export const enterMeetingRequestSocketEvent = createMeetingSocketEvent<
    EnterMeetingRequestPayload,
    EnterMeetingRequestResponse
>(MeetingSocketEmitters.SendAccessRequest);
export const answerAccessMeetingRequestSocketEvent = createMeetingSocketEvent<
    AnswerAccessMeetingRequestPayload,
    void
>(MeetingSocketEmitters.AnswerAccessRequest);
export const cancelAccessMeetingRequestSocketEvent = createMeetingSocketEvent<
    CancelAccessMeetingRequestPayload,
    CancelAccessMeetingRequestResponse
>(MeetingSocketEmitters.CancelAccessRequest);
export const updateMeetingTemplateSocketEvent = createMeetingSocketEvent<
    UpdateMeetingTemplatePayload,
    void
>(TemplatesSocketEmitters.UpdateMeetingTemplate);
export const enterWaitingRoomSocketEvent = createSocketEvent<
    EnterWaitingRoomPayload,
    void
>(DashboardSocketEmitters.EnterWaitingRoom);
export const sendReconnectMeetingEvent = createMeetingSocketEvent<
    SendReconnectMeetingPayload,
    EnterMeetingRequestResponse
>(MeetingSocketEmitters.SendReconnectMeeting);
export const joinMeetingAudienceEvent = createMeetingSocketEvent<
    JoinAudienceMeetingPayload,
    EnterMeetingRequestResponse
>(MeetingSocketEmitters.JoinWithAudience);
export const joinMeetingRecorderEvent = createMeetingSocketEvent<
    JoinAudienceMeetingPayload,
    EnterMeetingRequestResponse
>(MeetingSocketEmitters.JoinWithRecorder);

export const sendMeetingChatEvent = createMeetingSocketEvent<
    SendMessageChatPayload,
    SendMessageChatResponse
>(MeetingSocketEmitters.SendMessage);

export const sendMeetingReactionEvent = createMeetingSocketEvent<
    SendReactionMessagePayload,
    SendReactionMessageReponse
>(MeetingSocketEmitters.SendReactionMessage);

export const sendMeetingUnReactionEvent = createMeetingSocketEvent<
    SendUnReactionMessagePayload,
    SendUnReactionMessageResponse
>(MeetingSocketEmitters.SendUnReactionMessage);

export const sendUpdatePaymentsMeetingEvent = createMeetingSocketEvent<
    SendUpdatePaymentsMeetingPayload,
    SendUpdatePaymentsMeetingRespone
>(TemplatesSocketEmitters.UpdatePaymentTemplate);

export const sendMeetingQuestionAnswerEvent = createMeetingSocketEvent<
    SendQuestionPayload,
    SendQuestionResponse
>(MeetingSocketEmitters.SendQuestion);

export const sendMeetingQuestionReactionEvent = createMeetingSocketEvent<
    SendReactionQuestionPayload,
    SendReactionQuestionReponse
>(MeetingSocketEmitters.ReactionQuestion);

export const sendMeetingQuestionUnReactionEvent = createMeetingSocketEvent<
    SendUnReactionQuestionPayload,
    SendUnReactionQuestionResponse
>(MeetingSocketEmitters.SendUnReactionQuestion);

export const requestRecordingEvent = createMeetingSocketEvent<
    RequestRecordingEventPayload,
    RequestRecordingResponse
>(MeetingSocketEmitters.RequestRecording);

export const requestRecordingRejectEvent = createMeetingSocketEvent<
    RequestRecordingEventPayload,
    AnswerRequestRecordingResponse
>(MeetingSocketEmitters.RequestRecordingReject);

export const requestRecordingAcceptEvent = createMeetingSocketEvent<
    RequestRecordingEventPayload,
    AnswerRequestRecordingResponse
>(MeetingSocketEmitters.RequestRecordingAccept);

export const saveRecordingUrl = createMeetingSocketEvent<
    SaveRecordingEventPayload,
    AnswerRequestRecordingResponse
>(MeetingSocketEmitters.SaveRecordingUrl);

export const getRecordingUrls = createMeetingSocketEvent<
    RequestRecordingEventPayload,
    AnswerRequestRecordingResponse
>(MeetingSocketEmitters.GetRecordingUrls);