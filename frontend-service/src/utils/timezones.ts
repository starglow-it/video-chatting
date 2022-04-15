import timezones from 'timezones-list';

import { _24_HOURS, ONE_HOUR, ONE_MINUTE } from "../const/time/common";

export const TIMEZONES = timezones;

const addZero = (number: number): string => number < 10 ? `0${number}` : `${number}`;

export const getTimeList = (interval: number): string[] => {
    const intervals = _24_HOURS / interval;

    return new Array(intervals).fill(0).map((value, index) => {
        const intervalValue = index * interval;

        const hours = Math.floor(intervalValue / ONE_HOUR);

        const minutes = Math.floor((intervalValue - (hours > 0 ? hours : 0) * ONE_HOUR) / ONE_MINUTE);

        return `${hours > 0 ? addZero(hours) : '00'}:${addZero(minutes)}`;
    });
}

export const getTimestamp = (time: string): number => {
    const [hours, minutes] = time.split(':');

    return parseInt(hours, 10) * ONE_HOUR + parseInt(minutes, 10) * ONE_MINUTE;
}
