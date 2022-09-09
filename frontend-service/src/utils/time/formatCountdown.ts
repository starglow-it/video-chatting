import { ONE_HOUR, ONE_MINUTE } from '../../const/time/common';
import { addZero } from '../functions/addZero';

export const formatCountDown = (
    time: number,
    {
        hours,
        minutes,
        seconds,
        numeric = true,
    }: { hours?: boolean; minutes?: boolean; seconds?: boolean; numeric?: boolean },
) => {
    const hoursNumber = time / ONE_HOUR;
    const minutesNumber = time % ONE_HOUR;

    const secondsNumber = Math.floor((minutesNumber % ONE_MINUTE) / 1000);

    const minutesTime = Math.floor(minutesNumber / ONE_MINUTE);
    const hoursTime = Math.floor(hoursNumber);

    const finalHours = `${addZero(hoursTime)}`;
    const finalMinutes = `${addZero(minutesTime)}`;
    const finalSeconds = `${addZero(secondsNumber)}`;

    if (numeric) {
        return `${hours ? finalHours : ''}${hours && minutes ? ':' : ''}${
            minutes ? finalMinutes : ''
        }${minutes && seconds ? ':' : ''}${seconds ? finalSeconds : ''}`;
    }

    return `${hours ? finalHours : ''}${hours ? 'h ' : ''}${minutes ? finalMinutes : ''}${
        minutes ? 'm ' : ''
    }${seconds ? finalSeconds : ''}${seconds ? 'sec' : ''}`;
};
