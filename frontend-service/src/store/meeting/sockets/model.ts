import { meetingDomain } from '../../domains';
import { createSocketEvent } from '../../socket/model';
import {
    EMIT_ANSWER_ACCESS_REQUEST,
    EMIT_CANCEL_ACCESS_REQUEST,
    EMIT_END_MEETING,
    EMIT_JOIN_WAITING_ROOM,
    EMIT_LEAVE_MEETING,
    EMIT_SEND_ACCESS_REQUEST,
    EMIT_START_MEETING,
    EMIT_UPDATE_MEETING,
    EMIT_UPDATE_MEETING_TEMPLATE,
} from '../../../const/socketEvents/emitters';

import {
    AnswerAccessMeetingRequestPayload,
    CancelAccessMeetingRequestPayload,
    EndMeetingPayload,
    EnterMeetingRequestPayload,
    JoinMeetingPayload,
    LeaveMeetingPayload,
    StartMeetingPayload,
    JoinMeetingResponse,
    StartMeetingResponse,
    EnterMeetingRequestResponse,
    CancelAccessMeetingRequestResponse,
    UpdateMeetingTemplatePayload,
} from './types';
import { Meeting } from '../../types';

export const emitEnterMeetingEvent = meetingDomain.createEvent('emitEnterMeetingEvent');
export const emitEnterWaitingRoom = meetingDomain.createEvent('emitEnterWaitingRoom');

// socket events
export const joinMeetingSocketEvent = createSocketEvent<JoinMeetingPayload, JoinMeetingResponse>(
    EMIT_JOIN_WAITING_ROOM,
);
export const endMeetingSocketEvent = createSocketEvent<EndMeetingPayload, void>(EMIT_END_MEETING);
export const leaveMeetingSocketEvent = createSocketEvent<LeaveMeetingPayload, void>(
    EMIT_LEAVE_MEETING,
);
export const startMeetingSocketEvent = createSocketEvent<StartMeetingPayload, StartMeetingResponse>(
    EMIT_START_MEETING,
);
export const updateMeetingSocketEvent = createSocketEvent<Partial<Meeting>, Meeting>(
    EMIT_UPDATE_MEETING,
);
export const enterMeetingRequestSocketEvent = createSocketEvent<
    EnterMeetingRequestPayload,
    EnterMeetingRequestResponse
>(EMIT_SEND_ACCESS_REQUEST);
export const answerAccessMeetingRequestSocketEvent = createSocketEvent<
    AnswerAccessMeetingRequestPayload,
    void
>(EMIT_ANSWER_ACCESS_REQUEST);
export const cancelAccessMeetingRequestSocketEvent = createSocketEvent<
    CancelAccessMeetingRequestPayload,
    CancelAccessMeetingRequestResponse
>(EMIT_CANCEL_ACCESS_REQUEST);
export const updateMeetingTemplateSocketEvent = createSocketEvent<
    UpdateMeetingTemplatePayload,
    void
>(EMIT_UPDATE_MEETING_TEMPLATE);
