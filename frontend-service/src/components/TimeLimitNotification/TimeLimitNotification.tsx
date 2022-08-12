import React, { memo, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomIconButton } from '@library/custom/CustomIconButton/CustomIconButton';

// icons
import { WarningIcon } from '@library/icons/WarningIcon';
import { CloseIcon } from '@library/icons/CloseIcon';

// styles
import styles from './TimeLimitNotification.module.scss';

// utils
import { formatDate } from '../../utils/time/formatDate';

// stores
import { $isOwner, $profileStore } from '../../store';

type ComponentProps = unknown;

const Component: React.FunctionComponent<ComponentProps> = () => {
    const router = useRouter();

    const [open, setOpenState] = useState(false);
    const [isHidden, setHiddenState] = useState(false);

    const profile = useStore($profileStore);
    const isOwner = useStore($isOwner);

    const handleOpenProfile = () => {
        router.push('/dashboard/profile');
    };

    const handleClose = () => {
        setOpenState(false);
        setHiddenState(true);
    };

    const minutesLeft = Math.ceil(profile.maxMeetingTime / 1000 / 60);

    useEffect(() => {
        const planName = profile.subscriptionPlanKey;

        if (minutesLeft <= 20 && planName !== 'Business' && isOwner && !isHidden) {
            setOpenState(true);
        }
    }, [profile.maxMeetingTime, profile.subscriptionPlanKey, isOwner]);

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
                        options={{ minutesLeft, renewTime }}
                    />
                    <CustomButton
                        variant="custom-common"
                        onClick={handleOpenProfile}
                        nameSpace="common"
                        translation="buttons.update"
                        className={styles.button}
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

export const TimeLimitNotification = memo(Component);
