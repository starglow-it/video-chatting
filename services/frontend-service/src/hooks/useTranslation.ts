import { useCallback } from 'react';
import { useTranslation as useT } from '../../i18n';

type ReturnT = {
    translation: (ts: string, options?: Record<string, unknown>) => string;
};

export const useLocalization = (ns?: string): ReturnT => {
    const { t: tr } = useT(ns);

    const translation = useCallback(
        (ts, options = {}) => tr(ts, options),
        [tr],
    );

    return { translation };
};
