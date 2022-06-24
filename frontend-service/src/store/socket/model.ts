import { root } from '../root';
import { SocketState } from '../types';
import {attach} from "effector-next";

export const socketDomain = root.createDomain('socketDomain');
export const $socketStore = socketDomain.store<SocketState>({ socketInstance: null });

export const resetSocketStore = socketDomain.event('resetSocketStore');
export const disconnectSocketEvent = socketDomain.event('disconnectSocketEvent');

export const socketEventRequest = socketDomain.effect<
    { eventName: string; data?: unknown; socketStore: SocketState },
    any,
    string
>('socketEventRequest');

export const createSocketEvent = (eventName: string) =>
    attach({
        effect: socketEventRequest,
        source: $socketStore,
        mapParams: (data, socketStore) => ({ eventName, data, socketStore }),
    });

export const initiateSocketConnectionFx = socketDomain.effect<void, any>(
    'initiateSocketConnectionFx',
);

export const $isSocketConnected = $socketStore.map(data => Boolean(data.socketInstance?.id));
