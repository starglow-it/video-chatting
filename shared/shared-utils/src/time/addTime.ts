import { addDays, addHours, addMonths } from 'date-fns';

export const addHoursCustom = (date: Date | number, value: number): number =>
  addHours(date, value).getTime();
export const addDaysCustom = (date: Date | number, value: number): number =>
  addDays(date, value).getTime();
export const addMonthsCustom = (date: Date | number, value: number): number =>
  addMonths(date, value).getTime();
