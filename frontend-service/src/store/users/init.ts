import { meetingUsersDomain } from './domain/model';
import { ErrorState } from '../types';
import sendRequestWithCredentials from '../../helpers/http/sendRequestWithCredentials';
import { sendInviteEmailUrl } from '../../utils/urls';
import { createSocketEvent } from '../socket/model';
import { REMOVE_USER, UPDATE_USER } from '../../const/socketEvents/emitters';

// backend api effects
export const sendInviteEmailFx = meetingUsersDomain.effect({
    name: 'sendInviteEmailFx',
    handler: async params => {
        return await sendRequestWithCredentials<{ result: true }, ErrorState>({
            ...sendInviteEmailUrl,
            data: params,
        });
    },
});

export const updateUserSocketEvent = createSocketEvent(UPDATE_USER);
export const removeUserSocketEvent = createSocketEvent(REMOVE_USER);
