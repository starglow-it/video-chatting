import { subDays, subMonths } from 'date-fns';

export const subtractDays = (timestamp, number): number => {
  return subDays(timestamp, number).getTime();
};

export const subtractMonths = (timestamp, number): number => {
  return subMonths(timestamp, number).getTime();
};
