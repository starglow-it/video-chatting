import React, { memo, useCallback, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomIconButton } from '@library/custom/CustomIconButton/CustomIconButton';

// icons
import { WarningIcon } from 'shared-frontend/icons/OtherIcons/WarningIcon';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';

// styles
import { MeetingAccessStatusEnum } from 'shared-types';
import { Translation } from '@library/common/Translation/Translation';
import styles from './TimeLimitNotification.module.scss';

// utils
import { formatDate } from '../../utils/time/formatDate';

// stores
import {
    $authStore,
    $isBusinessSubscription,
    $profileStore,
} from '../../store';
import { $isOwner, $localUserStore } from '../../store/roomStores';

// types

// const
import { dashboardRoute, profileRoute } from '../../const/client-routes';

type ComponentProps = unknown;

const Component: React.FunctionComponent<ComponentProps> = () => {
    const router = useRouter();

    const [open, setOpenState] = useState(false);
    const [isHidden, setHiddenState] = useState(false);

    const profile = useStore($profileStore);
    const isOwner = useStore($isOwner);
    const localUser = useStore($localUserStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const { isAuthenticated } = useStore($authStore);

    const handleOpenProfile = useCallback(() => {
        window.open(profileRoute, '_blank');
    }, []);

    const isDashboardRoute = new RegExp(dashboardRoute).test(router.pathname);

    const handleClose = useCallback(() => {
        setOpenState(false);
        setHiddenState(true);
    }, []);

    const minutesLeft = Math.floor(profile.maxMeetingTime / 1000 / 60);

    useEffect(() => {
        if (
            minutesLeft <= 20 &&
            isAuthenticated &&
            !isBusinessSubscription &&
            !isHidden &&
            isDashboardRoute
        ) {
            setOpenState(true);
        }
    }, [
        minutesLeft,
        isBusinessSubscription,
        isOwner,
        isDashboardRoute,
        isAuthenticated,
    ]);

    useEffect(() => {
        if (localUser.accessStatus === MeetingAccessStatusEnum.InMeeting) {
            setOpenState(false);
        }
    }, [localUser.accessStatus]);

    const renewTime = formatDate(
        profile?.renewSubscriptionTimestampInSeconds
            ? profile.renewSubscriptionTimestampInSeconds * 1000
            : Date.now(),
        'dd MMM',
    );

    return (
        <Snackbar
            classes={{
                root: styles.snackBarRoot,
            }}
            ContentProps={{
                classes: {
                    root: styles.snackBarContent,
                    action: styles.snackBarAction,
                },
            }}
            message={
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    wrap="nowrap"
                    className={styles.wrapper}
                >
                    <WarningIcon width="22px" height="22px" />
                    <CustomTypography
                        variant="body2"
                        className={styles.text}
                        nameSpace="subscriptions"
                        translation="timeLimit.text"
                        options={{
                            minutesLeft: `${minutesLeft} minute${
                                minutesLeft === 1 ? '' : 's'
                            }`,
                            renewTime,
                        }}
                    />
                    <CustomButton
                        variant="custom-common"
                        onClick={handleOpenProfile}
                        className={styles.button}
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.update"
                            />
                        }
                        typographyProps={{
                            variant: 'body2',
                        }}
                    />
                </CustomGrid>
            }
            open={open}
            action={
                <CustomIconButton disableRipple onClick={handleClose}>
                    <CloseIcon width="24px" height="24px" />
                </CustomIconButton>
            }
        />
    );
};

const TimeLimitNotification = memo(Component);

export default TimeLimitNotification;
