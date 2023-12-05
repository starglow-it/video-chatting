import * as dateFns from 'date-fns';
import { ITimestamp } from 'shared-types';

export const parseDateObject = (data: ITimestamp): number => {
  return dateFns
    .set(new Date(), {
      hours: data.hours,
      month: data.month - 1,
      minutes: data.minutes,
      date: data.day,
      year: data.year,
    })
    .getTime();
};
