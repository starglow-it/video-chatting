import { meetingDomain } from '../domain';
import { MeetingUser } from '../../types';
import { createSocketEvent } from '../../socket/model';
import {
    ANSWER_ACCESS_REQUEST,
    CANCEL_ACCESS_REQUEST,
    END_MEETING,
    JOIN_WAITING_ROOM,
    LEAVE_MEETING,
    SEND_ACCESS_REQUEST,
    START_MEETING,
    UPDATE_MEETING,
    UPDATE_MEETING_TEMPLATE,
} from '../../../const/socketEvents/emitters';

export const emitEndMeetingEvent = meetingDomain.event('emitEndMeetingEvent');
export const emitLeaveMeetingEvent = meetingDomain.event('emitLeaveMeetingEvent');
export const emitEnterMeetingEvent = meetingDomain.event('emitEnterMeetingEvent');
export const emitEnterWaitingRoom = meetingDomain.event('emitEnterWaitingRoom');
export const emitCancelEnterMeetingEvent = meetingDomain.event('emitCancelEnterMeetingEvent');
export const emitAnswerAccessMeetingRequest = meetingDomain.event<{
    isUserAccepted: boolean;
    userId: MeetingUser['id'];
}>('emitAnswerAccessMeetingRequest');
export const emitUpdateMeetingTemplate = meetingDomain.event<void>('emitUpdateMeetingTemplate');

// socket events
export const joinMeetingEvent = createSocketEvent(JOIN_WAITING_ROOM);
export const endMeetingEvent = createSocketEvent(END_MEETING);
export const leaveMeetingSocketEvent = createSocketEvent(LEAVE_MEETING);
export const startMeetingSocketEvent = createSocketEvent(START_MEETING);
export const updateMeetingSocketEvent = createSocketEvent(UPDATE_MEETING);
export const enterMeetingRequestSocketEvent = createSocketEvent(SEND_ACCESS_REQUEST);
export const answerAccessMeetingRequestEvent = createSocketEvent(ANSWER_ACCESS_REQUEST);
export const cancelAccessMeetingRequestEvent = createSocketEvent(CANCEL_ACCESS_REQUEST);
export const updateMeetingTemplateEvent = createSocketEvent(UPDATE_MEETING_TEMPLATE);
