import getMonth from 'date-fns/getMonth';

export const isCurrentMonthDay = (currentMonth: number | Date, date: number | Date): boolean => {
    return getMonth(currentMonth) === getMonth(date);
}