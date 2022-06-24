import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';
import Image from 'next/image';

import { ClickAwayListener } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// components
import { BellIcon } from '@library/icons/BellIcon';
import { DashboardNotificationItem } from '@components/Dashboard/DashboardNotificationItem/DashboardNotificationItem';

// types
import { DashboardNotificationsProps } from './types';

// stores
import {
    $dashboardNotificationsStore,
    emitReadDashboardNotifications,
} from '../../../store';

// styles
import styles from './DashboardNotifications.module.scss';

type ComponentPropsType = DashboardNotificationsProps;

const Component: React.FunctionComponent<ComponentPropsType> = ({ onClickAway }, ref) => {
    const dashboardNotifications = useStore($dashboardNotificationsStore);

    const handleMarkAllNotificationAsRead = useCallback(() => {
        emitReadDashboardNotifications();
    }, []);

    const renderDashboardNotifications = useMemo(
        () =>
            dashboardNotifications.map(dashboardNotification => (
                <DashboardNotificationItem
                    key={dashboardNotification.id}
                    notification={dashboardNotification}
                />
            )),
        [dashboardNotifications],
    );

    return (
        <CustomPaper ref={ref} className={styles.paper}>
            <ClickAwayListener onClickAway={onClickAway}>
                {!dashboardNotifications?.length ? (
                    <CustomGrid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        className={styles.noNotificationsWrapper}
                    >
                        <Image src="/images/eyes.png" width={40} height={40} />
                        <CustomTypography
                            nameSpace="dashboard"
                            translation="notifications.noNotifications"
                        />
                    </CustomGrid>
                ) : (
                    <CustomGrid
                        container
                        direction="column"
                        className={styles.notificationsWrapper}
                    >
                        <CustomGrid container justifyContent="center" className={styles.header}>
                            <BellIcon width="24px" height="24px" className={styles.bellIcon} />
                            <CustomTypography
                                variant="body1bold"
                                nameSpace="dashboard"
                                translation="notifications.title"
                            />
                            <CustomTypography
                                onClick={handleMarkAllNotificationAsRead}
                                color="colors.blue.primary"
                                className={styles.markAllAsRead}
                                nameSpace="dashboard"
                                translation="notifications.readAll"
                            />
                        </CustomGrid>
                        <CustomScroll className={styles.notificationsScroll}>
                            <CustomGrid container direction="column">
                                {renderDashboardNotifications}
                            </CustomGrid>
                        </CustomScroll>
                    </CustomGrid>
                )}
            </ClickAwayListener>
        </CustomPaper>
    );
};

const DashboardNotifications = memo<ComponentPropsType>(
    forwardRef<HTMLDivElement, ComponentPropsType>(Component),
);

export { DashboardNotifications };
