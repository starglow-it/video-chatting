import { root } from '../root';
import { MeetingInstance, SocketState } from '../types';

export const socketDomain = root.createDomain('socketDomain');
export const $socketStore = socketDomain.store<SocketState>({ socketInstance: null });

export const resetSocketStore = socketDomain.event('resetSocketStore');
export const disconnectSocketEvent = socketDomain.event('disconnectSocketEvent');

export const socketEventRequest = socketDomain.effect<
    { eventName: string; data: unknown; socketStore: SocketState },
    any,
    string
>('socketEventRequest');

export const initiateSocketConnectionFx = socketDomain.effect<
    { serverIp: MeetingInstance['serverIp'] },
    any
>('initiateSocketConnectionFx');
