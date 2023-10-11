import { attach, combine, sample, Store } from 'effector-next';
import { isMobile } from 'shared-utils';
import {
    AnswerSwitchRoleAction,
    ICommonUser,
    IUserTemplate,
    MeetingAccessStatusEnum,
    MeetingRole,
} from 'shared-types';
import { $meetingStore, updateMeetingEvent } from '../meeting/model';
import {
    $isUserSendEnterRequest,
    $meetingTemplateStore,
    setIsUserSendEnterRequest,
} from '../meetingTemplate/model';
import {
    $localUserStore,
    updateLocalUserEvent,
} from '../../users/localUser/model';
import { $profileStore } from '../../../profile/profile/model';
import {
    emitEnterMeetingEvent,
    emitEnterWaitingRoom,
    endMeetingSocketEvent,
    enterMeetingRequestSocketEvent,
    joinWaitingRoomSocketEvent,
    leaveMeetingSocketEvent,
    startMeetingSocketEvent,
    updateMeetingSocketEvent,
    answerAccessMeetingRequestSocketEvent,
    cancelAccessMeetingRequestSocketEvent,
    updateMeetingTemplateSocketEvent,
    enterWaitingRoomSocketEvent,
    sendReconnectMeetingEvent,
    joinMeetingLurkerEvent,
} from './model';
import { meetingAvailableSocketEvent } from '../../../waitingRoom/model';
import { appDialogsApi } from '../../../dialogs/init';
import { updateMeetingUsersEvent } from '../../users/meetingUsers/model';
import { setMeetingErrorEvent } from '../meetingError/model';

import {
    AppDialogsEnum,
    Meeting,
    MeetingUser,
    Profile,
    JoinMeetingResult,
} from '../../../types';
import { SendAnswerMeetingRequestParams } from './types';

import { MeetingSubscribeEvents } from '../../../../const/socketEvents/subscribers';
import { getMeetingSocketSubscribeHandler } from './handlers';
import { initiateMeetingSocketConnectionFx } from '../../meetingSocket/model';
import { $SFURoom } from '../../videoChat/sfu/model';
import { $serverTypeStore, initVideoChatEvent } from '../../videoChat/model';
import { $isOwner, $meetingRoleStore } from '../meetingRole/model';
import { answerRequestByHostEvent } from '../../users/init';

export const sendEnterWaitingRoomSocketEvent = attach({
    effect: enterWaitingRoomSocketEvent,
    source: combine({
        profile: $profileStore,
        meetingTemplate: $meetingTemplateStore,
        localUser: $localUserStore,
    }),
    mapParams: (_, { profile, meetingTemplate, localUser }) => ({
        profileId: profile.id,
        meetingUserId: localUser.id,
        templateId: meetingTemplate.id,
        username: localUser.username,
    }),
});

export const sendReconnectMeetingSocketEvent = attach<
    void,
    Store<MeetingUser>,
    typeof sendReconnectMeetingEvent
>({
    effect: sendReconnectMeetingEvent,
    source: $localUserStore,
    mapParams: (_, { id }) => ({
        meetingUserId: id,
    }),
});

export const joinLurkerMeetingSocketEvent = attach<
    void,
    Store<{
        meeting: Meeting;
        localUser: MeetingUser;
    }>,
    typeof joinMeetingLurkerEvent
>({
    effect: joinMeetingLurkerEvent,
    source: combine({
        meeting: $meetingStore,
        localUser: $localUserStore,
    }),
    mapParams: (_, { meeting, localUser }) => ({
        meetingId: meeting.id,
        username: localUser.username,
    }),
});

export const sendJoinWaitingRoomSocketEvent = attach<
    void,
    Store<{
        profile: ICommonUser;
        template: IUserTemplate;
        localUser: MeetingUser;
        meetingRole: MeetingRole;
    }>,
    typeof joinWaitingRoomSocketEvent
