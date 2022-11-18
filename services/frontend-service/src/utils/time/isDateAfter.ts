import * as dateFns from 'date-fns';

export const isDateAfter = (date: Date | number, target: Date | number): boolean =>
    dateFns.isAfter(date, target);