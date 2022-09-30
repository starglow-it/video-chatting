import isEqual from 'date-fns/isEqual';

export const isDatesEqual = (date1: Date, date2: Date): boolean =>
    isEqual(date1.setHours(0, 0, 0, 0), date2.setHours(0, 0, 0, 0));
