import {
    $meetingSocketStore,
    disconnectMeetingSocketEvent,
    initiateMeetingSocketConnectionFx,
    joinRoomBeforeMeetingSocketEvent,
    meetingSocketEventRequest,
} from './model';

import { handleEmitSocketEvent } from './handlers/handleEmitSocketEvent';
import { handleConnectSocket } from './handlers/handleConnectSocket';

import { UsersSubscribeEvents } from '../../../const/socketEvents/subscribers';

import { getUsersSocketSubscribeHandler } from './socketSubscribeHandlers';

import { AppDialogsEnum, SocketState } from '../../types';
import { resetRoomStores } from '../../root';
import { setMeetingErrorEvent } from '../meeting/meetingError/model';
import { appDialogsApi } from '../../dialogs/init';

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
        socketInstance?.on(
            UsersSubscribeEvents.OnAnswerSwitchRoleByHost,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnAnswerSwitchRoleByHost,
            ),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnAnswerSwitchRoleByAudience,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnAnswerSwitchRoleByAudience,
            ),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnRequestSwitchRoleByHost,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnRequestSwitchRoleByHost,
            ),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnRequestSwitchFromParticipantToAudienceRoleByHost,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnRequestSwitchFromParticipantToAudienceRoleByHost,
            ),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnRequestSwitchFromParticipantToAudienceRoleByParticipant,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnRequestSwitchFromParticipantToAudienceRoleByParticipant,
            ),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnAnswerSwitchFromParticipantToAudienceRoleByHost,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnAnswerSwitchFromParticipantToAudienceRoleByHost,
            ),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnAnswerSwitchFromParticipantToAudienceRoleByParticipant,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnAnswerSwitchFromParticipantToAudienceRoleByParticipant,
            ),
        );
        socketInstance?.on(
            UsersSubscribeEvents.OnRequestSwitchRoleByAudience,
            getUsersSocketSubscribeHandler(
                UsersSubscribeEvents.OnRequestSwitchRoleByAudience,
            ),
        );
    }
});

joinRoomBeforeMeetingSocketEvent.failData.watch(data => {
    if (data) {
        setMeetingErrorEvent(data);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }
});
