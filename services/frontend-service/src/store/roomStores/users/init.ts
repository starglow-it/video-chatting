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
    joinMeetingWithLurkerEvent,
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

export const requestSwitchRoleByHostEvent = createMeetingSocketEvent<
    { meetingId: string; meetingUserId: string },
    any
>(UsersSocketEmitters.RequestRoleByHost);

export const requestSwitchRoleByLurkerEvent = createMeetingSocketEvent<
    { meetingId: string },
    any
>(UsersSocketEmitters.RequestRoleByLurker);

export const answerRequestByHostEvent = createMeetingSocketEvent<
    {
        meetingUserId: string;
        action: AnswerSwitchRoleAction;
        meetingId: string;
    },
    any
>(UsersSocketEmitters.AnswerRequestByHost);

export const answerRequestByLurkerEvent = createMeetingSocketEvent<
    { action: AnswerSwitchRoleAction; meetingId: string },
    any
>(UsersSocketEmitters.AnswerRequestByLurker);

changeHostSocketEvent.failData.watch(data => {
    if (data) {
        setMeetingErrorEvent(data);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }
});

answerRequestByLurkerEvent.doneData.watch(async data => {
    if (data) {
        if (data?.action === AnswerSwitchRoleAction.Accept) {
            setRoleQueryUrlEvent(null);
            updateMeetingEvent({ meeting: data?.meeting });
            updateMeetingUserEvent({ user: data?.user });
            await initDevicesEventFxWithStore();
            await joinMeetingWithLurkerEvent();
        }
    }
});

requestSwitchRoleByLurkerEvent.doneData.watch(data => {
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
