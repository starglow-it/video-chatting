import * as dateFns from 'date-fns';

export const isDatesEqual = (date1: number | Date, date2: number | Date): boolean=> {
    return dateFns.isEqual(date1, date2);
}