import { Track } from 'livekit-client';
import { ChangeTracksPayload } from '../../types';
import { publishTracksFx } from '../model';

export const handleChangeSFUStream = async ({
    stream,
    room,
    localUser,
    isCameraActive,
    isMicActive,
}: ChangeTracksPayload) => {
    if (room) {
        const { localParticipant } = room;

        const oldVideoTrack = localParticipant.getTrackPublication(Track.Source.Camera);
        const oldAudioTrack = localParticipant.getTrackPublication(
            Track.Source.Microphone,
        );

        if (oldVideoTrack?.videoTrack) {
            localParticipant.unpublishTrack(
                oldVideoTrack.videoTrack.mediaStreamTrack,
            );
        }

        if (oldAudioTrack?.audioTrack) {
            localParticipant.unpublishTrack(
                oldAudioTrack.audioTrack.mediaStreamTrack,
            );
        }

        await publishTracksFx({
            room,
            stream,
            localUser,
            isCameraActive,
            isMicActive,
        });
    }
};
