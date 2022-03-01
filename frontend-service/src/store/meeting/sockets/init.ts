import Router from 'next/router';
import { combine, forward, sample } from 'effector-next';

import {
    ON_MEETING_ENTER_REQUEST,
    ON_MEETING_FINISHED,
    ON_MEETING_TEMPLATE_UPDATE,
    ON_MEETING_UPDATE,
} from '../const/subscribeSocketEvents';

import {
    answerAccessMeetingRequestEvent,
    answerAccessMeetingResultFx,
    cancelAccessMeetingRequestEvent,
    cancelMeetingRequestResultFx,
    emitAnswerAccessMeetingRequest,
    emitCancelEnterMeetingEvent,
    emitEndMeetingEvent,
    emitEnterMeetingEvent,
    emitJoinMeetingEvent,
    emitLeaveMeetingEvent,
    emitStartMeetingEvent,
    emitUpdateMeetingEvent,
    emitUpdateMeetingTemplate,
    endMeetingEvent,
    endMeetingResultFx,
    enterMeetingRequestEvent,
    enterMeetingRequestResultFx,
    joinMeetingEvent,
    joinMeetingResultFx,
    leaveMeetingEvent,
    leaveMeetingResultFx,
    meetingSocketEventsController,
    startMeetingEvent,
    startMeetingResultFx,
    updateMeetingResultFx,
    updateMeetingSocketEvent,
    updateMeetingTemplateEvent,
    updateMeetingTemplateResultFx,
} from './model';

import {
    $localUserStore,
    setLocalUserEvent,
    updateLocalUserEvent,
    updateMeetingUserEvent,
    updateMeetingUsersEvent,
} from '../../users';
import { $meetingTemplateStore, getMeetingTemplateFx } from '../meetingTemplate';
import { $meetingStore, setMeetingEvent, updateMeetingEvent } from '../meeting';
import { initiateSocketConnectionFx } from '../../socket';
import { setMeetingErrorEvent } from '../meetingError';
import { appDialogsApi } from '../../dialogs';
import { $profileStore } from '../../profile';
import { $meetingInstanceStore } from '../meetingInstance';

import { AppDialogsEnum, SocketState } from '../../types';

joinMeetingResultFx.use(async data => joinMeetingEvent(data));
startMeetingResultFx.use(async data => startMeetingEvent(data));
updateMeetingResultFx.use(async data => updateMeetingSocketEvent(data));
endMeetingResultFx.use(async data => endMeetingEvent(data));
leaveMeetingResultFx.use(async data => leaveMeetingEvent(data));
enterMeetingRequestResultFx.use(async data => enterMeetingRequestEvent(data));
cancelMeetingRequestResultFx.use(async data => cancelAccessMeetingRequestEvent(data));
answerAccessMeetingResultFx.use(async data => answerAccessMeetingRequestEvent(data));
updateMeetingTemplateResultFx.use(async data => updateMeetingTemplateEvent(data));

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
        mainMeeting: $meetingInstanceStore,
        localUser: $localUserStore,
    }),
    fn: data => ({
        profileId: data.profile?.id,
        profileUserName: data?.profile?.fullName,
        profileAvatar: data?.profile?.profileAvatar.url,
        instanceId: data.mainMeeting.id,
        isOwner: data.mainMeeting.owner === data.profile?.id,
    }),
    target: joinMeetingResultFx,
});

sample({
    clock: emitStartMeetingEvent,
    source: combine({ meeting: $meetingStore, user: $localUserStore }),
    fn: ({ meeting, user }) => ({ meetingId: meeting?.id, user }),
    target: startMeetingResultFx,
});

sample({
    clock: emitUpdateMeetingEvent,
    source: {},
    target: updateMeetingResultFx,
});

sample({
    clock: emitEndMeetingEvent,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: endMeetingResultFx,
});

sample({
    clock: emitLeaveMeetingEvent,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: leaveMeetingResultFx,
});

sample({
    clock: emitEnterMeetingEvent,
    source: combine({ meeting: $meetingStore, user: $localUserStore }),
    fn: ({ meeting, user }) => ({ meetingId: meeting?.id, user }),
    target: enterMeetingRequestResultFx,
});

sample({
    clock: emitAnswerAccessMeetingRequest,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }, data) => ({ meetingId: meeting?.id, ...data }),
    target: answerAccessMeetingResultFx,
});

sample({
    clock: emitCancelEnterMeetingEvent,
    source: combine({ meeting: $meetingStore }),
    fn: ({ meeting }) => ({ meetingId: meeting?.id }),
    target: cancelMeetingRequestResultFx,
});

sample({
    clock: emitUpdateMeetingTemplate,
    source: combine({ template: $meetingTemplateStore }),
    fn: ({ template }) => ({ templateId: template.id }),
    target: updateMeetingTemplateResultFx,
});

forward({
    from: joinMeetingResultFx.doneData,
    to: [setMeetingEvent, setLocalUserEvent],
});

forward({
    from: [
        startMeetingResultFx.doneData,
        enterMeetingRequestResultFx.doneData,
        cancelMeetingRequestResultFx.doneData,
        updateMeetingResultFx.doneData,
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
});
