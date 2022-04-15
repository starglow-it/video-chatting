import * as dateFnsTz from 'date-fns-tz';

export const getUtcTimestamp = (time, tz): number => {
  return dateFnsTz.zonedTimeToUtc(time, tz).getTime();
};
