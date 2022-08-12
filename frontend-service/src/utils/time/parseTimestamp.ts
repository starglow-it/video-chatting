import * as dateFns from 'date-fns';

type ParsedTimeStamp = {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
};

export const parseTimestamp = (ts: number): ParsedTimeStamp => ({
    year: dateFns.getYear(ts),
    month: dateFns.getMonth(ts) + 1,
    day: dateFns.getDate(ts),
    hours: dateFns.getHours(ts),
    minutes: dateFns.getMinutes(ts),
});
