import {attach, combine, forward, sample} from "effector-next";
import {$meetingStore, setMeetingEvent, updateMeetingEvent} from "../meeting/model";
import {setMeetingSoundType} from "../meetingSounds/model";
import {
    $isOwner,
    $meetingTemplateStore,
    getMeetingTemplateFx,
    setIsUserSendEnterRequest
} from "../meetingTemplate/model";
import {
    answerAccessMeetingRequestEvent,
    cancelAccessMeetingRequestEvent,
    emitAnswerAccessMeetingRequest,
    emitCancelEnterMeetingEvent,
    emitEndMeetingEvent,
    emitEnterMeetingEvent,
    emitLeaveMeetingEvent, emitStartMeetingEvent, emitUpdateMeetingTemplate,
    endMeetingEvent,
    enterMeetingRequestEvent,
    joinMeetingEvent,
    leaveMeetingSocketEvent, meetingSocketEventsController,
    startMeetingEvent, updateMeetingSocketEvent,
    updateMeetingTemplateEvent
} from "./model";
import {AppDialogsEnum, Meeting, MeetingSounds, MeetingUser, SocketState, UserTemplate, Profile } from "../../types";
import {$localUserStore, setLocalUserEvent, updateLocalUserEvent} from "../../users/localUser/model";
import {appDialogsApi} from "../../dialogs/init";
import {updateMeetingUserEvent, updateMeetingUsersEvent} from "../../users/meetingUsers/model";
import {removeLocalMeetingNoteEvent, setMeetingNotesEvent} from "../meetingNotes/model";
import {sendMeetingAvailable} from "../../waitingRoom/model";
import {initiateSocketConnectionFx} from "../../socket/model";
import {$profileStore} from "../../profile/profile/model";
import {setMeetingErrorEvent} from "../meetingError/model";
import {
    ON_GET_MEETING_NOTES, ON_MEETING_ENTER_REQUEST, ON_MEETING_ERROR, ON_MEETING_TEMPLATE_UPDATE,
    ON_MEETING_UPDATE, ON_PLAY_SOUND,
    ON_REMOVE_MEETING_NOTE,
    ON_SEND_MEETING_NOTE
} from "../../../const/socketEvents/subscribers";

const handleMeetingEventsError = (data: string) => {
    setMeetingErrorEvent(data);
    setIsUserSendEnterRequest(false);
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.meetingErrorDialog,
    });
};

joinMeetingEvent.failData.watch(handleMeetingEventsError);
enterMeetingRequestEvent.failData.watch(handleMeetingEventsError);
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
    target: sendMeetingAvailable
});

sample({
    clock: emitStartMeetingEvent,
    source: combine<{ meeting: Meeting; user: MeetingUser }>({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    fn: ({ meeting, user }) => ({ meetingId: meeting?.id, user }),
    target: startMeetingEvent,
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
    clock: emitEnterMeetingEvent,
    source: combine<{ meeting: Meeting; user: MeetingUser }>({
        meeting: $meetingStore,
        user: $localUserStore,
    }),
    fn: ({ meeting, user }) => ({ meetingId: meeting?.id, user }),
    target: enterMeetingRequestEvent,
});

sample({
    clock: emitAnswerAccessMeetingRequest,
    source: combine<{ meeting: Meeting }>({ meeting: $meetingStore }),
    fn: ({ meeting, template }, data) => ({ meetingId: meeting?.id, ...data }),
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

forward({
    from: joinMeetingEventWithData.doneData,
    to: [setMeetingEvent, setLocalUserEvent, updateMeetingUsersEvent],
});

forward({
    from: [
        startMeetingEvent.doneData,
        enterMeetingRequestEvent.doneData,
        cancelAccessMeetingRequestEvent.doneData,
        updateMeetingSocketEvent.doneData,
    ],
    to: [
        updateMeetingEvent,
        updateMeetingUsersEvent,
        updateLocalUserEvent
    ],
});

meetingSocketEventsController.watch(({ socketInstance }: SocketState) => {
    socketInstance?.on(ON_MEETING_ENTER_REQUEST, (data: any) => {
        updateMeetingUserEvent({ user: data.user });
    });

    socketInstance?.on(ON_MEETING_UPDATE, (data: any) => {
        updateMeetingEvent({ meeting: data.meeting });
        updateMeetingUsersEvent({ users: data.users });
    });

    socketInstance?.on(ON_MEETING_TEMPLATE_UPDATE, ({ templateId }) => {
        getMeetingTemplateFx({ templateId });
    });

    socketInstance?.on(ON_SEND_MEETING_NOTE, ({ meetingNotes }) => {
        setMeetingNotesEvent(meetingNotes);
    });

    socketInstance?.on(ON_REMOVE_MEETING_NOTE, ({ meetingNoteId }) => {
        removeLocalMeetingNoteEvent(meetingNoteId);
    });

    socketInstance?.on(ON_GET_MEETING_NOTES, ({ meetingNotes }) => {
        setMeetingNotesEvent(meetingNotes);
    });

    socketInstance?.on(ON_MEETING_ERROR, ({ message }) => {
        setMeetingErrorEvent(message);

        setIsUserSendEnterRequest(false);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    });

    socketInstance?.on(ON_PLAY_SOUND, (data: { soundType: MeetingSounds }) => {
        setMeetingSoundType(data.soundType);
    });
});
