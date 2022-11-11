import { useLocalization } from '@hooks/useTranslation';
import { useMemo } from 'react';
import { intervalToDuration } from 'date-fns';
import { _24_HOURS, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_SECOND } from '../const/time/common';

const stages = [ONE_MONTH, _24_HOURS, ONE_HOUR, ONE_MINUTE, ONE_SECOND];
const translationKeys = ['months', 'days', 'hours', 'minutes', 'now'];

export const useFormatDistanceDate = (timestamp: number) => {
    const { translation } = useLocalization('dates');

    return useMemo(() => {
        const now = Date.now();
        const diff = now - timestamp;
        const targetStageIndex = stages.findIndex(stage => diff / stage >= 1);
        let translationKey = translationKeys[targetStageIndex];
        const duration = intervalToDuration({ start: now, end: timestamp });

        if (translationKey === 'hours' && duration.minutes) {
            translationKey = `${translationKey}AndMinutes`;
        }

        return translation(`fromNow.${translationKey}`, duration);
    }, [timestamp, translation]);
};
