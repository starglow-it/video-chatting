import React, { memo, SyntheticEvent, useCallback, useEffect } from 'react';
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
import { $authStore } from '../../../store';
import {
    $isMeetingHostStore,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingUsersStore,
    disconnectFromVideoChatEvent,
    sendLeaveMeetingSocketEvent,
    setDevicesPermission,
    toggleUsersPanelEvent,
    updateLocalUserEvent,
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlButtons.module.scss';
import { clientRoutes } from '../../../const/client-routes';
import { MeetingControlCollapse } from '../MeetingControlCollapse/MeetingControlCollapse';

const Component = () => {
    const router = useRouter();

    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
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

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (isMeetingHost && isThereNewRequests) toggleUsersPanelEvent(true);
    }, [isMeetingHost, isThereNewRequests]);

    const handleEndVideoChat = useCallback(async () => {
        sendLeaveMeetingSocketEvent();
        disconnectFromVideoChatEvent();
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
        }
    }, [isMeetingConnected, isMicActive, isCamActive]);

    const handleToggleUsersPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent();
    };

    return (
        <CustomGrid container gap={1.5} className={styles.devicesWrapper}>
            <ConditionalRender condition={!isMobile}>
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
