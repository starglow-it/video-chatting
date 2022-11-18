import React, { memo } from 'react';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// styles
import { useFormatDistanceDate } from '@hooks/useFormatDistanceDate';
import styles from './DashboardNotificationItem.module.scss';

// hooks

// types
import { DashboardNotification } from '../../../store/types';

const Component = ({ notification }: { notification: DashboardNotification }) => {
    const formattedString = useFormatDistanceDate(notification.sentAt);

    return (
        <CustomGrid
            container
            className={styles.notificationWrapper}
            gap={1.5}
            wrap="nowrap"
            flex="0 0 auto"
        >
            <ProfileAvatar
                className={styles.profileAvatar}
                src={notification.sender?.profileAvatar?.url || ''}
                width="44px"
                height="44px"
                userName={notification?.sender?.fullName || notification.senderFullName}
            />
            <CustomGrid container direction="column">
                <CustomTypography className={styles.fullName}>
                    {notification?.sender?.fullName || notification.senderFullName}
                </CustomTypography>
                <CustomGrid container alignItems="center">
                    <CustomTypography color="colors.grayscale.normal">
                        {formattedString}
                    </CustomTypography>
                    &nbsp;
                    <CustomTypography color="colors.grayscale.normal">&#8226;</CustomTypography>
                    &nbsp;
                    <CustomTypography
                        color="colors.grayscale.normal"
                        nameSpace="dashboard"
                        translation={`notifications.types.${notification.notificationType}`}
                    />
                    &nbsp;
                    <CustomTypography color="colors.blue.primary">
                        {notification.template.name}
                    </CustomTypography>
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};

export const DashboardNotificationItem = memo(Component);
