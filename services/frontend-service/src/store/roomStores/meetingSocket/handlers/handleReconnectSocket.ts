import {
    StorageKeysEnum,
    WebStorage,
} from 'src/controllers/WebStorageController';
import { SavedSettings } from 'src/types';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { MeetingAccessStatusEnum } from 'shared-types';
import { disconnectFromVideoChatEvent } from '../../videoChat/model';
import {
    joinMeetingEvent,
    setMeetingConnectedEvent,
} from '../../meeting/meeting/model';
import { getMeetingTemplateFx } from '../../meeting/meetingTemplate/model';
import { sendJoinWaitingRoomSocketEvent } from '../../meeting/sockets/init';
import { updateLocalUserEvent } from '../../users/localUser/model';

export const handleReconnectSocket = async ({
    isOwner,
    isBackgroundAudioActive,
    backgroundAudioVolume,
    templateId,
}: {
    templateId: string;
    isOwner: boolean;
    isBackgroundAudioActive: boolean;
    backgroundAudioVolume: number;
}) => {
    const savedSettings = WebStorage.get<SavedSettings>({
        key: StorageKeysEnum.meetingSettings,
    });
    const isHasSettings = Object.keys(savedSettings)?.length;

    disconnectFromVideoChatEvent();

    setMeetingConnectedEvent(false);

    await getMeetingTemplateFx({
        templateId,
        subdomain: isSubdomain() ? window.location.origin : undefined,
    });

    await sendJoinWaitingRoomSocketEvent();
    if (isOwner) {
        if (isHasSettings) {
            updateLocalUserEvent({
                isAuraActive: savedSettings.auraSetting,
                accessStatus: MeetingAccessStatusEnum.InMeeting,
            });
            joinMeetingEvent({
                isSettingsAudioBackgroundActive:
                    savedSettings.backgroundAudioSetting,
                settingsBackgroundAudioVolume:
                    savedSettings.backgroundAudioVolumeSetting,
                needToRememberSettings: false,
            });
        } else {
            updateLocalUserEvent({
                accessStatus: MeetingAccessStatusEnum.InMeeting,
            });
            joinMeetingEvent({
                isSettingsAudioBackgroundActive: isBackgroundAudioActive,
                settingsBackgroundAudioVolume: backgroundAudioVolume,
                needToRememberSettings: true,
            });
        }
    }
};
