import { meetingDomain } from '../domain';
import {
    SocketState,
    Template,
    JoinMeetingResult,
    Meeting,
    MeetingInstance,
    MeetingUser,
    Profile,
} from '../../types';
import { createSocketEvent } from '../../socket';
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
} from '../const/emitSocketEvents';

export const meetingSocketEventsController = meetingDomain.event<SocketState>(
    'meetingSocketEventsController',
);

export const emitJoinMeetingEvent = meetingDomain.event('emitJoinMeetingEvent');
export const emitEndMeetingEvent = meetingDomain.event('emitEndMeetingEvent');
export const emitLeaveMeetingEvent = meetingDomain.event('emitLeaveMeetingEvent');
export const emitStartMeetingEvent = meetingDomain.event('emitStartMeetingEvent');
export const emitUpdateMeetingEvent = meetingDomain.event('emitUpdateMeetingEvent');
export const emitEnterMeetingEvent = meetingDomain.event('emitEnterMeetingEvent');
export const emitCancelEnterMeetingEvent = meetingDomain.event('emitCancelEnterMeetingEvent');
export const emitAnswerAccessMeetingRequest = meetingDomain.event<{
    isUserAccepted: boolean;
    userId: MeetingUser['id'];
}>('emitAnswerAccessMeetingRequest');
export const emitUpdateMeetingTemplate = meetingDomain.event<void>('emitUpdateMeetingTemplate');

// socket events
export const joinMeetingEvent = createSocketEvent(JOIN_WAITING_ROOM);
export const endMeetingEvent = createSocketEvent(END_MEETING);
export const leaveMeetingEvent = createSocketEvent(LEAVE_MEETING);
export const startMeetingEvent = createSocketEvent(START_MEETING);
export const updateMeetingSocketEvent = createSocketEvent(UPDATE_MEETING);
export const enterMeetingRequestEvent = createSocketEvent(SEND_ACCESS_REQUEST);
export const answerAccessMeetingRequestEvent = createSocketEvent(ANSWER_ACCESS_REQUEST);
export const cancelAccessMeetingRequestEvent = createSocketEvent(CANCEL_ACCESS_REQUEST);
export const updateMeetingTemplateEvent = createSocketEvent(UPDATE_MEETING_TEMPLATE);

export const joinMeetingResultFx = meetingDomain.effect<
    {
        profileId: Profile['id'];
        instanceId: MeetingInstance['id'];
        profileUserName: Profile['fullName'];
        isOwner: boolean;
    },
    JoinMeetingResult
>('joinMeetingResultFx');

export const startMeetingResultFx = meetingDomain.effect<
    { meetingId: Meeting['id'] },
    JoinMeetingResult
>('startMeetingResultFx');
export const updateMeetingResultFx = meetingDomain.effect<Partial<Meeting>, { meeting: Meeting }>(
    'updateMeetingResultFx',
);
export const endMeetingResultFx = meetingDomain.effect<{ meetingId: Meeting['id'] }, void>(
    'endMeetingResultFx',
);
export const leaveMeetingResultFx = meetingDomain.effect<{ meetingId: Meeting['id'] }, void>(
    'leaveMeetingResultFx',
);
export const enterMeetingRequestResultFx = meetingDomain.effect<
    { meetingId: Meeting['id'] },
    JoinMeetingResult
>('enterMeetingRequestResultFx');
export const cancelMeetingRequestResultFx = meetingDomain.effect<
    { meetingId: Meeting['id'] },
    JoinMeetingResult
>('cancelMeetingRequestResultFx');
export const answerAccessMeetingResultFx = meetingDomain.effect<
    { meetingId: Meeting['id']; userId: MeetingUser['id']; isUserAccepted: boolean },
    JoinMeetingResult
>('answerMeetingAccessResultFx');
export const updateMeetingTemplateResultFx = meetingDomain.effect<
    { templateId: Template['id'] },
    Template
>('updateMeetingTemplateResultFx');
