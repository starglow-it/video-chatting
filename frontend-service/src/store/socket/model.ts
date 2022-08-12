import { attach, combine, guard } from 'effector-next';

import { root } from '../root';

import { EmitSocketEventPayload, SocketState } from '../types';

export const socketDomain = root.createDomain('socketDomain');

export const $socketStore = socketDomain.store<SocketState>({ socketInstance: null });
export const $isSocketConnected = $socketStore.map(data => Boolean(data.socketInstance?.id));

export const resetSocketStore = socketDomain.event('resetSocketStore');
export const disconnectSocketEvent = socketDomain.event('disconnectSocketEvent');
export const initiateSocketConnectionEvent = socketDomain.event('initiateSocketConnectionEvent');

export const socketEventRequest = socketDomain.effect<EmitSocketEventPayload, any, string>(
    'socketEventRequest',
);

export const initiateSocketConnectionFx = socketDomain.effect<void, any>(
    'initiateSocketConnectionFx',
);

export const createSocketEvent = (eventName: string) =>
    attach({
        effect: socketEventRequest,
        source: $socketStore,
        mapParams: (data, socketStore) => ({ eventName, data, socketStore }),
    });

export const $isSocketConnecting = initiateSocketConnectionFx.pending;

guard({
    clock: initiateSocketConnectionEvent,
    source: combine({
        isSocketConnecting: $isSocketConnecting,
        isSocketConnected: $isSocketConnected,
    }),
    filter: ({ isSocketConnecting, isSocketConnected }) =>
        !isSocketConnecting && !isSocketConnected,
    target: initiateSocketConnectionFx,
});
