import isToday from "date-fns/isToday";

export const isTodayDate = (date: Date | number) => {
    return isToday(date);
}