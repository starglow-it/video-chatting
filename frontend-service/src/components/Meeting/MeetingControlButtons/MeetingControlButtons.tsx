import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

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

// stores
import {
    $isGoodsVisible,
    $isOwner,
    $localUserStore,
    $meetingTemplateStore,
    $meetingStore,
    appDialogsApi,
    toggleIsGoodsVisible,
    updateMeetingSocketEvent,
} from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// controllers
import { AgoraController } from '../../../controllers/VideoChatController';

// styles
import styles from './MeetingControlButtons.module.scss';

const Component = () => {
    const isOwner = useStore($isOwner);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isGoodsVisible = useStore($isGoodsVisible);
    const meetingTemplate = useStore($meetingTemplateStore);

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const isAbleToToggleSharing = isOwner || isSharingScreenActive || !meeting.sharingUserId;

    const handleOpenDeviceSettings = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });
    }, []);

    const handleEndVideoChat = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    const handleToggleSharing = useCallback(() => {
        if (!meeting.sharingUserId) {
            AgoraController.startScreensharing();
        } else if (isOwner || isSharingScreenActive) {
            updateMeetingSocketEvent({ sharingUserId: null });
        }
    }, [isSharingScreenActive, meeting.sharingUserId, isOwner]);

    const isSharingActive = Boolean(meeting.sharingUserId);

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

            <CustomTooltip
                classes={{ tooltip: styles.tooltip }}
                nameSpace="meeting"
                translation={tooltipTranslation}
            >
                <CustomPaper variant="black-glass" borderRadius={8} className={styles.deviceButton}>
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
            <ConditionalRender condition={meetingTemplate.isAudioAvailable}>
                <BackgroundAudioControl />
            </ConditionalRender>

            <CustomPaper variant="black-glass" borderRadius={8} className={styles.deviceButton}>
                <ActionButton
                    variant="transparentBlack"
                    onAction={handleOpenDeviceSettings}
                    className={styles.settingsButton}
                    Icon={<SettingsIcon width="22px" height="22px" />}
                />
            </CustomPaper>

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
