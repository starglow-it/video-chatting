import { root } from '../root';
import { SocketState } from '../types';

export const mainSocketDomain = root.createDomain('socketDomain');
export const $mainSocketStore = mainSocketDomain.store<SocketState>({ socketInstance: null });

export const resetMainSocketStore = mainSocketDomain.event('resetSocketStore');
export const disconnectMainSocketEvent = mainSocketDomain.event('disconnectSocketEvent');

export const mainSocketEventRequest = mainSocketDomain.effect<
    { eventName: string; data: unknown; socketStore: SocketState },
    any,
    string
>('mainSocketEventRequest');

export const initiateMainSocketConnectionFx = mainSocketDomain.effect<
    void,
    any
>('initiateMainSocketConnectionFx');
