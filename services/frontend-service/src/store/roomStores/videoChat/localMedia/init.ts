import { combine, attach, Store, sample } from 'effector-next';

import {
    $activeStreamStore,
    $audioDevicesStore,
    $audioErrorStore,
    $changeStreamStore,
    $currentAudioDeviceStore,
    $currentVideoDeviceStore,
    $isAuraActive,
    $isCameraActiveStore,
    $isMicActiveStore,
    $isStreamRequestedStore,
    $sharingStream,
    $videoDevicesStore,
    $videoErrorStore,
    changeStreamFx,
    commonMediaStore,
    initDevicesEventFx,
    resetMediaStoreEvent,
    setActivePermissionsEvent,
    setActiveStreamEvent,
    setAudioDevicesEvent,
    setAudioErrorEvent,
    setChangeStreamEvent,
    setCurrentAudioDeviceEvent,
    setCurrentVideoDeviceEvent,
    setIsAudioActiveEvent,
    setIsAuraActive,
    setIsCameraActiveEvent,
    setIsStreamRequestedEvent,
    setPermissionsEvent,
    setVideoDevicesEvent,
    setVideoErrorEvent,
    chooseSharingStreamFx,
    toggleDevicesEvent,
    toggleIsAuraActive,
    toggleLocalDeviceEvent,
} from './model';
import { $localUserStore } from '../../users/localUser/model';
import { sendDevicesPermissionSocketEvent } from '../sockets/model';
import { stopScreenSharingFx } from '../p2p/model';

// handlers
import { handleChooseSharingStream } from './handlers/handleChooseSharingStream';
import { handleSetMicPermissions } from './handlers/handleSetMicPermissions';
import { handleSetCameraPermissions } from './handlers/handleSetCameraPermissions';
import { handleInitDevices } from './handlers/handleInitDevices';
import { handleChangeStream } from './handlers/handleChangeStream';

// helpers
import { clearStreamStore } from '../helpers/clearStreamStore';
import { setNewStream } from '../helpers/setNewStream';

// other
import { CustomMediaStream } from '../../../../types';
import { DeviceInputKindEnum } from '../../../../const/media/DEVICE_KINDS';
import { resetRoomStores } from '../../../root';

$audioDevicesStore.on(setAudioDevicesEvent, (state, data) => data).reset(resetRoomStores);
$videoDevicesStore.on(setVideoDevicesEvent, (state, data) => data).reset(resetRoomStores);
$currentAudioDeviceStore
    .on(setCurrentAudioDeviceEvent, (state, data) => data)
    .reset([resetRoomStores, resetMediaStoreEvent]);
$currentVideoDeviceStore
    .on(setCurrentVideoDeviceEvent, (state, data) => data)
    .reset([resetRoomStores, resetMediaStoreEvent]);
$audioErrorStore.on(setAudioErrorEvent, (state, data) => data).reset(resetRoomStores);
$videoErrorStore.on(setVideoErrorEvent, (state, data) => data).reset(resetRoomStores);

$changeStreamStore
    .on(setChangeStreamEvent, setNewStream)
    .on([resetRoomStores, resetMediaStoreEvent], clearStreamStore);

$activeStreamStore.on(setActiveStreamEvent, setNewStream).on(resetRoomStores, clearStreamStore);
$sharingStream
    .on(chooseSharingStreamFx.doneData, (state, data) => data)
    .on([stopScreenSharingFx.doneData, resetRoomStores], clearStreamStore);

$isStreamRequestedStore.on(setIsStreamRequestedEvent, (state, data) => data).reset(resetRoomStores);
$isAuraActive.on(setIsAuraActive, (state, data) => data).on(toggleIsAuraActive, state => !state);
$isCameraActiveStore
    .on(setIsCameraActiveEvent, (state, data) => data)
    .on(setPermissionsEvent, handleSetCameraPermissions)
    .on(setActivePermissionsEvent, handleSetCameraPermissions)
    .reset(resetRoomStores);
$isMicActiveStore
    .on(setIsAudioActiveEvent, (state, data) => data)
    .on(setPermissionsEvent, handleSetMicPermissions)
    .on(setActivePermissionsEvent, handleSetMicPermissions)
    .reset(resetRoomStores);

initDevicesEventFx.use(handleInitDevices);
changeStreamFx.use(handleChangeStream);
chooseSharingStreamFx.use(handleChooseSharingStream);

export const initDevicesEventFxWithStore = attach<
    void,
    typeof commonMediaStore,
    typeof initDevicesEventFx
>({
    effect: initDevicesEventFx,
    source: commonMediaStore,
    mapParams: (data, state) => state,
});

export const changeStreamFxWithStore = attach<
    {
        kind: DeviceInputKindEnum;
        deviceId: MediaDeviceInfo['deviceId'];
    },
    Store<CustomMediaStream>,
    typeof changeStreamFx
>({
    effect: changeStreamFx,
    source: $changeStreamStore,
    mapParams: (data, stream) => ({ ...data, stream }),
});

sample({
    clock: toggleLocalDeviceEvent,
    source: combine({
        stream: $changeStreamStore,
        isCameraActive: $isCameraActiveStore,
        isMicActive: $isMicActiveStore,
    }),
    fn: (state, data) => ({ ...state, ...data }),
    target: setPermissionsEvent,
});

sample({
    clock: toggleDevicesEvent,
    source: combine({
        stream: $activeStreamStore,
        isCameraActive: $isCameraActiveStore,
        isMicActive: $isMicActiveStore,
        localUser: $localUserStore,
    }),
    fn: ({ isMicActive, isCameraActive, localUser, stream }, data) => ({
        isCameraActive,
        isMicActive,
        stream,
        userId: localUser.id,
        ...data,
    }),
    target: setActivePermissionsEvent,
});

setActivePermissionsEvent.watch(data => {
    sendDevicesPermissionSocketEvent({
        audio:
            typeof data.isMicEnabled === 'boolean'
                ? data.isMicEnabled ?? !data.isMicActive
                : data.isMicActive,
        video:
            typeof data.isCamEnabled === 'boolean'
                ? data.isCamEnabled ?? !data.isCameraActive
                : data.isCameraActive,
        userId: data.userId,
    });
});

// TODO:
// navigator.mediaDevices.ondevicechange = async () => {
// const { audio, video } = await getDevices();
// };
