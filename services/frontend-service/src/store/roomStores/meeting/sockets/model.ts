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
    JoinWaitingRoomResponse,
    StartMeetingResponse,
    EnterMeetingRequestResponse,
    CancelAccessMeetingRequestResponse,
    UpdateMeetingTemplatePayload,
    EnterWaitingRoomPayload,
    SendReconnectMeetingPayload,
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
export const startMeetingSocketEvent = createMeetingSocketEvent<
    StartMeetingPayload,
    StartMeetingResponse
>(MeetingSocketEmitters.StartMeeting);
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
