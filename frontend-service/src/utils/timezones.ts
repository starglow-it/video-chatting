import { _24_HOURS, ONE_HOUR, ONE_MINUTE } from '../const/time/common';
import {addZero} from "./functions/addZero";

export const getTimeList = (startAt: string, interval: number): string[] => {
    const intervals = _24_HOURS / interval;

    return new Array(intervals)
        .fill(0)
        .map((value, index) => {
            const intervalValue = index * interval;

            const hours = Math.floor(intervalValue / ONE_HOUR);

            const minutes = Math.floor(
                (intervalValue - (hours > 0 ? hours : 0) * ONE_HOUR) / ONE_MINUTE,
            );

            return `${hours > 0 ? addZero(hours) : '00'}:${addZero(minutes)}`;
        })
        .filter(time => {
            const startAtTimestamp = getTimestamp(startAt);
            const currentTimestamp = getTimestamp(time);

            return currentTimestamp > startAtTimestamp;
        });
};

export const getTimestamp = (time: string): number => {
    const [hours, minutes] = time.split(':');

    return parseInt(hours, 10) * ONE_HOUR + parseInt(minutes, 10) * ONE_MINUTE;
};

export const getTimeString = (timestamp: number): string => {
    const hours = Math.floor(timestamp / ONE_HOUR);

    const minutes = Math.floor((timestamp - (hours > 0 ? hours : 0) * ONE_HOUR) / ONE_MINUTE);

    return `${hours > 0 ? addZero(hours) : '00'}:${addZero(minutes)}`;
};

export const getHourMinutesString = ({ hours, minutes }) => {
    return `${addZero(hours > 0 ? hours : 0)}:${addZero(minutes)}`;
}
