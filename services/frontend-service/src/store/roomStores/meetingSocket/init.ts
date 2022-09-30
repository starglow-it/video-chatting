import {
    $meetingSocketStore,
    disconnectMeetingSocketEvent,
    initiateMeetingSocketConnectionFx,
    meetingSocketEventRequest,
} from './model';

import { handleEmitSocketEvent } from './handlers/handleEmitSocketEvent';
import { handleConnectSocket } from './handlers/handleConnectSocket';

import { UsersSubscribeEvents } from '../../../const/socketEvents/subscribers';

import { getUsersSocketSubscribeHandler } from './socketSubscribeHandlers';

import { SocketState } from '../../types';
import { resetRoomStores } from '../../root';

meetingSocketEventRequest.use(handleEmitSocketEvent);
initiateMeetingSocketConnectionFx.use(handleConnectSocket);

const handleDisconnectedSocket = (state: SocketState) => {
    state.socketInstance?.disconnect();

    return {
        socketInstance: null,
    };
};

$meetingSocketStore
    .on(initiateMeetingSocketConnectionFx.doneData, (state, data) => ({
        socketInstance: data.socketInstance,
    }))
    .on(disconnectMeetingSocketEvent, handleDisconnectedSocket)
    .on(resetRoomStores, handleDisconnectedSocket);

initiateMeetingSocketConnectionFx.doneData.watch(({ socketInstance }) => {
    if (socketInstance) {
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
