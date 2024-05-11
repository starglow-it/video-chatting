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
        console.log(isCameraActive, isMicActive, room, stream, localUser);
        if (room) {
            const videoTrack = stream?.getVideoTracks?.()?.[0];
            const audioTrack = stream?.getAudioTracks?.()?.[0];
            console.log(localUser);

            if (videoTrack) {
                console.log('video track exist');
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
