import { combine } from 'effector-next';

import { videoChatDomain } from '../../../domains';
import { recordMeetingResponse, CustomMediaStream, VideoBlob } from '../../../../types';
import {
    ChangeStreamPayload,
    InitDevicesPayload,
    SetActivePermissionsPayload,
    SetPermissionsPayload,
    ToggleDevicePayload,
    UseMediaDevices,
} from '../types';
import { MediaStreamError } from 'src/helpers/media/getMediaStream';

const initialRecordStream = {
    message: '',
    egressId: '',
    url: '',
    error: ''
};

export const $audioDevicesStore = videoChatDomain.createStore<
    UseMediaDevices['audioDevices']
>([]);
export const $videoDevicesStore = videoChatDomain.createStore<
    UseMediaDevices['videoDevices']
>([]);
export const $activeStreamStore =
    videoChatDomain.createStore<CustomMediaStream>(null);
export const $changeStreamStore =
    videoChatDomain.createStore<CustomMediaStream>(null);
export const $isCameraActiveStore = videoChatDomain.createStore<boolean>(true);
export const $isMicActiveStore = videoChatDomain.createStore<boolean>(true);
export const $isStreamRequestedStore =
    videoChatDomain.createStore<boolean>(false);
export const $audioErrorStore = videoChatDomain.createStore<MediaStreamError | null>(
    null,
);
export const $videoErrorStore = videoChatDomain.createStore<MediaStreamError | null>(
    null,
);
export const $currentAudioDeviceStore = videoChatDomain.createStore<string>('');
export const $currentVideoDeviceStore = videoChatDomain.createStore<string>('');
export const $isAuraActive = videoChatDomain.createStore<boolean>(true);
export const $sharingStream =
    videoChatDomain.createStore<CustomMediaStream>(null);

export const $recordingStream =
    videoChatDomain.createStore<recordMeetingResponse>(initialRecordStream);

export const $recordedVideoBlobStore =
    videoChatDomain.createStore<VideoBlob>(null);

export const $isRecordingStore = videoChatDomain.createStore<boolean>(false);
export const $uploadVideoToS3Store = videoChatDomain.createStore<string>('');

export const commonMediaStore = combine({
    audioDevices: $audioDevicesStore,
    videoDevices: $videoDevicesStore,
    activeStream: $activeStreamStore,
    changeStream: $changeStreamStore,
    sharingStream: $sharingStream,
    isCameraActive: $isCameraActiveStore,
    isMicActive: $isMicActiveStore,
    isStreamRequested: $isStreamRequestedStore,
    audioError: $audioErrorStore,
    videoError: $videoErrorStore,
    currentAudioDevice: $currentAudioDeviceStore,
    currentVideoDevice: $currentVideoDeviceStore,
    isAuraActive: $isAuraActive,
    recordedVideoBlob: $recordedVideoBlobStore,
    isRecording: $isRecordingStore,
    uploadVideoToS3Store: $uploadVideoToS3Store,
});

export const setAudioDevicesEvent = videoChatDomain.createEvent<
    UseMediaDevices['audioDevices']
>('setAudioDevicesEvent');
export const setVideoDevicesEvent = videoChatDomain.createEvent<
    UseMediaDevices['videoDevices']
>('setAudioDevicesEvent');
export const setActiveStreamEvent =
    videoChatDomain.createEvent<CustomMediaStream>('setActiveStreamEvent');
export const setChangeStreamEvent =
    videoChatDomain.createEvent<CustomMediaStream>('setChangeStreamEvent');
export const setIsCameraActiveEvent = videoChatDomain.createEvent<boolean>(
    'setIsCameraActiveEvent',
);
export const setIsAudioActiveEvent = videoChatDomain.createEvent<boolean>(
    'setIsAudioActiveEvent',
);
export const setIsStreamRequestedEvent = videoChatDomain.createEvent<boolean>(
    'setIsStreamRequestedEvent',
);
export const setPermissionsEvent =
    videoChatDomain.createEvent<SetPermissionsPayload>('setPermissionsEvent');
export const setActivePermissionsEvent =
    videoChatDomain.createEvent<SetActivePermissionsPayload>(
        'setActivePermissionsEvent',
    );
export const setAudioErrorEvent = videoChatDomain.createEvent<
    MediaStreamError | null
>('setAudioErrorEvent');
export const setVideoErrorEvent = videoChatDomain.createEvent<
    MediaStreamError | null
>('setVideoErrorEvent');
export const setCurrentAudioDeviceEvent = videoChatDomain.createEvent<string>(
    'setCurrentAudioDeviceEvent',
);
export const setCurrentVideoDeviceEvent = videoChatDomain.createEvent<string>(
    'setCurrentVideoDeviceEvent',
);
export const setIsAuraActive =
    videoChatDomain.createEvent<boolean>('setIsAuraActive');
export const toggleIsAuraActive =
    videoChatDomain.createEvent<void>('toggleIsAuraActive');
export const resetMediaStoreEvent = videoChatDomain.createEvent(
    'resetMediaStoreEvent',
);
export const toggleLocalDeviceEvent =
    videoChatDomain.createEvent<ToggleDevicePayload>('toggleLocalDeviceEvent');
export const toggleDevicesEvent =
    videoChatDomain.createEvent<ToggleDevicePayload>('toggleDevicesEvent');

export const initDevicesEventFx = videoChatDomain.createEffect<
    InitDevicesPayload,
    void
>('initDevicesEvent');
export const changeStreamFx = videoChatDomain.createEffect<
    ChangeStreamPayload,
    void
>('changeStreamFx');
export const chooseSharingStreamFx = videoChatDomain.createEffect<
    void,
    CustomMediaStream
>('chooseSharingStreamFx');
export const startRecordStreamFx = videoChatDomain.createEffect<
    void,
    recordMeetingResponse
>('startRecordStreamFx');
export const stopRecordStreamFx = videoChatDomain.createEffect<
    void,
    recordMeetingResponse
>('stopRecordStreamFx');
export const uploadToS3Fx = videoChatDomain.createEffect<
    VideoBlob,
    string
>('uploadToS3Fx');