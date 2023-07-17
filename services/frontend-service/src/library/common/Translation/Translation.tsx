import React, { memo } from 'react';
import { Trans } from 'react-i18next';

import { useLocalization } from '@hooks/useTranslation';

import { TranslationProps } from './types';

const Component = ({
    nameSpace,
    translation: ts,
    options = {},
}: TranslationProps) => {
    const { translation } = useLocalization(nameSpace);

    return <Trans>{translation(ts, options)}</Trans>;
};

export const Translation = memo(Component);
