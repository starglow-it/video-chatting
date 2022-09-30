import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { BackgroundAudioControl } from '@components/Meeting/BackgroundAudioControl/BackgroundAudioControl';

// icons
import { HangUpIcon } from '@library/icons/HangUpIcon';
import { SettingsIcon } from '@library/icons/SettingsIcon';
import { SharingIcon } from '@library/icons/SharingIcon';
import { GoodsIcon } from '@library/icons/GoodsIcon';
import { MicIcon } from '@library/icons/MicIcon';

// stores
import { $isGoodsVisible, appDialogsApi, toggleIsGoodsVisible } from '../../../store';
import {
    $isMeetingHostStore,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingTemplateStore,
    startScreenSharing,
    stopScreenSharing,
    updateLocalUserEvent,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MeetingControlButtons.module.scss';

const Component = () => {
    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isSharingActive = useStore($isScreenSharingStore);
    const isGoodsVisible = useStore($isGoodsVisible);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isMeetingConnected = useStore($meetingConnectedStore);

    const isSharingScreenActive = localUser.id === meeting.sharingUserId;

    const isAbleToToggleSharing = isMeetingHost || isSharingScreenActive || !meeting.sharingUserId;

    const handleOpenDeviceSettings = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });
    }, []);

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';

    const { isMobile } = useBrowserDetect();

    const handleEndVideoChat = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    const handleToggleSharing = useCallback(async () => {
        if (!meeting.sharingUserId) {
            startScreenSharing();
        } else if (isMeetingHost || isSharingScreenActive) {
            stopScreenSharing();
        }
    }, [isSharingScreenActive, meeting.sharingUserId, isMeetingHost, localUser.id]);

    const handleToggleMic = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                micStatus: isMicActive ? 'inactive' : 'active',
            });
        }
    }, [isMeetingConnected, isMicActive, isCamActive]);

    const sharingAction = isAbleToToggleSharing ? handleToggleSharing : undefined;

    const tooltipTranslation = useMemo(() => {
        if (isAbleToToggleSharing) {
            return `modes.screensharing.${isSharingActive ? 'off' : 'on'}`;
        }
        if (!isAbleToToggleSharing && isSharingActive) {
            return 'modes.screensharing.busy';
        }
        return '';
    }, [isAbleToToggleSharing, isSharingActive]);

    return (
        <CustomGrid container gap={1.5} className={styles.devicesWrapper}>
            <ConditionalRender condition={Boolean(meetingTemplate?.links?.length)}>
                <CustomTooltip
                    classes={{ tooltip: styles.tooltip }}
                    nameSpace="meeting"
                    translation={isGoodsVisible ? 'links.offGoods' : 'links.onGoods'}
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={toggleIsGoodsVisible}
                            className={clsx(styles.goodsButton, {
                                [styles.disabled]: !isGoodsVisible,
                            })}
                            Icon={<GoodsIcon width="22px" height="22px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={isMobile}>
                <CustomPaper variant="black-glass" borderRadius={8} className={styles.deviceButton}>
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleMic}
                        className={clsx(styles.deviceButton, { [styles.inactive]: !isMicActive })}
                        Icon={<MicIcon isActive={isMicActive} width="22px" height="22px" />}
                    />
                </CustomPaper>
            </ConditionalRender>
            <ConditionalRender condition={!isMobile}>
                <CustomTooltip
                    classes={{ tooltip: styles.tooltip }}
                    nameSpace="meeting"
                    translation={tooltipTranslation}
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={sharingAction}
                            className={clsx(styles.sharingButton, {
                                [styles.active]: isSharingActive && isAbleToToggleSharing,
                                [styles.noRights]: isSharingActive && !isAbleToToggleSharing,
                            })}
                            Icon={<SharingIcon width="22px" height="22px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>

            <ConditionalRender condition={meetingTemplate.isAudioAvailable}>
                <BackgroundAudioControl />
            </ConditionalRender>

            <ConditionalRender condition={!isMobile}>
                <CustomPaper variant="black-glass" borderRadius={8} className={styles.deviceButton}>
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleOpenDeviceSettings}
                        className={styles.settingsButton}
                        Icon={<SettingsIcon width="22px" height="22px" />}
                    />
                </CustomPaper>
            </ConditionalRender>

            <ActionButton
                variant="danger"
                onAction={handleEndVideoChat}
                className={styles.hangUpButton}
                Icon={<HangUpIcon width="22px" height="22px" />}
            />
        </CustomGrid>
    );
};

export const MeetingControlButtons = memo(Component);
