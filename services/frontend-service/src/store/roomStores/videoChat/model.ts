import { videoChatDomain } from '../../domains';
import { ServerTypes, TrackKind } from '../../../const/webrtc';
import { ConnectionsStore, TracksStore } from './types';

export const $serverTypeStore = videoChatDomain.createStore(ServerTypes.P2P);
export const $connectionsStore = videoChatDomain.createStore<ConnectionsStore>({});
export const $tracksStore = videoChatDomain.createStore<TracksStore>({});

export const initVideoChatEvent = videoChatDomain.createEvent<{ serverType: ServerTypes }>(
    'initVideoChatController',
);
export const initP2PVideoChat = videoChatDomain.createEvent('initP2PVideoChat');
export const setServerType = videoChatDomain.createEvent<ServerTypes>('setServerType');
export const setConnectionStream = videoChatDomain.createEvent<{
    type: TrackKind;
    connectionId: string;
    track?: MediaStreamTrack;
}>('setConnectionStream');
export const removeConnectionStream = videoChatDomain.createEvent<{
    connectionId: string;
}>('removeConnectionStream');
export const setDevicesPermission = videoChatDomain.createEvent<{
    isMicEnabled?: boolean;
    isCamEnabled?: boolean;
}>('setDevicesPermission');
export const setDevicesPermissionEvent = videoChatDomain.createEvent<{
    serverType: ServerTypes;
    isMicEnabled?: boolean;
    isCamEnabled?: boolean;
}>('setDevicesPermissionEvent');
export const startScreenSharing = videoChatDomain.createEvent<void>('');
export const stopScreenSharing = videoChatDomain.createEvent<void>('');
export const disconnectFromVideoChatEvent = videoChatDomain.createEvent<void>('');
