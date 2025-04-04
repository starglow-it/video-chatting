import {
    MeetingSubscribeEvents,
    TemplateSubscribeEvents,
} from '../../../../../const/socketEvents/subscribers';
import { handleMeetingEnterRequest } from './handleMeetingEnterRequest';
import { handleMeetingUserAccepted } from './handleMeetingUserAccepted';
import { handleUpdateMeeting } from './handleUpdateMeeting';
import { handleUpdateMeetingTemplate } from './handleUpdateMeetingTemplate';
import { handleSendMeetingNote } from './handleSendMeetingNote';
import { handleRemoveMeetingNote } from './handleRemoveMeetingNote';
import { handleGetMeetingNotes } from './handleGetMeetingNotes';
import { handleMeetingError } from './handleMeetingError';
import { handlePlaySound } from './handlePlaySound';
import { handleMeetingFinished } from './handleMeetingFinished';
import { handleMeetingTimeLimit } from './handleMeetingTimeLimit';
import { emptyFunction } from '../../../../../utils/functions/emptyFunction';
import { handleReceiveMessage } from './handleReceiveMessage';
import { handleReceiveReaction } from './handleReceiveReaction';
import { handleReceiveUnReaction } from './handleReceiveUnReaction';
import { handleReceiveUpdatePaymentMeeting } from './handleReceiveUpdatePaymentMeeting';
import { handleRejoinMeeting } from './handleRejoinMeeting';
import { handleReceiveQuestion } from './handleReceiveQuestion';
import { handleReceiveQuestionReaction } from './handleReceiveQuestionReaction';
import { handleReceiveQuestionUnReaction } from './handleReceiveQuestionUnReaction';
import { handleSendMeetingReaction } from './handleSendMeetingReaction';
import { handleRemoveMeetingReaction } from './handleRemoveMeetingReaction';
import { handleGetMeetingReactions } from './handleGetMeetingReactions';
import { handleReceiveTranscriptionMessage } from './handleReceiveTranscriptionMessage';
import { handleReceiveRequestRecording } from './handleReceiveRequestRecording';
import { handleReceiveRequestRecordingRejected } from './handleReceiveRequestRecordingRejected';
import { handleReceiveRequestRecordingAccepted } from './handleReceiveRequestRecordingAccepted';
import { handleGetMeetingUrlReceive } from './handleGetMeetingUrlReceive';
import { handleGetMeetingUrlsReceive } from './handleGetMeetingUrlsReceive';
import { handleGetMeetingUrlsReceiveFail } from './handleGetMeetingUrlsReceiveFail';
import { handleReceiveStartRecordingPending } from './handleReceiveStartRecordingPending';
import { handleReceiveStopRecordingPending } from './handleReceiveStopRecordingPending';
import { handleGetUrlByAttendee } from './handleGetUrlByAttendee';
import { handleGetUrlFailDueToPermission } from './handleGetUrlFailDueToPermission';
import { handleGetUrlFailDueToHostPermission } from './handleGetUrlFailDueToHostPermission';
import { handleGetUrlByAttendeeFailDueToHostPermission } from './handleGetUrlByAttendeeFailDueToHostPermission';
import { handleAttendeeRequestWhenDnd } from './handleAttendeeRequestWhenDnd';
import { handleAiTranscriptionReceive } from './handleAiTranscriptionReceive';
import { handleIsRecordingStarted } from './handleIsRecordingStarted';

type SocketHandlerData = {
    handler: (...args: any[]) => void;
};

type MeetingSocketHandlerDataMap = Map<
    MeetingSubscribeEvents,
    SocketHandlerData
>;

