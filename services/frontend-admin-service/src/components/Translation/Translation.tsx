import { memo } from 'react';

import { useLocalization } from '@hooks/useTranslation';

import { TranslationProps } from './types';

const Component = ({
    nameSpace,
    translation: ts,
    options = {},
}: TranslationProps) => {
    const { translation } = useLocalization(nameSpace);

    return translation(ts, options);
};

export const Translation = memo(Component);
