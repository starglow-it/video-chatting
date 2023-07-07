import * as dateFns from 'date-fns';

type FormatStringEnum =
    | 'MMMM, yyyy'
    | 'EEEEEE'
    | 'dd'
    | 'd'
    | 'dd MMM'
    | 'dd MMM, yyyy';

export const formatDate = (
    date: number | Date,
    format: FormatStringEnum,
): string => dateFns.format(date, format);
