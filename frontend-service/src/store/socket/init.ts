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
} from '../../const/socketEvents/subscribers';

import { getSocketSubscribeHandler } from './socketSubscribeHandlers';

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
    .on(disconnectSocketEvent, handleDisconnectedSocket)
    .on(resetSocketStore, handleDisconnectedSocket);

initiateSocketConnectionFx.doneData.watch(({ socketInstance }) => {
    socketInstance.on(ON_MEETING_AVAILABLE, getSocketSubscribeHandler(ON_MEETING_AVAILABLE));
    socketInstance.on(
        ON_SEND_DASHBOARD_NOTIFICATION,
        getSocketSubscribeHandler(ON_SEND_DASHBOARD_NOTIFICATION),
    );
    socketInstance?.on(
        ON_MEETING_ENTER_REQUEST,
        getSocketSubscribeHandler(ON_MEETING_ENTER_REQUEST),
    );
    socketInstance?.on(ON_MEETING_UPDATE, getSocketSubscribeHandler(ON_MEETING_UPDATE));
    socketInstance?.on(
        ON_MEETING_TEMPLATE_UPDATE,
        getSocketSubscribeHandler(ON_MEETING_TEMPLATE_UPDATE),
    );
    socketInstance?.on(ON_MEETING_FINISHED, getSocketSubscribeHandler(ON_MEETING_FINISHED));
    socketInstance?.on(ON_SEND_MEETING_NOTE, getSocketSubscribeHandler(ON_SEND_MEETING_NOTE));
    socketInstance?.on(ON_REMOVE_MEETING_NOTE, getSocketSubscribeHandler(ON_REMOVE_MEETING_NOTE));
    socketInstance?.on(ON_GET_MEETING_NOTES, getSocketSubscribeHandler(ON_GET_MEETING_NOTES));
    socketInstance?.on(ON_MEETING_ERROR, getSocketSubscribeHandler(ON_MEETING_ERROR));

    socketInstance?.on(ON_PLAY_SOUND, getSocketSubscribeHandler(ON_PLAY_SOUND));

    socketInstance?.on(ON_USER_UPDATE, getSocketSubscribeHandler(ON_USER_UPDATE));
    socketInstance?.on(ON_USER_KICK, getSocketSubscribeHandler(ON_USER_KICK));
    socketInstance?.on(ON_USERS_UPDATE, getSocketSubscribeHandler(ON_USERS_UPDATE));
    socketInstance?.on(ON_USERS_REMOVE, getSocketSubscribeHandler(ON_USERS_REMOVE));
    socketInstance?.on(ON_MEETING_TIME_LIMIT, getSocketSubscribeHandler(ON_MEETING_TIME_LIMIT));
});
