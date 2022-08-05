import React, {memo, useEffect} from "react";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {useStore} from "effector-react";
import {formatCountDown} from "../../../utils/time/formatCountdown";
import {ONE_MINUTE} from "../../../const/time/common";
import {useTimer} from "../../../hooks/useTimer";
import {$meetingStore} from "../../../store";

const Component = () => {
    const meeting = useStore($meetingStore);

    const { value: currentTime, onStartTimer: handleStartMeetingEnd } = useTimer();

    useEffect(() => {
        if (meeting?.endsAt && meeting?.startAt) {
            const endAtValue = (meeting?.endsAt || Date.now()) - Date.now();
            const startValue = Date.now() - meeting?.startAt;

            handleStartMeetingEnd(startValue, endAtValue);
        }
    }, [meeting?.endsAt, meeting?.startAt]);

    const is10MinutesLeft =
        ((meeting?.endsAt || 0) - (meeting.startAt || 0) || Date.now()) - currentTime <
        10 * ONE_MINUTE;

    return (
        <CustomTypography
            color={`colors.${is10MinutesLeft ? 'red' : 'white'}.primary`}
            variant="body3bold"
        >
            In progress: &nbsp;
            {formatCountDown(currentTime, { hours: true, minutes: true })}
        </CustomTypography>
    )
}

export const MeetingTimer = memo(Component);