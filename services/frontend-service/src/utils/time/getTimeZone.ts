import { TIMEZONES } from 'src/const/time/timezones';

export const getTimeZone = (): string | undefined => {
    const gmtValue = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const targetTimzone = TIMEZONES.find(timezone => timezone.tzCode === gmtValue)?.tzCode;

    return targetTimzone || TIMEZONES[0].tzCode;
};
