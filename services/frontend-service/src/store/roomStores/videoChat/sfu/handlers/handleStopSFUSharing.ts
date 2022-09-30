import { Track } from 'livekit-client';

import { StopSFUSharingPayload } from '../../types';

export const handleStopSFUSharing = async ({
    room,
    userId,
    sharingUserId,
}: StopSFUSharingPayload) => {
    if (room) {
        if (userId === sharingUserId) {
            const { localParticipant } = room;

            const oldSharingTrack = localParticipant.getTrack(Track.Source.ScreenShare);

            if (oldSharingTrack?.videoTrack) {
                localParticipant.unpublishTrack(oldSharingTrack.videoTrack.mediaStreamTrack);
            }

            await localParticipant.setScreenShareEnabled(false);
        }
    }
};
