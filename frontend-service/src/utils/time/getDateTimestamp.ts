import * as dateFns from 'date-fns';

export const getDateTimestamp = (date: Date | number, time: string): number => {
    const [hours, minutes] = time.split(':');

    return dateFns
        .set(new Date(date), {
            hours: parseInt(hours, 10),
            minutes: parseInt(minutes, 10),
        })
        .getTime();
};
