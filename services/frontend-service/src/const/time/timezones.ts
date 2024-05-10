import dateFnz from 'date-fns-tz';

const date = new Date();

export type TimeZoneData = { name: string; tzCode: string };

export const TIMEZONES = (): TimeZoneData[] => {
    try {
        if (typeof Intl.supportedValuesOf !== "undefined") {
            return Intl.supportedValuesOf('timeZone').map(
                tz => ({
                    name: `(${dateFnz.format(date, 'OOOO', { timeZone: tz })}) ${tz}`,
                    tzCode: tz,
                }),
            );
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
    }
}
