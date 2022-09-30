import { Track } from 'livekit-client';
import { RoomStore, ToggleDevicePayload } from '../../types';
import { sendDevicesPermissionSocketEvent } from '../../sockets/model';
import { MeetingUser } from '../../../../types';

export const handleSetSFUPermissions = async (
    data: ToggleDevicePayload & {
        userId: MeetingUser['id'];
        room: RoomStore;
        isCameraActive: boolean;
        isMicActive: boolean;
    },
) => {
    if (data.room) {
        if ('isCamEnabled' in data) {
            const videoTrackPub = data.room.localParticipant.getTrack(Track.Source.Camera);

            if (videoTrackPub) {
                if (data.isCamEnabled) {
                    await videoTrackPub.unmute();
                } else {
                    await videoTrackPub.mute();
                }

                sendDevicesPermissionSocketEvent({
                    audio: data.isMicActive,
                    video:
                        typeof data.isCamEnabled === 'boolean'
                            ? data.isCamEnabled ?? !data.isCameraActive
                            : data.isCameraActive,
                    userId: data.userId,
                });
            }
        }

        if ('isMicEnabled' in data) {
            const audioTrackPub = data.room.localParticipant.getTrack(Track.Source.Microphone);

            if (audioTrackPub) {
                if (data.isMicEnabled) {
                    await audioTrackPub.unmute();
                } else {
                    await audioTrackPub.mute();
                }

                sendDevicesPermissionSocketEvent({
                    audio:
                        typeof data.isMicEnabled === 'boolean'
                            ? data.isMicEnabled ?? !data.isMicActive
                            : data.isMicActive,
                    video: data.isCameraActive,
                    userId: data.userId,
                });
            }
        }
    }
};
