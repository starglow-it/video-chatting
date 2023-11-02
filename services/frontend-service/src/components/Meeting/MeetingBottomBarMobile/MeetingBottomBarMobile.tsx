import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import clsx from 'clsx';
import { HangUpIcon } from 'shared-frontend/icons/OtherIcons/HangUpIcon';
import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import { ChatIcon } from 'shared-frontend/icons/OtherIcons/ChatIcon';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { SyntheticEvent, useCallback } from 'react';
import {
    $isHaveNewMessage,
    $isMeetingHostStore,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingUsersStore,
    disconnectFromVideoChatEvent,
    sendLeaveMeetingSocketEvent,
    setDevicesPermission,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    toggleBackgroundManageEvent,
    togglePaymentFormEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
    updateLocalUserEvent,
} from 'src/store/roomStores';
import { useStore, useStoreMap } from 'effector-react';
import { MeetingAccessStatusEnum } from 'shared-types';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { ImageIcon } from 'shared-frontend/icons/OtherIcons/ImageIcon';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { $authStore, $isPortraitLayout, deleteDraftUsers } from 'src/store';
import { deleteUserAnonymousCookies } from 'src/helpers/http/destroyCookies';
import { clientRoutes } from 'src/const/client-routes';
import { useRouter } from 'next/router';
import config from '../../../const/config';
import styles from './MeetingBottomBarMobile.module.scss';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CameraIcon } from 'shared-frontend/icons/OtherIcons/CameraIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';

export const MeetingBottomBarMobile = () => {
    const isUsersOpen = useStore($isToggleUsersPanel);
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
    const isThereNewMessage = useStore($isHaveNewMessage);
    const isMeetingHost = useStore($isMeetingHostStore);
    const { isWithoutAuthen } = useStore($authStore);
    const localUser = useStore($localUserStore);
    const isMeetingConnected = useStore($meetingConnectedStore);

    const { isMobile } = useBrowserDetect();
    const isPortraitLayout = useStore($isPortraitLayout);

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';

    const router = useRouter();

    const handleToggleSchedulePanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        toggleSchedulePanelEvent();
    }, []);

    const handleToggleUsersPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent();
    }, []);

    const handleTogglePaymentPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        togglePaymentFormEvent();
    }, []);

    const handleToggleChangeBackground = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        toggleBackgroundManageEvent();
    }, []);

    const handleToggleCam = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                cameraStatus: isCamActive ? 'inactive' : 'active',
            });
            setDevicesPermission({
                isCamEnabled: !isCamActive,
            });
            setIsCameraActiveEvent(!isCamActive);
        }
    }, [isMeetingConnected, isCamActive]);

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
    }, [isMeetingConnected, isMicActive]);

    const handleEndVideoChat = async () => {
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
    };
    return (
        <CustomGrid className={styles.container}>
            <CustomGrid className={styles.main}>
                <ConditionalRender condition={isMobile && !isPortraitLayout}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleMic}
                            className={clsx(styles.deviceButton)}
                            Icon={
                                <MicIcon
                                    width="24px"
                                    height="24px"
                                    isActive={isMicActive}
                                />
                            }
                        />
                    </CustomPaper>
                </ConditionalRender>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleChangeBackground}
                        className={clsx(styles.deviceButton, {
                            [styles.inactive]: false,
                        })}
                        Icon={<ImageIcon width="20px" height="20px" />}
                    />
                </CustomPaper>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleSchedulePanel}
                        className={clsx(styles.deviceButton)}
                        Icon={<PersonPlusIcon width="18px" height="18px" />}
                    />
                </CustomPaper>
                <ActionButton
                    variant="danger"
                    onAction={handleEndVideoChat}
                    className={styles.endButton}
                    Icon={<HangUpIcon width="22px" height="22px" />}
                />
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleUsersPanel}
                        className={clsx(styles.deviceButton, {
                            [styles.active]: isUsersOpen,
                            [styles.newRequests]:
                                (isThereNewRequests && isMeetingHost) ||
                                !!isThereNewMessage,
                            [styles.mobile]: isMobile,
                        })}
                        Icon={<ChatIcon width="18px" height="18px" />}
                    />
                </CustomPaper>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={28}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleTogglePaymentPanel}
                        className={clsx(styles.deviceButton)}
                        Icon={<MonetizationIcon width="24px" height="24px" />}
                    />
                </CustomPaper>
                <ConditionalRender condition={isMobile && !isPortraitLayout}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleCam}
                            className={clsx(styles.deviceButton)}
                            Icon={
                                <CameraIcon
                                    width="24px"
                                    height="24px"
                                    isActive={isCamActive}
                                />
                            }
                        />
                    </CustomPaper>
                </ConditionalRender>
            </CustomGrid>
        </CustomGrid>
    );
};
