import { AnswerSwitchRoleAction, ErrorState } from 'shared-types';

import { meetingUsersDomain } from './domain/model';
import { AppDialogsEnum, MeetingUser } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { sendInviteEmailUrl } from '../../../utils/urls';
import { UsersSocketEmitters } from '../../../const/socketEvents/emitters';
import { setMeetingErrorEvent } from '../meeting/meetingError/model';
import { appDialogsApi } from '../../dialogs/init';
import { createMeetingSocketEvent } from '../meetingSocket/model';
import { updateMeetingEvent } from '../meeting/meeting/model';
import { updateMeetingUserEvent } from './meetingUsers/model';
import { setRoleQueryUrlEvent } from '../meeting/meetingRole/model';
import { initDevicesEventFxWithStore } from '../videoChat/localMedia/init';
import { publishTracksEvent } from '../videoChat/sfu/model';
import { putStreamToLocalStreamEvent } from '../videoChat/localMedia/model';

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
    unknown
>(UsersSocketEmitters.UpdateUser);
export const removeUserSocketEvent = createMeetingSocketEvent<
    { id: MeetingUser['id'] },
    unknown
>(UsersSocketEmitters.RemoveUser);
export const changeHostSocketEvent = createMeetingSocketEvent<
    { userId: MeetingUser['id'] },
    unknown
>(UsersSocketEmitters.ChangeHost);

export const requestSwitchRoleByHostEvent = createMeetingSocketEvent<
    { meetingId: string; meetingUserId: string },
    unknown
>(UsersSocketEmitters.RequestRoleByHost);

export const requestSwitchRoleByLurkerEvent = createMeetingSocketEvent<
    { meetingId: string },
    unknown
>(UsersSocketEmitters.AnswerRequestByLurker);

export const answerRequestByHostEvent = createMeetingSocketEvent<
    {
        meetingUserId: string;
        action: AnswerSwitchRoleAction;
        meetingId: string;
    },
    unknown
>(UsersSocketEmitters.AnswerRequestByHost);

export const answerRequestByLurkerEvent = createMeetingSocketEvent<
    { action: AnswerSwitchRoleAction; meetingId: string },
    unknown
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
        console.log('#Duy Phan console answer', data);
        await initDevicesEventFxWithStore();
        setRoleQueryUrlEvent(null);
        updateMeetingEvent({ meeting: data?.meeting });
        updateMeetingUserEvent({ user: data?.user });
        publishTracksEvent();
        putStreamToLocalStreamEvent();
    }
});
