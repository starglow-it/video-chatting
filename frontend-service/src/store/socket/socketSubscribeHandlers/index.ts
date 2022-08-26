// subscribe events
import {
    DashboardSubscribeEvents,
    MeetingSubscribeEvents,
    UsersSubscribeEvents,
} from '../../../const/socketEvents/subscribers';

// handlers
import { handleMeetingAvailable } from './handleMeetingAvailable';
import { handleDashboardNotification } from './handleDashboardNotification';
import { handleMeetingEnterRequest } from './handleMeetingEnterRequest';
import { handleUpdateMeeting } from './handleUpdateMeeting';
import { handleUpdateMeetingTemplate } from './handleUpdateMeetingTemplate';
import { handleSendMeetingNote } from './handleSendMeetingNote';
import { handleRemoveMeetingNote } from './handleRemoveMeetingNote';
import { handleGetMeetingNotes } from './handleGetMeetingNotes';
import { handleMeetingError } from './handleMeetingError';
import { handlePlaySound } from './handlePlaySound';
import { handleUpdateUser } from './handleUpdateUser';
import { handleKickUser } from './handleKickUser';
import { handleMeetingFinished } from './handleMeetingFinished';
import { handleUpdateUsers } from './handleUpdateUsers';
import { handleRemoveUsers } from './handleRemoveUsers';
import { handleMeetingTimeLimit } from './handleMeetingTimeLimit';
import { emptyFunction } from '../../../utils/functions/emptyFunction';

type SocketHandlerData = {
    handler: (...args: any[]) => void;
};

type MeetingSocketHandlerDataMap = Map<MeetingSubscribeEvents, SocketHandlerData>;
type DashboardSocketHandlerDataMap = Map<DashboardSubscribeEvents, SocketHandlerData>;
type UsersSocketHandlerDataMap = Map<UsersSubscribeEvents, SocketHandlerData>;

const MEETING_SUBSCRIBE_HANDLERS_REGISTRY: MeetingSocketHandlerDataMap = new Map([
    [MeetingSubscribeEvents.OnMeetingEnterRequest, { handler: handleMeetingEnterRequest }],
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

const DASHBOARD_SUBSCRIBE_HANDLERS_REGISTRY: DashboardSocketHandlerDataMap = new Map([
    [
        DashboardSubscribeEvents.OnSendDashboardNotification,
        { handler: handleDashboardNotification },
    ],
    [DashboardSubscribeEvents.OnMeetingAvailable, { handler: handleMeetingAvailable }],
]);

const USERS_SUBSCRIBE_HANDLERS_REGISTRY: UsersSocketHandlerDataMap = new Map([
    [UsersSubscribeEvents.OnRemoveUsers, { handler: handleRemoveUsers }],
    [UsersSubscribeEvents.OnUpdateUsers, { handler: handleUpdateUsers }],
    [UsersSubscribeEvents.OnKickUser, { handler: handleKickUser }],
    [UsersSubscribeEvents.OnUpdateUser, { handler: handleUpdateUser }],
]);

export const getDashboardSocketSubscribeHandler = (
    eventName: DashboardSubscribeEvents,
): SocketHandlerData['handler'] =>
    DASHBOARD_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction;

export const getMeetingSocketSubscribeHandler = (
    eventName: MeetingSubscribeEvents,
): SocketHandlerData['handler'] =>
    MEETING_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction;

export const getUsersSocketSubscribeHandler = (
    eventName: UsersSubscribeEvents,
): SocketHandlerData['handler'] =>
    USERS_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction;
