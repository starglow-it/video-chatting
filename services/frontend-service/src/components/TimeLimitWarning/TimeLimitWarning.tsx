import React, { memo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';
import Snackbar from '@mui/material/Snackbar';

import { getTimeoutTimestamp } from 'shared-utils';
import { TimeoutTypesEnum } from 'shared-types';

// hooks
import { useTimer } from '@hooks/useTimer';

// icons
import { WarningIcon } from 'shared-frontend/icons/OtherIcons/WarningIcon';
import { ClockIcon } from 'shared-frontend/icons/OtherIcons/ClockIcon';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// utils
import { Translation } from '@library/common/Translation/Translation';
import { formatDate } from '../../utils/time/formatDate';

// stores
import { $profileStore } from '../../store';
import { $timeLimitWarningStore } from '../../store/roomStores';

// styles
import styles from './TimeLimitWarning.module.scss';

// utils
import { formatCountDown } from '../../utils/time/formatCountdown';

// const
import { profileRoute } from '../../const/client-routes';

type ComponentProps = unknown;

const twtMinutes = getTimeoutTimestamp({
    value: 20,
    type: TimeoutTypesEnum.Minutes,
});

const Component: React.FunctionComponent<ComponentProps> = () => {
    const router = useRouter();

    const profile = useStore($profileStore);
    const timeLimitWarning = useStore($timeLimitWarningStore);

    const {
        value: currentTime,
        onStartTimer: handleStartMeetingEnd,
        onEndTimer: handleStopMeetingEnd,
    } = useTimer(false);

    useEffect(() => {
        if (timeLimitWarning) {
            handleStartMeetingEnd(
                Math.min(profile.maxMeetingTime, twtMinutes),
                0,
            );
        } else {
            handleStopMeetingEnd();
        }
    }, [timeLimitWarning]);

    const handleOpenProfile = () => {
        router.push(profileRoute);
    };

    const minutesLeft = Math.floor(profile.maxMeetingTime / 1000 / 60);

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
                    message: styles.snackBarMessage,
                },
            }}
            message={
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    wrap="nowrap"
                    className={styles.wrapper}
                >
                    <CustomGrid
                        container
                        wrap="nowrap"
                        className={styles.timeWrapper}
                    >
                        <ClockIcon width="24px" height="24px" />
                        <CustomTypography variant="body1bold">
                            {formatCountDown(currentTime, {
                                seconds: true,
                                minutes: true,
                            })}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        container
                        alignItems="center"
                        className={styles.message}
                        wrap="nowrap"
                    >
                        <WarningIcon width="22px" height="22px" />
                        <CustomTypography
                            variant="body2"
                            className={styles.text}
                            nameSpace="subscriptions"
                            translation="timeLimit.warning"
                            options={{ minutesLeft, renewTime }}
                        />
                    </CustomGrid>
                    <CustomButton
                        variant="custom-common"
                        onClick={handleOpenProfile}
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.update"
                            />
                        }
                        className={styles.button}
                        typographyProps={{
                            variant: 'body2',
                        }}
                    />
                </CustomGrid>
            }
            open={timeLimitWarning}
        />
    );
};

const TimeLimitWarning = memo(Component);

export default TimeLimitWarning;
