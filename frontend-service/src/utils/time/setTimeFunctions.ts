import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setSeconds from 'date-fns/setSeconds';
import setMilliseconds from 'date-fns/setMilliseconds';

export const setDayTime = (date: Date | number, {
    hours,
    minutes,
    seconds,
    milliseconds,
} = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 } ): Date => {
    return setHours(setMinutes(setSeconds(setMilliseconds(date, milliseconds), seconds), minutes), hours);
}