import { ErrorState } from 'shared-types';

import { meetingUsersDomain } from './domain/model';
import { AppDialogsEnum, MeetingUser } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { sendInviteEmailUrl } from '../../../utils/urls';
import { UsersSocketEmitters } from '../../../const/socketEvents/emitters';
import { setMeetingErrorEvent } from '../meeting/meetingError/model';
import { appDialogsApi } from '../../dialogs/init';
import { createMeetingSocketEvent } from '../meetingSocket/model';

// backend api effects
export const sendInviteEmailFx = meetingUsersDomain.effect({
    name: 'sendInviteEmailFx',
    handler: async params =>
        sendRequestWithCredentials<{ result: true }, ErrorState>({
            ...sendInviteEmailUrl,
            data: params,
        }),
});

export const updateUserSocketEvent = createMeetingSocketEvent<Partial<MeetingUser>, unknown>(
    UsersSocketEmitters.UpdateUser,
);
export const removeUserSocketEvent = createMeetingSocketEvent<{ id: MeetingUser['id'] }, unknown>(
    UsersSocketEmitters.RemoveUser,
);
export const changeHostSocketEvent = createMeetingSocketEvent<
    { userId: MeetingUser['id'] },
    unknown
>(UsersSocketEmitters.ChangeHost);

changeHostSocketEvent.failData.watch(data => {
    if (data) {
        setMeetingErrorEvent(data);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }
});
