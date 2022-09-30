import subMonths from 'date-fns/subMonths';

export const getPreviousMonth = (date: Date): Date => subMonths(date, 1);
