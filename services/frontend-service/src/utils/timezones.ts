import { TWF_24_HOURS, ONE_HOUR, ONE_MINUTE } from '../const/time/common';
import { addZero } from './functions/addZero';

export const getTimestamp = (time: string): number => {
    const [hours, minutes] = time.split(':');

    return parseInt(hours, 10) * ONE_HOUR + parseInt(minutes, 10) * ONE_MINUTE;
};

export const getTimeList = (
    startAt: string,
    interval: number,
    maxIntervals?: number,
    maxValue = '24:00',
): string[] => {
    const intervals = TWF_24_HOURS / interval;

    const timeList = new Array(intervals + 1)
        .fill(0)
        .map((value, index) => {
            const intervalValue = index * interval;

            const hours = Math.floor(intervalValue / ONE_HOUR);

            const minutes = Math.floor(
                (intervalValue - (hours > 0 ? hours : 0) * ONE_HOUR) /
                    ONE_MINUTE,
            );

            return `${hours > 0 ? addZero(hours) : '00'}:${addZero(minutes)}`;
        })
        .filter(time => {
            const startAtTimestamp = getTimestamp(startAt);
            const currentTimestamp = getTimestamp(time);
            const maxTimestamp = getTimestamp(maxValue);

            return (
                currentTimestamp >= startAtTimestamp &&
                currentTimestamp <= maxTimestamp
            );
        });

    return timeList.slice(0, maxIntervals || intervals);
};

export const getTimeString = (timestamp: number): string => {
    const hours = Math.floor(timestamp / ONE_HOUR);

    const minutes = Math.floor(
        (timestamp - (hours > 0 ? hours : 0) * ONE_HOUR) / ONE_MINUTE,
    );

    return `${hours > 0 ? addZero(hours) : '00'}:${addZero(minutes)}`;
};

export const getHourMinutesString = ({
    hours,
    minutes,
}: {
    hours: number;
    minutes: number;
}) => `${addZero(hours > 0 ? hours : 0)}:${addZero(minutes)}`;
