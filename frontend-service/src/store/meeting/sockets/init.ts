import Router from 'next/router';
import { combine, forward, sample } from 'effector-next';

import {
    ON_GET_MEETING_NOTES,
    ON_MEETING_ENTER_REQUEST,
    ON_MEETING_FINISHED,
    ON_MEETING_TEMPLATE_UPDATE,
    ON_MEETING_UPDATE,
    ON_REMOVE_MEETING_NOTE,
    ON_SEND_MEETING_NOTE,
} from '../const/subscribeSocketEvents';

import {
    meetingSocketEventsController,
    emitAnswerAccessMeetingRequest,
    emitCancelEnterMeetingEvent,
    emitEndMeetingEvent,
    emitEnterMeetingEvent,
    emitJoinMeetingEvent,
    emitLeaveMeetingEvent,
    emitStartMeetingEvent,
    emitUpdateMeetingTemplate,
    endMeetingEvent,
    joinMeetingEvent,
    leaveMeetingEvent,
    startMeetingEvent,
    enterMeetingRequestEvent,
    updateMeetingSocketEvent,
    updateMeetingTemplateEvent,
    cancelAccessMeetingRequestEvent,
    answerAccessMeetingRequestEvent,
} from './model';

import {
    $localUserStore,
    setLocalUserEvent,
    updateLocalUserEvent,
    updateMeetingUserEvent,
    updateMeetingUsersEvent,
} from '../../users';
import {removeLocalMeetingNoteEvent, setMeetingNotesEvent} from "../meetingNotes";

import { $meetingTemplateStore, getMeetingTemplateFx } from '../meetingTemplate';
import { $meetingStore, setMeetingEvent, updateMeetingEvent } from '../meeting';
import { initiateSocketConnectionFx } from '../../socket';
import { setMeetingErrorEvent } from '../meetingError';
import { appDialogsApi } from '../../dialogs';
import { $profileStore } from '../../profile';

import { AppDialogsEnum, SocketState } from '../../types';

const handleMeetingEventsError = (data: string) => {
    setMeetingErrorEvent(data);
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.meetingErrorDialog,
    });
};

joinMeetingEvent.failData.watch(handleMeetingEventsError);
enterMeetingRequestEvent.failData.watch(handleMeetingEventsError);

forward({
    from: initiateSocketConnectionFx.doneData,
    to: meetingSocketEventsController,
});

sample({
    clock: emitJoinMeetingEvent,
    source: combine({
        profile: $profileStore,
        template: $meetingTemplateStore,
        localUser: $localUserStore,
    }),
    fn: data => ({
        profileId: data.profile?.id,
        profileUserName: data?.profile?.fullName,
        profileAvatar: data?.profile?.profileAvatar.url,
        instanceId: data.template?.meetingInstance?.id,
        isOwner: data.template?.meetingInstance?.owner === data.profile?.id,
    }),
    target: joinMeetingEvent,
});

sample({
    clock: emitStartMeetingEvent,
    source: combine({ meeting: $meetingStore, user: $localUserStore }),
    fn: ({ meeting, user }) => ({ meetingId: meeting?.id, user }),
    target: startMeetingEvent,
});

sample({
    clock: emitEndMeetingEvent,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: endMeetingEvent,
});

sample({
    clock: emitLeaveMeetingEvent,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: leaveMeetingEvent,
});

sample({
    clock: emitEnterMeetingEvent,
    source: combine({ meeting: $meetingStore, user: $localUserStore }),
    fn: ({ meeting, user }) => ({ meetingId: meeting?.id, user }),
    target: enterMeetingRequestEvent,
});

sample({
    clock: emitAnswerAccessMeetingRequest,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }, data) => ({ meetingId: meeting?.id, ...data }),
    target: answerAccessMeetingRequestEvent,
});

sample({
    clock: emitCancelEnterMeetingEvent,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: cancelAccessMeetingRequestEvent,
});

sample({
    clock: emitUpdateMeetingTemplate,
    source: combine({ template: $meetingTemplateStore }),
    fn: ({ template }) => ({ templateId: template.id }),
    target: updateMeetingTemplateEvent,
});

forward({
    from: joinMeetingEvent.doneData,
    to: [setMeetingEvent, setLocalUserEvent, updateMeetingUsersEvent],
});

forward({
    from: [
        startMeetingEvent.doneData,
        enterMeetingRequestEvent.doneData,
        cancelAccessMeetingRequestEvent.doneData,
        updateMeetingSocketEvent.doneData,
    ],
    to: [updateMeetingEvent, updateMeetingUsersEvent, updateLocalUserEvent],
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

    socketInstance?.on(ON_REMOVE_MEETING_NOTE, ({ meetingNote }) => {
        removeLocalMeetingNoteEvent(meetingNote);
    });

    socketInstance?.on(ON_GET_MEETING_NOTES, ({ meetingNotes }) => {
        setMeetingNotesEvent(meetingNotes);
    });
});
