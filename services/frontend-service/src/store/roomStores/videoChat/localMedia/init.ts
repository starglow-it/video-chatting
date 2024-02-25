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
    $recordingStream,
    startRecordStreamFx,
    stopRecordStreamFx,
    $recordedVideoBlobStore,
    $isRecordingStore,
    uploadToS3Fx,
    $uploadVideoToS3Store,
    recordingRequestAcceptedEvent
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

// other
import { CustomMediaStream } from '../../../../types';
import { DeviceInputKindEnum } from '../../../../const/media/DEVICE_KINDS';
import { resetRoomStores } from '../../../root';
import { clearStreamStore } from '../../../../helpers/media/clearStreamStore';
import { setNewStream } from '../../../../helpers/media/setNewStream';
import { handleStartRecordingStream, handleStopRecordingStream } from './handlers/handleRecordingStream';
import { resetRecordedVideoBlobStore, resetUploadVideoToS3Store, startRecordMeeting, stopRecordMeeting } from '../model';
import { handleUploadToS3 } from './handlers/handleUploadToS3';

$audioDevicesStore
    .on(setAudioDevicesEvent, (state, data) => data)
    .reset(resetRoomStores);
$videoDevicesStore
    .on(setVideoDevicesEvent, (state, data) => data)
    .reset(resetRoomStores);
$currentAudioDeviceStore
    .on(setCurrentAudioDeviceEvent, (state, data) => data)
    .reset([resetRoomStores, resetMediaStoreEvent]);
$currentVideoDeviceStore
    .on(setCurrentVideoDeviceEvent, (state, data) => data)
    .reset([resetRoomStores, resetMediaStoreEvent]);
$audioErrorStore
    .on(setAudioErrorEvent, (state, data) => data)
    .reset(resetRoomStores);
$videoErrorStore
    .on(setVideoErrorEvent, (state, data) => data)
    .reset(resetRoomStores);

$changeStreamStore
    .on(setChangeStreamEvent, setNewStream)
    .on([resetRoomStores, resetMediaStoreEvent], clearStreamStore);

$activeStreamStore
    .on(setActiveStreamEvent, setNewStream)
    .on(resetRoomStores, clearStreamStore);
$sharingStream
    .on(chooseSharingStreamFx.doneData, (state, data) => data)
    .on([stopScreenSharingFx.doneData, resetRoomStores], clearStreamStore);

$isStreamRequestedStore
    .on(setIsStreamRequestedEvent, (state, data) => data)
    .reset(resetRoomStores);
$isAuraActive
    .on(setIsAuraActive, (state, data) => data)
    .on(toggleIsAuraActive, state => !state);
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

$recordingStream
    .on(startRecordStreamFx.doneData, (state, data) => ({ ...data }))
    .on(stopRecordStreamFx.doneData, (state, data) => ({ ...data }))
    .on(stopRecordStreamFx.fail, (state, error) => {
        return { ...state, error: 'An error occurred during recording.' };
    })
    .reset(resetRoomStores);

$recordedVideoBlobStore
    .on(stopRecordStreamFx.doneData, (state, data) => ({ ...data }))
    .on(resetRecordedVideoBlobStore, () => null);

$isRecordingStore
    .on(recordingRequestAcceptedEvent, () => true)
    .on(startRecordStreamFx.doneData, (state, data) => Boolean(data))
    .on(stopRecordMeeting, () => false);

$uploadVideoToS3Store
    .on(uploadToS3Fx.doneData, (state, data) => data)
    .on(resetUploadVideoToS3Store, () => '');

initDevicesEventFx.use(handleInitDevices);
changeStreamFx.use(handleChangeStream);
chooseSharingStreamFx.use(handleChooseSharingStream);
startRecordStreamFx.use(handleStartRecordingStream);
stopRecordStreamFx.use(handleStopRecordingStream)
uploadToS3Fx.use(handleUploadToS3)

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
