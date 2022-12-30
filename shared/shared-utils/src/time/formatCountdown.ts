import { addZero } from '../strings/addZero';
import { getTimeoutTimestamp } from './getTimeoutTimestamp';
import { TimeoutTypesEnum } from 'shared-types';

const ONE_HOUR = getTimeoutTimestamp({
  type: TimeoutTypesEnum.Hours,
  value: 1,
});

const ONE_MINUTE = getTimeoutTimestamp({
  type: TimeoutTypesEnum.Minutes,
  value: 1,
});

export const formatCountDown = (
  time: number,
  {
    hours,
    minutes,
    seconds,
    numeric = true,
  }: {
    hours?: boolean;
    minutes?: boolean;
    seconds?: boolean;
    numeric?: boolean;
  },
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

  return `${hours ? finalHours : ''}${hours ? 'h ' : ''}${
    minutes ? finalMinutes : ''
  }${minutes ? 'm ' : ''}${seconds ? finalSeconds : ''}${seconds ? 'sec' : ''}`;
};
