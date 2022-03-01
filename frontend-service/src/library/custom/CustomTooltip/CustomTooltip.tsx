import React, { memo } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';

// hooks
import { useLocalization } from '../../../hooks/useTranslation';

import { TranslationProps } from '@library/common/Translation/types';
import { CustomTooltipProps } from './types';

const CustomTooltip = memo(
    ({
        nameSpace,
        translation,
        children,
        ...rest
    }: TranslationProps & CustomTooltipProps & Omit<TooltipProps, 'title'>) => {
        const { translation: t } = useLocalization(nameSpace);

        return (
            <Tooltip title={t(translation)} {...rest}>
                {children}
            </Tooltip>
        );
    },
);

export { CustomTooltip };
