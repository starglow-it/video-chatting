import {
    setAudioDevicesEvent,
    setAudioErrorEvent,
    setChangeStreamEvent,
    setCurrentAudioDeviceEvent,
    setCurrentVideoDeviceEvent,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    setIsStreamRequestedEvent,
    setVideoDevicesEvent,
    setVideoErrorEvent,
} from '../model';
import { stopStream } from '../../../../../helpers/media/stopStream';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../../../../controllers/WebStorageController';
import { SavedSettings } from '../../../../../types';
import { getMediaStream } from '../../../../../helpers/media/getMediaStream';
import {
    getDevices,
    getDevicesFromStream,
} from '../../../../../helpers/media/getDevices';
import { InitDevicesPayload } from '../../types';

export const handleInitDevices = async ({
    changeStream,
    currentAudioDevice,
    currentVideoDevice,
    isCameraActive,
    isMicActive,
}: InitDevicesPayload) => {
    setIsStreamRequestedEvent(true);
    stopStream(changeStream);
    setChangeStreamEvent(null);

    const savedSettings = WebStorage.get<SavedSettings>({
        key: StorageKeysEnum.meetingSettings,
    });

    const {
        stream: initialStream,
        audioError: initialAudioError,
        videoError: initialVideoError,
    } = await getMediaStream({
        audioDeviceId: savedSettings.savedAudioDeviceId || currentAudioDevice,
        videoDeviceId: savedSettings.savedVideoDeviceId || currentVideoDevice,
    });

    setAudioErrorEvent(initialAudioError);
    setVideoErrorEvent(initialVideoError);

    if (initialAudioError && initialVideoError) {
        setIsStreamRequestedEvent(false);
        return;
    }

    if (initialStream) {
        const { audioDeviceId, videoDeviceId } =
            getDevicesFromStream(initialStream);

        stopStream(initialStream);

        const { audio, video } = await getDevices();

        const videoDevice =
            video.find(device => device.deviceId === videoDeviceId) ||
            video?.[0];
        const audioDevice =
            audio.find(device => device.deviceId === audioDeviceId) ||
            audio?.[0];

        const {
            stream,
            audioError: newAudioError,
            videoError: newVideoError,
        } = await getMediaStream({
            audioDeviceId: audioDevice?.deviceId,
            videoDeviceId: videoDevice?.deviceId,
        });

        if (stream) {
            const { videoDeviceId: oldDevice } =
                getDevicesFromStream(changeStream);
            const {
                videoDeviceId: newVideoDeviceId,
                audioDeviceId: newAudioDeviceId,
            } = getDevicesFromStream(stream);

            if (
                oldDevice !== newVideoDeviceId ||
                !changeStream ||
                !changeStream?.active
            ) {
                stopStream(changeStream);

                setIsCameraActiveEvent(isCameraActive);
                setIsAudioActiveEvent(isMicActive);

                setCurrentAudioDeviceEvent(
                    newAudioDeviceId || currentAudioDevice,
                );
                setCurrentVideoDeviceEvent(
                    newVideoDeviceId || currentVideoDevice,
                );

                setChangeStreamEvent(stream);
            } else {
                stopStream(stream);
                setChangeStreamEvent(changeStream);
            }

            setAudioErrorEvent('');
            setVideoErrorEvent('');

            if (audio.length) {
                setAudioDevicesEvent(audio);
            }

            if (video.length) {
                setVideoDevicesEvent(video);
            }
        }

        if (newAudioError || newVideoError) {
            setAudioErrorEvent(newAudioError);
            setVideoErrorEvent(newVideoError);
        }

        setIsStreamRequestedEvent(false);
    }
};
