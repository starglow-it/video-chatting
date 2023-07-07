import setDay from 'date-fns/setDay';

export const getDaysOfWeek = (): Date[] =>
    new Array(7)
        .fill(0)
        .map((value, index) => new Date(setDay(Date.now(), index)));
