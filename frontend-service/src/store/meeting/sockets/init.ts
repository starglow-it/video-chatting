import Router from 'next/router';
import { attach, combine, forward, sample } from 'effector-next';

import {
    ON_GET_MEETING_NOTES,
    ON_MEETING_ENTER_REQUEST,
    ON_MEETING_ERROR,
    ON_MEETING_FINISHED,
    ON_MEETING_TEMPLATE_UPDATE,
    ON_MEETING_UPDATE,
    ON_PLAY_SOUND,
    ON_REMOVE_MEETING_NOTE,
    ON_SEND_MEETING_NOTE,
} from '../const/subscribeSocketEvents';

import {
    answerAccessMeetingRequestEvent,
    cancelAccessMeetingRequestEvent,
    emitAnswerAccessMeetingRequest,
    emitCancelEnterMeetingEvent,
    emitEndMeetingEvent,
    emitEnterMeetingEvent,
    emitLeaveMeetingEvent,
    emitStartMeetingEvent,
    emitUpdateMeetingTemplate,
    endMeetingEvent,
    enterMeetingRequestEvent,
    joinMeetingEvent,
    leaveMeetingEvent,
    meetingSocketEventsController,
    startMeetingEvent,
    updateMeetingSocketEvent,
    updateMeetingTemplateEvent,
} from './model';

import {
    $localUserStore,
    setLocalUserEvent,
    updateLocalUserEvent,
    updateMeetingUserEvent,
    updateMeetingUsersEvent,
} from '../../users';
import { removeLocalMeetingNoteEvent, setMeetingNotesEvent } from '../meetingNotes';

import {
    $meetingTemplateStore,
    getMeetingTemplateFx,
    setIsUserSendEnterRequest,
} from '../meetingTemplate';
import { $meetingStore, setMeetingEvent, updateMeetingEvent } from '../meeting';
import { initiateSocketConnectionFx } from '../../socket';
import { setMeetingErrorEvent } from '../meetingError';
import { appDialogsApi } from '../../dialogs';
import { $profileStore } from '../../profile';
import {setMeetingSoundType} from "../meetingSounds";

import {
    AppDialogsEnum,
    Meeting,
    MeetingSounds,
    MeetingUser,
    Profile,
    SocketState,
    UserTemplate,
} from '../../types';

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
    target: leaveMeetingEvent,
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

    socketInstance?.on(ON_MEETING_FINISHED, () => {
        Router.push('/dashboard');
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
