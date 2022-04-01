import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// hooks

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomPopper } from '@library/custom/CustomPopper/CustomPopper';

// components
import { BellIcon } from '@library/icons/BellIcon';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { DashboardNotifications } from '@components/Dashboard/DashboardNotifications/DashboardNotifications';
import { useToggle } from '../../../hooks/useToggle';

// styles
import styles from './ProfileNotifications.module.scss';

// stores
import {
    $dashboardNotificationsStore,
    emitGetDashboardNotifications,
} from '../../../store/dashboardNotifications';
import { $isMainSocketConnected } from '../../../store/mainServerSocket';

// types
import { DashboardNotificationReadStatus } from '../../../store/types/dashboard';

const ProfileNotifications = memo(() => {
    const isMainSocketConnected = useStore($isMainSocketConnected);
    const dashboardNotifications = useStore($dashboardNotificationsStore);

    const notificationsButtonRef = useRef<HTMLButtonElement | null>(null);

    const isThereUnreadNotifications = useMemo(
        () =>
            dashboardNotifications.some(
                notification => notification.status === DashboardNotificationReadStatus.active,
            ),
        [dashboardNotifications],
    );

    useEffect(() => {
        if (isMainSocketConnected) {
            emitGetDashboardNotifications();
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
                <DashboardNotifications onClickAway={handleCloseNotifications} />
            </CustomPopper>
        </CustomBox>
    );
});

export { ProfileNotifications };
