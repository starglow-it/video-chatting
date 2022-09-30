import * as dateFnsTz from 'date-fns-tz';

export const formatDate = (time: Date | number, timeZone: string): string => {
  if (typeof time === 'number') {
    return dateFnsTz.format(time, 'dd EEEE MMMM yyyy HH:mm zzz', { timeZone });
  }

  return dateFnsTz.format(new Date(time), 'dd EEEE MMMM yyyy HH:mm zzz', {
    timeZone,
  });
};
