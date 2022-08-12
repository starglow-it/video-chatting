// subscribe events
import {
    ON_GET_MEETING_NOTES,
    ON_MEETING_AVAILABLE,
    ON_MEETING_ENTER_REQUEST,
    ON_MEETING_ERROR,
    ON_MEETING_FINISHED,
    ON_MEETING_TEMPLATE_UPDATE,
    ON_MEETING_TIME_LIMIT,
    ON_MEETING_UPDATE,
    ON_PLAY_SOUND,
    ON_REMOVE_MEETING_NOTE,
    ON_SEND_DASHBOARD_NOTIFICATION,
    ON_SEND_MEETING_NOTE,
    ON_USER_KICK,
    ON_USER_UPDATE,
    ON_USERS_REMOVE,
    ON_USERS_UPDATE,
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

const SUBSCRIBE_HANDLERS_REGISTRY = new Map([
    [
        ON_MEETING_AVAILABLE,
        {
            handler: handleMeetingAvailable,
        },
    ],
    [
        ON_SEND_DASHBOARD_NOTIFICATION,
        {
            handler: handleDashboardNotification,
        },
    ],
    [
        ON_MEETING_ENTER_REQUEST,
        {
            handler: handleMeetingEnterRequest,
        },
    ],
    [
        ON_MEETING_UPDATE,
        {
            handler: handleUpdateMeeting,
        },
    ],
    [
        ON_MEETING_TEMPLATE_UPDATE,
        {
            handler: handleUpdateMeetingTemplate,
        },
    ],
    [
        ON_SEND_MEETING_NOTE,
        {
            handler: handleSendMeetingNote,
        },
    ],
    [
        ON_REMOVE_MEETING_NOTE,
        {
            handler: handleRemoveMeetingNote,
        },
    ],
    [
        ON_GET_MEETING_NOTES,
        {
            handler: handleGetMeetingNotes,
        },
    ],
    [
        ON_MEETING_ERROR,
        {
            handler: handleMeetingError,
        },
    ],
    [
        ON_PLAY_SOUND,
        {
            handler: handlePlaySound,
        },
    ],
    [
        ON_USER_UPDATE,
        {
            handler: handleUpdateUser,
        },
    ],
    [
        ON_USER_KICK,
        {
            handler: handleKickUser,
        },
    ],
    [
        ON_MEETING_FINISHED,
        {
            handler: handleMeetingFinished,
        },
    ],
    [
        ON_USERS_UPDATE,
        {
            handler: handleUpdateUsers,
        },
    ],
    [
        ON_USERS_REMOVE,
        {
            handler: handleRemoveUsers,
        },
    ],
    [
        ON_MEETING_TIME_LIMIT,
        {
            handler: handleMeetingTimeLimit,
        },
    ],
]);

export const getSocketSubscribeHandler = (eventName: string) =>
    SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler;
