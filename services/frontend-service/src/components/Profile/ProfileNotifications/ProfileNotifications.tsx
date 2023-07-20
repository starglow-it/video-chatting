import { memo, useEffect, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { BellIcon } from 'shared-frontend/icons/OtherIcons/BellIcon';
import { CustomPopper } from '@library/custom/CustomPopper/CustomPopper';

// components
import { DashboardNotifications } from '@components/Dashboard/DashboardNotifications/DashboardNotifications';

// styles
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import styles from './ProfileNotifications.module.scss';

// stores
import {
    $dashboardNotificationsStore,
    $isSocketConnected,
    sendGetDashboardNotificationsSocketEvent,
} from '../../../store';

// types
import { DashboardNotificationReadStatus } from '../../../store/types';

const ProfileNotifications = memo(() => {
    const isMainSocketConnected = useStore($isSocketConnected);
    const dashboardNotifications = useStore($dashboardNotificationsStore);

    const notificationsButtonRef = useRef<HTMLButtonElement | null>(null);

    const isThereUnreadNotifications = useMemo(
        () =>
            dashboardNotifications.some(
                notification =>
                    notification.status ===
                    DashboardNotificationReadStatus.active,
            ),
        [dashboardNotifications],
    );

    useEffect(() => {
        if (isMainSocketConnected) {
            sendGetDashboardNotificationsSocketEvent();
        }
    }, [isMainSocketConnected]);

    const {
        value: isNotificationsOpened,
        onToggleSwitch: handleToggleNotifications,
        onSwitchOff: handleCloseNotifications,
    } = useToggle(false);

    return (
        <CustomBox className={styles.notificationsWrapper}>
            <ActionButton
                ref={notificationsButtonRef}
                variant="decline"
                onAction={handleToggleNotifications}
                className={clsx(styles.bellIcon, {
                    [styles.withUnread]: isThereUnreadNotifications,
                })}
                Icon={<BellIcon width="24px" height="24px" />}
            />
            <CustomPopper
                id="notifications"
                open={isNotificationsOpened}
                anchorEl={notificationsButtonRef.current}
                placement="bottom-end"
            >
                <DashboardNotifications
                    onClickAway={handleCloseNotifications}
                />
            </CustomPopper>
        </CustomBox>
    );
});

export { ProfileNotifications };
