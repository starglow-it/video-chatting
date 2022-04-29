import * as dateFns from 'date-fns';

type FormatStringEnum = 'MMMM, yyyy' | 'EEEEEE' | 'dd' | 'd';

export const formatDate = (date: number | Date, format: FormatStringEnum): string => {
    return dateFns.format(date, format);
};
