import * as dateFns from 'date-fns';

export const isBefore = (date: Date | number, target: Date | number): boolean =>
    dateFns.isBefore(date, target);
