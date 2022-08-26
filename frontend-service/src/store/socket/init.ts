import {
    $socketStore,
    disconnectSocketEvent,
    initiateSocketConnectionFx,
    resetSocketStore,
    socketEventRequest,
} from './model';

import { handleEmitSocketEvent } from './handlers/handleEmitSocketEvent';
import { handleConnectSocket } from './handlers/handleConnectSocket';

import {
    DashboardSubscribeEvents,
    MeetingSubscribeEvents,
    UsersSubscribeEvents,
} from '../../const/socketEvents/subscribers';

import {
    getDashboardSocketSubscribeHandler,
    getMeetingSocketSubscribeHandler,
    getUsersSocketSubscribeHandler,
} from './socketSubscribeHandlers';

import { SocketState } from '../types';
import { isMobile } from '../../utils/browser/detectBrowser';

socketEventRequest.use(handleEmitSocketEvent);
initiateSocketConnectionFx.use(handleConnectSocket);

const handleDisconnectedSocket = (state: SocketState) => {
    state.socketInstance?.disconnect();

    return {
        socketInstance: null,
    };
};

$socketStore
    .on(initiateSocketConnectionFx.doneData, (state, data) => ({
        socketInstance: data.socketInstance,
    }))
    .on(disconnectSocketEvent, handleDisconnectedSocket)
    .on(resetSocketStore, handleDisconnectedSocket);

initiateSocketConnectionFx.doneData.watch(({ socketInstance }) => {
    if (socketInstance) {
        socketInstance.on(
            DashboardSubscribeEvents.OnMeetingAvailable,
            getDashboardSocketSubscribeHandler(DashboardSubscribeEvents.OnMeetingAvailable),
        );
        socketInstance.on(
            DashboardSubscribeEvents.OnSendDashboardNotification,
            getDashboardSocketSubscribeHandler(
                DashboardSubscribeEvents.OnSendDashboardNotification,
            ),
        );
        socketInstance?.on(
            MeetingSubscribeEvents.OnMeetingEnterRequest,
            getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnMeetingEnterRequest),
        );
        socketInstance?.on(
            MeetingSubscribeEvents.OnUpdateMeeting,
            getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnUpdateMeeting),
        );
        socketInstance?.on(
            MeetingSubscribeEvents.OnUpdateMeetingTemplate,
            getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnUpdateMeetingTemplate),
        );
        socketInstance?.on(
            MeetingSubscribeEvents.OnFinishMeeting,
            getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnFinishMeeting),
        );

        if (!isMobile()) {
            socketInstance?.on(
                MeetingSubscribeEvents.OnGetMeetingNotes,
                getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnGetMeetingNotes),
            );
            socketInstance?.on(
                MeetingSubscribeEvents.OnRemoveMeetingNote,
                getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnRemoveMeetingNote),
            );
            socketInstance?.on(
                MeetingSubscribeEvents.OnSendMeetingNote,
                getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnSendMeetingNote),
            );
        }

        socketInstance?.on(
            MeetingSubscribeEvents.OnMeetingError,
            getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnMeetingError),
        );

        socketInstance?.on(
            MeetingSubscribeEvents.OnPlaySound,
            getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnPlaySound),
        );
        socketInstance?.on(
            MeetingSubscribeEvents.OnMeetingTimeLimit,
            getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnMeetingTimeLimit),
        );

        socketInstance?.on(
            UsersSubscribeEvents.OnUpdateUser,
            getUsersSocketSubscribeHandler(UsersSubscribeEvents.OnUpdateUser),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnUpdateUsers,
            getUsersSocketSubscribeHandler(UsersSubscribeEvents.OnUpdateUsers),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnRemoveUsers,
            getUsersSocketSubscribeHandler(UsersSubscribeEvents.OnRemoveUsers),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnKickUser,
            getUsersSocketSubscribeHandler(UsersSubscribeEvents.OnKickUser),
        );
    }
});
