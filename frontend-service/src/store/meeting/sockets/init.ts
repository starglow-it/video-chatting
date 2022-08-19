import { attach, combine, guard, sample, Store } from 'effector-next';
import { $meetingStore, updateMeetingEvent } from '../meeting/model';
import {
    $isOwner,
    $isUserSendEnterRequest,
    $meetingTemplateStore,
    setIsUserSendEnterRequest,
} from '../meetingTemplate/model';
import { $localUserStore, updateLocalUserEvent } from '../../users/localUser/model';
import { $profileStore } from '../../profile/profile/model';
import {
    emitEnterMeetingEvent,
    emitEnterWaitingRoom,
    endMeetingSocketEvent,
    enterMeetingRequestSocketEvent,
    joinMeetingSocketEvent,
    leaveMeetingSocketEvent,
    startMeetingSocketEvent,
    updateMeetingSocketEvent,
    answerAccessMeetingRequestSocketEvent,
    cancelAccessMeetingRequestSocketEvent,
    updateMeetingTemplateSocketEvent,
} from './model';
import { meetingAvailableSocketEvent } from '../../waitingRoom/model';
import { sendEnterWaitingRoomSocketEvent } from '../../waitingRoom/init';
import { appDialogsApi } from '../../dialogs/init';
import { updateMeetingUsersEvent } from '../../users/meetingUsers/model';
import { setMeetingErrorEvent } from '../meetingError/model';

import {
    AppDialogsEnum,
    Meeting,
    MeetingUser,
    UserTemplate,
    Profile,
    JoinMeetingResult,
    MeetingAccessStatuses,
} from '../../types';
import { SendAnswerMeetingRequestParams } from './types';

export const sendJoinMeetingEventSocketEvent = attach<
    void,
    Store<{ profile: Profile; template: UserTemplate; localUser: MeetingUser }>,
    typeof joinMeetingSocketEvent
>({
    effect: joinMeetingSocketEvent,
    source: combine({
        profile: $profileStore,
        template: $meetingTemplateStore,
        localUser: $localUserStore,
    }),
    mapParams: (
        data,
        source: { profile: Profile; template: UserTemplate; localUser: MeetingUser },
    ) => ({
        profileId: source.profile?.id,
        profileUserName: source?.profile?.fullName,
        profileAvatar: source?.profile?.profileAvatar?.url,
        templateId: source.template?.id,
        isOwner: source.template?.meetingInstance?.owner === source.profile?.id,
        accessStatus: source.localUser.accessStatus,
        isAuraActive: source.localUser.isAuraActive,
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
    mapParams: (params, { meeting, user }) => ({ meetingId: meeting?.id, user }),
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
    void,
    Store<{ meeting: Meeting }>,
    typeof endMeetingSocketEvent
>({
    effect: endMeetingSocketEvent,
    source: combine({ meeting: $meetingStore }),
    mapParams: (params, { meeting }) => ({ meetingId: meeting?.id }),
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

export const sendUpdateMeetingTemplateSocketEvent = attach<
    void,
    Store<{ template: UserTemplate }>,
    typeof updateMeetingTemplateSocketEvent
>({
    effect: updateMeetingTemplateSocketEvent,
    source: combine({ template: $meetingTemplateStore }),
    mapParams: (params, { template }) => ({ templateId: template.customLink || template.id }),
});

sample({
    clock: sendJoinMeetingEventSocketEvent.doneData,
    source: combine({ meetingTemplate: $meetingTemplateStore, isOwner: $isOwner }),
    filter: source => source.isOwner,
    fn: source => ({
        templateId: source.meetingTemplate.id,
    }),
    target: meetingAvailableSocketEvent,
});

guard({
    clock: emitEnterMeetingEvent,
    source: combine({
        isUserSendEnterRequest: $isUserSendEnterRequest,
        localUser: $localUserStore,
    }),
    filter: ({ isUserSendEnterRequest, localUser }) =>
        isUserSendEnterRequest && localUser.accessStatus === MeetingAccessStatuses.Waiting,
    target: sendEnterMeetingRequestSocketEvent,
});

guard({
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
    setMeetingErrorEvent(data);
    setIsUserSendEnterRequest(false);
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.meetingErrorDialog,
    });
};

joinMeetingSocketEvent.failData.watch(handleMeetingEventsError);
enterMeetingRequestSocketEvent.failData.watch(handleMeetingEventsError);
answerAccessMeetingRequestSocketEvent.failData.watch(handleMeetingEventsError);
joinMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);
startMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);
sendEnterMeetingRequestSocketEvent.doneData.watch(handleUpdateMeetingEntities);
cancelAccessMeetingRequestSocketEvent.doneData.watch(handleUpdateMeetingEntities);
updateMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);

sample({
    clock: [sendEnterMeetingRequestSocketEvent.doneData, sendEnterWaitingRoomSocketEvent.doneData],
    fn: () => true,
    target: setIsUserSendEnterRequest,
});

sample({
    clock: sendEnterWaitingRoomSocketEvent.doneData,
    fn: () => ({ accessStatus: MeetingAccessStatuses.Waiting }),
    target: updateLocalUserEvent,
});

sample({
    clock: cancelAccessMeetingRequestSocketEvent.doneData,
    fn: () => false,
    target: setIsUserSendEnterRequest,
});
