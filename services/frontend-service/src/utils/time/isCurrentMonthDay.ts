import getMonth from 'date-fns/getMonth';

export const isCurrentMonthDay = (
    currentMonth: number | Date,
    date: number | Date,
): boolean => getMonth(currentMonth) === getMonth(date);
