import { forward } from 'effector-next';

import { meetingUsersDomain } from './domain';
import { initiateSocketConnectionFx } from '../socket';

// types
import { ErrorState, HttpMethods, SocketState } from '../types';

// const
import { sendInviteEmailUrl } from '../../utils/urls/resolveUrl';
import sendRequestWithCredentials from '../../helpers/http/sendRequestWithCredentials';

export const usersSocketEventsController = meetingUsersDomain.event<SocketState>();

// backend api effects
export const sendInviteEmailFx = meetingUsersDomain.effect({
    name: 'sendInviteEmailFx',
    handler: async params => {
        return await sendRequestWithCredentials<{ result: true }, ErrorState>(sendInviteEmailUrl, {
            method: HttpMethods.Post,
            data: params,
        });
    },
});

forward({
    from: initiateSocketConnectionFx.doneData,
    to: usersSocketEventsController,
});
