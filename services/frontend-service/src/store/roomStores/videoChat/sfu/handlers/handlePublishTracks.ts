import { Track } from 'livekit-client';
import { PublishTracksPayload } from '../../types';

export const handlePublishTracks = async ({
    stream,
    room,
    isCameraActive,
    isMicActive,
    localUser,
}: PublishTracksPayload) => {
    try {
        if (room) {
            const videoTrack = stream?.getVideoTracks?.()?.[0];
            const audioTrack = stream?.getAudioTracks?.()?.[0];

            if (videoTrack) {
                const videoTrackPub = await room.localParticipant.publishTrack(
                    videoTrack,
                    {
                        name: `videoTrack_${localUser.id}`,
                        simulcast: true,
                        source: Track.Source.Camera,
                    },
                );

                if (!isCameraActive) {
                    await videoTrackPub.mute();
                }
            }

            if (audioTrack) {
                const audioTrackPub = await room.localParticipant.publishTrack(
                    audioTrack,
                    {
                        name: `audioTrack_${localUser.id}`,
                        source: Track.Source.Microphone,
                    },
                );
                if (!isMicActive) {
                    await audioTrackPub.mute();
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
};
