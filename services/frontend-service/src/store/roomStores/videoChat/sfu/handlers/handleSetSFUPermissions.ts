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
    const updateData = {
        userId: data.userId,
        video: data.isCameraActive,
        audio: data.isMicActive,
    };

    if (data.room) {
        const videoTrackPub = data.room.localParticipant.getTrackPublication(
            Track.Source.Camera,
        );

        if (videoTrackPub) {
            if (updateData.video) {
                await videoTrackPub.unmute();
            } else {
                await videoTrackPub.mute();
            }
        }

        const audioTrackPub = data.room.localParticipant.getTrackPublication(
            Track.Source.Microphone,
        );

        if (audioTrackPub) {
            if (updateData.audio) {
                await audioTrackPub.unmute();
            } else {
                await audioTrackPub.mute();
            }
        }
    }

    sendDevicesPermissionSocketEvent(updateData);
};
