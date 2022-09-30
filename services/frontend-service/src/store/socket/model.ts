import { attach, combine, Effect, sample, Store } from 'effector-next';

import { EmitSocketEventPayload, SocketState } from '../types';
import { rootDomain } from '../domains';

export const socketDomain = rootDomain.createDomain('socketDomain');

export const $socketStore = socketDomain.store<SocketState>({ socketInstance: null });
export const $isSocketConnected = $socketStore.map(data => Boolean(data.socketInstance?.id));

export const disconnectSocketEvent = socketDomain.event('disconnectSocketEvent');
export const initiateSocketConnectionEvent = socketDomain.event('initiateSocketConnectionEvent');

export const socketEventRequest = socketDomain.effect<EmitSocketEventPayload, unknown, string>(
    'socketEventRequest',
);

export const initiateSocketConnectionFx = socketDomain.effect<void, SocketState>(
    'initiateSocketConnectionFx',
);

export const createSocketEvent = <Payload, Response>(eventName: string) =>
    attach<Payload, Store<SocketState>, Effect<EmitSocketEventPayload, Response, string>>({
        effect: socketEventRequest as Effect<EmitSocketEventPayload, Response, string>,
        source: $socketStore,
        mapParams: (data, socketStore) => ({ eventName, data, socketStore }),
    });

export const $isSocketConnecting = initiateSocketConnectionFx.pending;

sample({
    clock: initiateSocketConnectionEvent,
    source: combine({
        isSocketConnecting: $isSocketConnecting,
        isSocketConnected: $isSocketConnected,
    }),
    filter: ({ isSocketConnecting, isSocketConnected }) =>
        !isSocketConnecting && !isSocketConnected,
    target: initiateSocketConnectionFx,
});
