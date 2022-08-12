import isEqual from 'date-fns/isEqual';

export const isDatesEqual = (date1: number | Date, date2: number | Date): boolean =>
    isEqual(date1, date2);
