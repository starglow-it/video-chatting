import * as dateFns from 'date-fns';

export const parseDateObject = (data): number => {
  return dateFns
    .set(new Date(), {
      hours: data.hours,
      month: data.month,
      minutes: data.minutes,
      date: data.day,
    })
    .getTime();
};
