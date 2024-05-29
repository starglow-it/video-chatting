import { SyntheticEvent, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';

//components
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

import { HangUpIcon } from 'shared-frontend/icons/OtherIcons/HangUpIcon';
import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import { ChatIcon } from 'shared-frontend/icons/OtherIcons/ChatIcon';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import LinkIcon from '@mui/icons-material/Link';

import {
    $enabledPaymentMeetingAudience,
    $enabledPaymentMeetingParticipant,
    $isHaveNewMessage,
    $isAudience,
    $isParticipant,
    $isMeetingHostStore,
    $isOwner,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingUsersStore,
    $paymentIntent,
    $meetingPanelsVisibilityForMobileStore,
    initialMeetingPanelsVisibilityData,
    createPaymentIntentWithData,
    disconnectFromVideoChatEvent,
    requestSwitchRoleByAudienceEvent,
    sendLeaveMeetingSocketEvent,
    setDevicesPermission,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    toggleBackgroundManageEvent,
    togglePaymentFormEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
    updateLocalUserEvent,
    setMeetingPanelsVisibilityForMobileEvent
} from 'src/store/roomStores';

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

//icons
import CallEndIcon from '@mui/icons-material/CallEnd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
    const isAudience = useStore($isAudience);
    const isParticipant = useStore($isParticipant);
    const isOwner = useStore($isOwner);
    const meeting = useStore($meetingStore);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);
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

    const {
        isMobileMoreListVisible,
        isMobileChatPanelVisible,
        isMobileAttendeeListVisible,
        isMobileLinksPanleVisible,
        isMobileQAPanleVisible,
        isMobileStickyNotesVisible,
        isMobileSettingPanelVisible
    } = useStore($meetingPanelsVisibilityForMobileStore);

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
        requestSwitchRoleByAudienceEvent({ meetingId: meeting.id });
    };

    const handleOpenMoreList = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: true
        });
    }, []);

    const handleOpenAttendeeList = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileAttendeeListVisible: true
        });
    }, []);

    const handleOpenLinksPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: false,
            isMobileLinksPanleVisible: true
        });
    }, []);

    return (
        <CustomGrid className={
            clsx(styles.container,
                {
                    [styles.hidden]: isMobileMoreListVisible ||
                        isMobileChatPanelVisible ||
                        isMobileAttendeeListVisible ||
                        isMobileLinksPanleVisible ||
                        isMobileQAPanleVisible ||
                        isMobileStickyNotesVisible ||
                        isMobileSettingPanelVisible
                })}>
            <CustomGrid className={styles.main}>
                <ConditionalRender
                    condition={isMobile && !isAudience}
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
                                    width="30px"
                                    height="30px"
                                    isActive={isCamActive}
                                />
                            }
                        />
                    </CustomPaper>
                </ConditionalRender>
                <ConditionalRender
                    condition={isMobile && !isAudience}
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
                                    width="30px"
                                    height="30px"
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
                            onAction={handleOpenAttendeeList}
                            className={clsx(styles.deviceButton)}
                            Icon={<PersonPlusIcon width="30px" height="30px" />}
                        />
                    </CustomPaper>
                </ConditionalRender>
                <ConditionalRender condition={isParticipant}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleOpenLinksPanel}
                            className={clsx(styles.deviceButton)}
                            Icon={<LinkIcon width="30px" height="30px" />}
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
                        onAction={handleEndVideoChat}
                        className={clsx(styles.deviceButton)}
                        Icon={<CallEndIcon sx={{ color: 'red', width: "30px", height: "30px" }} />}
                    />
                </CustomPaper>
                <ConditionalRender condition={isAudience}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleOpenLinksPanel}
                            className={clsx(styles.deviceButton)}
                            Icon={<LinkIcon width="30px" height="30px" />}
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
                        onAction={handleOpenMoreList}
                        className={clsx(styles.deviceButton)}
                        Icon={<MoreHorizIcon sx={{ width: "30px", height: "30px" }} />}
                    />
                </CustomPaper>
            </CustomGrid>
        </CustomGrid>
    );
};
