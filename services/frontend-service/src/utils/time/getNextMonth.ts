import addMonths from 'date-fns/addMonths';

export const getNextMonth = (date: Date): Date => addMonths(date, 1);
