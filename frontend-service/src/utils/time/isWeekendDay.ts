import isWeekend from 'date-fns/isWeekend';

export const isWeekendDay = (dayOfWeek: Date | number): boolean => {
    return isWeekend(dayOfWeek);
};