>({
    effect: joinWaitingRoomSocketEvent,
    source: combine({
        profile: $profileStore,
        template: $meetingTemplateStore,
        localUser: $localUserStore,
        meetingRole: $meetingRoleStore,
    }),
    mapParams: (
        data,
        source: {
            profile: Profile;
            template: IUserTemplate;
            localUser: MeetingUser;
            meetingRole: MeetingRole;
        },
    ) => ({
        profileId: source.profile?.id,
        profileUserName: source?.profile?.fullName,
        profileAvatar: source?.profile?.profileAvatar?.url,
        templateId: source.template?.id,
        meetingRole: source.meetingRole,
        accessStatus: source.localUser.accessStatus,
        isAuraActive: source.localUser.isAuraActive,
        cameraStatus: source.localUser.cameraStatus,
        micStatus: source.localUser.micStatus,
        maxParticipants: source.template.maxParticipants,
    }),
});

export const sendStartMeetingSocketEvent = attach<
    void,
    Store<{ meeting: Meeting; user: MeetingUser }>,
    typeof startMeetingSocketEvent
>({
    effect: startMeetingSocketEvent,
    source: combine({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    mapParams: (params, { meeting, user }) => ({
        meetingId: meeting?.id,
        user,
    }),
});

export const sendEnterMeetingRequestSocketEvent = attach<
    void,
    Store<{ meeting: Meeting; user: MeetingUser }>,
    typeof enterMeetingRequestSocketEvent
>({
    effect: enterMeetingRequestSocketEvent,
    source: combine({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    mapParams: (params, { meeting, user }) => ({
        meetingId: meeting?.id,
        user,
    }),
});

export const sendEndMeetingSocketEvent = attach<
    any,
    Store<{ meeting: Meeting }>,
    typeof endMeetingSocketEvent
>({
    effect: endMeetingSocketEvent,
    source: combine({ meeting: $meetingStore }),
    mapParams: (params, { meeting }) => ({
        meetingId: meeting?.id,
        ...(params || {}),
    }),
});

export const sendLeaveMeetingSocketEvent = attach<
    void,
    Store<{ meeting: Meeting }>,
    typeof leaveMeetingSocketEvent
>({
    effect: leaveMeetingSocketEvent,
    source: combine({ meeting: $meetingStore }),
    mapParams: (params, { meeting }) => ({ meetingId: meeting?.id }),
});

export const sendAnswerAccessMeetingRequestEvent = attach<
    SendAnswerMeetingRequestParams,
    Store<{ meeting: Meeting }>,
    typeof answerAccessMeetingRequestSocketEvent
>({
    effect: answerAccessMeetingRequestSocketEvent,
    source: combine({ meeting: $meetingStore }),
    mapParams: (params, { meeting }) => ({ meetingId: meeting?.id, ...params }),
});

export const sendCancelAccessMeetingRequestEvent = attach<
    void,
    Store<{ meeting: Meeting }>,
    typeof cancelAccessMeetingRequestSocketEvent
>({
    effect: cancelAccessMeetingRequestSocketEvent,
    source: combine({ meeting: $meetingStore }),
    mapParams: (params, { meeting }) => ({
        meetingId: meeting?.id,
    }),
});

export const sendAnswerRequestByHostEvent = attach<
    { action: AnswerSwitchRoleAction; userId: string },
    Store<{ meeting: Meeting }>,
    typeof answerRequestByHostEvent
>({
    effect: answerRequestByHostEvent,
    source: combine({ meeting: $meetingStore }),
    mapParams: ({ action, userId }, { meeting }) => ({
        meetingId: meeting?.id,
        action,
        meetingUserId: userId,
    }),
});

export const sendUpdateMeetingTemplateSocketEvent = attach<
    void,
    Store<{ template: IUserTemplate }>,
    typeof updateMeetingTemplateSocketEvent
>({
    effect: updateMeetingTemplateSocketEvent,
    source: combine({ template: $meetingTemplateStore }),
    mapParams: (params, { template }) => ({
        templateId: template.customLink || template.id,
    }),
});

sample({
    clock: sendJoinWaitingRoomSocketEvent.doneData,
    source: combine({
        meetingTemplate: $meetingTemplateStore,
        isOwner: $isOwner,
    }),
    filter: source => source.isOwner,
    fn: source => ({
        templateId: source.meetingTemplate.id,
    }),
    target: meetingAvailableSocketEvent,
});

sample({
    clock: emitEnterMeetingEvent,
    source: $localUserStore,
    filter: localUser =>
        localUser.accessStatus === MeetingAccessStatusEnum.Waiting,
    target: sendEnterMeetingRequestSocketEvent,
});

sample({
    clock: emitEnterWaitingRoom,
    source: $isUserSendEnterRequest,
    filter: isUserSendEnterRequest => !isUserSendEnterRequest,
    target: sendEnterWaitingRoomSocketEvent,
});

const handleUpdateMeetingEntities = (data: JoinMeetingResult) => {
    if (data?.user) updateLocalUserEvent(data?.user);
    if (data?.meeting) updateMeetingEvent({ meeting: data?.meeting });
    if (data?.users) updateMeetingUsersEvent({ users: data?.users });
};

const handleMeetingEventsError = (data: string) => {
    if (data) {
        setMeetingErrorEvent(data);
        setIsUserSendEnterRequest(false);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }
};

joinWaitingRoomSocketEvent.failData.watch(handleMeetingEventsError);
enterMeetingRequestSocketEvent.failData.watch(handleMeetingEventsError);
answerAccessMeetingRequestSocketEvent.failData.watch(handleMeetingEventsError);
joinWaitingRoomSocketEvent.doneData.watch(handleUpdateMeetingEntities);
startMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);
sendEnterMeetingRequestSocketEvent.doneData.watch(handleUpdateMeetingEntities);
cancelAccessMeetingRequestSocketEvent.doneData.watch(
    handleUpdateMeetingEntities,
);
updateMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);
sendReconnectMeetingEvent.doneData.watch(handleUpdateMeetingEntities);
sendReconnectMeetingEvent.failData.watch((error: any) => {
    console.log('console reconnect error', error);
});
joinMeetingLurkerEvent.doneData.watch(handleUpdateMeetingEntities);
joinMeetingLurkerEvent.failData.watch((error: any) => {
    console.log('lurker join fail', error);
});

sample({
    clock: sendReconnectMeetingEvent.doneData,
    source: combine({
        room: $SFURoom,
        serverType: $serverTypeStore,
    }),
    filter: ({ room }) => !room,
    fn: ({ serverType }) => ({ serverType }),
    target: initVideoChatEvent,
});

sample({
    clock: sendEnterMeetingRequestSocketEvent.doneData,
    fn: () => true,
    target: setIsUserSendEnterRequest,
});

sample({
    clock: sendEnterWaitingRoomSocketEvent.doneData,
    fn: () => ({ accessStatus: MeetingAccessStatusEnum.Waiting }),
    target: updateLocalUserEvent,
});

sample({
    clock: cancelAccessMeetingRequestSocketEvent.doneData,
    fn: () => false,
    target: setIsUserSendEnterRequest,
});

initiateMeetingSocketConnectionFx.doneData.watch(({ socketInstance }) => {
    socketInstance?.on(
        MeetingSubscribeEvents.OnMeetingEnterRequest,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnMeetingEnterRequest,
        ),
    );

    socketInstance?.on(
        MeetingSubscribeEvents.OnUserAccepted,
        getMeetingSocketSubscribeHandler(MeetingSubscribeEvents.OnUserAccepted),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnUpdateMeeting,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnUpdateMeeting,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnUpdateMeetingTemplate,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnUpdateMeetingTemplate,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnFinishMeeting,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnFinishMeeting,
        ),
    );

    if (!isMobile()) {
        socketInstance?.on(
            MeetingSubscribeEvents.OnGetMeetingNotes,
            getMeetingSocketSubscribeHandler(
                MeetingSubscribeEvents.OnGetMeetingNotes,
            ),
        );
        socketInstance?.on(
            MeetingSubscribeEvents.OnRemoveMeetingNote,
            getMeetingSocketSubscribeHandler(
                MeetingSubscribeEvents.OnRemoveMeetingNote,
            ),
        );
        socketInstance?.on(
            MeetingSubscribeEvents.OnSendMeetingNote,
            getMeetingSocketSubscribeHandler(
                MeetingSubscribeEvents.OnSendMeetingNote,
            ),
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
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnMeetingTimeLimit,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveMessage,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveMessage,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveReaction,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveReaction,
        ),
    );
});
