import * as dateFnsTz from 'date-fns-tz';

export const getTzOffset = (date, timezone) => {
  return dateFnsTz.getTimezoneOffset(timezone, date);
};
