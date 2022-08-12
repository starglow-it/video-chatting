import { attach, combine, guard, sample } from 'effector-next';
import { $meetingStore, updateMeetingEvent } from '../meeting/model';
import {
    $isOwner,
    $isUserSendEnterRequest,
    $meetingTemplateStore,
    setIsUserSendEnterRequest,
} from '../meetingTemplate/model';
import {
    answerAccessMeetingRequestEvent,
    cancelAccessMeetingRequestEvent,
    emitAnswerAccessMeetingRequest,
    emitCancelEnterMeetingEvent,
    emitEndMeetingEvent,
    emitEnterMeetingEvent,
    emitEnterWaitingRoom,
    emitLeaveMeetingEvent,
    emitUpdateMeetingTemplate,
    endMeetingEvent,
    enterMeetingRequestSocketEvent,
    joinMeetingEvent,
    leaveMeetingSocketEvent,
    startMeetingSocketEvent,
    updateMeetingSocketEvent,
    updateMeetingTemplateEvent,
} from './model';
import {
    AppDialogsEnum,
    Meeting,
    MeetingUser,
    UserTemplate,
    Profile,
    JoinMeetingResult,
    MeetingAccessStatuses,
} from '../../types';
import { $localUserStore, updateLocalUserEvent } from '../../users/localUser/model';
import { appDialogsApi } from '../../dialogs/init';
import { updateMeetingUsersEvent } from '../../users/meetingUsers/model';
import { sendMeetingAvailableSocketEvent } from '../../waitingRoom/model';
import { $profileStore } from '../../profile/profile/model';
import { setMeetingErrorEvent } from '../meetingError/model';
import { sendEnterWaitingRoom } from '../../waitingRoom/init';

export const joinMeetingEventWithData = attach({
    effect: joinMeetingEvent,
    source: combine<{ profile: Profile; template: UserTemplate; localUser: MeetingUser }>({
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

export const startMeeting = attach({
    effect: startMeetingSocketEvent,
    source: combine<{ meeting: Meeting; user: MeetingUser }>({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    mapParams: (params, { meeting, user }) => ({ meetingId: meeting?.id, user }),
});

export const enterMeetingRequest = attach({
    effect: enterMeetingRequestSocketEvent,
    source: combine<{ meeting: Meeting; user: MeetingUser }>({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    mapParams: (params, { meeting, user }) => ({
        meetingId: meeting?.id,
        user,
    }),
});

sample({
    clock: joinMeetingEventWithData.doneData,
    source: combine({ meetingTemplate: $meetingTemplateStore, isOwner: $isOwner }),
    filter: source => source.isOwner,
    fn: source => ({
        templateId: source.meetingTemplate.id,
    }),
    target: sendMeetingAvailableSocketEvent,
});

guard({
    clock: emitEnterMeetingEvent,
    source: combine({
        isUserSendEnterRequest: $isUserSendEnterRequest,
        localUser: $localUserStore,
    }),
    filter: ({ isUserSendEnterRequest, localUser }) =>
        isUserSendEnterRequest && localUser.accessStatus === MeetingAccessStatuses.Waiting,
    target: enterMeetingRequest,
});

guard({
    clock: emitEnterWaitingRoom,
    source: $isUserSendEnterRequest,
    filter: isUserSendEnterRequest => !isUserSendEnterRequest,
    target: sendEnterWaitingRoom,
});

sample({
    clock: emitEndMeetingEvent,
    source: combine<{ meeting: Meeting }>({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: endMeetingEvent,
});

sample({
    clock: emitLeaveMeetingEvent,
    source: combine<{ meeting: Meeting }>({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: leaveMeetingSocketEvent,
});

sample({
    clock: emitAnswerAccessMeetingRequest,
    source: combine<{ meeting: Meeting }>({ meeting: $meetingStore }),
    fn: ({ meeting }, data) => ({ meetingId: meeting?.id, ...data }),
    target: answerAccessMeetingRequestEvent,
});

sample({
    clock: emitCancelEnterMeetingEvent,
    source: combine<{ meeting: Meeting }>({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({
        meetingId: meeting?.id,
    }),
    target: cancelAccessMeetingRequestEvent,
});

sample({
    clock: emitUpdateMeetingTemplate,
    source: combine<{ template: UserTemplate }>({ template: $meetingTemplateStore }),
    fn: ({ template }) => ({ templateId: template.customLink || template.id }),
    target: updateMeetingTemplateEvent,
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

joinMeetingEvent.failData.watch(handleMeetingEventsError);
enterMeetingRequestSocketEvent.failData.watch(handleMeetingEventsError);
answerAccessMeetingRequestEvent.failData.watch(handleMeetingEventsError);

joinMeetingEventWithData.doneData.watch(handleUpdateMeetingEntities);
startMeeting.doneData.watch(handleUpdateMeetingEntities);
enterMeetingRequest.doneData.watch(handleUpdateMeetingEntities);
cancelAccessMeetingRequestEvent.doneData.watch(handleUpdateMeetingEntities);
updateMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);

sample({
    clock: [enterMeetingRequest.doneData, sendEnterWaitingRoom.doneData],
    fn: () => true,
    target: setIsUserSendEnterRequest,
});

sample({
    clock: sendEnterWaitingRoom.doneData,
    fn: () => ({ accessStatus: MeetingAccessStatuses.Waiting }),
    target: updateLocalUserEvent,
});

sample({
    clock: cancelAccessMeetingRequestEvent.doneData,
    fn: () => false,
    target: setIsUserSendEnterRequest,
});
