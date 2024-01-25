import { AnswerSwitchRoleAction, ErrorState } from 'shared-types';

import { addNotificationEvent } from 'src/store/notifications/model';
import { meetingUsersDomain } from './domain/model';
import { AppDialogsEnum, MeetingUser, NotificationType } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { sendInviteEmailUrl } from '../../../utils/urls';
import { UsersSocketEmitters } from '../../../const/socketEvents/emitters';
import { setMeetingErrorEvent } from '../meeting/meetingError/model';
import { appDialogsApi } from '../../dialogs/init';
import { createMeetingSocketEvent } from '../meetingSocket/model';
import {
    joinMeetingEvent,
    joinMeetingWithAudienceEvent,
    updateMeetingEvent,
} from '../meeting/meeting/model';
import { updateMeetingUserEvent } from './meetingUsers/model';
import { setRoleQueryUrlEvent } from '../meeting/meetingRole/model';
import { initDevicesEventFxWithStore } from '../videoChat/localMedia/init';

// backend api effects
export const sendInviteEmailFx = meetingUsersDomain.effect({
    name: 'sendInviteEmailFx',
    handler: async params =>
        sendRequestWithCredentials<{ result: true }, ErrorState>({
            ...sendInviteEmailUrl,
            data: params,
        }),
});

export const updateUserSocketEvent = createMeetingSocketEvent<
    Partial<MeetingUser>,
    any
>(UsersSocketEmitters.UpdateUser);
export const removeUserSocketEvent = createMeetingSocketEvent<
    { id: MeetingUser['id'] },
    any
>(UsersSocketEmitters.RemoveUser);
export const changeHostSocketEvent = createMeetingSocketEvent<
    { userId: MeetingUser['id'] },
    any
>(UsersSocketEmitters.ChangeHost);

//add audience to paticipant
export const requestSwitchRoleByHostEvent = createMeetingSocketEvent<
    { meetingId: string; meetingUserId: string },
    any
>(UsersSocketEmitters.RequestRoleByHost);

export const requestSwitchRoleByAudienceEvent = createMeetingSocketEvent<
    { meetingId: string },
    any
>(UsersSocketEmitters.RequestRoleByAudience);

export const answerRequestByHostEvent = createMeetingSocketEvent<
    {
        meetingUserId: string;
        action: AnswerSwitchRoleAction;
        meetingId: string;
    },
    any
>(UsersSocketEmitters.AnswerRequestByHost);

export const answerRequestByAudienceEvent = createMeetingSocketEvent<
    { action: AnswerSwitchRoleAction; meetingId: string },
    any
>(UsersSocketEmitters.AnswerRequestByAudience);

//Send participant back to audience
export const requestSwitchRoleFromParticipantToAudienceByHostEvent = createMeetingSocketEvent<
    { meetingId: string; meetingUserId: string },
    any
>(UsersSocketEmitters.RequestRoleFromParticipantToAudienceByHost);

export const requestSwitchRoleFromParticipantToAudienceByParticipantEvent = createMeetingSocketEvent<
    { meetingId: string },
    any
>(UsersSocketEmitters.RequestRoleFromParticipantToAudienceByParticipant);

export const answerRequestFromParticipantToAudienceByHostEvent = createMeetingSocketEvent<
    {
        meetingUserId: string;
        action: AnswerSwitchRoleAction;
        meetingId: string;
    },
    any
>(UsersSocketEmitters.AnswerRequestFromParticipantToAudienceByHost);

export const answerRequestFromParticipantToAudienceByParticipantEvent = createMeetingSocketEvent<
    { action: AnswerSwitchRoleAction; meetingId: string },
    any
>(UsersSocketEmitters.AnswerRequestFromParticipantToAudienceByParticipant);

//Socket events watch
changeHostSocketEvent.failData.watch(data => {
    if (data) {
        setMeetingErrorEvent(data);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }
});

answerRequestByAudienceEvent.doneData.watch(async data => {
    if (data) {
        if (data?.action === AnswerSwitchRoleAction.Accept) {
            setRoleQueryUrlEvent(null);
            updateMeetingEvent({ meeting: data?.meeting });
            updateMeetingUserEvent({ user: data?.user });
            await initDevicesEventFxWithStore();
            await joinMeetingWithAudienceEvent();
        }
    }
});

requestSwitchRoleByAudienceEvent.doneData.watch(data => {
    if (data) {
        addNotificationEvent({
            message: `Request sent to Host. Please wait for Host to approve`,
            withSuccessIcon: true,
            type: NotificationType.RequestBecomeParticipantSuccess,
        });
    }
});

requestSwitchRoleByHostEvent.doneData.watch(data => {
    if (data) {
        addNotificationEvent({
            message: `Request sent to user`,
            withSuccessIcon: true,
            type: NotificationType.RequestBecomeParticipantSuccess,
        });
    }
});

requestSwitchRoleFromParticipantToAudienceByHostEvent.doneData.watch(data => {
    if (data) {
        addNotificationEvent({
            message: `Moved user to audience`,
            withSuccessIcon: true,
            type: NotificationType.RequestBecomeAudienceSuccess,
        });
    }
});

answerRequestFromParticipantToAudienceByParticipantEvent.doneData.watch(async data => {
    if (data) {
        if (data?.action === AnswerSwitchRoleAction.Accept) {
            setRoleQueryUrlEvent('audience');
            updateMeetingEvent({ meeting: data?.meeting });
            updateMeetingUserEvent({ user: data?.user });
            await initDevicesEventFxWithStore();
            await joinMeetingEvent();
        }
    }
});