import { Room } from 'livekit-client';

import { videoChatDomain } from '../../../domains';
import {
    ChangeTracksPayload,
    ConnectToSFUPayload,
    GetLiveKitTokenPayload,
    PublishTracksPayload,
    RoomStore,
    StartSFUSharingPayload,
    StopSFUSharingPayload,
    ToggleDevicePayload,
} from '../types';
import { MeetingUser } from '../../../types';

export const $SFURoom = videoChatDomain.createStore<RoomStore>(null);
export const $isRoomPublished = videoChatDomain.createStore<RoomStore>(false);

// effects
export const getLiveKitTokenFx = videoChatDomain.createEffect<
    GetLiveKitTokenPayload,
    string
>('getLiveKitTokenFx');
export const connectToSFUFx = videoChatDomain.createEffect<
    ConnectToSFUPayload,
    Room
>('connectToSFUFx');
export const disconnectFromSFUFx = videoChatDomain.createEffect<
    { room: RoomStore },
    void
>('disconnectFromSFUFx');
export const publishTracksFx = videoChatDomain.createEffect<
    PublishTracksPayload,
    void
>('publishTracksFx');

export const publishTracksEvent =
    videoChatDomain.createEvent('publishTracksEvent');
export const setSFUPermissionsFx = videoChatDomain.createEffect<
    ToggleDevicePayload & {
        userId: MeetingUser['id'];
        isCameraActive: boolean;
        isMicActive: boolean;
        room: RoomStore;
    },
    void
>('setSFUPermissionsFx');
export const startSFUSharingFx = videoChatDomain.createEffect<
    StartSFUSharingPayload,
    void
>('startSFUSharingFx');
export const stopSFUSharingFx = videoChatDomain.createEffect<
    StopSFUSharingPayload,
    void
>('stopSFUSharingFx');

// events
export const initSFUVideoChat = videoChatDomain.createEvent('initSFUVideoChat');
export const disconnectFromSFUEvent = videoChatDomain.createEvent<void>(
    'disconnectFromSFUEvent',
);
export const isRoomPublishedEvent = videoChatDomain.createEvent<void>(
    'isRoomPublishedEvent',
);
export const toggleSFUPermissionsEvent =
    videoChatDomain.createEvent<ToggleDevicePayload>(
        'toggleSFUPermissionsEvent',
    );
export const startSFUSharingEvent = videoChatDomain.createEvent(
    'startSFUSharingEvent',
);
export const stopSFUSharingEvent = videoChatDomain.createEvent(
    'stopSFUSharingEvent',
);
export const changeSFUActiveStreamEvent = videoChatDomain.createEvent(
    'changeSFUActiveStreamEvent',
);
export const changeSFUActiveStreamFx = videoChatDomain.createEffect<
    ChangeTracksPayload,
    void
>('changeSFUActiveStreamFx');
