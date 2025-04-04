import { attach, combine, sample, Store } from 'effector-next';
import { isMobile } from 'shared-utils';
import {
    AnswerSwitchRoleAction,
    ICommonUser,
    IUserTemplate,
    MeetingAccessStatusEnum,
    MeetingRole,
} from 'shared-types';
import { meetingDomain } from 'src/store/domains';
import { resetRoomStores } from 'src/store/root';
import {
    StorageKeysEnum,
    WebStorage,
} from 'src/controllers/WebStorageController';
import { SavedSettings } from 'src/types';
import Router from 'next/router';
import { dashboardRoute } from 'src/const/client-routes';
import { $meetingStore, setMeetingRecordingIdEvent, updateMeetingEvent } from '../meeting/model';
import { $meetingTemplateStore } from '../meetingTemplate/model';
import {
    $localUserStore,
    $userLocationStore,
    updateLocalUserEvent,
} from '../../users/localUser/model';
import { $profileStore } from '../../../profile/profile/model';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import {
    emitEnterMeetingEvent,
    endMeetingSocketEvent,
    enterMeetingRequestSocketEvent,
    joinWaitingRoomSocketEvent,
    leaveMeetingSocketEvent,
    startMeetingSocketEvent,
    getMeetingUserStatisticsSocketEvent,
    updateMeetingSocketEvent,
    answerAccessMeetingRequestSocketEvent,
    cancelAccessMeetingRequestSocketEvent,
    updateMeetingTemplateSocketEvent,
    enterWaitingRoomSocketEvent,
    sendReconnectMeetingEvent,
    joinMeetingAudienceEvent,
    joinMeetingRecorderEvent,
    sentRequestToHostWhenDnd,
    updateRecordingVideoPrice,
    getRecordingVideo,
    getRecordingUrl,
    startRecording,
    generatePrePaymentCodeEvent,
    checkPrePaymentCodeEvent
} from './model';
import { meetingAvailableSocketEvent } from '../../../waitingRoom/model';
import { appDialogsApi } from '../../../dialogs/init';
import { updateMeetingUsersEvent } from '../../users/meetingUsers/model';
import { setMeetingErrorEvent } from '../meetingError/model';
import { setRecordingVideoEvent, setPreEvenyPaymentCodeEvent, setPreEvenyPaymentCodeCheckEvent } from '../../../roomStores';
import { GetRecordingUrlResponse, GetRecordingVideoResponse, StartRecordingResponse } from './types';

import {
    AppDialogsEnum,
    Meeting,
    MeetingUser,
    Profile,
    JoinMeetingResult,
} from '../../../types';
import {
    SendAnswerMeetingRequestParams,
    AnswerRequestRecordingResponse,
    SendRequestToHostWhenDndPayload,
    SendRequestToHostWhenDndResponse,
    GeneratePrePaymentCodeResponse
} from './types';

import {
    MeetingSubscribeEvents,
    TemplateSubscribeEvents,
} from '../../../../const/socketEvents/subscribers';
import {
    getMeetingSocketSubscribeHandler,
    getMeetingTemplateSocketSubscribeHandler,
} from './handlers';
import { initiateMeetingSocketConnectionFx } from '../../meetingSocket/model';
import { $SFURoom } from '../../videoChat/sfu/model';
import { $serverTypeStore, initVideoChatEvent } from '../../videoChat/model';
import { $isOwner, $meetingRoleStore } from '../meetingRole/model';
import { answerRequestByHostEvent } from '../../users/init';
import { handleUpdateRecordingVideoPrice } from './handlers/handleUpdateRecordingVideoPrice';

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

export const joinAudienceMeetingSocketEvent = attach<
    void,
    Store<{
        meeting: Meeting;
        localUser: MeetingUser;
    }>,
    typeof joinMeetingAudienceEvent
>({
    effect: joinMeetingAudienceEvent,
    source: combine({
        meeting: $meetingStore,
        localUser: $localUserStore,
        userLocation: $userLocationStore
    }),
    mapParams: (_, { meeting, localUser, userLocation }) => {
        return {
            meetingId: meeting.id,
            username: localUser.username,
            userLocation: userLocation
        };
    },
});

export const joinRecorderMeetingSocketEvent = attach<
    void,
    Store<{
        meeting: Meeting;
        localUser: MeetingUser;
    }>,
    typeof joinMeetingRecorderEvent
