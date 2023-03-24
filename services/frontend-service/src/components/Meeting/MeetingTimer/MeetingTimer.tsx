import React, { memo, useEffect } from 'react';
import { useStore } from 'effector-react';

// hooks
import { useTimer } from '@hooks/useTimer';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// stores
import { MeetingAccessStatusEnum } from 'shared-types';
import {
    $isBusinessSubscription,
    $profileStore,
    updateProfileFx,
} from '../../../store';
import {
    $isMeetingHostStore,
    $localUserStore,
    $meetingStore,
    $timeLimitWarningStore,
    setTimeLimitWarningEvent,
} from '../../../store/roomStores';

// utils
import { formatCountDown } from '../../../utils/time/formatCountdown';

// const
import { ONE_MINUTE } from '../../../const/time/common';

// types

const Component = () => {
    const meeting = useStore($meetingStore);
    const profile = useStore($profileStore);
    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const timeLimitWarning = useStore($timeLimitWarningStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);

    const { value: currentTime, onStartTimer: handleStartMeetingEnd } =
        useTimer(true);

    const isLimitTime = profile.role !== 'anonymous';

    useEffect(() => {
        if (meeting?.endsAt && meeting?.startAt) {
            const endAtValue = (meeting?.endsAt || Date.now()) - Date.now();
            const startValue = Date.now() - (meeting?.startAt || 0);

            handleStartMeetingEnd(startValue, endAtValue);
        }
    }, [meeting?.endsAt, meeting?.startAt]);

    useEffect(() => {
        if (
            (profile.maxMeetingTime - currentTime) / (1000 * 60) < 20 &&
            !timeLimitWarning &&
            localUser?.accessStatus === MeetingAccessStatusEnum.InMeeting &&
            !isBusinessSubscription &&
            isMeetingHost &&
            isLimitTime
        ) {
            if (profile.maxMeetingTime > 20 * 60 * 1000) {
                updateProfileFx({
                    maxMeetingTime: profile.maxMeetingTime,
                }).then(() => {
                    setTimeLimitWarningEvent(true);
                });
            } else {
                setTimeLimitWarningEvent(true);
            }
        }
        if (!isMeetingHost) {
            setTimeLimitWarningEvent(false);
        }
    }, [
        currentTime,
        profile.maxMeetingTime,
        timeLimitWarning,
        localUser?.accessStatus,
        isMeetingHost,
        isBusinessSubscription,
    ]);

    const is10MinutesLeft =
        ((meeting?.endsAt || 0) - (meeting.startAt || 0) || Date.now()) -
            currentTime <
        10 * ONE_MINUTE;

    return (
        <CustomTypography
            color={`colors.${
                is10MinutesLeft && !isLimitTime ? 'red' : 'white'
            }.primary`}
            variant="body3bold"
        >
            In progress: &nbsp;
            {formatCountDown(currentTime, { hours: true, minutes: true })}
        </CustomTypography>
    );
};

export const MeetingTimer = memo(Component);
