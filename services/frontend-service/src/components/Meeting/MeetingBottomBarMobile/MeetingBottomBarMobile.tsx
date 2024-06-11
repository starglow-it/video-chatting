import { SyntheticEvent, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';

//components
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import LinkIcon from '@mui/icons-material/Link';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import {
    $isHaveNewMessage,
    $isAudience,
    $isParticipant,
    $enabledPaymentMeetingParticipant,
    $isMeetingHostStore,
    $isOwner,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingUsersStore,
    $meetingPanelsVisibilityForMobileStore,
    $enabledPaymentMeetingAudience,
    initialMeetingPanelsVisibilityData,
    disconnectFromVideoChatEvent,
    sendLeaveMeetingSocketEvent,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    setMeetingPanelsVisibilityForMobileEvent,
    updateUserSocketEvent,
    updateLocalUserEvent,
    setDevicesPermission
} from 'src/store/roomStores';

import { MeetingAccessStatusEnum } from 'shared-types';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { $authStore, $isPortraitLayout, deleteDraftUsers } from 'src/store';
import { deleteUserAnonymousCookies } from 'src/helpers/http/destroyCookies';
import { clientRoutes } from 'src/const/client-routes';
import { useRouter } from 'next/router';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CameraIcon } from 'shared-frontend/icons/OtherIcons/CameraIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
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
    const { isMobile } = useBrowserDetect();
    const isPortraitLayout = useStore($isPortraitLayout);
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);
    const enabledPaymentMeetingParticipant = useStore($enabledPaymentMeetingParticipant);

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

    const handleToggleCam = useCallback(async () => {
        if (isMeetingConnected) {
            setIsCameraActiveEvent(!isCamActive);
            await updateUserSocketEvent({
                cameraStatus: !isCamActive ? 'active' : 'inactive',
            });
        }
    }, [isMeetingConnected, isCamActive]);

    const handleToggleMic = useCallback(async () => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                micStatus: isMicActive ? 'inactive' : 'active',
            });
            updateUserSocketEvent({
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

    const handleOpenDonationPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: false,
            isMobileDonationPanleVisible: true
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
                        onClick={handleToggleCam}
                    >
                        <ActionButton
                            variant="transparentBlack"
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
                        onClick={handleToggleMic}
                    >
                        <ActionButton
                            variant="transparentBlack"
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
                <ConditionalRender condition={isParticipant && !enabledPaymentMeetingParticipant}>
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
                <ConditionalRender condition={isParticipant && enabledPaymentMeetingParticipant}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleOpenDonationPanel}
                            className={clsx(styles.deviceButton)}
                            Icon={<AttachMoneyIcon width="30px" height="30px" />}
                        />
                    </CustomPaper>
                </ConditionalRender>
                <ConditionalRender condition={enabledPaymentMeetingAudience}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={28}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleOpenDonationPanel}
                            className={clsx(styles.deviceButton)}
                            Icon={<AttachMoneyIcon width="30px" height="30px" />}
                        />
                    </CustomPaper>
                </ConditionalRender>
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
                        onAction={handleEndVideoChat}
                        className={clsx(styles.deviceButton)}
                        Icon={<CallEndIcon sx={{ color: 'red', width: "30px", height: "30px" }} />}
                    />
                </CustomPaper>
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
