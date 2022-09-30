import { MeetingSubscribeEvents } from '../../../../../const/socketEvents/subscribers';
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

type SocketHandlerData = {
    handler: (...args: any[]) => void;
};

type MeetingSocketHandlerDataMap = Map<MeetingSubscribeEvents, SocketHandlerData>;

const MEETING_SUBSCRIBE_HANDLERS_REGISTRY: MeetingSocketHandlerDataMap = new Map([
    [MeetingSubscribeEvents.OnMeetingEnterRequest, { handler: handleMeetingEnterRequest }],
    [MeetingSubscribeEvents.OnUserAccepted, { handler: handleMeetingUserAccepted }],
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
]);

export const getMeetingSocketSubscribeHandler = (
    eventName: MeetingSubscribeEvents,
): SocketHandlerData['handler'] =>
    MEETING_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction;
