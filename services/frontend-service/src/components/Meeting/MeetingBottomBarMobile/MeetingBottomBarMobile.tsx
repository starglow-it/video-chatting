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
    $enabledPaymentMeetingLurker,
    $enabledPaymentMeetingParticipant,
    $isHaveNewMessage,
    $isLurker,
    $isMeetingHostStore,
    $isOwner,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingUsersStore,
    $paymentIntent,
    createPaymentIntentWithData,
    disconnectFromVideoChatEvent,
    requestSwitchRoleByLurkerEvent,
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
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CameraIcon } from 'shared-frontend/icons/OtherIcons/CameraIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { ArrowUp } from 'shared-frontend/icons/OtherIcons/ArrowUp';
import { PaymentType } from 'shared-const';
import styles from './MeetingBottomBarMobile.module.scss';
import config from '../../../const/config';

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
    const isLurker = useStore($isLurker);
    const isOwner = useStore($isOwner);
    const meeting = useStore($meetingStore);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingLurker = useStore($enabledPaymentMeetingLurker);
    const paymentIntent = useStore($paymentIntent);
    const intentId = paymentIntent?.id;
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );

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

    const handleTogglePaymentPanel = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            togglePaymentFormEvent();
            if (!isCreatePaymentIntentPending && !isOwner) {
                if (!intentId) {
                    createPaymentIntentWithData({
                        paymentType: PaymentType.Meeting,
                    });
                }
            }
        },
        [isCreatePaymentIntentPending, isOwner, intentId],
    );

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

    const handleRequestToBecomeParticipant = () => {
        requestSwitchRoleByLurkerEvent({ meetingId: meeting.id });
    };

    return (
        <CustomGrid className={styles.container}>
            <CustomGrid className={styles.main}>
                <ConditionalRender
                    condition={isMobile && !isPortraitLayout && !isLurker}
                >
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
                                    width="22px"
                                    height="22px"
                                    isActive={isMicActive}
                                />
                            }
                        />
                    </CustomPaper>
                </ConditionalRender>
                <ConditionalRender condition={isOwner}>
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
                </ConditionalRender>
                <ConditionalRender condition={!isLurker}>
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
                </ConditionalRender>
                <ConditionalRender condition={isLurker}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleRequestToBecomeParticipant}
                            className={styles.deviceButton}
                            Icon={<ArrowUp width="15px" height="15px" />}
                        />
                    </CustomPaper>
                </ConditionalRender>

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
                <ConditionalRender
                    condition={
                        isOwner ||
                        enabledPaymentMeetingParticipant ||
                        enabledPaymentMeetingLurker
                    }
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleTogglePaymentPanel}
                            className={clsx(styles.deviceButton)}
                            Icon={
                                <MonetizationIcon width="24px" height="24px" />
                            }
                        />
                    </CustomPaper>
                </ConditionalRender>
                <ConditionalRender
                    condition={isMobile && !isPortraitLayout && !isLurker}
                >
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
                                    width="22px"
                                    height="22px"
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