>({
    effect: joinMeetingRecorderEvent,
    source: combine({
        meeting: $meetingStore,
        localUser: $localUserStore,
    }),
    mapParams: (_, { meeting, localUser }) => {
        return {
            meetingId: meeting.id,
            username: localUser.username,
        };
    },
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
        userData: {
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
        },
        previousMeetingUserId: data.meetingUserId,
        isScheduled: data.isScheduled
    }),
});

export const $isLoadingJoinWaitingRoom = meetingDomain
    .createStore(true)
    .on(joinWaitingRoomSocketEvent.finally, () => false)
    .reset(resetRoomStores);

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

export const sendGetMeetingUsersStatisticsSocketEvent = attach<
    void,
    typeof getMeetingUserStatisticsSocketEvent
>({
    effect: getMeetingUserStatisticsSocketEvent,
    mapParams: (params) => ({
        meetingId: !!params.meetingId || '',
        userId: params.userId,
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
        userLocation: $userLocationStore
    }),
    mapParams: (params, { meeting, user, userLocation }) => ({
        meetingId: meeting?.id,
        user,
        userLocation
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
    mapParams: (params, { template }) => (params),
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

// sample({
//     clock: emitEnterWaitingRoom,
//     source: $isUserSendEnterRequest,
//     filter: isUserSendEnterRequest => !isUserSendEnterRequest,
//     target: sendEnterWaitingRoomSocketEvent,
// });

const handleUpdateMeetingEntities = (data: JoinMeetingResult) => {
    if (data?.user) updateLocalUserEvent(data?.user);
    if (data?.meeting) updateMeetingEvent({ meeting: data?.meeting });
    if (data?.users) updateMeetingUsersEvent({ users: data?.users });
};

const handleRequestToHostWHenDnd = ({ message }: SendRequestToHostWhenDndResponse) => {
    if (message === 'success') {
        addNotificationEvent({
            type: NotificationType.RequestRecordingMeeting,
            message: "meeting.isHostNotified",
            withSuccessIcon: true
        });

        updateLocalUserEvent({ accessStatus: MeetingAccessStatusEnum.RequestSentWhenDnd });
    }
};

const handleMeetingEventsError = (data: string, isUpdateWaiting = true) => {
    if (data) {
        setMeetingErrorEvent(data);
        if (isUpdateWaiting) {
            updateLocalUserEvent({
                accessStatus: MeetingAccessStatusEnum.Waiting,
            });
        }
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }
};

joinWaitingRoomSocketEvent.failData.watch(handleMeetingEventsError);
enterMeetingRequestSocketEvent.failData.watch(handleMeetingEventsError);
answerAccessMeetingRequestSocketEvent.failData.watch(data =>
    handleMeetingEventsError(data, false),
);
joinWaitingRoomSocketEvent.doneData.watch(handleUpdateMeetingEntities);
updateRecordingVideoPrice.doneData.watch(handleUpdateRecordingVideoPrice);
generatePrePaymentCodeEvent.doneData.watch(({ message }: GeneratePrePaymentCodeResponse) => setPreEvenyPaymentCodeEvent(message));
checkPrePaymentCodeEvent.doneData.watch(({ message }: AnswerRequestRecordingResponse) => {
    setPreEvenyPaymentCodeCheckEvent(message);
});
startMeetingSocketEvent.doneData.watch((data: JoinMeetingResult) => {
    const savedSettings = WebStorage.get<SavedSettings>({
        key: StorageKeysEnum.meetingSettings,
    });
    const isHasSettings = Object.keys(savedSettings)?.length;

    isHasSettings
        ? updateLocalUserEvent({
            isAuraActive: savedSettings.auraSetting,
            accessStatus: MeetingAccessStatusEnum.InMeeting,
        })
        : updateLocalUserEvent({
            accessStatus: MeetingAccessStatusEnum.InMeeting,
        });
    handleUpdateMeetingEntities(data);
});
startMeetingSocketEvent.failData.watch(data => {
    handleMeetingEventsError(data, false);
    setTimeout(() => {
        Router.push(dashboardRoute);
    }, 3000);
});
sendEnterMeetingRequestSocketEvent.doneData.watch(handleUpdateMeetingEntities);
cancelAccessMeetingRequestSocketEvent.doneData.watch(
    handleUpdateMeetingEntities,
);
cancelAccessMeetingRequestSocketEvent.failData.watch(() =>
    updateLocalUserEvent({ accessStatus: MeetingAccessStatusEnum.Settings }),
);
updateMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);
sendReconnectMeetingEvent.doneData.watch(handleUpdateMeetingEntities);
sendReconnectMeetingEvent.failData.watch((error: any) => {
    console.log('console reconnect error', error);
});
joinMeetingAudienceEvent.doneData.watch(handleUpdateMeetingEntities);
joinMeetingAudienceEvent.failData.watch((error: any) => {
    console.log('audience join fail', error);
});
joinMeetingRecorderEvent.doneData.watch(handleUpdateMeetingEntities);
joinMeetingRecorderEvent.failData.watch((error: any) => {
    console.log('audience join fail', error);
});
sentRequestToHostWhenDnd.doneData.watch(handleRequestToHostWHenDnd);
getRecordingVideo.doneData.watch(({ message }: GetRecordingVideoResponse) => {
    setRecordingVideoEvent(message);
});
getRecordingVideo.doneData.watch(({ message }: GetRecordingVideoResponse) => {
    setRecordingVideoEvent(message);
});
getRecordingUrl.doneData.watch(({ message }: GetRecordingUrlResponse) => {
    setRecordingVideoEvent({ url: message });
});
startRecording.doneData.watch(({ message }: StartRecordingResponse) => {
    setMeetingRecordingIdEvent(message);
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

// sample({
//     clock: sendEnterMeetingRequestSocketEvent.doneData,
//     fn: () => true,
//     target: setIsUserSendEnterRequest,
// });

sample({
    clock: sendEnterWaitingRoomSocketEvent.doneData,
    fn: () => ({ accessStatus: MeetingAccessStatusEnum.Waiting }),
    target: updateLocalUserEvent,
});

// sample({
//     clock: cancelAccessMeetingRequestSocketEvent.doneData,
//     fn: () => false,
//     target: setIsUserSendEnterRequest,
// });

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

    socketInstance?.on(
        MeetingSubscribeEvents.OnGetMeetingReactions,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetMeetingReactions,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnRemoveMeetingReaction,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnRemoveMeetingReaction,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnSendMeetingReaction,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnSendMeetingReaction,
        ),
    );


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
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiceUnReaction,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiceUnReaction,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveQuestion,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveQuestion,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveQuestionReaction,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveQuestionReaction,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiceQuestionUnReaction,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiceQuestionUnReaction,
        ),
    );

    socketInstance?.on(
        TemplateSubscribeEvents.OnUpdatePaymentsTemplate,
        getMeetingTemplateSocketSubscribeHandler(
            TemplateSubscribeEvents.OnUpdatePaymentsTemplate,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnRejoinWaitingRoom,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnRejoinWaitingRoom,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveTranscriptionMessage,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveTranscriptionMessage,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveRequestRecording,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveRequestRecording,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveRequestRecordingAccepted,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveRequestRecordingAccepted,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnGetMeetingUrlReceive,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetMeetingUrlReceive,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnGetMeetingUrlsReceive,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetMeetingUrlsReceive,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnGetMeetingUrlsReceiveFail,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetMeetingUrlsReceiveFail,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveRequestRecordingRejected,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveRequestRecordingRejected,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveStartRecordingPending,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveStartRecordingPending,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnReceiveStopRecordingPending,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnReceiveStopRecordingPending,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnGetUrlByAttendee,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetUrlByAttendee,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnGetUrlFailDueToPermission,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetUrlFailDueToPermission,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnGetUrlFailDueToHostPermission,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetUrlFailDueToHostPermission,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnGetUrlByAttendeeFailDueToHostPermission,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnGetUrlByAttendeeFailDueToHostPermission,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnAttendeeRequestWhenDnd,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnAttendeeRequestWhenDnd,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnAiTranscriptionReceive,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnAiTranscriptionReceive,
        ),
    );
    socketInstance?.on(
        MeetingSubscribeEvents.OnIsRecordingStarted,
        getMeetingSocketSubscribeHandler(
            MeetingSubscribeEvents.OnIsRecordingStarted,
        ),
    );
});
