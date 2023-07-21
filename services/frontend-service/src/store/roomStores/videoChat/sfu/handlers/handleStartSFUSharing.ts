import { Track } from 'livekit-client';
import { StartSFUSharingPayload } from '../../types';

export const handleStartSFUSharing = async ({
    room,
    userId,
}: StartSFUSharingPayload) => {
    if (room) {
        const { localParticipant } = room;

        const oldSharingTrack = localParticipant.getTrack(
            Track.Source.ScreenShare,
        );

        if (oldSharingTrack?.videoTrack) {
            localParticipant.unpublishTrack(
                oldSharingTrack.videoTrack.mediaStreamTrack,
            );
        }

        await localParticipant.setScreenShareEnabled(
            true,
            { audio: false },
            {
                name: `sharing_${userId}`,
                source: Track.Source.ScreenShare,
                simulcast: true,
            },
        );
    }
};
