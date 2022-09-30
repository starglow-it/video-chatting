import { attach, combine, Effect, sample, Store } from 'effector-next';

import { EmitSocketEventPayload, SocketState, UserTemplate } from '../../types';
import { rootDomain } from '../../domains';
import { $meetingTemplateStore } from '../meeting/meetingTemplate/model';

export const meetingSocketDomain = rootDomain.createDomain('socketDomain');

export const $meetingSocketStore = meetingSocketDomain.store<SocketState>({ socketInstance: null });
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
    { serverIp: UserTemplate['meetingInstance']['serverIp'] },
    SocketState
>('initiateMeetingSocketConnectionFx');

export const createMeetingSocketEvent = <Payload, Response>(eventName: string) =>
    attach<Payload, Store<SocketState>, Effect<EmitSocketEventPayload, Response, string>>({
        effect: meetingSocketEventRequest as Effect<EmitSocketEventPayload, Response, string>,
        source: $meetingSocketStore,
        mapParams: (data, socketStore) => ({ eventName, data, socketStore }),
    });

export const $isMeetingSocketConnecting = initiateMeetingSocketConnectionFx.pending;

sample({
    clock: initiateMeetingSocketConnectionEvent,
    source: combine({
        meetingTemplate: $meetingTemplateStore,
        isSocketConnecting: $isMeetingSocketConnecting,
        isSocketConnected: $isMeetingSocketConnected,
    }),
    filter: ({ isSocketConnecting, isSocketConnected }) =>
        !isSocketConnecting && !isSocketConnected,
    fn: ({ meetingTemplate }) => ({ serverIp: meetingTemplate.meetingInstance.serverIp }),
    target: initiateMeetingSocketConnectionFx,
});
