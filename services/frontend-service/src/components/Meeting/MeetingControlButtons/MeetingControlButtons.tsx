import React, { memo, SyntheticEvent, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { BackgroundAudioControl } from '@components/Meeting/BackgroundAudioControl/BackgroundAudioControl';
import { MeetingAccessStatusEnum } from 'shared-types';

// icons
import { HangUpIcon } from 'shared-frontend/icons/OtherIcons/HangUpIcon';
import { SharingIcon } from 'shared-frontend/icons/OtherIcons/SharingIcon';
import { GoodsIcon } from 'shared-frontend/icons/OtherIcons/GoodsIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';

// stores
import {
    $authStore,
    $isGoodsVisible,
    appDialogsApi,
    toggleIsGoodsVisible,
} from '../../../store';
import {
    $isMeetingHostStore,
    $isOwner,
    $isScreenSharingStore,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    disconnectFromVideoChatEvent,
    sendLeaveMeetingSocketEvent,
    setDevicesPermission,
    startScreenSharing,
    stopScreenSharing,
    toggleUsersPanelEvent,
    updateLocalUserEvent,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MeetingControlButtons.module.scss';
import {
    clientRoutes,
    dashboardRoute,
    loginRoute,
} from '../../../const/client-routes';
import { MeetingControlCollapse } from '../MeetingControlCollapse/MeetingControlCollapse';

const Component = () => {
    const router = useRouter();

    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isSharingActive = useStore($isScreenSharingStore);
    const isGoodsVisible = useStore($isGoodsVisible);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const { isWithoutAuthen } = useStore($authStore);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isThereNewRequests = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.some(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.RequestSent,
            ),
    });

    const isSharingScreenActive = localUser.id === meeting.sharingUserId;

    const isAbleToToggleSharing =
        isMeetingHost || isSharingScreenActive || !meeting.sharingUserId;

    const handleOpenDeviceSettings = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });
    }, []);

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';

    const { isMobile } = useBrowserDetect();

    const handleEndVideoChat = useCallback(async () => {
        sendLeaveMeetingSocketEvent();
        disconnectFromVideoChatEvent();

        await router.push(
            !isWithoutAuthen
                ? localUser.isGenerated
                    ? clientRoutes.welcomeRoute
                    : dashboardRoute
                : loginRoute,
        );
    }, []);

    const handleToggleSharing = useCallback(async () => {
        if (!meeting.sharingUserId) {
            startScreenSharing();
        } else if (isMeetingHost || isSharingScreenActive) {
            stopScreenSharing();
        }
    }, [
        isSharingScreenActive,
        meeting.sharingUserId,
        isMeetingHost,
        localUser.id,
    ]);

    const handleToggleMic = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                micStatus: isMicActive ? 'inactive' : 'active',
            });
            setDevicesPermission({
                isMicEnabled: !isMicActive,
            });
        }
    }, [isMeetingConnected, isMicActive, isCamActive]);

    const handleToggleUsersPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent();
    }

    const sharingAction = isAbleToToggleSharing
        ? handleToggleSharing
        : undefined;

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
            <CustomPaper
                variant="black-glass"
                borderRadius={8}
                className={styles.deviceButton}
            >
                <ActionButton
                    variant="transparentBlack"
                    onAction={handleToggleUsersPanel}
                    className={clsx(styles.actionButton, {
                        [styles.active]: isUsersOpen,
                        [styles.newRequests]:
                            isThereNewRequests && isMeetingHost,
                        [styles.mobile]: isMobile,
                    })}
                    Icon={<PeopleIcon width="22px" height="22px" />}
                />
            </CustomPaper>
            <ConditionalRender
                condition={Boolean(meetingTemplate?.links?.length)}
            >
                <CustomTooltip
                    classes={{ tooltip: styles.tooltip }}
                    nameSpace="meeting"
                    translation={
                        isGoodsVisible ? 'links.offGoods' : 'links.onGoods'
                    }
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
                <CustomPaper
                    variant="black-glass"
                    borderRadius={8}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleMic}
                        className={clsx(styles.deviceButton, {
                            [styles.inactive]: !isMicActive,
                        })}
                        Icon={
                            <MicIcon
                                isActive={isMicActive}
                                width="22px"
                                height="22px"
                            />
                        }
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
                                [styles.active]:
                                    isSharingActive && isAbleToToggleSharing,
                                [styles.noRights]:
                                    isSharingActive && !isAbleToToggleSharing,
                            })}
                            Icon={<SharingIcon width="22px" height="22px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>

            <ConditionalRender condition={meetingTemplate.isAudioAvailable}>
                <BackgroundAudioControl />
            </ConditionalRender>

            <ActionButton
                variant="danger"
                onAction={handleEndVideoChat}
                className={styles.hangUpButton}
                Icon={<HangUpIcon width="22px" height="22px" />}
            />
            <MeetingControlCollapse />
        </CustomGrid>
    );
};

export const MeetingControlButtons = memo(Component);
