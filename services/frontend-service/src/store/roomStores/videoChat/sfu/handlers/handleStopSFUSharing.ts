import { Track } from 'livekit-client';

import { StopSFUSharingPayload } from '../../types';

export const handleStopSFUSharing = async ({ room }: StopSFUSharingPayload) => {
    try {
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
    
            await localParticipant.setScreenShareEnabled(false);
        }
    } catch (error) {
        console.log(error);
    }
};
