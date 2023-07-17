import {
    $socketStore,
    disconnectSocketEvent,
    initiateSocketConnectionFx,
    socketEventRequest,
} from './model';

import { handleEmitSocketEvent } from './handlers/handleEmitSocketEvent';
import { handleConnectSocket } from './handlers/handleConnectSocket';

import { DashboardSubscribeEvents } from '../../const/socketEvents/subscribers';

import { getDashboardSocketSubscribeHandler } from './socketSubscribeHandlers';

import { SocketState } from '../types';

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
    .on(disconnectSocketEvent, handleDisconnectedSocket);

initiateSocketConnectionFx.doneData.watch(({ socketInstance }) => {
    if (socketInstance) {
        socketInstance.on(
            DashboardSubscribeEvents.OnMeetingAvailable,
            getDashboardSocketSubscribeHandler(
                DashboardSubscribeEvents.OnMeetingAvailable,
            ),
        );
        socketInstance.on(
            DashboardSubscribeEvents.OnSendDashboardNotification,
            getDashboardSocketSubscribeHandler(
                DashboardSubscribeEvents.OnSendDashboardNotification,
            ),
        );
        socketInstance.on(
            DashboardSubscribeEvents.OnTrialExpired,
            getDashboardSocketSubscribeHandler(
                DashboardSubscribeEvents.OnTrialExpired,
            ),
        );

        socketInstance.on(
            DashboardSubscribeEvents.OnKickUser,
            getDashboardSocketSubscribeHandler(
                DashboardSubscribeEvents.OnKickUser,
            ),
        );
    }
});
