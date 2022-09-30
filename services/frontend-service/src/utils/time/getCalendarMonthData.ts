import { addDays, subDays, addMonths, getDay, setDate, getDaysInMonth } from 'date-fns';
import { unflatArray } from '../arrays/unflatArray';

export const getCalendarMonthData = (date: Date): Date[][] => {
    const daysInMonth = getDaysInMonth(date);

    const currentMonthDaysNumber = new Array(daysInMonth)
        .fill(0)
        .map((value, index) => setDate(date, index + 1));

    const firstDay = setDate(date, 1);

    const firstWeekDay = getDay(firstDay);
    const firstDayOfPrevMonth = subDays(firstDay, firstWeekDay);

    const lastDay = setDate(date, daysInMonth);
    const lastWeekDay = getDay(lastDay);

    const prevMonthDays = new Array(firstWeekDay)
        .fill(0)
        .map((value, index) => addDays(firstDayOfPrevMonth, index));

    const nextMonthDays = new Array(7 - lastWeekDay - 1)
        .fill(0)
        .map((value, index) => setDate(addMonths(date, 1), index + 1));

    return unflatArray([...prevMonthDays, ...currentMonthDaysNumber, ...nextMonthDays], 7);
};
