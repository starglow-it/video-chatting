import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { isMobile } from 'shared-utils';
import { updateLocalUserEvent } from '../../../users/localUser/model';
import {
    joinAudienceMeetingSocketEvent,
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
import { updateUserSocketEvent } from 'src/store/roomStores/users/init';

export const handleJoinMeting = async ({
    needToRememberSettings,
    isSettingsAudioBackgroundActive,
    settingsBackgroundAudioVolume,
    currentVideoDevice,
    currentAudioDevice,
    isAuraActive,
    isMicActive,
    isCameraActive,
    meetingRole,
    isOwnerInMeeting,
    isOwnerDoNotDisturb,
    isMeetingInstanceExists,
    changeStream,
}: JoinMeetingFxPayload): Promise<void> => {
    updateLocalUserEvent({
        micStatus: isMicActive ? 'active' : 'inactive',
        cameraStatus: isCameraActive ? 'active' : 'inactive',
    });

    if (meetingRole === MeetingRole.Host) {
        await sendStartMeetingSocketEvent();
    } else if (isMeetingInstanceExists && isOwnerInMeeting && !isOwnerDoNotDisturb) {
        if (meetingRole === MeetingRole.Participant) {
            await sendEnterMeetingRequestSocketEvent();
        } else {
            await joinAudienceMeetingSocketEvent();
        }
    } else {
        updateLocalUserEvent({
            accessStatus: MeetingAccessStatusEnum.Waiting,
            isAuraActive,
        });
        if (meetingRole === MeetingRole.Participant) {
            updateUserSocketEvent({
                accessStatus: MeetingAccessStatusEnum.Waiting
            });
        }
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

    if (!isMobile() && meetingRole !== MeetingRole.Audience && false) {
        BackgroundManager.applyBlur(clonedStream);

        BackgroundManager.onBlur(clonedStream, isAuraActive, stream => {
            setActiveStreamEvent(stream);
        });
    } else {
        setActiveStreamEvent(clonedStream);
    }
};
