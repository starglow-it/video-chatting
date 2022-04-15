import subMonths from "date-fns/subMonths";

export const getPreviousMonth = (date: Date): Date => {
    return subMonths(date, 1);
}