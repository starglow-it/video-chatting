import {attach, combine, forward, sample} from "effector-next";
import {$meetingStore, updateMeetingEvent} from "../meeting/model";
import {
    $isOwner,
    $meetingTemplateStore,
    setIsUserSendEnterRequest
} from "../meetingTemplate/model";
import {
    answerAccessMeetingRequestEvent,
    cancelAccessMeetingRequestEvent,
    emitAnswerAccessMeetingRequest,
    emitCancelEnterMeetingEvent,
    emitEndMeetingEvent,
    emitLeaveMeetingEvent,
    emitUpdateMeetingTemplate,
    endMeetingEvent,
    enterMeetingRequestSocketEvent,
    joinMeetingEvent,
    leaveMeetingSocketEvent,
    meetingSocketEventsController,
    startMeetingSocketEvent,
    updateMeetingSocketEvent,
    updateMeetingTemplateEvent
} from "./model";
import {AppDialogsEnum, Meeting, MeetingUser, UserTemplate, Profile, JoinMeetingResult} from "../../types";
import {$localUserStore, updateLocalUserEvent} from "../../users/localUser/model";
import {appDialogsApi} from "../../dialogs/init";
import {updateMeetingUsersEvent} from "../../users/meetingUsers/model";
import { sendMeetingAvailableSocketEvent } from "../../waitingRoom/model";
import {initiateSocketConnectionFx} from "../../socket/model";
import {$profileStore} from "../../profile/profile/model";
import {setMeetingErrorEvent} from "../meetingError/model";

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
        instanceId: source.template?.meetingInstance?.id,
        templateId: source.template?.id,
        isOwner: source.template?.meetingInstance?.owner === source.profile?.id,
        accessStatus: source.localUser.accessStatus,
        maxParticipants: source.template.maxParticipants,
    }),
});

forward({
    from: initiateSocketConnectionFx.doneData,
    to: meetingSocketEventsController,
});

sample({
    clock: joinMeetingEventWithData.doneData,
    source: combine({ meetingTemplate: $meetingTemplateStore, isOwner: $isOwner }),
    filter: (source) => source.isOwner,
    fn: (source) => ({
        templateId: source.meetingTemplate.id,
    }),
    target: sendMeetingAvailableSocketEvent
});

export const startMeeting = attach({
    effect: startMeetingSocketEvent,
    source: combine<{ meeting: Meeting; user: MeetingUser }>({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    mapParams: (params, { meeting, user }) => ({ meetingId: meeting?.id, user })
});

export const enterMeetingRequest = attach({
    effect: enterMeetingRequestSocketEvent,
    source: combine<{ meeting: Meeting; user: MeetingUser }>({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    mapParams: (params, { meeting, user }) => ({ meetingId: meeting?.id, user })
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
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: cancelAccessMeetingRequestEvent,
});

sample({
    clock: emitUpdateMeetingTemplate,
    source: combine<{ template: UserTemplate }>({ template: $meetingTemplateStore }),
    fn: ({ template }) => ({ templateId: template.id }),
    target: updateMeetingTemplateEvent,
});

const handleUpdateMeetingEntities = ({ meeting, user, users }: JoinMeetingResult) => {
    if (user) updateLocalUserEvent(user);
    if (meeting) updateMeetingEvent({ meeting });
    if (users) updateMeetingUsersEvent({ users });
}

joinMeetingEventWithData.doneData.watch(handleUpdateMeetingEntities);
startMeeting.doneData.watch(handleUpdateMeetingEntities);
enterMeetingRequest.doneData.watch(handleUpdateMeetingEntities);
cancelAccessMeetingRequestEvent.doneData.watch(handleUpdateMeetingEntities);
updateMeetingSocketEvent.doneData.watch(handleUpdateMeetingEntities);
