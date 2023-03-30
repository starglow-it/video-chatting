import { sample } from 'effector-next';
import { split } from 'effector';
import {
    $serverTypeStore,
    $tracksStore,
    disconnectFromVideoChatEvent,
    initP2PVideoChat,
    initVideoChatEvent,
    removeConnectionStream,
    setConnectionStream,
    setDevicesPermission,
    setDevicesPermissionEvent,
    setServerType,
    startScreenSharing,
    stopScreenSharing,
} from './model';
import { ServerTypes, TrackKind } from '../../../const/webrtc';
import { $activeStreamStore, toggleDevicesEvent } from './localMedia/model';
import {
    changeSFUActiveStreamEvent,
    disconnectFromSFUEvent,
    initSFUVideoChat,
    startSFUSharingEvent,
    stopSFUSharingEvent,
    toggleSFUPermissionsEvent,
} from './sfu/model';
import {
    changeP2PActiveStreamEvent,
    disconnectFromP2PEvent,
    removeConnectionsFx,
    startP2PSharingEvent,
    stopP2PSharingEvent,
} from './p2p/model';
import { $meetingTemplateStore } from '../meeting/meetingTemplate/model';

$tracksStore
    .on(disconnectFromVideoChatEvent, () => ({}))
    .on(disconnectFromP2PEvent, () => ({}))
    .on(setConnectionStream, (state, { connectionId, type, track }) => {        
        if (type === TrackKind.Audio && track) {
            return {
                ...state,
                [connectionId]: { ...state[connectionId], audioTrack: track },
            };
        }
        if (type === TrackKind.Video && track) {
            return {
                ...state,
                [connectionId]: { ...state[connectionId], videoTrack: track },
            };
        }
        return state;
    })
    .on(removeConnectionStream, (state, data) =>
        Object.fromEntries(
            Object.entries(state).filter(([connectionId]) => connectionId !== data.connectionId),
        ),
    )
    .on(removeConnectionsFx.doneData, (state, data) =>
        Object.fromEntries(
            Object.entries(state).filter(([connectionId]) => !data.includes(connectionId)),
        ),
    );

$serverTypeStore.on(setServerType, (state, data) => data);

split({
    source: initVideoChatEvent,
    match: {
        p2p: msg => msg.serverType === ServerTypes.P2P,
        sfu: msg => msg.serverType === ServerTypes.SFU,
    },
    cases: {
        p2p: initP2PVideoChat,
        sfu: initSFUVideoChat,
    },
});

sample({
    clock: setDevicesPermission,
    source: $serverTypeStore,
    fn: (serverType, data) => ({ serverType, ...data }),
    target: setDevicesPermissionEvent,
});

split({
    source: setDevicesPermissionEvent,
    match: {
        p2p: msg => msg?.serverType === ServerTypes.P2P,
        sfu: msg => msg?.serverType === ServerTypes.SFU,
    },
    cases: {
        p2p: toggleDevicesEvent,
        sfu: toggleSFUPermissionsEvent,
    },
});

split({
    clock: startScreenSharing,
    source: $serverTypeStore,
    match: {
        p2p: msg => msg === ServerTypes.P2P,
        sfu: msg => msg === ServerTypes.SFU,
    },
    cases: {
        p2p: startP2PSharingEvent,
        sfu: startSFUSharingEvent,
    },
});

split({
    clock: stopScreenSharing,
    source: $serverTypeStore,
    match: {
        p2p: msg => msg === ServerTypes.P2P,
        sfu: msg => msg === ServerTypes.SFU,
    },
    cases: {
        p2p: stopP2PSharingEvent,
        sfu: stopSFUSharingEvent,
    },
});

split({
    clock: disconnectFromVideoChatEvent,
    source: $serverTypeStore,
    match: {
        p2p: msg => msg === ServerTypes.P2P,
        sfu: msg => msg === ServerTypes.SFU,
    },
    cases: {
        p2p: disconnectFromP2PEvent,
        sfu: disconnectFromSFUEvent,
    },
});

split({
    clock: $activeStreamStore,
    source: $serverTypeStore,
    match: {
        p2p: msg => msg === ServerTypes.P2P,
        sfu: msg => msg === ServerTypes.SFU,
    },
    cases: {
        p2p: changeP2PActiveStreamEvent,
        sfu: changeSFUActiveStreamEvent,
    },
});

sample({
    clock: $meetingTemplateStore,
    fn: meetingTemplate =>
        meetingTemplate.maxParticipants > 4 &&
        meetingTemplate.meetingInstance?.serverStatus === 'active'
            ? ServerTypes.SFU
            : ServerTypes.P2P,
    target: setServerType,
});
