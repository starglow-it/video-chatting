import { subDays, subMonths } from 'date-fns';

export const subtractDay = (timestamp, number) => {
  return subDays(timestamp, number);
};

export const subtractMonths = (timestamp, number): number => {
  return subMonths(timestamp, number).getTime();
};
