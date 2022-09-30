import { CustomMediaStream } from '../../../../types';
import { addBlur } from '../../../../helpers/media/addBlur';

export const applyBlur = async (
    stream: CustomMediaStream,
    options?: { isAuraActive: boolean },
): Promise<CustomMediaStream> => {
    const blurFn = addBlur('/images/orange.png');

    if (stream) {
        let videoTrack = stream?.getVideoTracks()[0];

        if (videoTrack) {
            const temEnabled = videoTrack.enabled;

            videoTrack.enabled = true;

            if (options?.isAuraActive) {
                videoTrack = await blurFn.start(videoTrack);
            } else {
                blurFn.destroy();
            }

            const track = stream.getVideoTracks()[0];

            stream.removeTrack(track);
            stream.addTrack(videoTrack);
            stream.addTrack(track);

            videoTrack.enabled = temEnabled;
        }

        return stream;
    }

    return stream;
};
