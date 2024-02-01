import { getRecordingStream } from 'src/helpers/media/getRecordingStream';
import { CustomMediaStream, VideoBlob } from 'src/types';
import { trackEndedEvent } from '../../model';

export const handleStartRecordingStream = async (): Promise<CustomMediaStream | null> => {
    try {
        const recordingStream = await getRecordingStream();
        const sharingTrack = recordingStream?.getVideoTracks()?.[0];
        if (sharingTrack) {
            sharingTrack.onended = () => {
                trackEndedEvent();
            };
        }
        return recordingStream;
    } catch (e) {
        console.error(e);
        return null;
    }
};
// Stopping the recording and returning the blob
export const handleStopRecordingStream = async (data: VideoBlob): Promise<VideoBlob> => {
    return new Promise((resolve, reject) => {
        resolve(data)
    });
};
