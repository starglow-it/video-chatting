import { forward } from 'effector-next';
import {meetingUsersDomain} from "./domain/model";
import {initiateSocketConnectionFx} from "../socket/model";
import {ErrorState, SocketState} from "../types";
import sendRequestWithCredentials from "../../helpers/http/sendRequestWithCredentials";
import {sendInviteEmailUrl} from "../../utils/urls";

export const usersSocketEventsController = meetingUsersDomain.event<SocketState>();

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

forward({
    from: initiateSocketConnectionFx.doneData,
    to: usersSocketEventsController,
});
