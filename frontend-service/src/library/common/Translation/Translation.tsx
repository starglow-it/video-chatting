import React, { memo } from 'react';
import { Trans } from 'react-i18next';

import { useLocalization } from '@hooks/useTranslation';

import { TranslationProps } from './types';

const Translation = memo(({ nameSpace, translation: ts, options = {} }: TranslationProps) => {
    const { translation } = useLocalization(nameSpace);

    return <Trans>{translation(ts, options)}</Trans>;
});

export { Translation };
