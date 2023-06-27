import { updateLocalUserEvent } from '../../../users/localUser/model';
import {
    sendEnterMeetingRequestSocketEvent,
    sendStartMeetingSocketEvent,
} from '../../sockets/init';
import { emitEnterWaitingRoom } from '../../sockets/model';
import {
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
} from '../../../audio/model';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../../../../controllers/WebStorageController';
import { setActiveStreamEvent } from '../../../videoChat/localMedia/model';
import { JoinMeetingFxPayload } from '../types';
import { BackgroundManager } from '../../../../../helpers/media/applyBlur';
import { MeetingAccessStatusEnum } from 'shared-types';
import { isMobile } from 'shared-utils';

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
    changeStream,
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
        updateLocalUserEvent({
            accessStatus: MeetingAccessStatusEnum.Waiting,
            isAuraActive: isAuraActive,
        });
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

    const clonedStream = changeStream?.clone();

    if (!isMobile()) {
        BackgroundManager.applyBlur(clonedStream);

        BackgroundManager.onBlur(clonedStream, isAuraActive, stream => {
            setActiveStreamEvent(stream);
        });
    } else {
        setActiveStreamEvent(clonedStream);
    }

};