const MEETING_SUBSCRIBE_HANDLERS_REGISTRY: MeetingSocketHandlerDataMap =
    new Map([
        [
            MeetingSubscribeEvents.OnMeetingEnterRequest,
            { handler: handleMeetingEnterRequest },
        ],
        [
            MeetingSubscribeEvents.OnUserAccepted,
            { handler: handleMeetingUserAccepted },
        ],
        [
            MeetingSubscribeEvents.OnUpdateMeeting,
            {
                handler: handleUpdateMeeting,
            },
        ],
        [
            MeetingSubscribeEvents.OnUpdateMeetingTemplate,
            {
                handler: handleUpdateMeetingTemplate,
            },
        ],
        [
            MeetingSubscribeEvents.OnSendMeetingNote,
            {
                handler: handleSendMeetingNote,
            },
        ],
        [
            MeetingSubscribeEvents.OnRemoveMeetingNote,
            {
                handler: handleRemoveMeetingNote,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetMeetingNotes,
            {
                handler: handleGetMeetingNotes,
            },
        ],
        [
            MeetingSubscribeEvents.OnSendMeetingReaction,
            {
                handler: handleSendMeetingReaction,
            },
        ],
        [
            MeetingSubscribeEvents.OnRemoveMeetingReaction,
            {
                handler: handleRemoveMeetingReaction,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetMeetingReactions,
            {
                handler: handleGetMeetingReactions,
            },
        ],
        [
            MeetingSubscribeEvents.OnMeetingError,
            {
                handler: handleMeetingError,
            },
        ],
        [
            MeetingSubscribeEvents.OnPlaySound,
            {
                handler: handlePlaySound,
            },
        ],
        [
            MeetingSubscribeEvents.OnFinishMeeting,
            {
                handler: handleMeetingFinished,
            },
        ],
        [
            MeetingSubscribeEvents.OnMeetingTimeLimit,
            {
                handler: handleMeetingTimeLimit,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveMessage,
            {
                handler: handleReceiveMessage,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveReaction,
            {
                handler: handleReceiveReaction,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiceUnReaction,
            {
                handler: handleReceiveUnReaction,
            },
        ],
        [
            MeetingSubscribeEvents.OnRejoinWaitingRoom,
            {
                handler: handleRejoinMeeting,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveQuestion,
            {
                handler: handleReceiveQuestion,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveQuestionReaction,
            {
                handler: handleReceiveQuestionReaction,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiceQuestionUnReaction,
            {
                handler: handleReceiveQuestionUnReaction,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveTranscriptionMessage,
            {
                handler: handleReceiveTranscriptionMessage,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveRequestRecording,
            {
                handler: handleReceiveRequestRecording,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveRequestRecordingAccepted,
            {
                handler: handleReceiveRequestRecordingAccepted,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveRequestRecordingRejected,
            {
                handler: handleReceiveRequestRecordingRejected,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetMeetingUrlReceive,
            {
                handler: handleGetMeetingUrlReceive,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetMeetingUrlsReceive,
            {
                handler: handleGetMeetingUrlsReceive,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetMeetingUrlsReceiveFail,
            {
                handler: handleGetMeetingUrlsReceiveFail,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveStartRecordingPending,
            {
                handler: handleReceiveStartRecordingPending,
            },
        ],
        [
            MeetingSubscribeEvents.OnReceiveStopRecordingPending,
            {
                handler: handleReceiveStopRecordingPending,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetUrlByAttendee,
            {
                handler: handleGetUrlByAttendee,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetUrlFailDueToPermission,
            {
                handler: handleGetUrlFailDueToPermission,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetUrlFailDueToHostPermission,
            {
                handler: handleGetUrlFailDueToHostPermission,
            },
        ],
        [
            MeetingSubscribeEvents.OnGetUrlByAttendeeFailDueToHostPermission,
            {
                handler: handleGetUrlByAttendeeFailDueToHostPermission,
            },
        ],
        [
            MeetingSubscribeEvents.OnAttendeeRequestWhenDnd,
            {
                handler: handleAttendeeRequestWhenDnd,
            },
        ],
        [
            MeetingSubscribeEvents.OnAiTranscriptionReceive,
            {
                handler: handleAiTranscriptionReceive,
            },
        ],
        [
            MeetingSubscribeEvents.OnIsRecordingStarted,
            {
                handler: handleIsRecordingStarted,
            },
        ],
    ]);

const MEETING_TEMPLATE_SUBSCRIBE_HANDLERS_REGISTRY: Map<
    TemplateSubscribeEvents,
    SocketHandlerData
> = new Map([
    [
        TemplateSubscribeEvents.OnUpdatePaymentsTemplate,
        { handler: handleReceiveUpdatePaymentMeeting },
    ],
]);

export const getMeetingSocketSubscribeHandler = (
    eventName: MeetingSubscribeEvents,
): SocketHandlerData['handler'] =>
    MEETING_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler ||
    emptyFunction;

export const getMeetingTemplateSocketSubscribeHandler = (
    eventName: TemplateSubscribeEvents,
): SocketHandlerData['handler'] =>
    MEETING_TEMPLATE_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler ||
    emptyFunction;
