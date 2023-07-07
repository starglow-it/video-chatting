import { setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

export const setDayTime = (
    date: Date | number,
    { hours, minutes, seconds, milliseconds } = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    },
): Date =>
    setHours(
        setMinutes(
            setSeconds(setMilliseconds(date, milliseconds), seconds),
            minutes,
        ),
        hours,
    );
