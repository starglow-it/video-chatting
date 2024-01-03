import {
    getMediaStream,
    GetMediaStream,
} from '../../../../../helpers/media/getMediaStream';
import { getDevicesFromStream } from '../../../../../helpers/media/getDevices';
import { DeviceInputKindEnum } from '../../../../../const/media/DEVICE_KINDS';
import { stopStream } from '../../../../../helpers/media/stopStream';
import {
    setAudioErrorEvent,
    setChangeStreamEvent,
    setCurrentAudioDeviceEvent,
    setCurrentVideoDeviceEvent,
    setVideoErrorEvent,
} from '../model';
import { ChangeStreamPayload } from '../../types';

export const handleChangeStream = async ({
    kind,
    deviceId,
    stream,
}: ChangeStreamPayload) => {
    let newStream: GetMediaStream = {};

    if (stream) {
        const { audioDeviceId, videoDeviceId } = getDevicesFromStream(stream);

        if (kind === DeviceInputKindEnum.VideoInput) {
            newStream = await getMediaStream({
                audioDeviceId,
                videoDeviceId: deviceId,
            });
        } else if (kind === DeviceInputKindEnum.AudioInput) {
            newStream = await getMediaStream({
                audioDeviceId: deviceId,
                videoDeviceId,
            });
        }

        stopStream(stream);

        if (newStream?.stream) {
            const {
                videoDeviceId: oldVideoDevice,
                audioDeviceId: oldAudioDevice,
            } = getDevicesFromStream(stream);
            const {
                videoDeviceId: newVideoDevice,
                audioDeviceId: newAudioDevice,
            } = getDevicesFromStream(newStream?.stream);

            if (
                oldVideoDevice !== newVideoDevice ||
                oldAudioDevice !== newAudioDevice ||
                !stream ||
                !stream?.active
            ) {
                stopStream(stream);

                setCurrentVideoDeviceEvent(
                    (newVideoDevice || oldVideoDevice) as string,
                );
                setCurrentAudioDeviceEvent(
                    (newAudioDevice || oldAudioDevice) as string,
                );

                setChangeStreamEvent(newStream?.stream);
            } else {
                stopStream(newStream?.stream);

                setChangeStreamEvent(stream);
            }
            setAudioErrorEvent(newStream?.audioError || null);
            setVideoErrorEvent(newStream?.videoError || null);
        }
        
        if (newStream?.audioError != null && newStream?.videoError != null) {
            setAudioErrorEvent(newStream?.audioError);
            setVideoErrorEvent(newStream?.videoError);
            setChangeStreamEvent(null);
        }
    }
};
