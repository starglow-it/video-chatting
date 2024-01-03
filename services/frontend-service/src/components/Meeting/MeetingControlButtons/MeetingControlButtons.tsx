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
import { ChatIcon } from 'shared-frontend/icons/OtherIcons/ChatIcon';
import { UnlockIcon } from 'shared-frontend/icons/OtherIcons/UnlockIcon';

// stores
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { deleteUserAnonymousCookies } from 'src/helpers/http/destroyCookies';
import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import { ArrowUp } from 'shared-frontend/icons/OtherIcons/ArrowUp';
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';
import { $authStore, addNotificationEvent, deleteDraftUsers } from '../../../store';
import {
    $audioErrorStore,
    $isHaveNewMessage,
    $isLurker,
    $isMeetingHostStore,
    $isOwner,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    disconnectFromVideoChatEvent,
    requestSwitchRoleByLurkerEvent,
    sendLeaveMeetingSocketEvent,
    setDevicesPermission,
    setIsAudioActiveEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
    updateLocalUserEvent,
    updateMeetingTemplateFxWithData,
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlButtons.module.scss';
import { clientRoutes } from '../../../const/client-routes';
import { MeetingControlCollapse } from '../MeetingControlCollapse/MeetingControlCollapse';
import config from '../../../const/config';
import { MeetingMonetizationButton } from '../MeetingMonetization/MeetingMonetizationButton';
import { NotificationType } from 'src/store/types';

const Component = () => {
    const router = useRouter();

    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const { isWithoutAuthen } = useStore($authStore);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isLurker = useStore($isLurker);
    const isOwner = useStore($isOwner);
    const meeting = useStore($meetingTemplateStore);
    const { isAcceptNoLogin, subdomain } = useStore($meetingTemplateStore);

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

    const audioError = useStore($audioErrorStore);
    const isAudioError = Boolean(audioError);

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';
    const { isPublishAudience } = meeting;

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (isMeetingHost && isThereNewRequests) toggleUsersPanelEvent(true);
    }, [isMeetingHost, isThereNewRequests]);

    useEffect(() => {
        if (isAudioError) {
            setIsAudioActiveEvent(false); // This assumes setIsAudioActiveEvent will set isMicActive to false
        }
    }, [isAudioError]);

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
        if (isAudioError) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.deviceErrors.${audioError?.type}`,
            });
        } else {
            if (isMeetingConnected) {
                updateLocalUserEvent({
                    micStatus: isMicActive ? 'inactive' : 'active',
                });
                setDevicesPermission({
                    isMicEnabled: !isMicActive,
                });
                setIsAudioActiveEvent(!isMicActive);
            } else {
                addNotificationEvent({
                    type: NotificationType.validationError,
                    message: `meeting.connectionError}`,
                });
            }
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
            <ConditionalRender condition={isOwner}>
                <CustomTooltip
                    title={
                        isAcceptNoLogin || subdomain ? (
                            <Translation
                                nameSpace="meeting"
                                translation="disablePublicMeeting"
                            />
                        ) : (
                            <Translation
                                nameSpace="meeting"
                                translation={
                                    !isPublishAudience
                                        ? 'lock.private'
                                        : 'lock.public'
                                }
                            />
                        )
                    }
                    placement="top"
                    tooltipClassName={styles.containerTooltip}
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={() =>
                                updateMeetingTemplateFxWithData({
                                    isPublishAudience: !isPublishAudience,
                                })
                            }
                            className={clsx(styles.deviceButton, {
                                [styles.inactive]: !isPublishAudience,
                            })}
                            disabled={isAcceptNoLogin || !!subdomain}
                            Icon={
                                !isPublishAudience ? (
                                    <LockIcon width="22px" height="22px" />
                                ) : (
                                    <UnlockIcon width="18px" height="18px" />
                                )
                            }
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>
            <MeetingMonetizationButton />
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
                            Icon={<PersonPlusIcon width="18px" height="18px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>

            <CustomTooltip
                title={
                    <Translation
                        nameSpace="meeting"
                        translation="chat.tooltip"
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
                                (isThereNewRequests && isMeetingHost) ||
                                !!isThereNewMessage,
                            [styles.mobile]: isMobile,
                        })}
                        Icon={<ChatIcon width="18px" height="18px" />}
                    />
                </CustomPaper>
            </CustomTooltip>
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
