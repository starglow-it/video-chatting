import { memo, SyntheticEvent, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MeetingAccessStatusEnum } from 'shared-types';

// icons
import { HangUpIcon } from 'shared-frontend/icons/OtherIcons/HangUpIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';

// stores
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { deleteUserAnonymousCookies } from 'src/helpers/http/destroyCookies';
import { ScheduleIcon } from 'shared-frontend/icons/OtherIcons/ScheduleIcon';
import { ArrowUp } from 'shared-frontend/icons/OtherIcons/ArrowUp';
import { $authStore, deleteDraftUsers } from '../../../store';
import {
    $isLurker,
    $isMeetingHostStore,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingUsersStore,
    disconnectFromVideoChatEvent,
    requestSwitchRoleByLurkerEvent,
    sendLeaveMeetingSocketEvent,
    setDevicesPermission,
    setIsAudioActiveEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
    updateLocalUserEvent,
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlButtons.module.scss';
import { clientRoutes } from '../../../const/client-routes';
import { MeetingControlCollapse } from '../MeetingControlCollapse/MeetingControlCollapse';
import config from '../../../const/config';

const Component = () => {
    const router = useRouter();

    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const { isWithoutAuthen } = useStore($authStore);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isLurker = useStore($isLurker);
    const meeting = useStore($meetingStore);
    const isThereNewRequests = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.some(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.RequestSent ||
                    user.accessStatus ===
                        MeetingAccessStatusEnum.SwitchRoleSent,
            ),
    });

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (isMeetingHost && isThereNewRequests) toggleUsersPanelEvent(true);
    }, [isMeetingHost, isThereNewRequests]);

    const handleEndVideoChat = useCallback(async () => {
        disconnectFromVideoChatEvent();
        if (isSubdomain()) {
            await deleteDraftUsers();
            deleteUserAnonymousCookies();
            sendLeaveMeetingSocketEvent();
            window.location.href =
                config.frontendUrl + clientRoutes.registerEndCallRoute;
            return;
        }
        await router.push(
            !isWithoutAuthen
                ? localUser.isGenerated
                    ? clientRoutes.welcomeRoute
                    : clientRoutes.dashboardRoute
                : clientRoutes.registerEndCallRoute,
        );
    }, []);

    const handleToggleMic = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                micStatus: isMicActive ? 'inactive' : 'active',
            });
            setDevicesPermission({
                isMicEnabled: !isMicActive,
            });
            setIsAudioActiveEvent(!isMicActive);
        }
    }, [isMeetingConnected, isMicActive, isCamActive]);

    const handleToggleUsersPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent();
        toggleSchedulePanelEvent(false);
    };

    const handleToggleSchedulePanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleSchedulePanelEvent();
        toggleUsersPanelEvent(false);
    };

    const handleRequestToBecomeParticipant = () => {
        requestSwitchRoleByLurkerEvent({ meetingId: meeting.id });
    };

    return (
        <CustomGrid container gap={1.5} className={styles.devicesWrapper}>
            <ConditionalRender condition={!isMobile && !isLurker}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="devices.microphone"
                        />
                    }
                    placement="top"
                >
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
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={!isLurker}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="invite.tooltip"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleSchedulePanel}
                            className={clsx(styles.actionButton)}
                            Icon={<ScheduleIcon width="22px" height="22px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={!isLurker}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="people.tooltip"
                        />
                    }
                    placement="top"
                >
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
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={isLurker}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="lurker.buttons.requestBecomeParticipant"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleRequestToBecomeParticipant}
                            className={styles.actionButton}
                            Icon={<ArrowUp width="15px" height="15px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>
            <CustomTooltip
                title={
                    <Translation
                        nameSpace="meeting"
                        translation="endMeeting.tooltip"
                    />
                }
                placement="top"
            >
                <ActionButton
                    variant="danger"
                    onAction={handleEndVideoChat}
                    className={styles.hangUpButton}
                    Icon={<HangUpIcon width="22px" height="22px" />}
                />
            </CustomTooltip>
            <ConditionalRender condition={!isLurker}>
                <MeetingControlCollapse />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingControlButtons = memo(Component);
