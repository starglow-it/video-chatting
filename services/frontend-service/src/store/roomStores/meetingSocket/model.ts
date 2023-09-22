import { attach, combine, Effect, sample, Store } from 'effector-next';

import { IUserTemplate } from 'shared-types';
import { EmitSocketEventPayload, SocketState } from '../../types';
import { rootDomain } from '../../domains';
import {
    $isOwner,
    $meetingTemplateStore,
} from '../meeting/meetingTemplate/model';
import { createSocketEvent } from '../../socket/model';
import { JoinRoomBeforeMeetingPayload } from '../../socket/types';
import { DashboardSocketEmitters } from '../../../const/socketEvents/emitters';
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
} from '../audio/model';

export const meetingSocketDomain = rootDomain.createDomain('socketDomain');

export const $meetingSocketStore = meetingSocketDomain.createStore<SocketState>(
    {
        socketInstance: null,
    },
);

export const reloadMeetingSocketFx = meetingSocketDomain.createEffect(
    'reloadMeetingSocketFx',
);

export const reloadMeetingSocketEvent = () =>
    attach({
        effect: reloadMeetingSocketFx,
        source: combine({
            backgroundAudioVolume: $backgroundAudioVolume,
            isBackgroundAudioActive: $isBackgroundAudioActive,
            templateId: window.location.pathname,
            isOwner: $isOwner,
        }),
        mapParams: ({
            isOwner,
            isBackgroundAudioActive,
            backgroundAudioVolume,
            templateId,
        }) => ({
            isOwner,
            isBackgroundAudioActive,
            backgroundAudioVolume,
            templateId,
        }),
    });

export const $isMeetingSocketConnected = $meetingSocketStore.map(data =>
    Boolean(data.socketInstance?.id),
);

export const disconnectMeetingSocketEvent = meetingSocketDomain.event(
    'disconnectMeetingSocketEvent',
);
export const initiateMeetingSocketConnectionEvent = meetingSocketDomain.event(
    'initiateMeetingSocketConnectionEvent',
);

export const meetingSocketEventRequest = meetingSocketDomain.effect<
    EmitSocketEventPayload,
    unknown,
    string
>('meetingSocketEventRequest');

export const initiateMeetingSocketConnectionFx = meetingSocketDomain.effect<
    { serverIp: IUserTemplate['meetingInstance']['serverIp'] },
    SocketState
>('initiateMeetingSocketConnectionFx');

export const createMeetingSocketEvent = <Payload, Response>(
    eventName: string,
) =>
    attach<
        Payload,
        Store<SocketState>,
        Effect<EmitSocketEventPayload, Response, string>
    >({
        effect: meetingSocketEventRequest as Effect<
            EmitSocketEventPayload,
            Response,
            string
        >,
        source: $meetingSocketStore,
        mapParams: (data, socketStore) => ({ eventName, data, socketStore }),
    });

export const $isMeetingSocketConnecting =
    initiateMeetingSocketConnectionFx.pending;

sample({
    clock: initiateMeetingSocketConnectionEvent,
    source: combine({
        meetingTemplate: $meetingTemplateStore,
        isSocketConnecting: $isMeetingSocketConnecting,
        isSocketConnected: $isMeetingSocketConnected,
    }),
    filter: ({ isSocketConnecting, isSocketConnected }) =>
        !isSocketConnecting && !isSocketConnected,
    fn: ({ meetingTemplate }) => ({
        serverIp: meetingTemplate.meetingInstance.serverIp,
    }),
    target: initiateMeetingSocketConnectionFx,
});

export const joinRoomBeforeMeetingSocketEvent = createSocketEvent<
    JoinRoomBeforeMeetingPayload,
    void
>(DashboardSocketEmitters.JoinRoomBeforeMeeting);
