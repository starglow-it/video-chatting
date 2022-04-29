import addMonths from 'date-fns/addMonths';

export const getNextMonth = (date: Date): Date => {
    return addMonths(date, 1);
};
