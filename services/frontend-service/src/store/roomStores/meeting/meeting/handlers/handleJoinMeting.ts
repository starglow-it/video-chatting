import { updateLocalUserEvent } from '../../../users/localUser/model';
import {
    sendEnterMeetingRequestSocketEvent,
    sendStartMeetingSocketEvent,
} from '../../sockets/init';
import { emitEnterWaitingRoom } from '../../sockets/model';
import { setBackgroundAudioActive, setBackgroundAudioVolume } from '../../../audio/model';
import { StorageKeysEnum, WebStorage } from '../../../../../controllers/WebStorageController';
import { JoinMeetingFxPayload } from '../types';

export const handleJoinMeting = async ({
    needToRememberSettings,
    isSettingsAudioBackgroundActive,
    settingsBackgroundAudioVolume,
    currentVideoDevice,
    currentAudioDevice,
    isAuraActive,
    isMicActive,
    isCameraActive,
    isOwner,
    isOwnerInMeeting,
    isMeetingInstanceExists,
}: JoinMeetingFxPayload): Promise<void> => {
    updateLocalUserEvent({
        micStatus: isMicActive ? 'active' : 'inactive',
        cameraStatus: isCameraActive ? 'active' : 'inactive',
    });

    if (isOwner) {
        await sendStartMeetingSocketEvent();
    } else if (isMeetingInstanceExists && isOwnerInMeeting) {
        await sendEnterMeetingRequestSocketEvent();
    } else {
        emitEnterWaitingRoom();
    }

    setBackgroundAudioVolume(settingsBackgroundAudioVolume);
    setBackgroundAudioActive(isSettingsAudioBackgroundActive);

    if (needToRememberSettings) {
        WebStorage.save({
            key: StorageKeysEnum.meetingSettings,
            data: {
                backgroundAudioSetting: isSettingsAudioBackgroundActive,
                backgroundAudioVolumeSetting: settingsBackgroundAudioVolume,
                auraSetting: isAuraActive,
                savedVideoDeviceId: currentVideoDevice,
                savedAudioDeviceId: currentAudioDevice,
                cameraActiveSetting: isCameraActive,
                micActiveSetting: isMicActive,
            },
        });
    }
};
