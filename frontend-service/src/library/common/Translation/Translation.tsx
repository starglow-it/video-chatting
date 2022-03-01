import React, { memo } from 'react';
import { useLocalization } from '../../../hooks/useTranslation';
import { TranslationProps } from './types';

const Translation = memo(({ nameSpace, translation: ts, options = {} }: TranslationProps) => {
    const { translation } = useLocalization(nameSpace);

    return <>{translation(ts, options)}</>;
});

export { Translation };
