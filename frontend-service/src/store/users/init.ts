import { meetingUsersDomain } from './domain/model';
import { AppDialogsEnum, ErrorState, MeetingUser } from '../types';
import sendRequestWithCredentials from '../../helpers/http/sendRequestWithCredentials';
import { sendInviteEmailUrl } from '../../utils/urls';
import { createSocketEvent } from '../socket/model';
import {
    EMIT_CHANGE_HOST,
    EMIT_REMOVE_USER,
    EMIT_UPDATE_USER,
} from '../../const/socketEvents/emitters';
import { setMeetingErrorEvent } from '../meeting/meetingError/model';
import { appDialogsApi } from '../dialogs/init';

// backend api effects
export const sendInviteEmailFx = meetingUsersDomain.effect({
    name: 'sendInviteEmailFx',
    handler: async params =>
        sendRequestWithCredentials<{ result: true }, ErrorState>({
            ...sendInviteEmailUrl,
            data: params,
        }),
});

export const updateUserSocketEvent = createSocketEvent<Partial<MeetingUser>, unknown>(
    EMIT_UPDATE_USER,
);
export const removeUserSocketEvent = createSocketEvent<{ id: MeetingUser['id'] }, unknown>(
    EMIT_REMOVE_USER,
);
export const changeHostSocketEvent = createSocketEvent<{ userId: MeetingUser['id'] }, unknown>(
    EMIT_CHANGE_HOST,
);

changeHostSocketEvent.failData.watch(data => {
    setMeetingErrorEvent(data);
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.meetingErrorDialog,
    });
});
